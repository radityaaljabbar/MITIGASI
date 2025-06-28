const { pool } = require('../../config/database');

/**
 * @desc    Get all grades with student information
 * @returns {Promise<Array>} An array containing a status object with the payload of all grades
 */
exports.getAllMahasiswa = async () => {
    try {
        const sql = `
            SELECT 
                mhs.nim,
                mhs.nama,
                mhs.kelas,
                kls.kode_dosen,
                kls.tahun_angkatan,
                mhs.status
            FROM 
                mahasiswa AS mhs
            JOIN 
                kelas AS kls ON mhs.kelas = kls.kode_kelas
            ORDER BY 
                mhs.nim ASC;
        `;
        const [mahasiswaFromDB] = await pool.execute(sql);

        const formattedMahasiswa = mahasiswaFromDB.map((mhs) => ({
            nim: mhs.nim,
            name: mhs.nama, // Konsisten menggunakan 'name'
            status: mhs.status, // Beri nilai default jika status null
            detail_kelas: { 
                angkatan: mhs.tahun_angkatan,
                kelas: mhs.kelas,
                dosen_wali: mhs.kode_dosen,
            },
        }));

        return [{ status: 'success', payload: formattedMahasiswa }];
    } catch (error) {
        console.error('Error in get All Mahasiswa Datas query:', error);
        throw error; // Re-throw the error to be caught by the controller
    }
};


// /**
//  * @desc    Find a single grade by its ID, including student information
//  * @param   {string|number} nim The ID of the grade to find
//  * @returns {Promise<Array>} An array containing a status object with the grade payload
//  */
// exports.findGradesMahasiswaByNIM = async (nim) => {
//     try {
//         const sql = `
//             SELECT 
//                 n.id_nilai,
//                 n.nim_mahasiswa,
//                 m.nama,
//                 m.kelas,
//                 mk.nama_mk,
//                 n.kode_mk,
//                 n.indeks_nilai,
//                 n.semester,
//                 n.tahun_ajaran
//             FROM 
//                 nilai AS n
//             JOIN 
//                 mahasiswa AS m ON n.nim_mahasiswa = m.nim
//             JOIN 
//                 mata_kuliah_baru AS mk ON n.kode_mk = mk.kode_mk
//             WHERE 
//                 n.nim_mahasiswa = ?;
//         `;
//         const [rows] = await pool.execute(sql, [nim]);

//         // Jika query tidak mengembalikan baris sama sekali, artinya tidak ada nilai.
//         if (rows.length === 0) {
//             return null; // Sinyal yang jelas ke controller bahwa data tidak ditemukan.
//         }

//         // Jika data ada, kita format agar lebih rapi.
//         // Informasi mahasiswa (nama, kelas) sama untuk semua baris, jadi kita ambil dari baris pertama.
//         const formattedResult = {
//             nim: nim,
//             name: rows[0].nama,
//             kelas: rows[0].kelas,
//             grades: rows.map(grade => ({ // 'grades' adalah array nilai
//                 id_nilai: grade.id_nilai,
//                 kode_mk: grade.kode_mk,
//                 nama_mk: grade.nama_mk,
//                 indeks: grade.indeks_nilai,
//                 semester: grade.semester,
//                 tahun_ajaran: grade.tahun_ajaran,
//             })),
//         };

//         // rows will be an array with one item or an empty array
//         return [{ status: 'success', payload: formattedResult}];
//     } catch (error) {
//         console.error(`Error in findByNIM grade query (nim: ${nim}):`, error);
//         throw error;
//     }
// };

// INI MIRIP SEPERTI DI MYCOURSE
/**
 * Ambil data nilai mahasiswa berdasarkan ID
 * @param {string} studentId - ID mahasiswa
 * @returns {Promise<Array>} - Array data nilai
 */
exports.getStudentGrades = async (studentId) => {
    const [nilaiRows] = await pool.execute(
        `SELECT 
            n.id_nilai,
            n.nim_mahasiswa,
            m.nama,
            m.kelas,
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
exports.getNewCourses = async (courseCodeArray) => {
    // Bikin placeholders buat query IN clause
    const placeholders = Array(courseCodeArray.length).fill('?').join(',');
    const [newCoursesRows] = await pool.execute(
        // UPDATED: Tambahkan kolom semester dari mata_kuliah_baru
        `SELECT id_mk, kode_mk, nama_mk, sks_mk, jenis_mk, semester, ekivalensi FROM mata_kuliah_baru WHERE kode_mk IN (${placeholders})`,
        courseCodeArray
    );
    return newCoursesRows;
};

/**
 * Cari matkul ekivalen untuk kode matkul lama
 * @param {Array} oldCourseCodeArray - Array kode matkul lama
 * @returns {Promise<Array>} - Array data matkul ekivalen
 */
exports.getEquivalentCourses = async (oldCourseCodeArray) => {
    const placeholders = Array(oldCourseCodeArray.length).fill('?').join(',');
    const [equivalentRows] = await pool.execute(
        // UPDATED: Tambahkan kolom semester dari mata_kuliah_baru
        `SELECT id_mk, kode_mk, nama_mk, sks_mk, jenis_mk, semester, ekivalensi FROM mata_kuliah_baru 
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
exports.getOldCoursesNames = async (ekivalensiArray) => {
    const placeholders = Array(ekivalensiArray.length).fill('?').join(',');
    const [oldCoursesRows] = await pool.execute(
        `SELECT id, kode_mk_lama, nama_mk_lama FROM mata_kuliah_lama
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
exports.getOldCourses = async (oldCourseCodeArray) => {
    const placeholders = Array(oldCourseCodeArray.length).fill('?').join(',');
    const [oldCoursesRows] = await pool.execute(
        `SELECT id, kode_mk_lama, nama_mk_lama, sks_mk_lama FROM mata_kuliah_lama
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
exports.processCourseHistory = (grades, coursesMap, oldCoursesNamesMap = {}) => {
    const courseHistory = [];

    grades.forEach((grade) => {
        // UPDATED: Ganti nama variabel semester jadi jenis_semester
        const {
            id_nilai,
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
                id_nilai: id_nilai,
                nama_mk: namaMataKuliah,
                kode_mk: kodeMataKuliah,
                jenis: courseDetails.jenis_mk || '-',
                sks: courseDetails.sks_mk || courseDetails.sks_mk_lama || 0,
                semester: jenis_semester,
                indeks: indeks_nilai,
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





















exports.getAllCourse = async () => {
    try {
        const [availableCourses] = await pool.execute(
            'SELECT kode_mk, nama_mk FROM mata_kuliah_baru'
        );
        
        return [{ status: 'success', payload: availableCourses }];
    } catch (error) {
        console.error('Error in fetching availableCourses', error);
        throw error; // Melempar error agar bisa ditangkap oleh controller
    }

};


/**
 * @desc    Create a new grade entry in the database
 * @param   {object} data Object containing the grade information (nim_mahasiswa, kode_mk, dll.)
 * @returns {Promise<Array>} An array containing a status object with the newly created grade payload
 */
exports.createNilaiMahasiswa = async (data) => {
    try {
        // Mengambil nilai-nilai yang relevan dari objek 'data' (yang berasal dari req.body)
        const { nim_mahasiswa, kode_mk, indeks_nilai, semester, tahun_ajaran } = data;

        const sql = `
            INSERT INTO nilai (nim_mahasiswa, kode_mk, indeks_nilai, semester, tahun_ajaran) 
            VALUES (?, ?, ?, ?, ?);
        `;
        
        const [result] = await pool.execute(sql, [nim_mahasiswa, kode_mk, indeks_nilai, semester, tahun_ajaran]);
        
        // Mengembalikan data yang baru saja dibuat, lengkap dengan ID barunya
        const newGrade = { id_nilai: result.insertId, ...data };
        return [{ status: 'success', payload: newGrade }];
    } catch (error) {
        console.error('Error in create grade query:', error);
        throw error; // Melempar error agar bisa ditangkap oleh controller
    }
};


/**
 * @desc    Update an existing grade entry by its ID
 * @param   {string|number} id The ID of the grade to update
 * @param   {object} data Object with the new grade information
 * @returns {Promise<Array>} An array containing a status object with the update result information
 */
exports.updateNilaiMahasiswa = async (id, data) => {
    try {
        const { kode_mk, indeks_nilai, semester, tahun_ajaran } = data;
        const sql = `
            UPDATE nilai 
            SET kode_mk = ?, indeks_nilai = ?, semester = ?, tahun_ajaran = ? 
            WHERE id_nilai = ?;
        `;
        const [result] = await pool.execute(sql, [ kode_mk, indeks_nilai, semester, tahun_ajaran, id]);
        return [{ status: 'success', payload: result }];
    } catch (error) {
        console.error(`Error in update grade query (id: ${id}):`, error);
        throw error;
    }
};


/**
 * @desc    Delete a grade entry by its ID
 * @param   {string|number} id The ID of the grade to delete
 * @returns {Promise<Array>} An array containing a status object with the deletion result information
 */
exports.removeNilaiMahasiswa = async (id) => {
    try {
        const sql = 'DELETE FROM nilai WHERE id_nilai = ?;';
        const [result] = await pool.execute(sql, [id]);
        return [{ status: 'success', payload: result }];
    } catch (error) {
        console.error(`Error in delete grade query (id: ${id}):`, error);
        throw error;
    }
};

