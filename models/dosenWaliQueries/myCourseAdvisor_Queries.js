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
            'SELECT nim, nama, kelas, peminatan FROM mahasiswa WHERE kelas = ?',
            [kelas]
        );

        const data = students.map((student) => ({
            id: student.nim,
            name: student.nama,
            class: student.kelas,
            peminatan:student.peminatan,
        }));
        listMahasiswa.push(...data);
    }
    return listMahasiswa;
};

// Fetch all courses available with kurikulum 2024:
exports.getAvailCourses = async () => {
    const [availableCourses] = await pool.execute(`
        SELECT 
            mkb.kode_mk, 
            mkb.nama_mk, 
            mkb.sks_mk, jenis_mk, 
            mkb.tingkat, 
            mkb.jenis_semester, 
            mkb.semester, 
            mkb.ekivalensi,
            mkb.kurikulum,
            pk.kelompok_keahlian
        FROM 
            mata_kuliah_baru mkb
        LEFT JOIN
            peminatan_keahlian pk ON pk.kode_matakuliah = mkb.kode_mk
        WHERE 
            kurikulum = (SELECT MAX(kurikulum) FROM mata_kuliah_baru)`
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
