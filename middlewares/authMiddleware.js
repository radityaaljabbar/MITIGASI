// Auth Middleware - Middleware untuk autentikasi dan otorisasi dalam sistem akademik
// Auth Middleware for authentication and authorization in academic system
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

/**
 * Middleware untuk melindungi route dengan verifikasi JWT Token
 * Middleware to protect routes with JWT Token verification
 * @desc    Protect routes - verify JWT Token
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next function
 * @access  Public (middleware)
 */
exports.protect = async (req, res, next) => {
    let token;

    // Cek apakah token ada di headers dengan format Bearer
    // Check if token exists in headers with Bearer format
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Ambil token dari header (hapus prefix "Bearer ")
        // Get token from header (remove "Bearer " prefix)
        token = req.headers.authorization.split(' ')[1];
    }

    // Validasi keberadaan token
    // Validate token existence
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }

    try {
        // Cek apakah token sudah di-blacklist (logout)
        // Check if token is blacklisted (logged out)
        const [blacklisted] = await pool.execute(
            'SELECT * FROM token_blacklist WHERE token = ?',
            [token]
        );

        if (blacklisted.length > 0) {
            return res.status(401).json({
                success: false,
                message: 'Token has been invalidated',
            });
        }

        // Verifikasi token dengan JWT secret
        // Verify token with JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ekstrak user id dan role dari token
        // Extract user id and role from token
        const { id, role } = decoded;

        // Set data user berdasarkan role yang berbeda
        // Set user data based on different roles
        if (role === 'mahasiswa') {
            // Query data mahasiswa dari database
            // Query student data from database
            const [rows] = await pool.execute(
                'SELECT nim, nama, kelas FROM mahasiswa WHERE nim = ?',
                [id]
            );

            // Validasi apakah mahasiswa ditemukan
            // Validate if student is found
            if (rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found',
                });
            }

            // Set data mahasiswa di request object
            // Set student data in request object
            req.user = {
                id: rows[0].nim,
                name: rows[0].nama,
                class: rows[0].kelas,
                role: 'mahasiswa',
            };
        } else if (role === 'dosen_wali') {
            // Query data dosen wali dari database
            // Query lecturer supervisor data from database
            const [rows] = await pool.execute(
                'SELECT nip, nama, kode FROM dosen_wali WHERE nip = ?',
                [id]
            );

            // Validasi apakah dosen wali ditemukan
            // Validate if lecturer supervisor is found
            if (rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found',
                });
            }

            // Set data dosen wali di request object
            // Set lecturer supervisor data in request object
            req.user = {
                id: rows[0].nip,
                name: rows[0].nama,
                code: rows[0].kode,
                role: 'dosen_wali',
            };
        } else if (role === 'admin') {
            // Query data admin dari database
            // Query admin data from database
            const [rows] = await pool.execute(
                'SELECT id, name, username FROM atmin_mitigasi WHERE username = ?',
                [id]
            );

            // Validasi apakah admin ditemukan
            // Validate if admin is found
            if (rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found',
                });
            }

            // Set data admin di request object
            // Set admin data in request object
            req.user = {
                id: rows[0].username, // menggunakan username sebagai id yang ditampilkan
                name: rows[0].name,
                username: rows[0].username,
                role: 'admin',
            };
        }

        // Simpan token di request untuk keperluan logout
        // Store token in request for logout purposes
        req.token = token;

        // Lanjutkan ke middleware/controller berikutnya
        // Continue to next middleware/controller
        next();
    } catch (error) {
        // Log error untuk debugging dan monitoring
        // Log error for debugging and monitoring
        console.error('Auth middleware error: ', error);
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }
};

/**
 * Middleware untuk otorisasi berdasarkan role tertentu
 * Middleware for authorization based on specific roles
 * @desc    Authorize specific roles
 * @param   {...string} roles - Daftar role yang diizinkan / List of allowed roles
 * @returns {Function} Middleware function untuk otorisasi / Authorization middleware function
 * @access  Public (middleware)
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // Cek apakah role user termasuk dalam daftar role yang diizinkan
        // Check if user role is included in the list of allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }

        // Lanjutkan ke middleware/controller berikutnya jika role sesuai
        // Continue to next middleware/controller if role matches
        next();
    };
};
