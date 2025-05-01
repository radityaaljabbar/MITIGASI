const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Login user (mahasiswa or dosen wali)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { id, password, role } = req.body;

        // Validasi Request
        if (!id || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide ID, password and role',
            });
        }

        //Validate Role
        if (role !== 'mahasiswa' && role !== 'dosen_wali' && role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Invalid Role',
            });
        }

        let user = null;
        let passwordMatch = false;

        // Check tabel mana yg hrs di query sesuai dengan role yg di kirim di req.body
        if (role === 'mahasiswa') {
            // Query tabel mahasiswa
            const [rows] = await pool.execute(
                'SELECT nim, nama, kelas, password FROM mahasiswa WHERE nim = ?',
                [id]
            );

            if (rows.length > 0) {
                user = rows[0];
                // Compare passwords
                passwordMatch = await bcrypt.compare(password, user.password);
            }
        } else if (role === 'dosen_wali') {
            // Query tabel dosen_wali
            const [rows] = await pool.execute(
                'SELECT nip, nama, kode, password FROM dosen_wali WHERE nip = ?',
                [id]
            );

            if (rows.length > 0) {
                user = rows[0];
                // Compare passwords
                passwordMatch = await bcrypt.compare(password, user.password);
            }
        } else {
            // Admin logic
            // Di hardcore dlu buat si admin
            if (id === 'admin' && password === 'admin12345') {
                user = { id: 'admin', nama: 'Administrator' };
                passwordMatch = true;
            }
        }

        // Cek keberadaan user dan password bener atau tidak
        if (!user || !passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Credentials',
            });
        }

        // Generate token
        const idField =
            role === 'mahasiswa' ? 'nim' : role === 'dosen_wali' ? 'nip' : 'id';
        const token = generateToekn(user[idField] || id, role);

        // Send Response
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user[idField] || id,
                name: user.nama,
                role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc Get data user yang lagi login
// @route GET /api/auth/me
// @access Private
exports.getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user,
    });
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};
