const { pool } = require('../../config/database');

/**
 * Mengambil semua admin dari database, diurutkan berdasarkan nama.
 * @returns {Promise<Array>} Array objek admin.
 */
exports.findAllAdmins = async () => {
    const sql = 'SELECT id, name, username, created_at FROM atmin_mitigasi ORDER BY name';
    const [rows] = await pool.execute(sql);
    return rows;
};

/**
 * Membuat admin baru di database. Hashing password harus dilakukan di controller.
 * @param {Object} adminData - Objek berisi { name, username, password }.
 * @returns {Promise<number>} ID dari admin yang baru dibuat.
 */
exports.createAdmin = async (adminData) => {
    const { name, username, password } = adminData;
    const sql = 'INSERT INTO atmin_mitigasi (name, username, password) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [name, username, password]);
    return result.insertId;
};

/**
 * Memperbarui data admin berdasarkan ID. Hashing password (jika ada) dilakukan di controller.
 * @param {number} id - ID admin yang akan diupdate.
 * @param {Object} adminData - Objek berisi { name, username, password? }.
 * @returns {Promise<boolean>} True jika ada baris yang terpengaruh.
 */
exports.updateAdminById = async (id, adminData) => {
    const { name, username, password } = adminData;
    let sql = 'UPDATE atmin_mitigasi SET name = ?, username = ?';
    const params = [name, username];

    if (password) {
        sql += ', password = ?';
        params.push(password);
    }
    sql += ' WHERE id = ?';
    params.push(id);

    const [result] = await pool.execute(sql, params);
    return result.affectedRows > 0;
};

/**
 * Menghapus admin dari database berdasarkan ID.
 * @param {number} id - ID admin yang akan dihapus.
 * @returns {Promise<boolean>} True jika ada baris yang terpengaruh.
 */
exports.deleteAdminById = async (id) => {
    const sql = 'DELETE FROM atmin_mitigasi WHERE id = ?';
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0;
};

// =============================================
// ==        QUERIES UNTUK DOSEN WALI         ==
// =============================================

/**
 * Mengambil semua dosen wali beserta daftar kelas wali mereka dalam satu query.
 * @returns {Promise<Array>} Array objek dosen, masing-masing dengan properti 'kelas_wali'.
 */
exports.findAllDosen = async () => {
    const sql = `
        SELECT dw.nip, dw.nama, dw.kode, dw.status, GROUP_CONCAT(k.kode_kelas SEPARATOR ', ') AS kelas_wali
        FROM dosen_wali dw
        LEFT JOIN kelas k ON dw.kode = k.kode_dosen
        GROUP BY dw.nip, dw.nama, dw.kode
        ORDER BY dw.nama
    `;
    const [rows] = await pool.execute(sql);
    return rows;
};

/**
 * Membuat dosen wali baru.
 * @param {Object} dosenData - { nip, nama, kode, password }.
 * @returns {Promise<string>} NIP dosen yang baru dibuat.
 */
exports.createDosen = async (dosenData) => {
    const { nip, nama, kode, password } = dosenData;
    const sql = 'INSERT INTO dosen_wali (nip, nama, kode, password) VALUES (?, ?, ?, ?)';
    await pool.execute(sql, [nip, nama, kode, password]);
    return nip;
};

/**
 * Memperbarui data dosen wali berdasarkan NIP.
 * @param {string} nip - NIP dosen.
 * @param {Object} dosenData - { nama, kode, password? }.
 * @returns {Promise<boolean>} True jika berhasil.
 */
exports.updateDosenByNip = async (nip, dosenData) => {
    const { nama, kode, password, status} = dosenData;
    let sql = 'UPDATE dosen_wali SET nama = ?, kode = ?, status=?';
    const params = [nama, kode, status];

    if (password) { sql += ', password = ?'; params.push(password); }
    sql += ' WHERE nip = ?';
    params.push(nip);

    const [result] = await pool.execute(sql, params);
    return result.affectedRows > 0;
};

/**
 * Menghapus dosen wali berdasarkan NIP.
 * @param {string} nip - NIP dosen.
 * @returns {Promise<boolean>} True jika berhasil.
 */
exports.deleteDosenByNip = async (nip) => {
    const sql = 'DELETE FROM dosen_wali WHERE nip = ?';
    const [result] = await pool.execute(sql, [nip]);
    return result.affectedRows > 0;
};

// =============================================
// ==         QUERIES UNTUK MAHASISWA         ==
// =============================================

/**
 * Mengambil semua mahasiswa.
 * @returns {Promise<Array>} Array objek mahasiswa.
 */
exports.findAllMahasiswa = async () => {
    const sql = 'SELECT nim, nama, kelas, status FROM mahasiswa ORDER BY nim';
    const [rows] = await pool.execute(sql);
    return rows;
};

/**
 * Membuat mahasiswa baru.
 * @param {Object} mhsData - { nim, nama, kelas, password }.
 * @returns {Promise<string>} NIM mahasiswa yang baru dibuat.
 */
exports.createMahasiswa = async (mhsData) => {
    const { nim, nama, kelas, password } = mhsData;
    const sql = 'INSERT INTO mahasiswa (nim, nama, kelas, password) VALUES (?, ?, ?, ?)';
    await pool.execute(sql, [nim, nama, kelas, password]);
    return nim;
};

/**
 * Memperbarui data mahasiswa berdasarkan NIM.
 * @param {string} nim - NIM mahasiswa.
 * @param {Object} mhsData - { nama, kelas, password? }.
 * @returns {Promise<boolean>} True jika berhasil.
 */
exports.updateMahasiswaByNim = async (nim, mhsData) => {
    const { nama, kelas, password, status } = mhsData;
    let sql = 'UPDATE mahasiswa SET nama = ?, kelas = ?, status = ?';
    const params = [nama, kelas, status];
    
    if (password) { sql += ', password = ?'; params.push(password); }
    sql += ' WHERE nim = ?';
    params.push(nim);
    
    const [result] = await pool.execute(sql, params);
    return result.affectedRows > 0;
};

/**
 * Menghapus mahasiswa berdasarkan NIM.
 * @param {string} nim - NIM mahasiswa.
 * @returns {Promise<boolean>} True jika berhasil.
 */
exports.deleteMahasiswaByNim = async (nim) => {
    const sql = 'DELETE FROM mahasiswa WHERE nim = ?';
    const [result] = await pool.execute(sql, [nim]);
    return result.affectedRows > 0;
};


// =============================================
// ==   QUERIES UNTUK KELAS & ANGKATAN   ==
// =============================================

/**
 * Mengambil semua data dari tabel kelas.
 * @returns {Promise<Array>} Array objek kelas.
 */
exports.findAllKelas = async () => {
    const sql = 'SELECT id_kelas, tahun_angkatan, kode_dosen, kode_kelas FROM kelas ORDER BY tahun_angkatan DESC, kode_kelas ASC';
    const [rows] = await pool.execute(sql);
    return rows;
};

/**
 * Membuat banyak kelas sekaligus dalam satu transaksi database.
 * @param {number} tahunAngkatan - Tahun angkatan.
 * @param {Array<Object>} classes - Array of objects [{ kode_kelas, kode_dosen }].
 * @returns {Promise<boolean>} True jika berhasil.
 */
exports.createKelasBatch = async (tahunAngkatan, classes) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const sql = 'INSERT INTO kelas (tahun_angkatan, kode_dosen, kode_kelas) VALUES ?';
        const values = classes.map(c => [tahunAngkatan, c.kode_dosen, c.kode_kelas]);
        await conn.query(sql, [values]); // query() lebih baik untuk multi-row insert
        await conn.commit();
        return true;
    } catch (error) {
        await conn.rollback();
        console.error("Batch insert kelas gagal:", error);
        throw error;
    } finally {
        conn.release();
    }
};

/**
 * Menghapus entri kelas berdasarkan ID-nya.
 * @param {number} id_kelas - ID dari tabel kelas.
 * @returns {Promise<boolean>} True jika berhasil.
 */
exports.deleteKelasById = async (id_kelas) => {
    const sql = 'DELETE FROM kelas WHERE id_kelas = ?';
    const [result] = await pool.execute(sql, [id_kelas]);
    return result.affectedRows > 0;
};