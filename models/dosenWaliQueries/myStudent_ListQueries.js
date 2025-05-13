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
            `SELECT 
                mhs.nim, 
                mhs.nama, 
                mhs.kelas,
                ipkt.ipk_lulus,
                takt.tak
            FROM mahasiswa mhs 
            JOIN ipk_mahasiswa ipkt ON ipkt.nim = mhs.nim
            JOIN tak_mahasiswa takt ON takt.nim = mhs.nim
            WHERE kelas = "${kelas}"`
        );

        const formattedStudents = students.map((student) => ({
            name: student.nama,
            nim: student.nim,
            kelas: student.kelas,
            ipk: student.ipk_lulus, // Placeholder for now
            tak: student.tak, // Placeholder for now
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
