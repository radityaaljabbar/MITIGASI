// src/controllers/logController.js
const { findAllLogs } = require('../models/logQueries/logQueries');

exports.getAllLogs = async (req, res) => {
    try {
        const logs = await findAllLogs();
        res.status(200).json({
            success: true,
            message: 'Data log aktivitas berhasil didapatkan',
            count: logs.length,
            data: logs,
        });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data log aktivitas',
        });
    }
};