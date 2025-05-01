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
            message: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Extract user id and role from token
        const { id, role } = decoded;

        // Set user data based on role
        if(role === 'mahasiswa') {
            const [rows] = await pool.execute(
                'SELECT nim, nama, kelas FROM mahasiswa WHERE nim = ?', [id]
            );

            if (rows.length === )
        }
    }
}