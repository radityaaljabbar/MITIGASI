// Admin Controller - Pengontrol utama untuk manajemen sistem akademik
// Main controller for academic system management
// const bcrypt = require('bcryptjs'); // Optional: untuk hashing password jika diperlukan / for password hashing if needed
const Papa = require('papaparse');

// Import queries untuk operasi database Admin
// Import queries for Admin database operations
const {
    findAllAdmins,
    createAdmin,
    updateAdminById,
    deleteAdminById,
    findAllDosen,
    createDosen,
    updateDosenByNip,
    deleteDosenByNip,
    findAllMahasiswa,
    createMahasiswa,
    updateMahasiswaByNim,
    deleteMahasiswaByNim,
    findAllKelas,
} = require('../models/adminQueries/kelolaPenggunaQueries');

// Import queries untuk manajemen kelas
// Import queries for class management
const {
    findAllWithDosen,
    createKelas,
    updateDosenWaliforKelas,
    deleteKelasById,
} = require('../models/adminQueries/kelolaKelasQueries');

// Import queries untuk manajemen akademik dan nilai
// Import queries for academic and grade management
const {
    getAllMahasiswa,
    // findGradesMahasiswaByNIM,
    getAllCourse,
    createNilaiMahasiswa,
    updateNilaiMahasiswa,
    removeNilaiMahasiswa,
    getStudentGrades,
    getNewCourses,
    getEquivalentCourses,
    getOldCoursesNames,
    getOldCourses,
    processCourseHistory,
} = require('../models/adminQueries/kelolaAkademikNilaiQueries');

// Import queries untuk manajemen prestasi akademik
// Import queries for academic achievement management
const {
    getDataPrestasi,
    createDataPrestasi,
    updateDataPrestasi,
    deleteDataPrestasi,
    upsertKlasifikasi,
} = require('../models/adminQueries/kelolaAkademikPrestasiQueries');

// Import queries untuk manajemen semester mahasiswa
// Import queries for student semester management
const {
    findSemesterMahasiswaByNIM,
    createSemesterMahasiswaByNIM,
    updateSemesterMahasiswaById,
    deleteSemesterMahasiswaById,
} = require('../models/adminQueries/kelolaAkademikSemesterQueries');

// Import queries untuk manajemen kurikulum dan mata kuliah
// Import queries for curriculum and course management
const {
    findMataKuliahByKurikulum,
    getAllKurikulum,
    findMataKuliahById,
    createMataKuliah,
    updateMataKuliah,
    deleteMataKuliah,
    getEkuivalensiOptions,
    getAllKelompokKeahlian,
} = require('../models/adminQueries/kelolaKurikulumQueries');

// Import service untuk logging aktivitas admin
// Import service for admin activity logging
const { logActivity } = require('../service/logService');

// =============================================
// ==           ADMIN CONTROLLER FUNCTIONS    ==
// =============================================

/**
 * Mengambil data semua akun admin
 * Get all admin accounts data
 * @desc    GET - mengambil data akun semua admin
 * @route   GET /api/admin/admins
 * @access  Private (Admin only)
 */
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await findAllAdmins();
        res.status(200).json({
            success: true,
            message: 'Data admin berhasil didapatkan',
            data: admins,
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data admin',
        });
    }
};

/**
 * Membuat akun admin baru
 * Create new admin account
 * @desc    POST - create admin baru
 * @route   POST /api/admin/admins
 * @access  Private (Admin only)
 */
exports.createAdmin = async (req, res) => {
    const { name, username, password } = req.body;

    // Validasi input - semua field wajib diisi
    // Input validation - all fields are required
    if (!name || !username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Nama, username, dan password wajib diisi',
        });
    }

    try {
        // Membuat admin baru dengan password plain text
        // Create new admin with plain text password
        const newAdminId = await createAdmin({
            name,
            username,
            password: password,
        });

        // Log aktivitas berhasil untuk audit trail
        // Log successful activity for audit trail
        await logActivity({
            req,
            admin: req.user,
            action: `Membuat Admin baru: ${name}`,
            target_entity: `Username: ${username}`,
            status: 'success',
        });

        res.status(201).json({
            success: true,
            message: 'Admin berhasil ditambahkan',
            data: {
                id: newAdminId,
                name,
                username,
            },
        });
    } catch (error) {
        console.error('Error in createAdmin:', error);

        // Handle error duplicate entry untuk username
        // Handle duplicate entry error for username
        if (error.code === 'ER_DUP_ENTRY') {
            // Log aktivitas gagal karena username duplikat
            // Log failed activity due to duplicate username
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat Admin (username duplikat): ${name}`,
                target_entity: `Username: ${username}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message: 'Username sudah digunakan',
            });
        }

        // Log error umum untuk monitoring
        // Log general error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat Admin: ${name}`,
            target_entity: `Username: ${username}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal membuat admin baru',
        });
    }
};

/**
 * Memperbarui data admin berdasarkan ID
 * Update admin data by ID
 * @desc    PUT - update admin
 * @route   PUT /api/admin/admins/:id
 * @access  Private (Admin only)
 */
exports.updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { name, username, password } = req.body;

    // Validasi input - nama dan username wajib
    // Input validation - name and username are required
    if (!name || !username) {
        return res.status(400).json({
            success: false,
            message: 'Nama dan username wajib diisi',
        });
    }

    try {
        // Siapkan data untuk update (password opsional)
        // Prepare data for update (password optional)
        const adminData = { name, username };
        if (password) {
            adminData.password = password;
        }

        const success = await updateAdminById(id, adminData);

        // Cek apakah admin ditemukan
        // Check if admin was found
        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Admin (ID tidak ditemukan)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });
            return res.status(404).json({
                success: false,
                message: `Admin dengan ID ${id} tidak ditemukan`,
            });
        }

        // Log aktivitas berhasil
        // Log successful activity
        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate data Admin: ${name}`,
            target_entity: `ID: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Admin ${name} berhasil diperbarui`,
            data: {
                id: parseInt(id),
                name,
                username,
            },
        });
    } catch (error) {
        console.error('Error in updateAdmin:', error);

        // Handle error duplicate entry
        // Handle duplicate entry error
        if (error.code === 'ER_DUP_ENTRY') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Admin (username duplikat)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });
            return res.status(409).json({
                success: false,
                message: 'Username sudah digunakan oleh pengguna lain',
            });
        }

        // Log error umum
        // Log general error
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update Admin`,
            target_entity: `ID: ${id}`,
            status: 'fail',
        });
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data admin',
        });
    }
};

/**
 * Menghapus admin berdasarkan ID
 * Delete admin by ID
 * @desc    DELETE - hapus admin
 * @route   DELETE /api/admin/admins/:id
 * @access  Private (Admin only)
 */
exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const success = await deleteAdminById(id);

        // Cek apakah admin ditemukan dan berhasil dihapus
        // Check if admin was found and successfully deleted
        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Admin (ID tidak ditemukan)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Admin dengan ID ${id} tidak ditemukan`,
            });
        }

        // Log aktivitas berhasil menghapus
        // Log successful deletion activity
        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus Admin`,
            target_entity: `ID: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Admin dengan ID ${id} berhasil dihapus`,
        });
    } catch (error) {
        console.error('Error in deleteAdmin:', error);

        // Log error untuk monitoring
        // Log error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus Admin`,
            target_entity: `ID: ${id}`,
            status: 'fail',
        });
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus admin',
        });
    }
};

// =============================================
// ==      DOSEN WALI CONTROLLER FUNCTIONS    ==
// =============================================

/**
 * Mengambil data semua dosen wali
 * Get all lecturer supervisor data
 * @desc    GET - ambil semua dosen wali
 * @route   GET /api/admin/dosen
 * @access  Private (Admin only)
 */
exports.getAllDosen = async (req, res) => {
    try {
        const dosen = await findAllDosen();
        res.status(200).json({
            success: true,
            message: 'Data dosen wali berhasil didapatkan',
            data: dosen,
        });
    } catch (error) {
        console.error('Error in getAllDosen:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data dosen wali',
        });
    }
};

/**
 * Membuat data dosen wali baru
 * Create new lecturer supervisor
 * @desc    POST - create dosen wali baru
 * @route   POST /api/admin/dosen
 * @access  Private (Admin only)
 */
exports.createDosen = async (req, res) => {
    const { nip, nama, kode, password } = req.body;

    // Validasi input - field wajib
    // Input validation - required fields
    if (!nip || !nama || !kode) {
        return res.status(400).json({
            success: false,
            message: 'NIP, nama, dan kode dosen wajib diisi',
        });
    }

    // Validasi panjang kode dosen (maksimal 3 karakter)
    // Validate lecturer code length (maximum 3 characters)
    if (kode.length > 3) {
        return res.status(400).json({
            success: false,
            message: 'Kode dosen maksimal 3 karakter',
        });
    }

    try {
        // Gunakan NIP sebagai password default jika tidak diisi
        // Use NIP as default password if not provided
        const finalPassword = password || nip;

        const newDosenNip = await createDosen({
            nip,
            nama,
            kode,
            password: finalPassword,
        });

        // Log aktivitas berhasil membuat dosen wali
        // Log successful lecturer creation activity
        await logActivity({
            req,
            admin: req.user, // didapat dari middleware 'protect'
            action: `Membuat Dosen Wali baru: ${nama}`,
            target_entity: `NIP: ${nip}`,
            status: 'success',
        });

        res.status(201).json({
            success: true,
            message: 'Dosen wali berhasil ditambahkan',
            data: {
                nip: newDosenNip,
                nama,
                kode,
            },
        });
    } catch (error) {
        console.error('Error in createDosen:', error);

        // Handle duplicate entry error (NIP atau kode sudah ada)
        // Handle duplicate entry error (NIP or code already exists)
        if (error.code === 'ER_DUP_ENTRY') {
            const field = error.message.includes("'nip'")
                ? 'NIP'
                : 'Kode Dosen';

            // Log aktivitas gagal karena duplikat
            // Log failed activity due to duplicate
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat Dosen Wali (duplikat): ${nama}`,
                target_entity: `NIP: ${nip} / Kode: ${kode}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message: `${field} sudah digunakan`,
            });
        }

        // Log error umum untuk monitoring
        // Log general error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat Dosen Wali: ${nama}`,
            target_entity: `NIP: ${nip}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal membuat dosen wali baru',
        });
    }
};

/**
 * Memperbarui data dosen wali berdasarkan NIP
 * Update lecturer supervisor data by NIP
 * @desc    PUT - update dosen wali
 * @route   PUT /api/admin/dosen/:nip
 * @access  Private (Admin only)
 */
exports.updateDosen = async (req, res) => {
    const { nip } = req.params;
    const { nama, kode, password, status } = req.body;

    // Validasi input - field wajib
    // Input validation - required fields
    if (!nama || !kode || !status) {
        return res.status(400).json({
            success: false,
            message: 'Nama, kode dosen, dan status wajib diisi',
        });
    }

    // Validasi panjang kode dosen
    // Validate lecturer code length
    if (kode.length > 3) {
        return res.status(400).json({
            success: false,
            message: 'Kode dosen maksimal 3 karakter',
        });
    }

    try {
        // Siapkan data untuk update (password opsional)
        // Prepare data for update (password optional)
        const dosenData = { nama, kode, status };
        if (password) {
            dosenData.password = password;
        }

        const success = await updateDosenByNip(nip, dosenData);

        // Cek apakah dosen ditemukan
        // Check if lecturer was found
        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Dosen Wali (NIP tidak ditemukan)`,
                target_entity: `NIP: ${nip}`,
                status: 'fail',
            });
            return res.status(404).json({
                success: false,
                message: `Dosen wali dengan NIP ${nip} tidak ditemukan`,
            });
        }

        // Log aktivitas berhasil update
        // Log successful update activity
        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate data Dosen Wali: ${nama}`,
            target_entity: `NIP: ${nip}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Data dosen wali ${nama} berhasil diperbarui`,
            data: {
                nip,
                nama,
                kode,
                status,
            },
        });
    } catch (error) {
        console.error('Error in updateDosen:', error);

        // Handle duplicate entry error untuk kode dosen
        // Handle duplicate entry error for lecturer code
        if (error.code === 'ER_DUP_ENTRY') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Dosen Wali (kode duplikat)`,
                target_entity: `NIP: ${nip}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message: `Kode dosen "${kode}" sudah digunakan oleh dosen lain`,
            });
        }

        // Log error umum
        // Log general error
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update Dosen Wali`,
            target_entity: `NIP: ${nip}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data dosen wali',
        });
    }
};

/**
 * Menghapus dosen wali berdasarkan NIP
 * Delete lecturer supervisor by NIP
 * @desc    DELETE - hapus dosen wali
 * @route   DELETE /api/admin/dosen/:nip
 * @access  Private (Admin only)
 */
exports.deleteDosen = async (req, res) => {
    const { nip } = req.params;

    try {
        const success = await deleteDosenByNip(nip);

        // Cek apakah dosen ditemukan dan berhasil dihapus
        // Check if lecturer was found and successfully deleted
        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Dosen Wali (NIP tidak ditemukan)`,
                target_entity: `NIP: ${nip}`,
                status: 'fail',
            });
            return res.status(404).json({
                success: false,
                message: `Dosen wali dengan NIP ${nip} tidak ditemukan`,
            });
        }

        // Log aktivitas berhasil menghapus
        // Log successful deletion activity
        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus Dosen Wali`,
            target_entity: `NIP: ${nip}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Dosen wali dengan NIP ${nip} berhasil dihapus`,
        });
    } catch (error) {
        console.error('Error in deleteDosen:', error);

        // Handle error referential integrity (dosen masih menjadi wali kelas)
        // Handle referential integrity error (lecturer still supervising classes)
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Dosen Wali (masih menjadi wali kelas)`,
                target_entity: `NIP: ${nip}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message:
                    'Gagal menghapus. Dosen ini masih menjadi wali untuk beberapa kelas. Harap hapus relasi kelas terlebih dahulu',
            });
        }

        // Log error umum untuk monitoring
        // Log general error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus Dosen Wali`,
            target_entity: `NIP: ${nip}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal menghapus data dosen wali',
        });
    }
};
// =============================================
// ==      MAHASISWA CONTROLLER FUNCTIONS     ==
// =============================================

/**
 * Mengambil data semua mahasiswa
 * Get all student data
 * @desc    GET - ambil semua mahasiswa
 * @route   GET /api/admin/mahasiswa
 * @access  Private (Admin only)
 */
exports.getAllMahasiswa = async (req, res) => {
    try {
        const mahasiswa = await findAllMahasiswa();
        res.status(200).json({
            success: true,
            message: 'Data mahasiswa berhasil didapatkan',
            data: mahasiswa,
        });
    } catch (error) {
        console.error('Error in getAllMahasiswa:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data mahasiswa',
        });
    }
};

/**
 * Membuat data mahasiswa baru
 * Create new student data
 * @desc    POST - create mahasiswa baru
 * @route   POST /api/admin/mahasiswa
 * @access  Private (Admin only)
 */
exports.createMahasiswa = async (req, res) => {
    const { nim, nama, kelas, password } = req.body;

    // Validasi input - field wajib
    // Input validation - required fields
    if (!nim || !nama || !kelas) {
        return res.status(400).json({
            success: false,
            message: 'NIM, nama, dan kelas wajib diisi',
        });
    }

    try {
        // Gunakan NIM sebagai password default jika tidak diisi
        // Use NIM as default password if not provided
        const finalPassword = password || nim;

        const newMahasiswaNim = await createMahasiswa({
            nim,
            nama,
            kelas,
            password: finalPassword,
        });

        // Log aktivitas berhasil membuat mahasiswa
        // Log successful student creation activity
        await logActivity({
            req,
            admin: req.user,
            action: `Membuat Mahasiswa baru: ${nama}`,
            target_entity: `NIM: ${nim}`,
            status: 'success',
        });

        res.status(201).json({
            success: true,
            message: 'Mahasiswa berhasil ditambahkan',
            data: {
                nim,
                nama,
                kelas,
            },
        });
    } catch (error) {
        console.error('Error in createMahasiswa:', error);

        // Handle duplicate entry error (NIM sudah terdaftar)
        // Handle duplicate entry error (NIM already registered)
        if (error.code === 'ER_DUP_ENTRY') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat Mahasiswa (NIM duplikat): ${nama}`,
                target_entity: `NIM: ${nim}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message: `NIM "${nim}" sudah terdaftar`,
            });
        }

        // Log error umum untuk monitoring
        // Log general error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat Mahasiswa: ${nama}`,
            target_entity: `NIM: ${nim}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal membuat mahasiswa baru',
        });
    }
};

/**
 * Memperbarui data mahasiswa berdasarkan NIM
 * Update student data by NIM
 * @desc    PUT - update mahasiswa
 * @route   PUT /api/admin/mahasiswa/:nim
 * @access  Private (Admin only)
 */
exports.updateMahasiswaByNim = async (req, res) => {
    const { nim } = req.params;
    const { nama, kelas, password, status } = req.body;

    // Validasi input - field wajib
    // Input validation - required fields
    if (!nama || !kelas || !status) {
        return res.status(400).json({
            success: false,
            message: 'Nama, kelas, dan status wajib diisi',
        });
    }

    try {
        // Siapkan data untuk update (password opsional)
        // Prepare data for update (password optional)
        const mhsData = { nama, kelas, status };
        if (password) {
            mhsData.password = password;
        }

        const success = await updateMahasiswaByNim(nim, mhsData);

        // Cek apakah mahasiswa ditemukan
        // Check if student was found
        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Mahasiswa (NIM tidak ditemukan)`,
                target_entity: `NIM: ${nim}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Mahasiswa dengan NIM ${nim} tidak ditemukan`,
            });
        }

        // Log aktivitas berhasil update
        // Log successful update activity
        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate data Mahasiswa: ${nama}`,
            target_entity: `NIM: ${nim}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Data mahasiswa ${nama} berhasil diperbarui`,
            data: {
                nim,
                nama,
                kelas,
                status,
            },
        });
    } catch (error) {
        console.error('Error in updateMahasiswa:', error);

        // Log error umum untuk monitoring
        // Log general error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update Mahasiswa`,
            target_entity: `NIM: ${nim}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data mahasiswa',
        });
    }
};

/**
 * Menghapus mahasiswa berdasarkan NIM
 * Delete student by NIM
 * @desc    DELETE - hapus mahasiswa
 * @route   DELETE /api/admin/mahasiswa/:nim
 * @access  Private (Admin only)
 */
exports.deleteMahasiswa = async (req, res) => {
    const { nim } = req.params;

    try {
        const success = await deleteMahasiswaByNim(nim);

        // Cek apakah mahasiswa ditemukan dan berhasil dihapus
        // Check if student was found and successfully deleted
        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Mahasiswa (NIM tidak ditemukan)`,
                target_entity: `NIM: ${nim}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Mahasiswa dengan NIM ${nim} tidak ditemukan`,
            });
        }

        // Log aktivitas berhasil menghapus
        // Log successful deletion activity
        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus Mahasiswa`,
            target_entity: `NIM: ${nim}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Mahasiswa dengan NIM ${nim} berhasil dihapus`,
        });
    } catch (error) {
        console.error('Error in deleteMahasiswa:', error);

        // Handle error referential integrity (mahasiswa masih memiliki data terkait)
        // Handle referential integrity error (student still has related data)
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Mahasiswa (data terkait masih ada)`,
                target_entity: `NIM: ${nim}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message:
                    'Gagal menghapus. Mahasiswa ini masih memiliki data terkait. Harap hapus data terkait terlebih dahulu',
            });
        }

        // Log error umum untuk monitoring
        // Log general error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus Mahasiswa`,
            target_entity: `NIM: ${nim}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal menghapus data mahasiswa',
        });
    }
};

/**
 * Mengambil daftar semua kelas untuk dropdown/select options
 * Get all class list for dropdown/select options
 * @desc    GET - mendapatkan daftar kelas untuk dropdown
 * @route   GET /api/admin/kelas
 * @access  Private (Admin only)
 */
exports.getAllKelas = async (req, res) => {
    try {
        const allKelas = await findAllKelas();
        res.status(200).json({
            success: true,
            message: 'Daftar kelas berhasil didapatkan',
            data: allKelas,
        });
    } catch (error) {
        console.error('Error in getAllKelas:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data kelas',
        });
    }
};

// =============================================
// ==         BULK IMPORT FUNCTIONS           ==
// =============================================

/**
 * Bulk import mahasiswa dari file CSV
 * Bulk import students from CSV file
 * @desc    POST - Bulk create mahasiswa from CSV
 * @route   POST /api/admin/mahasiswa/bulk-import
 * @access  Private (Admin only)
 */
exports.bulkCreateMahasiswa = async (req, res) => {
    try {
        // Validasi keberadaan file CSV
        // Validate CSV file existence
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File CSV wajib diupload',
            });
        }

        // Parse file CSV menggunakan PapaParse
        // Parse CSV file using PapaParse
        const csvData = req.file.buffer.toString('utf8');
        const parsed = Papa.parse(csvData, {
            header: true, // Gunakan baris pertama sebagai header
            skipEmptyLines: true, // Skip baris kosong
            transformHeader: (header) => header.trim().toLowerCase(), // Normalize header
        });

        // Validasi format CSV
        // Validate CSV format
        if (parsed.errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Format CSV tidak valid',
                errors: parsed.errors,
            });
        }

        const records = parsed.data;
        const results = {
            total: records.length,
            created: 0,
            failed: 0,
            errors: [],
        };

        // Proses setiap record dalam CSV
        // Process each record in CSV
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const rowNumber = i + 2; // +2 karena baris 1 adalah header, array dimulai dari 0

            try {
                // Validasi field yang wajib diisi
                // Validate required fields
                if (!record.nim || !record.nama || !record.kelas) {
                    throw new Error('NIM, nama, dan kelas wajib diisi');
                }

                // Set password default jika kosong (gunakan NIM)
                // Set default password if empty (use NIM)
                const finalPassword = record.password || record.nim;

                // Gunakan fungsi createMahasiswa yang sudah ada
                // Use existing createMahasiswa function
                await createMahasiswa({
                    nim: record.nim.trim(),
                    nama: record.nama.trim(),
                    kelas: record.kelas.trim(),
                    password: finalPassword,
                });

                results.created++;
            } catch (error) {
                results.failed++;
                let errorMessage = 'Unknown error';

                // Handle berbagai jenis error yang mungkin terjadi
                // Handle various types of errors that might occur
                if (error.code === 'ER_DUP_ENTRY') {
                    errorMessage = `NIM "${record.nim}" sudah terdaftar`;
                } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                    errorMessage = `Kelas "${record.kelas}" tidak ditemukan`;
                } else {
                    errorMessage = error.message;
                }

                // Simpan detail error untuk laporan
                // Store error details for reporting
                results.errors.push({
                    row: rowNumber,
                    nim: record.nim || 'N/A',
                    nama: record.nama || 'N/A',
                    error: errorMessage,
                });
            }
        }

        // Log aktivitas bulk import
        // Log bulk import activity
        await logActivity({
            req,
            admin: req.user,
            action: `Bulk import Mahasiswa: ${results.created} berhasil, ${results.failed} gagal`,
            target_entity: `Total: ${results.total} records`,
            status: results.failed === 0 ? 'success' : 'fail',
        });

        res.status(200).json({
            success: true,
            message: `Bulk import selesai: ${results.created} berhasil, ${results.failed} gagal`,
            data: results,
        });
    } catch (error) {
        console.error('Error in bulkCreateMahasiswa:', error);

        // Log error untuk bulk import yang gagal total
        // Log error for completely failed bulk import
        await logActivity({
            req,
            admin: req.user,
            action: `Error saat bulk import Mahasiswa`,
            target_entity: `Error: ${error.message}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal memproses bulk import',
            error: error.message,
        });
    }
};

// =============================================
// ==         KELOLA KELAS FUNCTIONS          ==
// =============================================

/**
 * Mengambil data semua kelas beserta informasi dosen wali
 * Get all class data along with lecturer supervisor information
 * @desc    GET - mengambil data kelas dengan dosen wali
 * @route   GET /api/admin/kelas-management
 * @access  Private (Admin only)
 */
exports.getAllKelasforKelas = async (req, res) => {
    try {
        const kelas = await findAllWithDosen();
        res.status(200).json({
            success: true,
            message: 'Data kelas berhasil didapatkan',
            data: kelas,
        });
    } catch (error) {
        console.error('Error in getAllKelas:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data kelas',
        });
    }
};

/**
 * Mengambil daftar semua dosen untuk dropdown/select options
 * Get all lecturer list for dropdown/select options
 * @desc    GET - mendapatkan daftar dosen untuk dropdown
 * @route   GET /api/admin/dosen-list
 * @access  Private (Admin only)
 */
exports.getDosenList = async (req, res) => {
    try {
        const dosenList = await findAllDosen();
        res.status(200).json({
            success: true,
            message: 'Daftar dosen berhasil didapatkan',
            data: dosenList,
        });
    } catch (error) {
        console.error('Error in getDosenList:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil daftar dosen',
        });
    }
};

/**
 * Membuat kelas baru dengan atau tanpa dosen wali
 * Create new class with or without lecturer supervisor
 * @desc    POST - create kelas baru
 * @route   POST /api/admin/kelas
 * @access  Private (Admin only)
 */
exports.createKelas = async (req, res) => {
    const { tahun_angkatan, kode_kelas, kode_dosen } = req.body;

    // Validasi input - tahun angkatan dan kode kelas wajib
    // Input validation - graduation year and class code are required
    if (!tahun_angkatan || !kode_kelas) {
        return res.status(400).json({
            success: false,
            message: 'Tahun angkatan dan kode kelas wajib diisi',
        });
    }

    try {
        // Siapkan data kelas (kode dosen opsional)
        // Prepare class data (lecturer code optional)
        const kelasData = {
            tahun_angkatan,
            kode_kelas,
            kode_dosen: kode_dosen || null, // Set null jika tidak ada dosen yang dipilih
        };

        const newKelasId = await createKelas(kelasData);

        // Log aktivitas berhasil membuat kelas
        // Log successful class creation activity
        await logActivity({
            req,
            admin: req.user,
            action: `Membuat Kelas baru: ${kode_kelas}`,
            target_entity: `ID: ${newKelasId}`,
            status: 'success',
        });

        res.status(201).json({
            success: true,
            message: 'Kelas berhasil ditambahkan',
            data: {
                id_kelas: newKelasId,
                ...kelasData,
            },
        });
    } catch (error) {
        console.error('Error in createKelas:', error);

        // Handle duplicate entry error (kode kelas sudah ada)
        // Handle duplicate entry error (class code already exists)
        if (error.code === 'ER_DUP_ENTRY') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat Kelas (kode duplikat): ${kode_kelas}`,
                target_entity: `Kode: ${kode_kelas}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message: `Kode kelas "${kode_kelas}" sudah ada`,
            });
        }

        // Log error umum untuk monitoring
        // Log general error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat Kelas: ${kode_kelas}`,
            target_entity: `Kode: ${kode_kelas}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal membuat kelas baru',
        });
    }
};

/**
 * Memperbarui dosen wali untuk kelas tertentu
 * Update lecturer supervisor for specific class
 * @desc    PUT - update kelas (dosen wali)
 * @route   PUT /api/admin/kelas/:id
 * @access  Private (Admin only)
 */
exports.updateKelas = async (req, res) => {
    const { id } = req.params;
    const { kode_kelas, kode_dosen } = req.body;

    try {
        // Set null jika kode dosen kosong (hapus assignment dosen wali)
        // Set null if lecturer code is empty (remove lecturer supervisor assignment)
        const newKodeDosen = kode_dosen || null;
        const success = await updateDosenWaliforKelas(id, newKodeDosen);

        // Cek apakah kelas ditemukan
        // Check if class was found
        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Kelas (ID tidak ditemukan)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Kelas dengan ID ${id} tidak ditemukan`,
            });
        }

        // Log aktivitas berhasil update
        // Log successful update activity
        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate Dosen Wali untuk Kelas ${kode_kelas}`,
            target_entity: `ID Kelas: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Dosen wali untuk kelas ${kode_kelas} berhasil diupdate`,
            data: {
                id_kelas: parseInt(id),
                kode_kelas,
                kode_dosen: newKodeDosen,
            },
        });
    } catch (error) {
        console.error('Error in updateKelas:', error);

        // Log error umum untuk monitoring
        // Log general error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update Kelas`,
            target_entity: `ID Kelas: ${id}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal mengupdate kelas',
        });
    }
};

/**
 * Menghapus kelas berdasarkan ID
 * Delete class by ID
 * @desc    DELETE - hapus kelas
 * @route   DELETE /api/admin/kelas/:id
 * @access  Private (Admin only)
 */
exports.deleteKelas = async (req, res) => {
    const { id } = req.params;

    try {
        const success = await deleteKelasById(id);

        // Cek apakah kelas ditemukan dan berhasil dihapus
        // Check if class was found and successfully deleted
        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Kelas (ID tidak ditemukan)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Kelas dengan ID ${id} tidak ditemukan`,
            });
        }

        // Log aktivitas berhasil menghapus
        // Log successful deletion activity
        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus Kelas`,
            target_entity: `ID: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Kelas dengan ID ${id} berhasil dihapus`,
        });
    } catch (error) {
        console.error('Error in deleteKelas:', error);

        // Handle error referential integrity (kelas masih memiliki mahasiswa terdaftar)
        // Handle referential integrity error (class still has registered students)
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Kelas (masih ada mahasiswa terdaftar)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message:
                    'Gagal menghapus. Masih ada mahasiswa yang terdaftar di kelas ini. Harap pindahkan mereka terlebih dahulu',
            });
        }

        // Log error umum untuk monitoring
        // Log general error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus Kelas`,
            target_entity: `ID: ${id}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal menghapus kelas',
        });
    }
};

// =============================================
// ==         BULK IMPORT FUNCTIONS           ==
// =============================================
/**
 * Bulk import nilai mahasiswa dari file CSV
 * Bulk import student grades from CSV file
 * @desc    POST - Bulk create grades from CSV
 * @route   POST /api/admin/mahasiswa/:nim/grades/bulk-import
 * @access  Private (Admin only)
 */
exports.bulkCreateGrades = async (req, res) => {
    try {
        const { nim } = req.params;

        // Validasi parameter NIM
        // Validate NIM parameter
        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM mahasiswa tidak tersedia',
            });
        }

        // Validasi keberadaan file CSV
        // Validate CSV file existence
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File CSV wajib diupload',
            });
        }

        // Parse file CSV menggunakan PapaParse
        // Parse CSV file using PapaParse
        const csvData = req.file.buffer.toString('utf8');
        const parsed = Papa.parse(csvData, {
            header: true, // Gunakan baris pertama sebagai header
            skipEmptyLines: true, // Skip baris kosong
            transformHeader: (header) => header.trim().toLowerCase(), // Normalize header
        });

        // Validasi format CSV
        // Validate CSV format
        if (parsed.errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Format CSV tidak valid',
                errors: parsed.errors,
            });
        }

        const records = parsed.data;
        const results = {
            total: records.length,
            created: 0,
            failed: 0,
            errors: [],
        };

        // Proses setiap record dalam CSV
        // Process each record in CSV
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const rowNumber = i + 2; // +2 karena baris 1 adalah header, array dimulai dari 0

            try {
                // Validasi field yang wajib diisi untuk nilai
                // Validate required fields for grades
                if (
                    !record.kode_mk ||
                    !record.indeks_nilai ||
                    !record.semester ||
                    !record.tahun_ajaran
                ) {
                    throw new Error(
                        'kode_mk, indeks_nilai, semester, dan tahun_ajaran wajib diisi'
                    );
                }

                // Siapkan data untuk fungsi createNilaiMahasiswa yang sudah ada
                // Prepare data for existing createNilaiMahasiswa function
                const gradeData = {
                    nim_mahasiswa: nim,
                    kode_mk: record.kode_mk.trim(),
                    indeks_nilai: record.indeks_nilai.trim(),
                    semester: record.semester.trim(),
                    tahun_ajaran: record.tahun_ajaran.trim(),
                };

                // Gunakan fungsi createNilaiMahasiswa yang sudah ada
                // Use existing createNilaiMahasiswa function
                await createNilaiMahasiswa(gradeData);
                results.created++;
            } catch (error) {
                results.failed++;
                let errorMessage = 'Unknown error';

                // Handle berbagai jenis error yang mungkin terjadi saat import nilai
                // Handle various types of errors that might occur during grade import
                if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                    errorMessage = `Kode MK "${record.kode_mk}" tidak ditemukan di sistem`;
                } else if (error.code === 'ER_DUP_ENTRY') {
                    errorMessage = `Nilai untuk MK "${record.kode_mk}" semester ${record.semester} ${record.tahun_ajaran} sudah ada`;
                } else {
                    errorMessage = error.message;
                }

                // Simpan detail error untuk laporan
                // Store error details for reporting
                results.errors.push({
                    row: rowNumber,
                    kode_mk: record.kode_mk || 'N/A',
                    semester: record.semester || 'N/A',
                    tahun_ajaran: record.tahun_ajaran || 'N/A',
                    error: errorMessage,
                });
            }
        }

        // Log aktivitas bulk import nilai
        // Log bulk import grades activity
        await logActivity({
            req,
            admin: req.user,
            action: `Bulk import Nilai NIM ${nim}: ${results.created} berhasil, ${results.failed} gagal`,
            target_entity: `NIM: ${nim}, Total: ${results.total} records`,
            status: results.failed === 0 ? 'success' : 'fail',
        });

        res.status(200).json({
            success: true,
            message: `Bulk import selesai: ${results.created} berhasil, ${results.failed} gagal`,
            data: results,
        });
    } catch (error) {
        console.error('Error in bulkCreateGrades:', error);

        // Log error untuk bulk import yang gagal total
        // Log error for completely failed bulk import
        await logActivity({
            req,
            admin: req.user,
            action: `Error bulk import Nilai NIM ${req.params.nim}`,
            target_entity: 'Bulk import failed',
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal memproses bulk import',
            error: error.message,
        });
    }
};

// =============================================
// ==            KELOLA AKADEMIK              ==
// =============================================

// ============= KELOLA DATA NILAI =============

/**
 * Mengambil data semua mahasiswa untuk keperluan kelola akademik
 * Get all student data for academic management purposes
 * @desc    GET - mengambil semua data mahasiswa
 * @route   GET /api/admin/akademik/mahasiswa
 * @access  Private (Admin only)
 */
exports.getAllMahasiswaForKelolaAkademik = async (req, res) => {
    try {
        // Panggil fungsi model untuk mendapatkan data
        // Destructuring [result] karena model mengembalikan array: [{ status: '...', payload: ... }]
        // Call model function to get data
        // Destructuring [result] because model returns array: [{ status: '...', payload: ... }]
        const [result] = await getAllMahasiswa();

        // Cek apakah operasi di model berhasil
        // Check if model operation was successful
        if (result.status === 'success') {
            // Kirim respons 200 OK dengan data mahasiswa
            // Send 200 OK response with student data
            res.status(200).json({
                success: true,
                message: 'Data semua mahasiswa berhasil diambil',
                data: result.payload, // payload berisi array mahasiswa yang sudah diformat
            });
        } else {
            // Kasus ini seharusnya tidak terjadi jika model selalu throw error,
            // tapi baik untuk penanganan jika ada status 'fail' di masa depan.
            // This case shouldn't happen if model always throws error,
            // but good for handling if there's 'fail' status in the future.
            res.status(400).json({
                success: false,
                message: 'Gagal mengambil data mahasiswa',
                data: null,
            });
        }
    } catch (error) {
        // Tangkap error yang di-throw dari model
        // Catch error thrown from model
        console.error('Error in getAllMahasiswa controller:', error);

        // Kirim respons 500 Internal Server Error
        // Send 500 Internal Server Error response
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: error.message,
        });
    }
};

/**
 * Mengambil riwayat mata kuliah dan nilai mahasiswa berdasarkan NIM
 * Get course history and student grades by NIM
 * @desc    GET - mengambil riwayat mata kuliah mahasiswa
 * @route   GET /api/admin/akademik/mahasiswa/:nim/course-history
 * @access  Private (Admin only)
 */
exports.getCourseHistory = async (req, res) => {
    try {
        // Ambil nim mahasiswa dari params
        // Get student NIM from params
        const { nim } = req.params;

        // Validasi keberadaan NIM
        // Validate NIM existence
        if (!nim) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM tidak ditemukan, pastikan kamu sudah login dengan benar',
            });
        }

        // 1. Ambil data nilai mahasiswa dari database
        // 1. Get student grades data from database
        const nilaiRows = await getStudentGrades(nim);

        // Validasi apakah mahasiswa memiliki data nilai
        // Validate if student has grade data
        if (nilaiRows.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: {
                    nim: nim,
                    name: null,
                    kelas: null,
                    grades: [],
                },
                message: 'Tidak ada data nilai untuk mahasiswa dengan NIM ini',
            });
        }

        // 2. Ekstrak data mahasiswa dari hasil query pertama
        // 2. Extract student data from first query result
        const dataMahasiswa = {
            nim: nim,
            name: nilaiRows[0].nama,
            kelas: nilaiRows[0].kelas,
        };

        // 3. Buat array unik kode mata kuliah dari nilai mahasiswa
        // 3. Create unique array of course codes from student grades
        const kodeMkSet = new Set(nilaiRows.map((row) => row.kode_mk));
        const arrayKodeMk = [...kodeMkSet];

        // Validasi tambahan untuk kode mata kuliah
        // Additional validation for course codes
        if (arrayKodeMk.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: {
                    nim: nim,
                    name: dataMahasiswa.name,
                    kelas: dataMahasiswa.kelas,
                    grades: [],
                },
                message: 'Data nilai mahasiswa kosong',
            });
        }

        // 4. Cari detail mata kuliah di tabel mata_kuliah_baru
        // 4. Find course details in mata_kuliah_baru table
        const newCoursesRows = await getNewCourses(arrayKodeMk);

        // 5. Buat map untuk pencarian cepat mata kuliah baru
        // 5. Create map for quick lookup of new courses
        const newCoursesMap = {};
        newCoursesRows.forEach((course) => {
            newCoursesMap[course.kode_mk] = course;
        });

        // 6. Cari kode mata kuliah yang tidak ditemukan di tabel mata kuliah baru
        // 6. Find course codes not found in new courses table
        const notFoundKodeMk = arrayKodeMk.filter(
            (kode) => !newCoursesMap[kode]
        );

        // 7. Proses mata kuliah yang tidak ditemukan (cari ekuivalensi dan mata kuliah lama)
        // 7. Process courses not found (search for equivalents and old courses)
        if (notFoundKodeMk.length > 0) {
            // Cek apakah ada mata kuliah lama yang punya ekuivalensi di mata kuliah baru
            // Check if there are old courses that have equivalents in new courses
            const equivalentRows = await getEquivalentCourses(notFoundKodeMk);

            // Buat map untuk pencarian ekuivalensi dengan cepat
            // Create map for quick equivalence lookup
            const equivalentMap = {};
            equivalentRows.forEach((course) => {
                equivalentMap[course.ekivalensi] = course;
            });

            // Update daftar yang belum ditemukan (yang benar-benar tidak ada ekuivalensinya)
            // Update list of not found courses (those without equivalents)
            const stillNotFound = notFoundKodeMk.filter(
                (kode) => !equivalentMap[kode]
            );

            // Tambahkan mata kuliah ekuivalensi ke map utama
            // Add equivalent courses to main map
            equivalentRows.forEach((course) => {
                // Map kode lama ke detail mata kuliah baru
                // Map old code to new course details
                newCoursesMap[course.ekivalensi] = {
                    nama_mk: course.nama_mk,
                    sks_mk: course.sks_mk,
                    jenis_mk: course.jenis_mk,
                    kode_mk_baru: course.kode_mk, // Simpan kode baru untuk ditampilkan
                    is_equivalent: true,
                };
            });

            // Kalau masih ada yang belum ditemukan, cari di tabel mata_kuliah_lama
            // If there are still not found courses, search in mata_kuliah_lama table
            if (stillNotFound.length > 0) {
                const oldCoursesRows = await getOldCourses(stillNotFound);

                // Tambahkan mata kuliah lama ke map utama
                // Add old courses to main map
                oldCoursesRows.forEach((course) => {
                    newCoursesMap[course.kode_mk_lama] = {
                        nama_mk_lama: course.nama_mk_lama,
                        sks_mk_lama: course.sks_mk_lama,
                        // Mata kuliah lama tidak punya jenis_mk
                        // Old courses don't have jenis_mk
                    };
                });
            }
        }

        // 8. Kumpulkan semua kode ekuivalensi yang perlu dicari namanya
        // 8. Collect all equivalence codes that need their names searched
        const ekivalensiCodes = [];

        // Tambahkan dari mata kuliah yang punya nilai ekuivalensi
        // Add from courses that have equivalence values
        newCoursesRows.forEach((course) => {
            if (course.ekivalensi) {
                ekivalensiCodes.push(course.ekivalensi);
            }
        });

        // Tambahkan dari mata kuliah yang sudah ekivalen (kode lama dari nilai)
        // Add from courses that are already equivalent (old codes from grades)
        arrayKodeMk.forEach((kode) => {
            if (newCoursesMap[kode] && newCoursesMap[kode].is_equivalent) {
                ekivalensiCodes.push(kode);
            }
        });

        // Map untuk menyimpan nama mata kuliah lama berdasarkan kode
        // Map to store old course names based on code
        const oldCoursesNamesMap = {};

        // 9. Cari nama mata kuliah lama jika ada kode ekuivalensi
        // 9. Search for old course names if there are equivalence codes
        if (ekivalensiCodes.length > 0) {
            const oldCoursesNamesRows = await getOldCoursesNames(
                ekivalensiCodes
            );

            // Buat map untuk nama mata kuliah lama
            // Create map for old course names
            oldCoursesNamesRows.forEach((course) => {
                oldCoursesNamesMap[course.kode_mk_lama] = course.nama_mk_lama;
            });
        }

        // 10. Proses dan gabungkan data untuk respons
        // 10. Process and combine data for response
        const courseHistory = processCourseHistory(
            nilaiRows,
            newCoursesMap,
            oldCoursesNamesMap
        );

        const responseData = {
            nim: nim,
            name: dataMahasiswa.name,
            kelas: dataMahasiswa.kelas,
            grades: courseHistory,
        };

        return res.status(200).json({
            success: true,
            count: courseHistory.length,
            data: responseData,
        });
    } catch (error) {
        console.error('Error fetching course history:', error);
        return res.status(500).json({
            success: false,
            message:
                'Terjadi kesalahan server saat mengambil riwayat mata kuliah',
            error: error.message,
        });
    }
};

/**
 * Mengambil daftar semua mata kuliah
 * Get list of all courses
 * @desc    GET - mengambil daftar semua mata kuliah
 * @route   GET /api/admin/akademik/courses
 * @access  Private (Admin only)
 */
exports.getAllCourses = async (req, res) => {
    try {
        // 1. Panggil fungsi dari model untuk mengambil data dari database.
        //    Gunakan destructuring [result] karena model mengembalikan array: [{ status: '...', payload: ... }]
        // 1. Call function from model to get data from database.
        //    Use destructuring [result] because model returns array: [{ status: '...', payload: ... }]
        const [result] = await getAllCourse();

        // 2. Periksa status yang dikembalikan oleh model.
        // 2. Check status returned by model.
        if (result.status === 'success') {
            // 3. Jika berhasil, kirim respons HTTP 200 (OK) dengan data.
            // 3. If successful, send HTTP 200 (OK) response with data.
            res.status(200).json({
                success: true,
                message: 'Data semua mata kuliah berhasil diambil',
                count: result.payload.length, // Opsional: menambahkan jumlah data yang ditemukan
                data: result.payload,
            });
        }
    } catch (error) {
        // 4. Jika terjadi error (misalnya, database down) yang dilempar oleh model,
        //    tangkap di sini.
        // 4. If error occurs (e.g., database down) thrown by model,
        //    catch it here.
        console.error('Error in getAllCourses controller:', error);

        // Kirim respons HTTP 500 (Internal Server Error).
        // Send HTTP 500 (Internal Server Error) response.
        res.status(500).json({
            success: false,
            message:
                'Terjadi kesalahan pada server saat mengambil data mata kuliah',
            error: error.message,
        });
    }
};

/**
 * Membuat data nilai baru untuk mahasiswa
 * Create new grade data for student
 * @desc    POST - membuat data nilai baru
 * @route   POST /api/admin/akademik/nilai
 * @access  Private (Admin only)
 */
exports.createNilai = async (req, res) => {
    try {
        // 1. Validasi input dasar (memastikan field yang wajib ada tidak kosong)
        // 1. Basic input validation (ensure required fields are not empty)
        const { nimMahasiswa, kodeMK, indeksNilai, semester, tahunAjaran } =
            req.body;
        if (
            !nimMahasiswa ||
            !kodeMK ||
            !indeksNilai ||
            !semester ||
            !tahunAjaran
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Permintaan tidak valid. Semua field wajib diisi: nim_mahasiswa, kode_mk, indeks_nilai, semester, tahun_ajaran.',
            });
        }

        // Buat objek baru dengan nama properti yang sesuai dengan kolom database
        // Create new object with property names matching database columns
        const dataForModel = {
            nim_mahasiswa: nimMahasiswa,
            kode_mk: kodeMK,
            indeks_nilai: indeksNilai,
            semester: semester,
            tahun_ajaran: tahunAjaran,
        };

        // 2. Panggil fungsi model dengan data dari body request.
        //    Gunakan destructuring [result] karena model mengembalikan array.
        // 2. Call model function with data from request body.
        //    Use destructuring [result] because model returns array.
        const [result] = await createNilaiMahasiswa(dataForModel);

        // 3. Jika model berhasil, kirim respons HTTP 201 (Created).
        // 3. If model succeeds, send HTTP 201 (Created) response.
        if (result.status === 'success') {
            // Log aktivitas berhasil membuat nilai
            // Log successful grade creation activity
            await logActivity({
                req,
                admin: req.user,
                action: `Membuat data Nilai baru`,
                target_entity: `NIM: ${nimMahasiswa}, MK: ${kodeMK}`,
                status: 'success',
            });

            res.status(201).json({
                success: true,
                message: 'Data nilai berhasil ditambahkan',
                data: result.payload, // payload berisi data yang baru dibuat, termasuk id_nilai
            });
        }
    } catch (error) {
        // 4. Penanganan Error yang Spesifik dan Umum
        // 4. Specific and General Error Handling

        // Kasus: Foreign Key Constraint Fails. Artinya, NIM atau Kode MK yang diberikan
        // tidak ada di tabel referensinya (mahasiswa atau mata_kuliah).
        // Case: Foreign Key Constraint Fails. Means NIM or Course Code provided
        // doesn't exist in reference tables (mahasiswa or mata_kuliah).
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat Nilai (NIM/MK tidak ada)`,
                target_entity: `NIM: ${req.body.nimMahasiswa}, MK: ${req.body.kodeMK}`,
                status: 'fail',
            });

            return res.status(400).json({
                success: false,
                message: `Gagal menambahkan nilai. Pastikan NIM '${req.body.nimMahasiswa}' dan Kode MK '${req.body.kodeMK}' sudah terdaftar di sistem.`,
            });
        }

        console.error('Error in createNilai controller:', error);

        // Log error umum untuk monitoring
        // Log general error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat Nilai`,
            target_entity: `NIM: ${req.body.nimMahasiswa}, MK: ${req.body.kodeMK}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat membuat data nilai',
            error: error.message,
        });
    }
};

/**
 * Memperbarui data nilai berdasarkan ID
 * Update grade data by ID
 * @desc    PUT - edit data nilai
 * @route   PUT /api/admin/akademik/nilai/:id
 * @access  Private (Admin only)
 */
exports.updateNilai = async (req, res) => {
    try {
        // 1. Ambil input dari request
        // 1. Get input from request
        const { id } = req.params;
        const dataToUpdate = req.body;

        // 2. Lakukan validasi input
        // 2. Perform input validation
        const { kodeMK, indeksNilai, semester, tahunAjaran } = dataToUpdate;
        if (!kodeMK || !indeksNilai || !semester || !tahunAjaran) {
            return res.status(400).json({
                success: false,
                message:
                    'Permintaan tidak valid. Pastikan semua field (kode_mk, indeks_nilai, semester, tahun_ajaran) telah diisi.',
            });
        }

        // 3. Panggil model untuk melakukan update
        // 3. Call model to perform update
        const dataForModel = {
            kode_mk: kodeMK,
            indeks_nilai: indeksNilai,
            semester: semester,
            tahun_ajaran: tahunAjaran,
        };
        const [updateResult] = await updateNilaiMahasiswa(id, dataForModel);

        // 4. Periksa apakah ada baris yang diupdate
        // 4. Check if any rows were updated
        if (updateResult.payload.affectedRows === 0) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Nilai (ID tidak ditemukan)`,
                target_entity: `ID Nilai: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Data nilai dengan ID ${id} tidak ditemukan.`,
            });
        }

        // 5. Jika berhasil, siapkan data konfirmasi untuk dikirim kembali
        // 5. If successful, prepare confirmation data to send back
        const confirmedData = {
            id_nilai: parseInt(id, 10), // Pastikan ID adalah angka
            ...dataToUpdate,
        };

        // Log aktivitas berhasil update
        // Log successful update activity
        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate data Nilai`,
            target_entity: `ID Nilai: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: 'Data nilai berhasil diupdate',
            data: confirmedData, // Kirim kembali data yang diupdate sebagai konfirmasi
        });
    } catch (error) {
        // 6. Tangani error yang mungkin terjadi
        // 6. Handle possible errors

        // Jika error karena foreign key (misal, kode_mk tidak ada)
        // If error due to foreign key (e.g., kode_mk doesn't exist)
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Nilai (Kode MK tidak ada)`,
                target_entity: `ID Nilai: ${req.params.id}`,
                status: 'fail',
            });

            return res.status(400).json({
                success: false,
                message: `Gagal mengupdate nilai. Kode MK '${req.body.kodeMK}' tidak terdaftar atau tidak valid.`,
            });
        }

        // Untuk semua error server lainnya
        // For all other server errors
        console.error('Error in updateNilai controller:', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update Nilai`,
            target_entity: `ID Nilai: ${req.params.id}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

/**
 * Menghapus data nilai berdasarkan ID
 * Delete grade data by ID
 * @desc    DELETE - delete data nilai
 * @route   DELETE /api/admin/akademik/nilai/:id
 * @access  Private (Admin only)
 */
exports.deleteNilai = async (req, res) => {
    try {
        // 1. Ambil ID dari parameter URL
        // 1. Get ID from URL parameter
        const { id } = req.params;

        // 2. Panggil model untuk menjalankan query DELETE
        // 2. Call model to execute DELETE query
        const [result] = await removeNilaiMahasiswa(id);

        // 3. Periksa apakah ada baris yang benar-benar dihapus.
        // 3. Check if any rows were actually deleted.
        if (result.payload.affectedRows === 0) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Nilai (ID tidak ditemukan)`,
                target_entity: `ID Nilai: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Data nilai dengan ID ${id} tidak ditemukan. Tidak ada data yang dihapus.`,
            });
        }

        // 4. Jika berhasil, kirim respons yang menandakan sukses.
        // 4. If successful, send response indicating success.
        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus data Nilai`,
            target_entity: `ID Nilai: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Data nilai berhasil dihapus`,
        });
    } catch (error) {
        // 5. Tangani semua error tak terduga dari server
        // 5. Handle all unexpected server errors
        console.error('Error in deleteNilai controller:', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus Nilai`,
            target_entity: `ID Nilai: ${req.params.id}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat menghapus data.',
        });
    }
};

// ============= KELOLA DATA PRESTASI =============

/**
 * Mengambil data prestasi mahasiswa (SKS, IPK, TAK) berdasarkan NIM
 * Get student achievement data (SKS, IPK, TAK) by NIM
 * @desc    GET - ambil data sks, ipk dan tak
 * @route   GET /api/admin/akademik/prestasi/:nim
 * @access  Private (Admin only)
 */
exports.getPrestasiByNIM = async (req, res) => {
    try {
        // 1. Ambil NIM dari parameter URL
        // 1. Get NIM from URL parameter
        const { nim } = req.params;

        // 2. Panggil model untuk mengambil data prestasi
        // 2. Call model to get achievement data
        const result = await getDataPrestasi(nim);

        // 3. Handle kasus "Not Found" (model mengembalikan null)
        // 3. Handle "Not Found" case (model returns null)
        if (result === null) {
            return res.status(200).json({
                success: true,
                message: `Belum ada data prestasi untuk mahasiswa dengan NIM ${nim}.`,
                data: null, // Return null murni, bukan object dengan field null
            });
        }

        // 4. Handle kasus sukses (model mengembalikan data)
        // 4. Handle success case (model returns data)
        const [data] = result;
        if (data.status === 'success') {
            const prestasiData = data.payload;

            // Validasi apakah semua field penting kosong/null
            // Validate if all important fields are empty/null
            const isEmptyData =
                (prestasiData.tak === null || prestasiData.tak === undefined) &&
                (prestasiData.ipk === null || prestasiData.ipk === undefined) &&
                (prestasiData.totalSks === null ||
                    prestasiData.totalSks === undefined);

            if (isEmptyData) {
                // Jika semua field null, return null murni
                // If all fields are null, return pure null
                return res.status(200).json({
                    success: true,
                    message: `Belum ada data prestasi untuk mahasiswa dengan NIM ${nim}.`,
                    data: null,
                });
            }

            // Jika ada data valid, return data normal
            // If there's valid data, return normal data
            res.status(200).json({
                success: true,
                message: 'Data prestasi berhasil diambil',
                data: prestasiData,
            });
        }
    } catch (error) {
        // 5. Handle error tak terduga dari server
        // 5. Handle unexpected server errors
        console.error('Error in getPrestasiByNIM controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

/**
 * Helper function untuk menentukan klasifikasi mahasiswa berdasarkan IPK
 * Helper function to determine student classification based on GPA
 * @param {number} ipk - Indeks Prestasi Kumulatif mahasiswa / Student's Cumulative GPA
 * @returns {string} Klasifikasi mahasiswa (aman/siaga/bermasalah) / Student classification
 */
const tentukanKlasifikasi = (ipk) => {
    const nilaiIpk = parseFloat(ipk);
    if (nilaiIpk > 3.0) {
        return 'aman'; // IPK > 3.0 = Status aman / Safe status
    } else if (nilaiIpk >= 2.5 && nilaiIpk <= 3.0) {
        return 'siaga'; // IPK 2.5-3.0 = Status siaga / Alert status
    } else {
        return 'bermasalah'; // IPK < 2.5 = Status bermasalah / Problematic status
    }
};

/**
 * Membuat data prestasi baru untuk mahasiswa
 * Create new achievement data for student
 * @desc    POST - membuat Data Prestasi Baru
 * @route   POST /api/admin/akademik/prestasi
 * @access  Private (Admin only)
 */
exports.createPrestasi = async (req, res) => {
    try {
        // 1. Validasi input dari klien (tanpa 'tanggal_dibuat')
        // 1. Validate input from client (without 'tanggal_dibuat')
        const { nim, tak, sks_lulus, ipk_lulus } = req.body;
        if (
            !nim ||
            tak === undefined ||
            sks_lulus === undefined ||
            ipk_lulus === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Permintaan tidak valid. Field nim, tak, sks_lulus, dan ipk_lulus wajib diisi.',
            });
        }

        // 2. Buat objek data untuk dikirim ke model
        //    Gunakan spread operator (...) untuk menggabungkan data dari body
        //    dengan timestamp yang dibuat di sini.
        // 2. Create data object to send to model
        //    Use spread operator (...) to combine data from body
        //    with timestamp created here.
        const dataForModel = {
            ...req.body,
            tanggal_dibuat: new Date(), // Membuat timestamp saat ini / Create current timestamp
        };

        // 3. Panggil model dengan objek data yang sudah lengkap
        // 3. Call model with complete data object
        const [result] = await createDataPrestasi(dataForModel);

        // 4. Kirim respons sukses dan update klasifikasi mahasiswa
        // 4. Send success response and update student classification
        if (result.status === 'success') {
            try {
                // Tentukan klasifikasi berdasarkan IPK dan update ke database
                // Determine classification based on GPA and update to database
                const hasilKlasifikasi = tentukanKlasifikasi(ipk_lulus);
                await upsertKlasifikasi(nim, hasilKlasifikasi);
            } catch (classificationError) {
                // Jika klasifikasi gagal, cukup log error tanpa menghentikan proses utama.
                // If classification fails, just log error without stopping main process.
                console.error(
                    `Gagal melakukan klasifikasi untuk NIM ${nim}:`,
                    classificationError
                );
            }

            // Log aktivitas berhasil membuat prestasi
            // Log successful achievement creation activity
            await logActivity({
                req,
                admin: req.user,
                action: `Membuat data Prestasi`,
                target_entity: `NIM: ${nim}`,
                status: 'success',
            });

            res.status(201).json({
                success: true,
                message: 'Data prestasi (TAK dan IPK) berhasil ditambahkan.',
                data: result.payload,
            });
        }
    } catch (error) {
        // Handle error foreign key constraint (NIM tidak ada)
        // Handle foreign key constraint error (NIM doesn't exist)
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat Prestasi (NIM tidak ada)`,
                target_entity: `NIM: ${req.body.nim}`,
                status: 'fail',
            });

            return res.status(400).json({
                success: false,
                message: `Gagal menambahkan prestasi. NIM '${req.body.nim}' tidak terdaftar.`,
            });
        }

        // Handle error umum untuk monitoring
        // Handle general error for monitoring
        console.error('Error from Prestasi Controller:', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat Prestasi`,
            target_entity: `NIM: ${req.body.nim}`,
            status: 'fail',
        });

        res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

/**
 * Memperbarui data prestasi mahasiswa berdasarkan NIM
 * Update student achievement data by NIM
 * @desc    PUT - mengedit data prestasi yang sudah ada
 * @route   PUT /api/admin/akademik/prestasi/:nim
 * @access  Private (Admin only)
 */
exports.updatePrestasi = async (req, res) => {
    try {
        // Ambil NIM dari URL dan data dari body
        // Get NIM from URL and data from body
        const { nim } = req.params;
        const data = req.body;

        // Validasi input - field wajib untuk update prestasi
        // Input validation - required fields for achievement update
        if (
            data.tak === undefined ||
            data.sks_lulus === undefined ||
            data.ipk_lulus === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Permintaan tidak valid. Field tak, sks_lulus, dan ipk_lulus wajib diisi.',
            });
        }

        // Siapkan data untuk model
        // Prepare data for model
        const dataForModel = {
            tak: data.tak,
            sks_lulus: data.sks_lulus,
            ipk_lulus: data.ipk_lulus,
        };
        const [result] = await updateDataPrestasi(nim, dataForModel);

        // Periksa apakah ada baris yang terpengaruh.
        // Jika tidak ada sama sekali, berarti NIM tidak ditemukan.
        // Check if any rows were affected.
        // If none at all, it means NIM was not found.
        const takAffected = result.payload.takResult.affectedRows;
        const ipkAffected = result.payload.ipkResult.affectedRows;

        if (takAffected === 0 && ipkAffected === 0) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Prestasi (NIM tidak ditemukan)`,
                target_entity: `NIM: ${nim}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Data prestasi untuk mahasiswa dengan NIM ${nim} tidak ditemukan.`,
            });
        }

        try {
            // Update klasifikasi mahasiswa berdasarkan IPK baru
            // Update student classification based on new GPA
            const hasilKlasifikasi = tentukanKlasifikasi(data.ipk_lulus);
            await upsertKlasifikasi(nim, hasilKlasifikasi);
        } catch (classificationError) {
            // Log error klasifikasi tanpa menghentikan proses utama
            // Log classification error without stopping main process
            console.error(
                `Gagal melakukan klasifikasi untuk NIM ${nim} saat update:`,
                classificationError
            );
        }

        // Log aktivitas berhasil update prestasi
        // Log successful achievement update activity
        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate data Prestasi`,
            target_entity: `NIM: ${nim}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Data prestasi untuk NIM ${nim} berhasil diupdate.`,
            data: {
                nim: nim,
                ...data,
            },
        });
    } catch (error) {
        // Handle error umum dari server
        // Handle general server errors
        console.error('Error from Prestasi Controller (Update):', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update Prestasi`,
            target_entity: `NIM: ${req.params.nim}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

/**
 * Menghapus data prestasi mahasiswa berdasarkan NIM
 * Delete student achievement data by NIM
 * @desc    DELETE - menghapus data IPK TAK SKS mahasiswa
 * @route   DELETE /api/admin/akademik/prestasi/:nim
 * @access  Private (Admin only)
 */
exports.deletePrestasi = async (req, res) => {
    try {
        // Ambil NIM dari parameter URL
        // Get NIM from URL parameter
        const { nim } = req.params;

        const [result] = await deleteDataPrestasi(nim);

        // Periksa apakah ada baris yang terpengaruh.
        // Jika tidak ada sama sekali di kedua tabel, berarti NIM tidak ditemukan.
        // Check if any rows were affected.
        // If none at all in both tables, it means NIM was not found.
        const takAffected = result.payload.takResult.affectedRows;
        const ipkAffected = result.payload.ipkResult.affectedRows;

        if (takAffected === 0 && ipkAffected === 0) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Prestasi (NIM tidak ditemukan)`,
                target_entity: `NIM: ${nim}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Data prestasi untuk mahasiswa dengan NIM ${nim} tidak ditemukan.`,
            });
        }

        // Log aktivitas berhasil menghapus prestasi
        // Log successful achievement deletion activity
        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus data Prestasi`,
            target_entity: `NIM: ${nim}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Data TAK SKS dan IPK berhasil dihapus`,
        });
    } catch (error) {
        // Handle error umum dari server
        // Handle general server errors
        console.error('Error from Prestasi Controller (Delete):', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus Prestasi`,
            target_entity: `NIM: ${req.params.nim}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

// ============= KELOLA DATA PERSEMESTER =============

/**
 * Mengambil data IP dan SKS per semester mahasiswa berdasarkan NIM
 * Get student's IP and SKS data per semester by NIM
 * @desc    GET - mengambil data ip dan sks persemester
 * @route   GET /api/admin/akademik/semester/:nim
 * @access  Private (Admin only)
 */
exports.getSemesterByNIM = async (req, res) => {
    try {
        // 1. Ambil NIM dari parameter URL
        // 1. Get NIM from URL parameter
        const { nim } = req.params;

        // 2. Panggil model untuk mencari data semester mahasiswa
        // 2. Call model to find student semester data
        const result = await findSemesterMahasiswaByNIM(nim);

        // 3. Handle kasus "Not Found" (model mengembalikan null)
        // 3. Handle "Not Found" case (model returns null)
        if (result === null) {
            return res.status(200).json({
                success: true,
                message: `Belum ada riwayat semester untuk mahasiswa dengan NIM ${nim}.`,
                data: {
                    nim: nim,
                    riwayat_semester: [], // Return array kosong untuk semester
                },
            });
        }

        // 4. Handle kasus "Success" - validasi apakah array semester kosong
        // 4. Handle "Success" case - validate if semester array is empty
        if (result.riwayat_semester && Array.isArray(result.riwayat_semester)) {
            if (result.riwayat_semester.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: `Belum ada riwayat semester untuk mahasiswa dengan NIM ${nim}.`,
                    data: {
                        nim: nim,
                        riwayat_semester: [],
                    },
                });
            }
        }

        // Return data semester yang ditemukan
        // Return found semester data
        res.status(200).json({
            success: true,
            message: 'Riwayat semester berhasil diambil.',
            data: result, // 'result' adalah objek yang sudah diformat dari model
        });
    } catch (error) {
        // 5. Handle error tak terduga dari server
        // 5. Handle unexpected server errors
        console.error('Error in getSemesterByNIM controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

/**
 * Membuat data semester baru untuk mahasiswa
 * Create new semester data for student
 * @desc    POST - membuat data semester baru
 * @route   POST /api/admin/akademik/semester/:nim
 * @access  Private (Admin only)
 */
exports.createSemester = async (req, res) => {
    try {
        // 1. Ambil input dari params dan body
        // 1. Get input from params and body
        const { nim } = req.params;
        const {
            ip_semester,
            semester,
            sks_semester,
            tahun_ajaran,
            jenis_semester,
        } = req.body;

        // 2. Validasi input dari body - semua field wajib diisi
        // 2. Validate input from body - all fields are required
        if (
            ip_semester === undefined ||
            semester === undefined ||
            sks_semester === undefined ||
            !tahun_ajaran ||
            !jenis_semester
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Permintaan tidak valid. Semua field dalam body wajib diisi.',
            });
        }

        // 3. Siapkan data untuk model dengan menggabungkan NIM dari params
        // 3. Prepare data for model by combining NIM from params
        const dataForModel = {
            nim_mahasiswa: nim, // Tambahkan NIM dari params ke data model
            ...req.body,
            tanggal_dibuat: new Date(), // Timestamp otomatis untuk audit trail
        };

        // 4. Panggil model dengan objek data yang lengkap
        // 4. Call model with complete data object
        const newSemester = await createSemesterMahasiswaByNIM(dataForModel);

        // 5. Log aktivitas berhasil dan kirim respons sukses
        // 5. Log successful activity and send success response
        await logActivity({
            req,
            admin: req.user,
            action: `Membuat data Semester`,
            target_entity: `NIM: ${nim}, Semester: ${semester}`,
            status: 'success',
        });

        res.status(201).json({
            success: true,
            message: 'Data semester berhasil ditambahkan.',
            data: newSemester,
        });
    } catch (error) {
        // 6. Handle error yang konsisten
        // 6. Handle consistent errors

        // Handle error jika NIM tidak ditemukan (foreign key constraint)
        // Handle error if NIM not found (foreign key constraint)
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat Semester (NIM tidak ada)`,
                target_entity: `NIM: ${nim}`,
                status: 'fail',
            });

            return res.status(400).json({
                success: false,
                message: `Gagal menambahkan data. Mahasiswa dengan NIM '${nim}' tidak ditemukan.`,
            });
        }

        console.error('Error in createSemester controller:', error);

        // Log error umum untuk monitoring
        // Log general error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat Semester`,
            target_entity: `NIM: ${nim}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

/**
 * Memperbarui data semester berdasarkan ID
 * Update semester data by ID
 * @desc    PUT - mengedit data persemester
 * @route   PUT /api/admin/akademik/semester/:id
 * @access  Private (Admin only)
 */
exports.updateSemester = async (req, res) => {
    try {
        const { id } = req.params;
        const dataToUpdate = req.body;

        // Validasi input - semua field wajib untuk update semester
        // Input validation - all fields required for semester update
        if (
            dataToUpdate.ip_semester === undefined ||
            dataToUpdate.semester === undefined ||
            dataToUpdate.sks_semester === undefined ||
            !dataToUpdate.tahun_ajaran ||
            !dataToUpdate.jenis_semester
        ) {
            return res
                .status(400)
                .json({ success: false, message: 'Semua field wajib diisi.' });
        }

        // Siapkan data untuk model dengan timestamp update
        // Prepare data for model with update timestamp
        const dataForModel = {
            ...req.body,
            tanggal_dibuat: new Date(), // Update timestamp untuk audit trail
        };

        const result = await updateSemesterMahasiswaById(id, dataForModel);

        // Periksa apakah ada baris yang diupdate (affected rows)
        // Check if any rows were updated (affected rows)
        if (result.affectedRows === 0) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Semester (ID tidak ditemukan)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Data semester dengan ID ${id} tidak ditemukan.`,
            });
        }

        // Log aktivitas berhasil update dan kirim respons sukses
        // Log successful update activity and send success response
        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate data Semester`,
            target_entity: `ID: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: 'Data semester berhasil diupdate.',
            data: {
                id: parseInt(id, 10),
                ...dataToUpdate, // Return data yang diupdate sebagai konfirmasi
            },
        });
    } catch (error) {
        console.error('Error in updateSemester controller:', error);

        // Log error untuk monitoring
        // Log error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update Semester`,
            target_entity: `ID: ${req.params.id}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

/**
 * Menghapus data semester berdasarkan ID
 * Delete semester data by ID
 * @desc    DELETE - menghapus data persemester
 * @route   DELETE /api/admin/akademik/semester/:id
 * @access  Private (Admin only)
 */
exports.deleteSemester = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await deleteSemesterMahasiswaById(id);

        // Periksa apakah ada baris yang terhapus (affected rows)
        // Check if any rows were deleted (affected rows)
        if (result.affectedRows === 0) {
            // Jika tidak ada, artinya data tidak ditemukan
            // If none, it means data was not found
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Semester (ID tidak ditemukan)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Data semester dengan ID ${id} tidak ditemukan.`,
            });
        }

        // Log aktivitas berhasil menghapus
        // Log successful deletion activity
        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus data Semester`,
            target_entity: `ID: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Data IP dan SKS semester berhasil dihapus`,
        });
    } catch (error) {
        console.error('Error in deleteSemester controller:', error);

        // Log error untuk monitoring
        // Log error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus Semester`,
            target_entity: `ID: ${req.params.id}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};
// =============================================
// ==           KELOLA KURIKULUM              ==
// =============================================

/**
 * Mengambil semua mata kuliah berdasarkan kurikulum tertentu
 * Get all courses based on specific curriculum
 * @desc    GET - mengambil mata kuliah berdasarkan kurikulum
 * @route   GET /api/admin/kurikulum/mata-kuliah?kurikulum=2024
 * @access  Private (Admin only)
 */
exports.getMataKuliahByKurikulum = async (req, res) => {
    try {
        const { kurikulum } = req.query;

        // Validasi parameter kurikulum wajib ada
        // Validate required curriculum parameter
        if (!kurikulum) {
            return res.status(400).json({
                success: false,
                message: 'kurikulum is required as a query parameter.',
            });
        }

        const mataKuliah = await findMataKuliahByKurikulum(kurikulum);

        // Handle jika tidak ada mata kuliah ditemukan
        // Handle if no courses found
        if (mataKuliah.length === 0) {
            return res.status(200).json({
                success: false,
                count: 0,
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            count: mataKuliah.length,
            message: `Data mata kuliah kurikulum ${kurikulum} berhasil diambil`,
            data: mataKuliah,
        });
    } catch (error) {
        console.error('Error in getMataKuliahByKurikulum controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan dalam mengambil data mata kuliah',
            error: error.message,
        });
    }
};

/**
 * Mengambil daftar semua kurikulum yang tersedia dalam sistem
 * Get list of all available curriculums in the system
 * @desc    GET - mengambil semua kurikulum yang tersedia
 * @route   GET /api/admin/kurikulum
 * @access  Private (Admin only)
 */
exports.getAllKurikulum = async (req, res) => {
    try {
        const kurikulumList = await getAllKurikulum();

        // Handle jika tidak ada kurikulum ditemukan
        // Handle if no curriculums found
        if (kurikulumList.length === 0) {
            return res.status(200).json({
                success: false,
                count: 0,
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Data kurikulum berhasil diambil',
            data: kurikulumList,
        });
    } catch (error) {
        console.error('Error in getAllKurikulum controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan dalam mengambil data kurikulum',
            error: error.message,
        });
    }
};

/**
 * Mengambil daftar semua kelompok keahlian untuk dropdown/select options
 * Get list of all expertise groups for dropdown/select options
 * @desc    GET - mengambil list semua kelompok keahlian
 * @route   GET /api/admin/kurikulum/kelompok-keahlian
 * @access  Private (Admin only)
 */
exports.getKelompokKeahlianList = async (req, res) => {
    try {
        const kelompokKeahlianList = await getAllKelompokKeahlian();

        // Handle jika tidak ada kelompok keahlian ditemukan (tetap return success)
        // Handle if no expertise groups found (still return success)
        if (kelompokKeahlianList.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Data kelompok keahlian berhasil diambil',
            data: kelompokKeahlianList,
        });
    } catch (error) {
        console.error('Error in getKelompokKeahlianList controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan dalam mengambil data kelompok keahlian',
            error: error.message,
        });
    }
};

/**
 * Mengambil detail mata kuliah berdasarkan ID untuk editing
 * Get course details by ID for editing
 * @desc    GET - mengambil mata kuliah berdasarkan ID
 * @route   GET /api/admin/kurikulum/mata-kuliah/:id
 * @access  Private (Admin only)
 */
exports.getMataKuliahById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validasi ID parameter
        // Validate ID parameter
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID mata kuliah tidak valid',
            });
        }

        const mataKuliah = await findMataKuliahById(parseInt(id));

        // Handle jika mata kuliah tidak ditemukan
        // Handle if course not found
        if (!mataKuliah) {
            return res.status(200).json({
                success: false,
                message: 'Mata kuliah tidak ditemukan',
                count: 0,
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: 'Data mata kuliah berhasil diambil',
            data: mataKuliah,
        });
    } catch (error) {
        console.error('Error in getMataKuliahById controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan dalam mengambil data mata kuliah',
            error: error.message,
        });
    }
};

/**
 * Menambahkan mata kuliah baru ke dalam kurikulum
 * Add new course to curriculum
 * @desc    POST - menambah mata kuliah baru
 * @route   POST /api/admin/kurikulum/mata-kuliah
 * @access  Private (Admin only)
 */
exports.createMataKuliah = async (req, res) => {
    try {
        const {
            kode_mk,
            nama_mk,
            sks_mk,
            jenis_mk,
            tingkat,
            jenis_semester,
            semester,
            ekivalensi,
            kurikulum,
            kelompok_keahlian,
        } = req.body;

        // Validasi input field yang wajib diisi
        // Validate required input fields
        if (!kode_mk || !nama_mk || !sks_mk || !jenis_mk || !kurikulum) {
            return res.status(400).json({
                success: false,
                message:
                    'Field kode_mk, nama_mk, sks_mk, jenis_mk, dan kurikulum wajib diisi',
                data: null,
            });
        }

        // Validasi tipe data numerik
        // Validate numeric data types
        if (isNaN(sks_mk) || isNaN(semester) || isNaN(kurikulum)) {
            return res.status(400).json({
                success: false,
                message: 'SKS, semester, dan kurikulum harus berupa angka',
            });
        }

        // Validasi rentang SKS (1-10 SKS)
        // Validate SKS range (1-10 credits)
        if (sks_mk < 1 || sks_mk > 10) {
            return res.status(400).json({
                success: false,
                message: 'SKS harus antara 1-10',
                data: null,
            });
        }

        // Validasi jenis mata kuliah
        // Validate course type
        const jenisValid = ['WAJIB PRODI', 'PILIHAN'];
        if (!jenisValid.includes(jenis_mk)) {
            return res.status(400).json({
                success: false,
                message: `Jenis mata kuliah harus salah satu dari: ${jenisValid.join(
                    ', '
                )}`,
                data: null,
            });
        }

        // Validasi jenis semester
        // Validate semester type
        const jenisSemesterValid = ['GANJIL', 'GENAP', 'ANTARA'];
        if (jenis_semester && !jenisSemesterValid.includes(jenis_semester)) {
            return res.status(400).json({
                success: false,
                message: `Jenis semester harus salah satu dari: ${jenisSemesterValid.join(
                    ', '
                )}`,
                data: null,
            });
        }

        // Validasi rentang semester (1-8)
        // Validate semester range (1-8)
        if (semester && (semester < 1 || semester > 8)) {
            return res.status(400).json({
                success: false,
                message: 'Semester harus antara 1-8',
                data: null,
            });
        }

        // Validasi rentang tingkat (1-4)
        // Validate level range (1-4)
        if (tingkat && (tingkat < 1 || tingkat > 4)) {
            return res.status(400).json({
                success: false,
                message: 'Tingkat harus antara 1-4',
                data: null,
            });
        }

        // Siapkan data untuk disimpan ke database
        // Prepare data to be saved to database
        const mataKuliahData = {
            kode_mk: kode_mk.toUpperCase(), // Normalisasi ke uppercase
            nama_mk: nama_mk.trim(), // Hapus spasi di awal/akhir
            sks_mk: parseInt(sks_mk),
            jenis_mk,
            tingkat: tingkat,
            jenis_semester: jenis_semester,
            semester: semester,
            ekivalensi: ekivalensi ? ekivalensi.toUpperCase() : null,
            kurikulum: parseInt(kurikulum),
            kelompok_keahlian: kelompok_keahlian || null,
        };

        // Panggil model untuk create mata kuliah
        // Call model to create course
        const result = await createMataKuliah(mataKuliahData);

        // Log aktivitas berhasil membuat mata kuliah
        // Log successful course creation activity
        await logActivity({
            req,
            admin: req.user,
            action: `Membuat Mata Kuliah baru: ${nama_mk}`,
            target_entity: `Kode: ${kode_mk}`,
            status: 'success',
        });

        return res.status(201).json({
            success: true,
            message: 'Mata kuliah berhasil ditambahkan',
            data: result,
        });
    } catch (error) {
        console.error('Error in createMataKuliah controller:', error);

        // Handle specific error untuk duplikat mata kuliah
        // Handle specific error for duplicate course
        if (error.message.includes('sudah ada dalam kurikulum')) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat MK (duplikat): ${req.body.nama_mk}`,
                target_entity: `Kode: ${req.body.kode_mk}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message: error.message,
                data: null,
            });
        }

        // Log error umum untuk monitoring
        // Log general error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat MK: ${req.body.nama_mk}`,
            target_entity: `Kode: ${req.body.kode_mk}`,
            status: 'fail',
        });

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
            data: null,
        });
    }
};

/**
 * Memperbarui data mata kuliah berdasarkan ID
 * Update course data by ID
 * @desc    PUT - mengupdate mata kuliah berdasarkan ID
 * @route   PUT /api/admin/kurikulum/mata-kuliah/:id
 * @access  Private (Admin only)
 */
exports.updateMataKuliah = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            kode_mk,
            nama_mk,
            sks_mk,
            jenis_mk,
            tingkat,
            jenis_semester,
            semester,
            ekivalensi,
            kurikulum,
            kelompok_keahlian,
        } = req.body;

        // Validasi ID parameter
        // Validate ID parameter
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID mata kuliah tidak valid',
            });
        }

        // Validasi input field wajib untuk update
        // Validate required input fields for update
        if (
            !kode_mk ||
            !nama_mk ||
            !sks_mk ||
            !jenis_mk ||
            !semester ||
            !kurikulum
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Data wajib tidak lengkap. Pastikan kode_mk, nama_mk, sks_mk, jenis_mk, semester, dan kurikulum diisi',
            });
        }

        // Validasi tipe data numerik
        // Validate numeric data types
        if (isNaN(sks_mk) || isNaN(semester) || isNaN(kurikulum)) {
            return res.status(400).json({
                success: false,
                message: 'SKS, semester, dan kurikulum harus berupa angka',
            });
        }

        // Validasi rentang nilai SKS dan semester
        // Validate SKS and semester value ranges
        if (parseInt(sks_mk) < 1 || parseInt(sks_mk) > 10) {
            return res.status(400).json({
                success: false,
                message: 'SKS harus dalam rentang 1-10',
            });
        }

        if (parseInt(semester) < 1 || parseInt(semester) > 8) {
            return res.status(400).json({
                success: false,
                message: 'Semester harus dalam rentang 1-8',
            });
        }

        // Siapkan data untuk update dengan normalisasi
        // Prepare data for update with normalization
        const mataKuliahData = {
            kode_mk: kode_mk.trim().toUpperCase(),
            nama_mk: nama_mk.trim(),
            sks_mk: parseInt(sks_mk),
            jenis_mk,
            tingkat: tingkat ? parseInt(tingkat) : 1,
            jenis_semester: jenis_semester || 'GANJIL',
            semester: parseInt(semester),
            ekivalensi:
                ekivalensi && ekivalensi.trim() !== ''
                    ? ekivalensi.trim()
                    : null,
            kurikulum: parseInt(kurikulum),
            kelompok_keahlian: kelompok_keahlian || null,
        };

        const updatedMataKuliah = await updateMataKuliah(
            parseInt(id),
            mataKuliahData
        );

        // Handle jika mata kuliah tidak ditemukan
        // Handle if course not found
        if (!updatedMataKuliah) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update MK (ID tidak ditemukan)`,
                target_entity: `ID MK: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: 'Mata kuliah tidak ditemukan',
            });
        }

        // Log aktivitas berhasil update mata kuliah
        // Log successful course update activity
        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate Mata Kuliah: ${nama_mk}`,
            target_entity: `ID MK: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: 'Mata kuliah berhasil diupdate',
            data: updatedMataKuliah,
        });
    } catch (error) {
        console.error('Error in updateMataKuliah controller:', error);

        // Handle duplicate error
        // Handle duplicate error
        if (error.message.includes('sudah ada dalam kurikulum')) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update MK (duplikat): ${req.body.nama_mk}`,
                target_entity: `ID MK: ${req.params.id}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        // Log error umum untuk monitoring
        // Log general error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update MK`,
            target_entity: `ID MK: ${req.params.id}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan dalam mengupdate mata kuliah',
            error: error.message,
        });
    }
};

/**
 * Menghapus mata kuliah berdasarkan ID
 * Delete course by ID
 * @desc    DELETE - menghapus mata kuliah berdasarkan ID
 * @route   DELETE /api/admin/kurikulum/mata-kuliah/:id
 * @access  Private (Admin only)
 */
exports.deleteMataKuliah = async (req, res) => {
    try {
        const { id } = req.params;

        // Validasi ID parameter
        // Validate ID parameter
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID mata kuliah tidak valid',
            });
        }

        // Cek apakah mata kuliah ada sebelum menghapus
        // Check if course exists before deleting
        const existingMataKuliah = await findMataKuliahById(parseInt(id));
        if (!existingMataKuliah) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus MK (ID tidak ditemukan)`,
                target_entity: `ID MK: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: 'Mata kuliah tidak ditemukan',
            });
        }

        // Lakukan penghapusan mata kuliah
        // Perform course deletion
        const isDeleted = await deleteMataKuliah(parseInt(id));

        if (!isDeleted) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus MK setelah ditemukan`,
                target_entity: `ID MK: ${id}`,
                status: 'fail',
            });

            return res.status(500).json({
                success: false,
                message: 'Gagal menghapus mata kuliah',
            });
        }

        // Log aktivitas berhasil menghapus mata kuliah
        // Log successful course deletion activity
        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus Mata Kuliah: ${existingMataKuliah.nama_mk}`,
            target_entity: `ID MK: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: 'Mata kuliah berhasil dihapus',
            data: {
                id: parseInt(id),
                kode_mk: existingMataKuliah.kode_mk,
                nama_mk: existingMataKuliah.nama_mk,
            },
        });
    } catch (error) {
        console.error('Error in deleteMataKuliah controller:', error);

        // Log error untuk monitoring
        // Log error for monitoring
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus MK`,
            target_entity: `ID MK: ${req.params.id}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan dalam menghapus mata kuliah',
            error: error.message,
        });
    }
};

/**
 * Mengambil opsi mata kuliah untuk keperluan ekuivalensi
 * Get course options for equivalence purposes
 * @desc    GET - mengambil opsi mata kuliah untuk ekuivalensi
 * @route   GET /api/admin/kurikulum/ekuivalensi-options/:kurikulum
 * @access  Private (Admin only)
 */
exports.getEkuivalensiOptions = async (req, res) => {
    try {
        const { kurikulum } = req.params;
        const currentKurikulum = kurikulum ? parseInt(kurikulum) : null;

        const options = await getEkuivalensiOptions(currentKurikulum);

        // Handle jika tidak ada opsi ekuivalensi
        // Handle if no equivalence options found
        if (!options) {
            return res.status(200).json({
                success: false,
                message: 'Opsi ekuivalensi tidak ditemukan',
                count: 0,
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: 'Data opsi ekuivalensi berhasil diambil',
            data: options,
        });
    } catch (error) {
        console.error('Error in getEkuivalensiOptions controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan dalam mengambil opsi ekuivalensi',
            error: error.message,
        });
    }
};
