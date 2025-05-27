const { pool } = require('../../config/database');

const fetchStudentsRelief = async (nim) => {
    const SQLQuery = `
        SELECT 
            rf.*,
            mhs.nama,
            srf.status as status_pengajuan,
            srf.tanggal_dibuat as tanggal_response,
            COALESCE(
                (SELECT MAX(p.semester) + 1 
                 FROM persemester p 
                 WHERE p.nim_mahasiswa = mhs.nim), 
                1
            ) as current_semester
        FROM response_finansial rf
        LEFT JOIN status_response_finansial srf ON rf.id = srf.id_response_finansial
        LEFT JOIN mahasiswa mhs ON rf.nim = mhs.nim
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
    fetchStudentsRelief
}