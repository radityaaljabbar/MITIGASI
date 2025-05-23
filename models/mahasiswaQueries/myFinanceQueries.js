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
    const SQLQuery = `
        SELECT 
            rf.id,
            rf.nim,
            rf.penghasilan_mahasiswa,
            rf.penghasilan_orangtua,
            rf.tanggungan_orangtua,
            rf.tempat_tinggal,
            rf.pengeluaran_perbulan,
            rf.jenis_keringanan,
            rf.alasan_keringan,
            rf.jumlah_diajukan,
            rf.detail_alasan,
            rf.tanggal_dibuat,
            rf.status_pengajuan as status_default,
            srf.status as status_pengajuan,
            srf.tanggal_dibuat as tanggal_response
        FROM response_finansial rf
        LEFT JOIN status_response_finansial srf ON rf.id = srf.id_response_finansial
        WHERE rf.nim = ?
        ORDER BY rf.tanggal_dibuat DESC
    `;
    
    try {
        // Eksekusi query dengan pool.execute
        // Destructuring [rows] akan mengambil array hasil query
        const [rowsRelief] = await pool.execute(SQLQuery, [nim]);
        
        // Process the data to add final_status logic
        const processedRows = rowsRelief.map(row => ({
            ...row,
            // Determine final status: use status_pengajuan if exists, otherwise use 'Menunggu'
            status_pengajuan: row.status_pengajuan || 'Menunggu'
        }));
        
        return processedRows;
    } catch (error) {
        console.error("Error fetching student relief data:", error);
        throw error;
    }
}

module.exports = {
    submitRelief,
    fetchRelief
}