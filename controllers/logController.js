// Log Controller - Pengontrol untuk mengelola log aktivitas sistem
// Log Controller for managing system activity logs
const { findAllLogs } = require('../models/logQueries/logQueries');

/**
 * Mengambil semua log aktivitas sistem untuk keperluan audit dan monitoring
 * Get all system activity logs for audit and monitoring purposes
 * @desc    GET - mengambil semua log aktivitas
 * @route   GET /api/admin/logs
 * @access  Private (Admin only)
 */
exports.getAllLogs = async (req, res) => {
    try {
        // Ambil semua log aktivitas dari database
        // Get all activity logs from database
        const logs = await findAllLogs();

        res.status(200).json({
            success: true,
            message: 'Data log aktivitas berhasil didapatkan',
            count: logs.length,
            data: logs,
        });
    } catch (error) {
        // Log error untuk monitoring dan debugging
        // Log error for monitoring and debugging
        console.error('Error fetching activity logs:', error);

        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data log aktivitas',
        });
    }
};
