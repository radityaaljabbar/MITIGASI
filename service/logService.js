const { createLog } = require('../models/logQueries/logQueries'); // Kita akan buat file ini selanjutnya

/**
 * @desc    Mencatat aktivitas admin ke dalam database.
 * @param {object} logData - Data log yang akan dicatat.
 * @param {object} logData.req - Objek request dari Express (untuk mendapatkan IP dan endpoint).
 * @param {object} logData.admin - Objek admin yang sedang login (dari req.user).
 * @param {string} logData.action - Deskripsi aksi yang dilakukan.
 * @param {string} logData.target_entity - ID atau pengenal dari entitas yang diubah.
 * @param {'success'|'fail'} logData.status - Status keberhasilan aksi.
 */
exports.logActivity = async ({ req, admin, action, target_entity, status }) => {
    try {
        const logEntry = {
            admin_username: admin ? admin.username : 'SYSTEM',
            action,
            endpoint: req.originalUrl,
            ip_address: req.ip,
            status,
            target_entity
        };

        // Panggil query untuk menyimpan ke database
        await createLog(logEntry);
        
        console.log(`[LOG] Admin '${logEntry.admin_username}' | Action: ${logEntry.action} | Status: ${status}`);

    } catch (error) {
        // Jika logging itu sendiri gagal, kita hanya menampilkannya di console
        // agar tidak mengganggu alur utama aplikasi.
        console.error('FATAL: Failed to write to admin_logs table.', error);
    }
};