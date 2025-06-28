// src/models/logQueries.js
const { pool } = require('../../config/database');

/**
 * @desc    Menyimpan satu entri log ke tabel admin_logs.
 * @param   {object} logData Data log yang akan disimpan.
 * @returns {Promise<void>}
 */
exports.createLog = async (logData) => {
    const { admin_username, action, endpoint, ip_address, status, target_entity } = logData;
    const sql = `
        INSERT INTO admin_logs 
            (admin_username, action, endpoint, ip_address, status, target_entity, log_time) 
        VALUES ( ?, ?, ?, ?, ?, ?, CONVERT_TZ(NOW(), 'UTC', 'Asia/Jakarta'));
    `;
    // Kita tidak perlu menunggu (await) atau mengembalikan apa pun untuk logging,
    // biarkan berjalan di background (fire-and-forget).
    pool.execute(sql, [admin_username, action, endpoint, ip_address, status, target_entity]);
};

/**
 * @desc    Mengambil semua log dari database, diurutkan dari yang terbaru.
 * @param   {object} filters - Opsi filter (opsional).
 * @returns {Promise<Array>} Array berisi semua data log.
 */
exports.findAllLogs = async (filters = {}) => {
    // TODO: Tambahkan logika filter jika diperlukan (misal: berdasarkan username, tanggal)
    const sql = `
      SELECT id, admin_username, action, endpoint, ip_address, status, target_entity, log_time 
      FROM admin_logs 
      ORDER BY log_time DESC
      LIMIT 1000; -- Batasi untuk performa
    `;
    const [rows] = await pool.execute(sql);
    return rows;
}