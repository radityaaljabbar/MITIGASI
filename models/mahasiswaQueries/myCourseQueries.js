const { pool } = require('../../config/database');

/**
 * Ambil data nilai mahasiswa berdasarkan ID
 * @param {string} studentId - ID mahasiswa
 * @returns {Promise<Array>} - Array data nilai
 */
const getStudentGrades = async (studentId) => {
    const [nilaiRows] = await pool.execute(
        `SELECT 
            n.kode_mk, 
            n.indeks_nilai, 
            n.semester AS jenis_semester, 
            n.tahun_ajaran,
            k.tahun_angkatan AS angkatan
        FROM 
            nilai n
        INNER JOIN 
            mahasiswa m ON n.nim_mahasiswa = m.nim
        INNER JOIN 
            kelas k ON m.kelas = k.kode_kelas
        WHERE 
            n.nim_mahasiswa = ?`,
        [studentId]
    );
    return nilaiRows;
};

/**
 * Ambil detail matkul baru dari database
 * @param {Array} courseCodeArray - Array kode matkul
 * @returns {Promise<Array>} - Array data matkul
 */
const getNewCourses = async (courseCodeArray) => {
    // Bikin placeholders buat query IN clause
    const placeholders = Array(courseCodeArray.length).fill('?').join(',');
    const [newCoursesRows] = await pool.execute(
        // UPDATED: Tambahkan kolom semester dari mata_kuliah_baru
        `SELECT kode_mk, nama_mk, sks_mk, jenis_mk, semester, ekivalensi FROM mata_kuliah_baru WHERE kode_mk IN (${placeholders})`,
        courseCodeArray
    );
    return newCoursesRows;
};

/**
 * Cari matkul ekivalen untuk kode matkul lama
 * @param {Array} oldCourseCodeArray - Array kode matkul lama
 * @returns {Promise<Array>} - Array data matkul ekivalen
 */
const getEquivalentCourses = async (oldCourseCodeArray) => {
    const placeholders = Array(oldCourseCodeArray.length).fill('?').join(',');
    const [equivalentRows] = await pool.execute(
        // UPDATED: Tambahkan kolom semester dari mata_kuliah_baru
        `SELECT kode_mk, nama_mk, sks_mk, jenis_mk, semester, ekivalensi FROM mata_kuliah_baru 
        WHERE ekivalensi IN (${placeholders})`,
        oldCourseCodeArray
    );
    return equivalentRows;
};

/**
 * Ambil data nama matkul lama berdasarkan kode ekivalensi
 * @param {Array} ekivalensiArray - Array kode ekivalensi
 * @returns {Promise<Array>} - Array data nama matkul lama
 */
const getOldCoursesNames = async (ekivalensiArray) => {
    const placeholders = Array(ekivalensiArray.length).fill('?').join(',');
    const [oldCoursesRows] = await pool.execute(
        `SELECT kode_mk_lama, nama_mk_lama FROM mata_kuliah_lama
        WHERE kode_mk_lama IN (${placeholders})`,
        ekivalensiArray
    );
    return oldCoursesRows;
};

/**
 * Ambil data matkul lama dari database
 * @param {Array} oldCourseCodeArray - Array kode matkul lama
 * @returns {Promise<Array>} - Array data matkul lama
 */
const getOldCourses = async (oldCourseCodeArray) => {
    const placeholders = Array(oldCourseCodeArray.length).fill('?').join(',');
    const [oldCoursesRows] = await pool.execute(
        `SELECT kode_mk_lama, nama_mk_lama, sks_mk_lama FROM mata_kuliah_lama
        WHERE kode_mk_lama IN (${placeholders})`,
        oldCourseCodeArray
    );
    return oldCoursesRows;
};

/**
 * Mengolah data matkul dan nilai menjadi riwayat matkul lengkap
 * @param {Array} grades - Array data nilai
 * @param {Object} coursesMap - Map data matkul
 * @param {Object} oldCoursesNamesMap - Map nama matkul lama
 * @returns {Array} - Array data riwayat matkul
 */
const processCourseHistory = (grades, coursesMap, oldCoursesNamesMap = {}) => {
    const courseHistory = [];

    grades.forEach((grade) => {
        // UPDATED: Ganti nama variabel semester jadi jenis_semester
        const {
            kode_mk,
            indeks_nilai,
            jenis_semester,
            tahun_ajaran,
            angkatan,
        } = grade;
        const courseDetails = coursesMap[kode_mk];

        // console.log(courseDetails)

        if (courseDetails) {
            const isSpecificSemester =
                jenis_semester === 'GANJIL' && tahun_ajaran === '2024/2025';

            let kodeMataKuliah = kode_mk;
            let namaMataKuliah;

            // BARIS BARU: Tambahkan blok if-else berdasarkan kondisi di atas
            if (isSpecificSemester) {
                // KASUS KHUSUS: Jika ini adalah semester Ganjil 2024/2025,
                // maka nama mata kuliah HARUS menggunakan nama baru (nama_mk)
                // dan kode mata kuliah tetap menggunakan kode_mk yang asli.
                namaMataKuliah =
                    courseDetails.nama_mk || 'Nama Baru Tidak Tersedia';
                kodeMataKuliah = kode_mk;
            } else {
                // LOGIKA LAMA: Untuk semua semester lainnya, jalankan logika seperti semula.
                const isEquivalent = courseDetails.is_equivalent === true;

                // Tentukan kode dan nama matkul yang akan ditampilkan
                namaMataKuliah =
                    courseDetails.nama_mk || courseDetails.nama_mk_lama;

                if (isEquivalent) {
                    // Untuk matkul yang sudah dipetakan ekivalen, gunakan kode lama dan nama lama
                    kodeMataKuliah = kode_mk;
                    if (oldCoursesNamesMap[kode_mk]) {
                        namaMataKuliah = oldCoursesNamesMap[kode_mk];
                    }
                } else if (courseDetails.ekivalensi) {
                    // Untuk matkul baru yang punya nilai ekivalensi, gunakan nilai ekivalensi dan nama lamanya
                    kodeMataKuliah = courseDetails.ekivalensi;
                    if (oldCoursesNamesMap[courseDetails.ekivalensi]) {
                        namaMataKuliah =
                            oldCoursesNamesMap[courseDetails.ekivalensi];
                    }
                }
            }

            courseHistory.push({
                nama_mata_kuliah: namaMataKuliah,
                kode_mata_kuliah: kodeMataKuliah,
                jenis: courseDetails.jenis_mk || '-',
                sks: courseDetails.sks_mk || courseDetails.sks_mk_lama || 0,
                // UPDATED: Tambahkan semester dari mata_kuliah_baru/lama
                semester: courseDetails.semester || '-',
                // UPDATED: Ganti nama dari semester ke jenis_semester (GANJIL/GENAP)
                jenis_semester: jenis_semester,
                nilai: indeks_nilai,
                tahun_ajaran: tahun_ajaran,
                ekivalensi: courseDetails.ekivalensi,
                angkatan: angkatan,
            });
        } else {
            // Kalau ga ketemu sama sekali di database
            courseHistory.push({
                nama_mata_kuliah: 'Mata Kuliah Tidak Ditemukan',
                kode_mata_kuliah: kode_mk,
                jenis: '-',
                sks: 0,
                // UPDATED: Set default values
                semester: '-',
                jenis_semester: jenis_semester,
                nilai: indeks_nilai,
                tahun_ajaran: tahun_ajaran,
            });
        }
    });

    return courseHistory;
};

const sendPeminatan = async (studentId, peminatan) => {
    try {
        const sql = `
            UPDATE mahasiswa
            SET peminatan = ?
            WHERE nim = ?
        `
        const [resultpeminatan] = await pool.execute(sql,[peminatan, studentId])
        return resultpeminatan
    } catch (error) {
        console.error(`Tidak dapat menambahkan peminatan ke database`, error);
        throw error;       
    }
}




const getListPeminatan = async () => {
    try {
        const sql = `
            SELECT DISTINCT kelompok_keahlian 
            FROM peminatan_keahlian
            ORDER BY kelompok_keahlian DESC
        `;

        const [rows] = await pool.execute(sql);
        return rows.map(row => row.kelompok_keahlian);
    } catch (error) {
        console.error('Eror mendapatkan list kelompok_keahlian query:', error);
        throw error;
    }
}

const getStudentPeminatan = async (studentId) => {
    try {
        const sql = `
            SELECT peminatan 
            FROM mahasiswa
            WHERE nim = ?
        `;
        const [rows] = await pool.execute(sql, [studentId]);
        // Return the first row if it exists, otherwise null
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error(`Tidak dapat mengambil data peminatan dari database`, error);
        throw error;
    }
};

module.exports = {
    getStudentGrades,
    getNewCourses,
    getEquivalentCourses,
    getOldCourses,
    getOldCoursesNames,
    processCourseHistory,
    sendPeminatan,
    getListPeminatan,
    getStudentPeminatan,
};
