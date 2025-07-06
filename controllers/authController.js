// Authentication Controller - Pengontrol Autentikasi untuk sistem login multi-role
// Authentication Controller for multi-role login system
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

/**
 * Membuat JWT Token untuk autentikasi user
 * Generate JWT Token for user authentication
 * @param {string} id - ID pengguna (NIM/NIP/Username) / User ID (NIM/NIP/Username)
 * @param {string} role - Role pengguna (mahasiswa/dosen_wali/admin) / User role
 * @returns {string} JWT Token
 */
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '30d', // Token berlaku selama 30 hari / Token valid for 30 days
    });
};

/**
 * Login user berdasarkan role (mahasiswa, dosen_wali, atau admin)
 * Login user based on role (mahasiswa, dosen_wali, or admin)
 * @desc    Login user (mahasiswa or dosen_wali)
 * @route   POST /api/login
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        const { id, password, role } = req.body;

        // Validasi input request - semua field wajib diisi
        // Validate request input - all fields are required
        if (!id || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide ID, password and role',
            });
        }

        // Validasi role yang diizinkan
        // Validate allowed roles
        if (role !== 'mahasiswa' && role !== 'dosen_wali' && role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Invalid role',
            });
        }

        let user = null;
        let passwordMatch = false;

        // Menentukan tabel database yang akan diquery berdasarkan role
        // Determine which database table to query based on role
        if (role === 'mahasiswa') {
            // Query tabel mahasiswa dengan kolom status untuk verifikasi keaktifan
            // Query mahasiswa table with status column for active verification
            const [rows] = await pool.execute(
                'SELECT nim, nama, kelas, password, status FROM mahasiswa WHERE nim = ?',
                [id]
            );

            if (rows.length > 0) {
                user = rows[0];

                // Cek apakah mahasiswa masih aktif
                // Check if student is still active
                if (user.status !== 'aktif') {
                    return res.status(401).json({
                        success: false,
                        message:
                            'Anda bukan mahasiswa aktif, silahkan hubungi Layanan Akademik dan Administrasi jika terdapat kesalahan.',
                    });
                }

                // Verifikasi password dengan plain text comparison
                // Verify password with plain text comparison
                passwordMatch = password === user.password;
            }
        } else if (role === 'dosen_wali') {
            // Query tabel dosen_wali dengan kolom status untuk verifikasi keaktifan
            // Query dosen_wali table with status column for active verification
            const [rows] = await pool.execute(
                'SELECT nip, nama, kode, password, status FROM dosen_wali WHERE nip = ?',
                [id]
            );

            if (rows.length > 0) {
                user = rows[0];

                // Cek apakah dosen masih aktif
                // Check if lecturer is still active
                if (user.status !== 'aktif') {
                    return res.status(401).json({
                        success: false,
                        message:
                            'Akun Anda tidak aktif. Silakan hubungi administrator.',
                    });
                }

                // Verifikasi password dengan plain text comparison
                // Verify password with plain text comparison
                passwordMatch = password === user.password;
            }
        } else {
            // Query tabel admin (tidak ada perubahan untuk admin)
            // Query admin table (no changes for admin)
            const [rows] = await pool.execute(
                'SELECT username, name, password FROM atmin_mitigasi WHERE username = ?',
                [id]
            );

            if (rows.length > 0) {
                user = rows[0];
                passwordMatch = password == user.password;
            }
        }

        // Cek apakah user ada dan password benar
        // Check if user exists and password is correct
        if (!user || !passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Kredensial tidak valid',
            });
        }

        // Generate token berdasarkan identifier yang sesuai dengan role
        // Generate token based on identifier appropriate for role
        let tokenIdentifier;
        if (role === 'mahasiswa') tokenIdentifier = user.nim;
        else if (role === 'dosen_wali') tokenIdentifier = user.nip;
        else if (role === 'admin') tokenIdentifier = user.username;

        const token = generateToken(tokenIdentifier, role);

        // Return response dengan data user yang sesuai berdasarkan role
        // Return response with appropriate user data based on role
        if (role === 'dosen_wali') {
            return res.status(200).json({
                success: true,
                token,
                user: {
                    id: user.nip,
                    name: user.nama, // kolom 'nama' dari database
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
                    name: user.nama, // kolom 'nama' dari database
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
        // Log error untuk monitoring dan debugging
        // Log error for monitoring and debugging
        console.error('Login error:', error);

        // Error handling untuk server error
        // Error handling for server errors
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
        });
    }
};

/**
 * Mendapatkan data user yang sedang login
 * Get current logged in user data
 * @desc    Get current logged in user
 * @route   GET /api/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
    // Mengembalikan data user dari middleware auth
    // Return user data from auth middleware
    res.status(200).json({
        success: true,
        data: req.user,
    });
};

/**
 * Logout user dengan menambahkan token ke blacklist
 * Logout user by adding token to blacklist
 * @desc    Logout user
 * @route   GET /api/logout
 * @access  Private
 */
exports.logout = async (req, res) => {
    try {
        // Mendapatkan token dari request (diset oleh middleware)
        // Get token from request (set by middleware)
        const token = req.token;

        // Decode token untuk mendapatkan waktu expiration
        // Decode token to get expiration time
        const decoded = jwt.decode(token);
        const expiresAt = new Date(decoded.exp * 1000);

        // Menambahkan token ke blacklist untuk mencegah penggunaan ulang
        // Add token to blacklist to prevent reuse
        await pool.execute(
            'INSERT INTO token_blacklist (token, expires_at) VALUES (?, ?)',
            [token, expiresAt]
        );

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        // Log error untuk monitoring dan debugging
        // Log error for monitoring and debugging
        console.error('Logout error:', error);

        // Error handling untuk proses logout
        // Error handling for logout process
        res.status(500).json({
            success: false,
            message: 'Error logging out',
        });
    }
};
