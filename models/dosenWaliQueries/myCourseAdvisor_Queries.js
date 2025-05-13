const { pool } = require('../../config/config');

// Fetch list kelas wali dosen wali (user)
exports.getKelasWali = async (kodeDosen) => {
    const [classes] = await pool.excecute(
        'SELECT id_kelas, kode_kelas FROM kelas WHERE kode_dosen = ?',
        [kodeDosen]
    );

    return classes;
};

// Fetch murid2 kelas tersebut:
exports.getStudentInClass = async (listKodeKelas) => {
    const listMahasiswa = [];
    for (const kelas of listKodeKelas) {
        const [students] = await pool.excecute(
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
