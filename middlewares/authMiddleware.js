// Auth middlewares
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Protect routes - verify JWT Token
exports.protect = async (req, res, next) => {
    let token;

    // Check if token exist in headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exist
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }

    try {
        // NEW: Check if token is blacklisted
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

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Extract user id and role from token
        const { id, role } = decoded;

        // Set user data based on role
        if (role === 'mahasiswa') {
            const [rows] = await pool.execute(
                'SELECT nim, nama, kelas FROM mahasiswa WHERE nim = ?',
                [id]
            );

            if (rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found',
                });
            }

            req.user = {
                id: rows[0].nim,
                name: rows[0].nama,
                class: rows[0].kelas,
                role: 'mahasiswa',
            };
        } else if (role === 'dosen_wali') {
            const [rows] = await pool.execute(
                'SELECT nip, nama, kode FROM dosen_wali WHERE nip = ?',
                [id]
            );

            if (rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found',
                });
            }

            req.user = {
                id: rows[0].nip,
                name: rows[0].nama,
                code: rows[0].kode,
                role: 'dosen_wali',
            };
        } else if (role === 'admin') {
            req.user = {
                id,
                role: 'admin',
            };
        }

        // NEW: Store the token in request for use in logout
        req.token = token;

        next();
    } catch (error) {
        console.error('Auth middleware error: ', error);
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }
};

// Authorize specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};
