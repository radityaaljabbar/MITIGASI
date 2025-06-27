const { pool } = require('../../config/database');

/**
 * @desc    Get achievement data (TAK and IPK) for a specific student by NIM.
 * @param   {string} nim The NIM of the student.
 * @returns {Promise<Array|null>} An array with the formatted data, or null if not found.
 */
exports.getDataPrestasi = async (nim) => {
    try {
        const sql = `
            SELECT 
                mhs.nim,
                mhs.nama,
                tak.tak,
                ipk.ipk_lulus,
                ipk.sks_lulus
            FROM 
                mahasiswa AS mhs
            LEFT JOIN 
                tak_mahasiswa AS tak ON mhs.nim = tak.nim
            LEFT JOIN 
                ipk_mahasiswa AS ipk ON mhs.nim = ipk.nim
            WHERE 
                mhs.nim = ?;
        `;
        const [rows] = await pool.execute(sql, [nim]);

        // Jika tidak ada mahasiswa dengan NIM tersebut, kembalikan null.
        if (rows.length === 0) {
            return null;
        }

        // Ambil objek pertama dari array hasil query.
        const studentData = rows[0];

        // Format hasil agar rapi.
        const formattedResult = {
            nim: studentData.nim,
            nama: studentData.nama,
            tak: studentData.tak,
            ipk: studentData.ipk_lulus,
            totalSks: studentData.sks_lulus
        };

        return [{ status: 'success', payload: formattedResult }];

    } catch (error) {
        console.error(`Error in getDataPrestasi query (nim: ${nim}):`, error);
        throw error;
    }
};

/**
 * @desc    Create new student achievement records (TAK and IPK) in a single transaction.
 * @param   {object} data Object containing achievement data, including a pre-set 'tanggal_dibuat'.
 * @returns {Promise<Array>} An array containing a status object with the payload of the created data.
 */
exports.createDataPrestasi = async (data) => {
    const connection = await pool.getConnection();

    try {
        // 'tanggal_dibuat' sekarang diterima langsung dari controller
        const { nim, tak, sks_lulus, ipk_lulus, tanggal_dibuat } = data;

        await connection.beginTransaction();

        // Query untuk INSERT ke tabel tak_mahasiswa
        const sqlTak = `
            INSERT INTO tak_mahasiswa (nim, tak, tanggal_dibuat) 
            VALUES (?, ?, ?);
        `;
        await connection.execute(sqlTak, [nim, tak, tanggal_dibuat]);

        // Query untuk INSERT ke tabel ipk_mahasiswa
        const sqlIpk = `
            INSERT INTO ipk_mahasiswa (nim, sks_lulus, ipk_lulus, tanggal_dibuat) 
            VALUES (?, ?, ?, ?);
        `;
        await connection.execute(sqlIpk, [nim, sks_lulus, ipk_lulus, tanggal_dibuat]);

        await connection.commit();

        const createdData = {
            nim: nim,
            tak_inserted: tak,
            ipk_inserted: {
                sks: sks_lulus,
                ipk: ipk_lulus,
            },
            timestamp: tanggal_dibuat,
        };

        return [{ status: 'success', payload: createdData }];

    } catch (error) {
        await connection.rollback();
        console.error('Error in createPrestasi transaction:', error);
        throw error;
    } finally {
        connection.release();
    }
};


/**
 * @desc    Update student achievement records (TAK and IPK) in a single transaction.
 * @param   {string} nim The NIM of the student to update.
 * @param   {object} data Object containing new data: { tak, sks_lulus, ipk_lulus }
 * @returns {Promise<Array>} An array containing a status object with the results of the update operations.
 */
exports.updateDataPrestasi = async (nim, data) => {
    // 1. Dapatkan koneksi dari pool untuk memulai transaksi
    const connection = await pool.getConnection();

    try {
        // 2. Destructuring data input
        const { tak, sks_lulus, ipk_lulus } = data;

        // 3. Memulai transaksi
        await connection.beginTransaction();

        // 4. Query untuk UPDATE tabel tak_mahasiswa
        const sqlTak = `
            UPDATE tak_mahasiswa 
            SET tak = ? 
            WHERE nim = ?;
        `;
        // `tanggal_diubah` akan diperbarui secara otomatis oleh database
        const [resultTak] = await connection.execute(sqlTak, [tak, nim]);

        // 5. Query untuk UPDATE tabel ipk_mahasiswa
        const sqlIpk = `
            UPDATE ipk_mahasiswa 
            SET sks_lulus = ?, ipk_lulus = ? 
            WHERE nim = ?;
        `;
        const [resultIpk] = await connection.execute(sqlIpk, [sks_lulus, ipk_lulus, nim]);

        // 6. Jika semua query berhasil, commit transaksi
        await connection.commit();

        // 7. Kembalikan hasil dari kedua operasi update.
        //    Ini berguna untuk controller memeriksa 'affectedRows'.
        return [{ 
            status: 'success', 
            payload: { 
                takResult: resultTak, 
                ipkResult: resultIpk 
            } 
        }];

    } catch (error) {
        // 8. Jika terjadi error, batalkan semua perubahan (rollback)
        await connection.rollback();
        
        console.error(`Error in updatePrestasi transaction for NIM ${nim}:`, error);
        throw error; // Lempar error agar ditangani oleh controller

    } finally {
        // 9. Selalu lepaskan koneksi kembali ke pool
        connection.release();
    }
};


exports.upsertKlasifikasi = async (nim, hasilKlasifikasi) => {
    try {
        const sql = `
            INSERT INTO klasifikasi_akademik (nim, hasil_klasifikasi, tanggal_dibuat)
            VALUES (?, ?, NOW())
            ON DUPLICATE KEY UPDATE
                hasil_klasifikasi = VALUES(hasil_klasifikasi),
                tanggal_diubah = NOW();
        `;
        const [result] = await pool.execute(sql, [nim, hasilKlasifikasi]);
        return result;
    } catch (error) {
        console.error(`Error in upsertKlasifikasi query (nim: ${nim}):`, error);
        // Lempar error agar bisa ditangkap oleh controller jika diperlukan
        throw error;
    }
};

/**
 * @desc    Delete student achievement records (TAK and IPK) in a single transaction.
 * @param   {string} nim The NIM of the student whose records should be deleted.
 * @returns {Promise<Array>} An array containing a status object with the results of the delete operations.
 */
exports.deleteDataPrestasi = async (nim) => {
    // 1. Dapatkan koneksi dari pool untuk memulai transaksi
    const connection = await pool.getConnection();

    try {
        // 2. Memulai transaksi
        await connection.beginTransaction();

        // 3. Query untuk DELETE dari tabel tak_mahasiswa
        const sqlTak = `DELETE FROM tak_mahasiswa WHERE nim = ?;`;
        const [resultTak] = await connection.execute(sqlTak, [nim]);

        // 4. Query untuk DELETE dari tabel ipk_mahasiswa
        const sqlIpk = `DELETE FROM ipk_mahasiswa WHERE nim = ?;`;
        const [resultIpk] = await connection.execute(sqlIpk, [nim]);

        // 5. Jika kedua query berhasil, commit transaksi (simpan permanen)
        await connection.commit();

        // 6. Kembalikan hasil dari kedua operasi delete.
        //    Ini berguna untuk controller memeriksa 'affectedRows'.
        return [{ 
            status: 'success', 
            payload: { 
                takResult: resultTak, 
                ipkResult: resultIpk 
            } 
        }];

    } catch (error) {
        
        console.error(`Error in deletePrestasi transaction for NIM ${nim}:`, error);
        throw error; // Lempar error agar ditangani oleh controller

    } finally {
        // 8. Selalu lepaskan koneksi kembali ke pool
        connection.release();
    }
};