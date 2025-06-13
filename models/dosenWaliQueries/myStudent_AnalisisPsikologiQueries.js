const { pool } = require('../../config/database');

exports.getWellnessResult = async (nim) => {
    const [rows] = await pool.execute(
        `SELECT 
            htp.*,
            m.nama,
            m.kelas,
            COALESCE(
                (SELECT MAX(p.semester) + 1 
                 FROM persemester p 
                 WHERE p.nim_mahasiswa = m.nim), 
                1
            ) as current_semester
        FROM hasil_tes_psikologi htp
        JOIN mahasiswa m ON htp.nim = m.nim
        WHERE htp.nim = ?
        ORDER BY htp.tanggalTes DESC`, // Tambahkan ORDER BY untuk sorting newest first
        [nim]
    );
    return rows;
};
