const { pool } = require('../../config/database');

exports.fetchPsiResult = async (nim) => {
    const [psiResultsData] = await pool.execute(
        'SELECT * from hasil_tes_psikologi where nim = ? ',
        [nim]
    );
    return psiResultsData;
};
