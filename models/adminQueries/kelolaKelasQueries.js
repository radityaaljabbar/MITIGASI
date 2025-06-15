const { pool } = require('../../config/database');

/**
 * @desc    Fetches all classes and joins with the lecturer's table to get their name.
 * @returns {Promise<Array>} An array of class objects with lecturer details.
 */
exports.findAllWithDosen = async () => {
    const sql = `
        SELECT 
            k.id_kelas, 
            k.tahun_angkatan, 
            k.kode_kelas, 
            k.kode_dosen,
            dw.nama AS nama_dosen
        FROM kelas k
        LEFT JOIN dosen_wali dw ON k.kode_dosen = dw.kode
        ORDER BY k.tahun_angkatan DESC, k.kode_kelas ASC
    `;
    const [rows] = await pool.execute(sql);
    return rows;
};

/**
 * @desc    Creates a new class entry in the database.
 * @param {Object} kelasData - Contains { tahun_angkatan, kode_kelas, kode_dosen }.
 * @returns {Promise<number>} The ID of the newly created class.
 */
exports.createKelas = async (kelasData) => {
    const { tahun_angkatan, kode_kelas, kode_dosen } = kelasData;
    const sql = 'INSERT INTO kelas (tahun_angkatan, kode_kelas, kode_dosen) VALUES (?, ?, ?)';
    // The `kode_dosen` will be stored as NULL in the DB if the variable is null
    const [result] = await pool.execute(sql, [tahun_angkatan, kode_kelas, kode_dosen]);
    return result.insertId;
};

/**
 * @desc    Updates the lecturer (dosen_wali) for a specific class.
 * @param {number} id_kelas - The ID of the class to update.
 * @param {string|null} kode_dosen - The new lecturer code, or null to remove the lecturer.
 * @returns {Promise<boolean>} True if a row was affected.
 */
exports.updateDosenWaliforKelas = async (id_kelas, kode_dosen) => {
    const sql = 'UPDATE kelas SET kode_dosen = ? WHERE id_kelas = ?';
    const [result] = await pool.execute(sql, [kode_dosen, id_kelas]);
    return result.affectedRows > 0;
};

/**
 * @desc    Deletes a class from the database by its ID.
 * @param {number} id_kelas - The ID of the class to delete.
 * @returns {Promise<boolean>} True if a row was affected.
 */
exports.deleteKelasById = async (id_kelas) => {
    const sql = 'DELETE FROM kelas WHERE id_kelas = ?';
    const [result] = await pool.execute(sql, [id_kelas]);
    return result.affectedRows > 0;
};