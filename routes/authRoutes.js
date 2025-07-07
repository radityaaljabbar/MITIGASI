// Auth Routes - Routing untuk autentikasi dan manajemen sesi pengguna
// Auth Routes for authentication and user session management
const express = require('express');
const router = express.Router();

// Import controller untuk operasi autentikasi
// Import controller for authentication operations
const authController = require('../controllers/authController');

// Import middleware untuk proteksi route
// Import middleware for route protection
const { protect } = require('../middlewares/authMiddleware');

// =============================================
// ==          AUTHENTICATION ROUTES          ==
// =============================================

/**
 * @desc    Login untuk semua role (mahasiswa, dosen_wali, admin)
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @desc    Mendapatkan data user yang sedang login
 * @route   GET /api/auth/me
 * @access  Private (semua role yang sudah login)
 */
router.get('/me', protect, authController.getMe);

/**
 * @desc    Logout dan invalidasi token
 * @route   GET /api/auth/logout
 * @access  Private (semua role yang sudah login)
 */
router.get('/logout', protect, authController.logout);

module.exports = router;
