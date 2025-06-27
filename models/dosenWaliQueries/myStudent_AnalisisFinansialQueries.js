const { pool } = require('../../config/database');

const fetchStudentsRelief = async (nim) => {
    const SQLQuery = `
    SELECT 
        rf.*,
        mhs.nama,
        srf.status as status_pengajuan,
        srf.tanggal_dibuat as tanggal_response,
        lf.file_url as lampiran_url,
        lf.original_name as lampiran_name,
        COALESCE(
            (SELECT MAX(p.semester) + 1 
             FROM persemester p 
             WHERE p.nim_mahasiswa = mhs.nim), 
            1
        ) as current_semester
    FROM response_finansial rf
    LEFT JOIN status_response_finansial srf ON rf.id = srf.id_response_finansial
    LEFT JOIN mahasiswa mhs ON rf.nim = mhs.nim
    LEFT JOIN lampiranfinance lf ON rf.id = lf.id_keluhan
    WHERE rf.nim = ?
    ORDER BY rf.tanggal_dibuat DESC
    `;

    try {
        // Eksekusi query dengan pool.execute
        // Destructuring [rows] akan mengambil array hasil query
        const [rowsRelief] = await pool.execute(SQLQuery, [nim]);

        // Process the data to add final_status logic
        const processedRows = rowsRelief.map((row) => ({
            ...row,
            status_pengajuan: row.status_pengajuan || 'Menunggu',
            lampiran: row.lampiran_url
                ? {
                      url: row.lampiran_url,
                      originalName: row.lampiran_name,
                  }
                : null,
        }));
        return processedRows;
    } catch (error) {
        console.error('Error fetching student relief data:', error);
        throw error;
    }
};

const financialResponse = async (id, status) => {
    try {
        // Ubah kondisi ini:
        // Jika status tidak ada (undefined) atau null, kita anggap ini adalah operasi SELECT
        if (status === undefined || status === null) {
            // atau bisa juga if (status == null) karena (undefined == null) itu true
            // Check if record exists
            const query = `SELECT * FROM status_response_finansial WHERE id_response_finansial = ?`;

            // Pastikan 'id' tidak undefined juga, meskipun controller sudah memvalidasi
            if (id === undefined) {
                throw new Error('ID is required for financial response query.');
            }
            const [rows] = await pool.execute(query, [id]);
            return rows[0] || null;
        } else {
            // Insert new record
            const query = `
                INSERT INTO status_response_finansial
                (id_response_finansial, status, tanggal_dibuat, tanggal_diubah)
                VALUES (?, ?, NOW(), NOW())`;

            // Pastikan 'id' dan 'status' tidak undefined
            if (id === undefined || status === undefined) {
                throw new Error(
                    'ID and Status are required for inserting financial response.'
                );
            }

            const [result] = await pool.execute(query, [id, status]);

            // Return the inserted record
            const selectQuery = `SELECT * FROM status_response_finansial WHERE id = ?`;
            const [rowsAfterInsert] = await pool.execute(selectQuery, [
                result.insertId,
            ]); // Mengganti nama variabel agar tidak konflik
            return rowsAfterInsert[0] || null;
        }
    } catch (error) {
        // Lebih baik melempar error asli jika itu sudah deskriptif,
        // atau bungkus dengan konteks yang lebih baik jika perlu.
        // Pesan error asli sudah cukup jelas: "Bind parameters must not contain undefined"
        // jadi mungkin tidak perlu diawali "Error with financial response: "
        console.error('Error in financialResponse:', error); // Log error internal
        throw error; // Re-throw error asli agar stack trace terjaga dan controller bisa menangkapnya
    }
};

module.exports = {
    fetchStudentsRelief,
    financialResponse,
};
