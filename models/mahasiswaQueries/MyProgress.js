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

exports.fetchStudentStatus = async (nim) => {
    const [rowsStatus] = await pool.execute(
        'SELECT hasil_klasifikasi from klasifikasi_akademik WHERE nim = ?',
        [nim]
    );
    return rowsStatus;
};

exports.fetchStudentIPS = async (nim) => {
    const SQLQuery = `SELECT semester, ip_semester FROM persemester WHERE nim_mahasiswa = ?`;
    try {
        // Eksekusi query dengan pool.execute
        // Destructuring [rows] akan mengambil array hasil query
        const [rowsIPS] = await pool.execute(SQLQuery, [nim]);
        
        // rowsIPS akan menjadi array. Jika Anda mengharapkan satu mahasiswa,
        // bisa jadi array ini berisi satu objek atau kosong.
        // Mirip dengan rowsTAK, rowsIPS adalah array dari baris hasil.
        return rowsIPS;
    } catch (error) {
        console.error("Error fetching student academic data:", error);
        // Anda mungkin ingin melempar error lagi atau mengembalikan array kosong/null
        // tergantung pada bagaimana Anda ingin menangani error di pemanggil fungsi ini.
        throw error; // atau return [];
    }
}