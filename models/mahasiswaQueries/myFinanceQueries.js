const { pool } = require('../../config/database');

const submitRelief = async (valueRelief) => {
    const connection = await pool.getConnection(); // Dapatkan connection dari pool

    try {
        // Mulai transaction
        await connection.beginTransaction();

        const submitQuery = `   INSERT INTO response_finansial 
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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // Eksekusi query insert response_finansial
        const [rowsRelief] = await connection.execute(submitQuery, valueRelief);

        // Dapatkan ID dari insert result (bukan dari rowsRelief)
        const responseId = rowsRelief.insertId; // insertId adalah property dari insert result
        const nim = valueRelief[0]; // nim dari parameter valueRelief array

        // Step 1: Delete any existing records for this nim
        const [deleteResult] = await pool.execute(
            'DELETE FROM klasifikasi_finansial WHERE nim = ?',
            [nim]
        );

        console.log(
            `Deleted ${deleteResult.affectedRows} existing records for nim: ${nim}`
        );

        // INSERT ke klasifikasi_finansial
        await connection.execute(
            `INSERT INTO klasifikasi_finansial (nim, status_finansial, id_response) 
             VALUES (?, '1', ?)`,
            [nim, responseId]
        );

        // Commit transaction
        await connection.commit();

        return {
            success: true,
            insertId: responseId,
            affectedRows: rowsRelief.affectedRows,
            message: 'Data relief dan klasifikasi berhasil disimpan',
        };
    } catch (error) {
        // Rollback jika ada error
        await connection.rollback();
        console.error('Error submitting relief data:', error);
        throw error;
    } finally {
        // Release connection kembali ke pool
        connection.release();
    }
};

const fetchRelief = async (nim) => {
    const SQLQuery = `
    SELECT 
        mhs.nama,
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
        srf.tanggal_dibuat as tanggal_response,
        lf.file_url as lampiran_url,
        lf.original_name as lampiran_name
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
            status_pengajuan: row.status_pengajuan || 'Menunggu Review',
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

const saveLampiranFinance = async (lampiranData) => {
    try {
        const query = `
            INSERT INTO lampiranfinance 
            (id_keluhan, file_name, original_name, file_url, file_type, file_size)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(query, [
            lampiranData.id_keluhan,
            lampiranData.file_name,
            lampiranData.original_name,
            lampiranData.file_url,
            lampiranData.file_type,
            lampiranData.file_size,
        ]);

        return result;
    } catch (error) {
        console.error('Error saving lampiran finance:', error);
        throw error;
    }
};

module.exports = {
    submitRelief,
    fetchRelief,
    saveLampiranFinance,
};
