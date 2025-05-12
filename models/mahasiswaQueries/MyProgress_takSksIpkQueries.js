const { pool } = require('../../config/database');

exports.fetchStudentTAK = async (nim) => {
    const [rowsTAK] = await pool.execute(
        'SELECT tak FROM tak_mahasiswa WHERE nim = ?',
        [nim]
    );
    return rowsTAK;
};

exports.fetchStudentSKSTotal = async (nim) => {
    const [rowsSKSTotal] = await pool.execute(
        'SELECT sks_lulus FROM ipk_mahasiswa WHERE nim = ?',
        [nim]
    );

    return rowsSKSTotal;
};

exports.fetchStudentIPK = async (nim) => {
    const [rowsIPK] = await pool.execute(
        'SELECT ipk_lulus from ipk_mahasiswa WHERE nim = ?',
        [nim]
    );
    return rowsIPK;
};
