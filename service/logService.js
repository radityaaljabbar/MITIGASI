// Log Service - Service untuk mencatat aktivitas admin dalam sistem audit trail
// Log Service for recording admin activities in audit trail system
const { createLog } = require('../models/logQueries/logQueries');

// =============================================
// ==           ACTIVITY LOGGING              ==
// =============================================

/**
 * Mencatat aktivitas admin ke dalam database untuk keperluan audit trail
 * Record admin activities to database for audit trail purposes
 *
 * @desc    Mencatat aktivitas admin ke dalam database
 * @param   {Object} logData - Data log yang akan dicatat / Log data to be recorded
 * @param   {Object} logData.req - Objek request dari Express (untuk mendapatkan IP dan endpoint) / Express request object for IP and endpoint
 * @param   {Object} logData.admin - Objek admin yang sedang login (dari req.user) / Logged-in admin object from req.user
 * @param   {string} logData.action - Deskripsi aksi yang dilakukan / Description of action performed
 * @param   {string} logData.target_entity - ID atau pengenal dari entitas yang diubah / ID or identifier of modified entity
 * @param   {'success'|'fail'} logData.status - Status keberhasilan aksi / Action success status
 * @returns {Promise<void>}
 * @access  Internal (service function)
 */
exports.logActivity = async ({ req, admin, action, target_entity, status }) => {
    try {
        // Siapkan data log entry dengan informasi lengkap untuk audit trail
        // Prepare log entry data with complete information for audit trail
        const logEntry = {
            admin_username: admin ? admin.username : 'SYSTEM', // Username admin atau SYSTEM untuk operasi otomatis
            action, // Deskripsi aksi yang dilakukan
            endpoint: req.originalUrl, // Endpoint API yang diakses
            ip_address: req.ip, // IP address admin yang melakukan aksi
            status, // Status operasi (success/fail)
            target_entity, // Entitas yang menjadi target operasi
        };

        // Simpan log entry ke database menggunakan model query
        // Save log entry to database using model query
        await createLog(logEntry);

        // Log ke console untuk monitoring real-time (dapat dihilangkan di production)
        // Console log for real-time monitoring (can be removed in production)
        console.log(
            `[LOG] Admin '${logEntry.admin_username}' | Action: ${logEntry.action} | Status: ${status}`
        );
    } catch (error) {
        // Jika logging itu sendiri gagal, hanya tampilkan error di console
        // agar tidak mengganggu alur utama aplikasi.
        // If logging itself fails, only show error in console
        // to not disrupt main application flow.
        console.error('FATAL: Failed to write to admin_logs table.', error);
    }
};
