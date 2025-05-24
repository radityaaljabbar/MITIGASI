const { pool } = require('../../config/database');

exports.getWellnessResult = async (nim) => {
    const [rows] = await pool.execute(
        'SELECT * FROM hasil_tes_psikologi WHERE nim = ?',
        [nim]
    );
    return rows; // Return rows saja, bukan seluruh result
};
