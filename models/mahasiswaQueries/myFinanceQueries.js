const { pool } = require('../../config/database');

const submitRelief = async (valueRelief) => {

    const submitQuery = 
    `   INSERT INTO response_finansial 
        (nim,
        penghasilan_mahasiswa, 
        penghasilan_orangtua, 
        tanggungan_orangtua,
        tempat_tinggal,
        pengeluaran_perbulan,
        jenis_keringanan,
        alasan_keringan,
        jumlah_diajukan,
        detail_alasan,
        tanggal_dibuat)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`


    try {
        // Eksekusi query dengan pool.execute
        // Destructuring [rows] akan mengambil array hasil query
        const [rowsRelief] = await pool.execute(submitQuery, valueRelief);
        
        // rowsAcademicData akan menjadi array. Jika Anda mengharapkan satu mahasiswa,
        // bisa jadi array ini berisi satu objek atau kosong.
        // Mirip dengan rowsTAK, rowsAcademicData adalah array dari baris hasil.
        return rowsRelief; 
    } catch (error) {
        console.error("Error fetching student academic data:", error);
        // Anda mungkin ingin melempar error lagi atau mengembalikan array kosong/null
        // tergantung pada bagaimana Anda ingin menangani error di pemanggil fungsi ini.
        throw error; // atau return [];
    }
};


const fetchRelief = async (nim) => {
    const SQLQuery = `SELECT * FROM response_finansial WHERE nim = ?`;
    try {
        // Eksekusi query dengan pool.execute
        // Destructuring [rows] akan mengambil array hasil query
        const [rowsRelief] = await pool.execute(SQLQuery, [nim]);
        
        // rowsIPS akan menjadi array. Jika Anda mengharapkan satu mahasiswa,
        // bisa jadi array ini berisi satu objek atau kosong.
        // Mirip dengan rowsTAK, rowsIPS adalah array dari baris hasil.
        return rowsRelief;
    } catch (error) {
        console.error("Error fetching student academic data:", error);
        // Anda mungkin ingin melempar error lagi atau mengembalikan array kosong/null
        // tergantung pada bagaimana Anda ingin menangani error di pemanggil fungsi ini.
        throw error; // atau return [];
    }
}


module.exports = {
    submitRelief,
    fetchRelief
}