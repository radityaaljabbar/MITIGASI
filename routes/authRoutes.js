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

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - id
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: NIM untuk mahasiswa, NIP untuk dosen, atau username untuk admin.
 *         password:
 *           type: string
 *           format: password
 *         role:
 *           type: string
 *           enum: [mahasiswa, dosen_wali, admin]
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         role:
 *           type: string
 *         kodedosen:
 *           type: string
 *           description: Hanya ada untuk role dosen_wali.
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 */

// =============================================
// ==          AUTHENTICATION ROUTES          ==
// =============================================

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login untuk semua role pengguna
 *     tags: [Authentication]
 *     description: Endpoint ini menangani proses login untuk mahasiswa, dosen wali, dan admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       '200':
 *         description: Login berhasil.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '400':
 *         description: Bad Request (field tidak lengkap atau role tidak valid).
 *       '401':
 *         description: Unauthorized (kredensial salah atau akun tidak aktif).
 * @desc    Login untuk semua role (mahasiswa, dosen_wali, admin)
 * @route   POST /api/login
 * @access  Public
*/
router.post('/login', authController.login);

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Mendapatkan data pengguna yang sedang login
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     description: Mengambil detail data pengguna (ID, nama, role) berdasarkan token JWT yang valid.
 *     responses:
 *       '200':
 *         description: Data pengguna berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized (token tidak valid atau tidak ada).
 * @desc    Mendapatkan data user yang sedang login
 * @route   GET /api/me
 * @access  Private (semua role yang sudah login)
*/
router.get('/me', protect, authController.getMe);

/**
 * @swagger
 * /api/logout:
 *   get:
 *     summary: Logout pengguna
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     description: Menginvalidasi token JWT yang sedang digunakan dengan menambahkannya ke blacklist.
 *     responses:
 *       '200':
 *         description: Logout berhasil.
 *       '500':
 *         description: Gagal melakukan logout.
 * @desc    Logout dan invalidasi token
 * @route   GET /api/logout
 * @access  Private (semua role yang sudah login)
*/
router.get('/logout', protect, authController.logout);

module.exports = router;