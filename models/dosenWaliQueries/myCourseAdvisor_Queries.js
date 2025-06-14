const { pool } = require('../../config/database');

// Fetch list kelas wali dosen wali (user)
exports.getKelasWaliDosen = async (kodeDosen) => {
    const [classes] = await pool.execute(
        'SELECT id_kelas, kode_kelas FROM kelas WHERE kode_dosen = ?',
        [kodeDosen]
    );

    return classes;
};

// Fetch murid2 kelas tersebut:
exports.getStudentInClass = async (listKodeKelas) => {
    const listMahasiswa = [];
    for (const kelas of listKodeKelas) {
        const [students] = await pool.execute(
            'SELECT nim, nama, kelas FROM mahasiswa WHERE kelas = ?',
            [kelas]
        );

        const data = students.map((student) => ({
            id: student.nim,
            name: student.nama,
            class: student.kelas,
        }));
        listMahasiswa.push(...data);
    }
    return listMahasiswa;
};

// Fetch all courses available:
exports.getAvailCourses = async () => {
    const [availableCourses] = await pool.execute(
        'SELECT kode_mk, nama_mk, sks_mk, jenis_mk, tingkat, jenis_semester, semester, ekivalensi FROM mata_kuliah_baru'
    );

    return availableCourses;
};

// Fetch IP semester terakhir mahasiswa
exports.getLastSemesterIP = async (nim) => {
    const [result] = await pool.execute(
        `SELECT 
            nim_mahasiswa,
            ip_semester,
            semester,
            tanggal_dibuat,
            sks_semester,
            tahun_ajaran,
            jenis_semester
         FROM persemester 
         WHERE nim_mahasiswa = ? 
         AND semester = (
             SELECT MAX(semester) 
             FROM persemester 
             WHERE nim_mahasiswa = ?
         )
         ORDER BY tanggal_dibuat DESC 
         LIMIT 1`,
        [nim, nim]
    );

    return result.length > 0 ? result[0] : null;
};

exports.getNimSKSData = async (nim) => {
    try {
        const [rows] = await pool.execute(
            'SELECT sks_lulus FROM ipk_mahasiswa WHERE nim = ?',
            [nim]
        );

        //Cek jika data mahasiswa tidak ditemukan
        if (rows.length === 0) {
            return null;
        }

        //Balikan object pertama dri array
        return rows[0];
    } catch (error) {
        console.error('Error in getNimSKSData service:', error);
        throw error;
    }
};
