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
                akd.hasil_klasifikasi,
                psi.klasifikasi,
                psi.total_skor,
                fin.status_finansial,
                ipkt.ipk_lulus,
                ipkt.sks_lulus,
                takt.tak,
                COALESCE(
                (SELECT MAX(p.semester) + 1 
                 FROM persemester p 
                 WHERE p.nim_mahasiswa = mhs.nim), 
                1
                ) as current_semester,
                CASE 
                    WHEN fin.nim IS NOT NULL THEN 1 
                    ELSE 0 
                END as status_finansial_bin
            FROM mahasiswa mhs 
            LEFT JOIN ipk_mahasiswa ipkt ON ipkt.nim = mhs.nim
            LEFT JOIN tak_mahasiswa takt ON takt.nim = mhs.nim
            LEFT JOIN klasifikasi_akademik akd ON akd.nim = mhs.nim
            LEFT JOIN hasil_tes_psikologi psi ON psi.nim = mhs.nim
            LEFT JOIN klasifikasi_finansial fin ON fin.nim = mhs.nim
            WHERE mhs.kelas = ?`,
            [kelas]
        );

        const formattedStudents = students.map((student) => ({
            name: student.nama,
            nim: student.nim,
            kelas: student.kelas,
            ipk: student.ipk_lulus || '-', // Placeholder if NULL
            sks: student.sks_lulus,
            semester: student.current_semester,
            tak: student.tak ,
            status: 'aman', // Default status
            skor_psikologi: student.total_skor,
            status_fin: student.status_finansial_bin,
            details: {
                akademik: student.hasil_klasifikasi ,
                psikologis: student.klasifikasi || '-',
                finansial: student.status_finansial === "1" ? 'bermasalah' : 'aman',
            },
        }));
        studentList.push(...formattedStudents);
    }
    return studentList;
};
