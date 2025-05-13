const { pool } = require('../../config/database');

exports.getKelasWali = async (kodeDosen) => {
    const [classes] = await pool.execute(
        'SELECT id_kelas, kode_kelas FROM kelas WHERE kode_dosen = ?',
        [kodeDosen]
    );

    return classes;
};

exports.getStudentsByClassCodes = async (classCodesList) => {
    const studentList = [];
    for (const kelas of classCodesList) {
        const [students] = await pool.execute(
            'SELECT nim, nama, kelas FROM mahasiswa WHERE kelas = ?',
            [kelas]
        );

        const formattedStudents = students.map((student) => ({
            name: student.nama,
            nim: student.nim,
            kelas: student.kelas,
            ipk: '-', // Placeholder for now
            tak: '-', // Placeholder for now
            status: 'Aman', // Default status
            details: {
                akademik: 'Aman',
                psikologis: 'Aman',
                finansial: 'Aman',
            },
        }));
        studentList.push(...formattedStudents);
    }
    return studentList;
};
