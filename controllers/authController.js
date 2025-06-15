// Authentication Controller for Plain Text Passwords
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '30d',
    });
};

// @desc    Login user (mahasiswa or dosen_wali)
// @route   POST /api/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { id, password, role } = req.body;

        // Validate request
        if (!id || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide ID, password and role',
            });
        }

        // Validate role
        if (role !== 'mahasiswa' && role !== 'dosen_wali' && role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Invalid role',
            });
        }

        let user = null;
        let passwordMatch = false;

        // Check which table to query based on role
        if (role === 'mahasiswa') {
            // Query mahasiswa table
            const [rows] = await pool.execute(
                'SELECT nim, nama, kelas, password FROM mahasiswa WHERE nim = ?',
                [id]
            );

            if (rows.length > 0) {
                user = rows[0];
                // For plain text passwords, simply compare the strings
                passwordMatch = password === user.password;
            }
        } else if (role === 'dosen_wali') {
            // Query dosen_wali table
            const [rows] = await pool.execute(
                'SELECT nip, nama, kode, password FROM dosen_wali WHERE nip = ?',
                [id]
            );

            if (rows.length > 0) {
                user = rows[0];
                // For plain text passwords, simply compare the strings
                passwordMatch = password === user.password;
            }
        } else {
            // Query admin table
            const [rows] = await pool.execute(
                'SELECT username, name, password FROM atmin_mitigasi WHERE username = ?',
                [id]
            );

            if (rows.length > 0) {
                user = rows[0];
                passwordMatch = password == user.password;
            }
        }

        // Check if user exists and password is correct
        if (!user || !passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Kredensial tidak valid',
            });
        }

        // Generate token
        let tokenIdentifier;
        if (role === 'mahasiswa') tokenIdentifier = user.nim;
        else if (role === 'dosen_wali') tokenIdentifier = user.nip;
        else if (role === 'admin') tokenIdentifier = user.username;

        const token = generateToken(tokenIdentifier, role);

        if (role === 'dosen_wali') {
            return res.status(200).json({
                success: true,
                token,
                user: {
                    id: user.nip,
                    name: user.nama, // kolom 'nama'
                    kodedosen: user.kode,
                    role,
                },
            });
        } else if (role === 'mahasiswa') {
            return res.status(200).json({
                success: true,
                token,
                user: {
                    id: user.nim,
                    name: user.nama, // kolom 'nama'
                    role,
                },
            });
        } else {
            // role === 'admin'
            return res.status(200).json({
                success: true,
                token,
                user: {
                    id: user.username, // Mengembalikan username sebagai ID yang ditampilkan
                    name: user.name, // kolom 'name', bukan 'nama'
                    role,
                },
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/me
// @access  Private
exports.getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user,
    });
};

// @desc    Logout user
// @route   GET /api/logout
// @access  Private
exports.logout = async (req, res) => {
    try {
        // Get token from request (set by middleware)
        const token = req.token;

        // Decode token to get expiration
        const decoded = jwt.decode(token);
        const expiresAt = new Date(decoded.exp * 1000);

        // Add token to blacklist
        await pool.execute(
            'INSERT INTO token_blacklist (token, expires_at) VALUES (?, ?)',
            [token, expiresAt]
        );

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging out',
        });
    }
};
