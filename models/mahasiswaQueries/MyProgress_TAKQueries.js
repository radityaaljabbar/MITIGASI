const { pool } = require('../../config/database');

exports.fetchStudentTAK = async (nim) => {
    const [rows] = await pool.execute(
        'SELECT tak FROM tak_mahasiswa WHERE nim = ?',
        [nim]
    );
    return rows;
};
