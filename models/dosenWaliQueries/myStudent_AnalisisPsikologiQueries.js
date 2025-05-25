const { pool } = require('../../config/database');

exports.getWellnessResult = async (nim) => {
    const [rows] = await pool.execute(
        `SELECT 
            htp.*,
            m.nama
        FROM hasil_tes_psikologi htp
        JOIN mahasiswa m ON htp.nim = m.nim
        WHERE htp.nim = ?`,
        [nim]
    );
    return rows;
};
