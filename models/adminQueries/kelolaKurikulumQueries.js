const { pool } = require('../../config/database');

exports.findMataKuliahByKurikulum = async (kurikulum) => {
    try {
        const sql = `
            SELECT 
                mb.id_mk,
                mb.kode_mk,
                mb.nama_mk,
                mb.sks_mk,
                mb.jenis_mk,
                mb.tingkat,
                mb.jenis_semester,
                mb.semester,
                mb.ekivalensi,
                mb.kurikulum,
                pk.kelompok_keahlian,
                -- Ambil nama mata kuliah ekuivalen dari mata_kuliah_lama
                ml.nama_mk_lama as nama_ekuivalen,
                ml.kode_mk_lama as kode_ekuivalen,
                -- Ambil kurikulum mata kuliah ekuivalen dari mata_kuliah_baru
                mb2.kurikulum as kurikulum_ekuivalen
            FROM 
                mata_kuliah_baru AS mb
            LEFT JOIN
                peminatan_keahlian AS pk ON mb.kode_mk = pk.kode_matakuliah
            LEFT JOIN 
                mata_kuliah_lama AS ml ON mb.ekivalensi = ml.kode_mk_lama
            LEFT JOIN 
                mata_kuliah_baru AS mb2 ON mb.ekivalensi = mb2.kode_mk AND mb2.kurikulum != mb.kurikulum
            WHERE 
                mb.kurikulum = ?
            ORDER BY 
                mb.semester ASC, mb.kode_mk ASC
        `;
        
        const [rows] = await pool.execute(sql, [kurikulum]);
        
        // Format hasil untuk menggabungkan informasi ekuivalensi
        const formattedResult = rows.map(row => ({
            id_mk: row.id_mk,
            kode_mk: row.kode_mk,
            nama_mk: row.nama_mk,
            sks_mk: row.sks_mk,
            jenis_mk: row.jenis_mk,
            tingkat: row.tingkat,
            jenis_semester: row.jenis_semester,
            semester: row.semester,
            kurikulum: row.kurikulum,
            kelompok_keahlian: row.kelompok_keahlian || null,
            ekivalensi: row.ekivalensi,
            ekuivalensi_info: row.ekivalensi ? {
                kode: row.ekivalensi,
                nama: row.nama_ekuivalen || 'Tidak ditemukan',
                kurikulum: row.nama_ekuivalen ? '2020' : (row.kurikulum_ekuivalen || 'Tidak diketahui')
            } : null
        }));

        return formattedResult;
    } catch (error) {
        console.error(`Error in findMataKuliahByKurikulum query (kurikulum: ${kurikulum}):`, error);
        throw error;
    }
};


/**
 * Mengambil semua kurikulum yang tersedia
 */
exports.getAllKurikulum = async () => {
    try {
        const sql = `
            SELECT DISTINCT kurikulum 
            FROM mata_kuliah_baru 
            ORDER BY kurikulum DESC
        `;
        
        const [rows] = await pool.execute(sql);
        return rows.map(row => row.kurikulum);
    } catch (error) {
        console.error('Error in getAllKurikulum query:', error);
        throw error;
    }
};

/**
 * Mengambil semua kelompok keahlian yang unik
 */
exports.getAllKelompokKeahlian = async () => {
    try {
        const sql = `
            SELECT DISTINCT kelompok_keahlian 
            FROM peminatan_keahlian 
            ORDER BY kelompok_keahlian ASC
        `;
        
        const [rows] = await pool.execute(sql);
        return rows.map(row => row.kelompok_keahlian);
    } catch (error) {
        console.error('Error in getAllKelompokKeahlian query:', error);
        throw error;
    }
};


/**
 * Mengambil mata kuliah berdasarkan ID
 */
exports.findMataKuliahById = async (id_mk) => {
    try {
        const sql = `
            SELECT 
                mb.id_mk, 
                mb.kode_mk, 
                mb.nama_mk, 
                mb.sks_mk, 
                mb.jenis_mk, 
                mb.tingkat, 
                mb.jenis_semester, 
                mb.semester, 
                mb.ekivalensi, 
                mb.kurikulum,
                pk.kelompok_keahlian
            FROM mata_kuliah_baru as mb
            LEFT JOIN peminatan_keahlian as pk ON mb.kode_mk = pk.kode_matakuliah
            WHERE mb.id_mk = ?
        `;
        
        const [rows] = await pool.execute(sql, [id_mk]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error(`Error in findMataKuliahById query (id: ${id_mk}):`, error);
        throw error;
    }
};


/**
 * Mengecek duplikasi kode mata kuliah dalam kurikulum yang sama
 */
exports.checkDuplicateKodeMK = async (kode_mk, kurikulum, excludeId = null) => {
    try {
        let sql = `
            SELECT COUNT(*) as count 
            FROM mata_kuliah_baru 
            WHERE kode_mk = ? AND kurikulum = ?
        `;
        let params = [kode_mk, kurikulum];
        
        if (excludeId) {
            sql += ' AND id_mk != ?';
            params.push(excludeId);
        }
        
        const [rows] = await pool.execute(sql, params);
        return rows[0].count > 0;
    } catch (error) {
        console.error('Error in checkDuplicateKodeMK query:', error);
        throw error;
    }
};


/**
 * Menambah mata kuliah baru
 */
exports.createMataKuliah = async (mataKuliahData) => {
    try {
        // Mulai transaksi
        
        const {
            kode_mk, 
            nama_mk, 
            sks_mk, 
            jenis_mk, 
            tingkat = 1,
            jenis_semester = 'Ganjil', 
            semester, 
            ekivalensi, 
            kurikulum,
            kelompok_keahlian,
        } = mataKuliahData;

        // Cek duplikasi terlebih dahulu
        const isDuplicate = await this.checkDuplicateKodeMK(kode_mk, kurikulum);
        if (isDuplicate) {
            throw new Error(`Kode mata kuliah '${kode_mk}' sudah ada dalam kurikulum ${kurikulum}`);
        }

        // Jika ada ekivalensi, cek apakah mata kuliah ekivalensi ada di mata_kuliah_baru
        if (ekivalensi !== null) {
            // Cari mata kuliah ekivalensi di tabel mata_kuliah_baru
            const sqlCheckEkivalensi = `
                SELECT * FROM mata_kuliah_baru 
                WHERE kode_mk = ?
            `;
            
            const [ekivalensiRows] = await pool.execute(sqlCheckEkivalensi, [ekivalensi]);
            
            if (ekivalensiRows.length > 0) {
                const mataKuliahEkivalensi = ekivalensiRows[0];
                
                // Cek apakah sudah ada di mata_kuliah_lama
                const sqlCheckLama = `
                    SELECT * FROM mata_kuliah_lama 
                    WHERE kode_mk_lama = ?
                `;
                
                const [lamaRows] = await pool.execute(sqlCheckLama, [ekivalensi]);
                
                // Jika belum ada di mata_kuliah_lama, insert ke sana
                if (lamaRows.length === 0) {
                    const sqlInsertLama = `
                        INSERT INTO mata_kuliah_lama 
                        (kode_mk_lama, nama_mk_lama, sks_mk_lama)
                        VALUES (?, ?, ?)
                    `;
                    
                    await pool.execute(sqlInsertLama, [
                        mataKuliahEkivalensi.kode_mk,
                        mataKuliahEkivalensi.nama_mk,
                        mataKuliahEkivalensi.sks_mk,
                    ]);
                    
                    console.log(`Mata kuliah ekivalensi '${ekivalensi}' berhasil ditambahkan ke mata_kuliah_lama`);
                }
            } else {
                console.warn(`Mata kuliah ekivalensi '${ekivalensi}' tidak ditemukan di mata_kuliah_baru`);
            }
        }

        // Insert mata kuliah baru
        const sqlInsertBaru = `
            INSERT INTO mata_kuliah_baru 
            (kode_mk, 
            nama_mk, 
            sks_mk, 
            jenis_mk, 
            tingkat, 
            jenis_semester, 
            semester, 
            ekivalensi, 
            kurikulum)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(sqlInsertBaru, [
            kode_mk, 
            nama_mk, 
            sks_mk, 
            jenis_mk, 
            tingkat,
            jenis_semester, 
            semester, 
            ekivalensi || null, 
            kurikulum
        ]);

        // Jika ada kelompok keahlian, jalankan logika "hapus-lalu-tambah"
        if (kelompok_keahlian) {
            // LANGKAH 1: Hapus semua relasi lama untuk kode_mk ini.
            // Ini untuk memastikan 'kode_mk' hanya terhubung ke satu 'kelompok_keahlian'.
            const deleteSql = `DELETE FROM peminatan_keahlian WHERE kode_matakuliah = ?`;
            await pool.execute(deleteSql, [kode_mk]);
            
            // LANGKAH 2: Tambahkan relasi yang baru.
            const insertSql = `INSERT INTO peminatan_keahlian (kelompok_keahlian, kode_matakuliah) VALUES (?, ?)`;
            await pool.execute(insertSql, [kelompok_keahlian, kode_mk]);
        }

        return {
            id_mk: result.insertId,
            ...mataKuliahData,
            ekivalensi: ekivalensi || null
        };
        
    } catch (error) {
        // Rollback transaksi jika terjadi error
        console.error('Error in createMataKuliah query:', error);
        throw error;
    }
};


/**
 * Mengupdate mata kuliah berdasarkan ID
 */
exports.updateMataKuliah = async (id_mk, mataKuliahData) => {
    try {
        const {
            kode_mk, nama_mk, sks_mk, jenis_mk, tingkat = 1,
            jenis_semester = 'Ganjil', semester, ekivalensi, kurikulum, kelompok_keahlian
        } = mataKuliahData;

        // Cek duplikasi (kecuali untuk record yang sedang diupdate)
        const isDuplicate = await this.checkDuplicateKodeMK(kode_mk, kurikulum, id_mk);
        if (isDuplicate) {
            throw new Error(`Kode mata kuliah '${kode_mk}' sudah ada dalam kurikulum ${kurikulum}`);
        }

        // Jika ada ekivalensi, cek apakah mata kuliah ekivalensi ada di mata_kuliah_baru
        if (ekivalensi !== null) {
            // Cari mata kuliah ekivalensi di tabel mata_kuliah_baru
            const sqlCheckEkivalensi = `
                SELECT * FROM mata_kuliah_baru 
                WHERE kode_mk = ?
            `;
            
            const [ekivalensiRows] = await pool.execute(sqlCheckEkivalensi, [ekivalensi]);
            
            if (ekivalensiRows.length > 0) {
                const mataKuliahEkivalensi = ekivalensiRows[0];
                
                // Cek apakah sudah ada di mata_kuliah_lama
                const sqlCheckLama = `
                    SELECT * FROM mata_kuliah_lama 
                    WHERE kode_mk_lama = ?
                `;
                
                const [lamaRows] = await pool.execute(sqlCheckLama, [ekivalensi]);
                
                // Jika belum ada di mata_kuliah_lama, insert ke sana
                if (lamaRows.length === 0) {
                    const sqlInsertLama = `
                        INSERT INTO mata_kuliah_lama 
                        (kode_mk_lama, nama_mk_lama, sks_mk_lama)
                        VALUES (?, ?, ?)
                    `;
                    
                    await pool.execute(sqlInsertLama, [
                        mataKuliahEkivalensi.kode_mk,
                        mataKuliahEkivalensi.nama_mk,
                        mataKuliahEkivalensi.sks_mk,
                    ]);
                    
                    console.log(`Mata kuliah ekivalensi '${ekivalensi}' berhasil ditambahkan ke mata_kuliah_lama`);
                }
            } else {
                console.warn(`Mata kuliah ekivalensi '${ekivalensi}' tidak ditemukan di mata_kuliah_baru`);
            }
        }

        const sql = `
            UPDATE 
                mata_kuliah_baru 
            SET 
                kode_mk = ?, 
                nama_mk = ?, 
                sks_mk = ?, 
                jenis_mk = ?, 
                tingkat = ?, 
                jenis_semester = ?, 
                semester = ?, 
                ekivalensi = ?, 
                kurikulum = ?
            WHERE 
                id_mk = ?
        `;
        
        const [result] = await pool.execute(sql, [
            kode_mk, 
            nama_mk, 
            sks_mk, 
            jenis_mk, 
            tingkat,
            jenis_semester, 
            semester, 
            ekivalensi || null, 
            kurikulum, 
            id_mk
        ]);
        
        if (result.affectedRows === 0) {
            return null; // Mata kuliah tidak ditemukan
        }

        // Jika ada kelompok keahlian, jalankan logika "hapus-lalu-tambah"
        if (kelompok_keahlian) {
            // LANGKAH 1: Hapus semua relasi lama untuk kode_mk ini.
            // Ini untuk memastikan 'kode_mk' hanya terhubung ke satu 'kelompok_keahlian'.
            const deleteSql = `DELETE FROM peminatan_keahlian WHERE kode_matakuliah = ?`;
            await pool.execute(deleteSql, [kode_mk]);
            
            // LANGKAH 2: Tambahkan relasi yang baru.
            const insertSql = `INSERT INTO peminatan_keahlian (kelompok_keahlian, kode_matakuliah) VALUES (?, ?)`;
            await pool.execute(insertSql, [kelompok_keahlian, kode_mk]);
        }
        
        return await this.findMataKuliahById(id_mk);
    } catch (error) {
        console.error(`Error in updateMataKuliah query (id: ${id_mk}):`, error);
        throw error;
    }
};


/**
 * Menghapus mata kuliah berdasarkan ID
 */
exports.deleteMataKuliah = async (id_mk) => {
    try {
        const sql = `DELETE FROM mata_kuliah_baru WHERE id_mk = ?`;
        const [result] = await pool.execute(sql, [id_mk]);
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Error in deleteMataKuliah query (id: ${id_mk}):`, error);
        throw error;
    }
};


/**
 * Mengambil opsi mata kuliah untuk ekuivalensi
 * Termasuk mata kuliah lama dan mata kuliah dari kurikulum yang lebih lama
 */
exports.getEkuivalensiOptions = async (currentKurikulum = null) => {
    try {
        let ekuivalensiOptions = [];
        
        // Ambil mata kuliah lama yang kodenya TIDAK ada di mata_kuliah_baru
        const sqlLama = `
            SELECT 
                ml.id, 
                ml.kode_mk_lama as kode, 
                ml.nama_mk_lama as nama, 
                2020 as kurikulum_type
            FROM 
                mata_kuliah_lama ml
            WHERE 
                ml.kode_mk_lama NOT IN (
                    SELECT DISTINCT kode_mk 
                    FROM mata_kuliah_baru 
                    WHERE kode_mk IS NOT NULL
                )
            ORDER BY ml.kode_mk_lama ASC
        `;
        const [mataKuliahLama] = await pool.execute(sqlLama);
        ekuivalensiOptions = [...mataKuliahLama];
        
        // Jika ada currentKurikulum, ambil mata kuliah dari kurikulum yang lebih lama
        if (currentKurikulum) {
            const sqlBaru = `
                SELECT 
                    id_mk as id, 
                    kode_mk as kode, 
                    nama_mk as nama, 
                    kurikulum, 
                    kurikulum as kurikulum_type
                FROM 
                    mata_kuliah_baru
                WHERE 
                    kurikulum <= ?
                ORDER BY kurikulum DESC, kode_mk ASC
            `;
            const [mataKuliahBaru] = await pool.execute(sqlBaru, [currentKurikulum]);
            ekuivalensiOptions = [...ekuivalensiOptions, ...mataKuliahBaru];
        }
        
        return ekuivalensiOptions;
    } catch (error) {
        console.error('Error in getEkuivalensiOptions query:', error);
        throw error;
    }
};