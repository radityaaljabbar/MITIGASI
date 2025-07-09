// Admin Routes - Routing untuk fitur administrasi sistem akademik
// Admin Routes for academic system administration features
const express = require('express');
const router = express.Router();

// Import controller untuk admin operations
// Import controller for admin operations
const adminController = require('../controllers/adminController');

// Import middleware autentikasi dan otorisasi
// Import authentication and authorization middleware
const { protect, authorize } = require('../middlewares/authMiddleware');

// Import controller untuk logging aktivitas
// Import controller for activity logging
const logController = require('../controllers/logController');

// Import middleware untuk upload file
// Import middleware for file uploads
const upload = require('../middlewares/uploadMiddleware');
const csvUpload = require('../middlewares/csvUploadMiddleware');

// =============================================
// ==           SWAGGER-JSDOC DEFINITIONS     ==
// =============================================

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik admin.
 *         name:
 *           type: string
 *           description: Nama lengkap admin.
 *         username:
 *           type: string
 *           description: Username untuk login.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Waktu pembuatan akun.
 *     AdminInput:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *           description: Password admin (wajib saat create, opsional saat update).
 *     Dosen:
 *       type: object
 *       properties:
 *         nip:
 *           type: string
 *         nama:
 *           type: string
 *         kode:
 *           type: string
 *           maxLength: 3
 *         status:
 *           type: string
 *           enum: [aktif, tidak aktif]
 *         kelas_wali:
 *           type: string
 *           nullable: true
 *           description: Daftar kelas yang diwalikan, dipisahkan koma.
 *     DosenInput:
 *        type: object
 *        required:
 *          - nip
 *          - nama
 *          - kode
 *        properties:
 *          nip:
 *            type: string
 *          nama:
 *            type: string
 *          kode:
 *            type: string
 *            maxLength: 3
 *          password:
 *            type: string
 *            description: Opsional, jika tidak diisi akan menggunakan NIP.
 *          status:
 *            type: string
 *            enum: [aktif, tidak aktif]
 *            default: aktif
 *     Mahasiswa:
 *       type: object
 *       properties:
 *         nim:
 *           type: string
 *         nama:
 *           type: string
 *         kelas:
 *           type: string
 *         status:
 *           type: string
 *           enum: [aktif, cuti, lulus, do]
 *     MahasiswaInput:
 *       type: object
 *       required:
 *         - nim
 *         - nama
 *         - kelas
 *       properties:
 *         nim:
 *           type: string
 *         nama:
 *           type: string
 *         kelas:
 *           type: string
 *         password:
 *           type: string
 *           description: Opsional, jika tidak diisi akan menggunakan NIM.
 *         status:
 *           type: string
 *           enum: [aktif, cuti, lulus, do]
 *           default: aktif
 *     Kelas:
 *       type: object
 *       properties:
 *          id_kelas:
 *              type: integer
 *          tahun_angkatan:
 *              type: integer
 *          kode_kelas:
 *              type: string
 *          kode_dosen:
 *              type: string
 *              nullable: true
 *          nama_dosen:
 *              type: string
 *              nullable: true
 *     MataKuliah:
 *       type: object
 *       properties:
 *         id_mk:
 *           type: integer
 *         kode_mk:
 *           type: string
 *         nama_mk:
 *           type: string
 *         sks_mk:
 *           type: integer
 *         jenis_mk:
 *           type: string
 *           enum: [WAJIB PRODI, PILIHAN]
 *         kurikulum:
 *           type: integer
 *         ekivalensi:
 *           type: string
 *           nullable: true
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Contoh endpoint untuk testing (dapat dihapus di production)
// Example endpoint for testing (can be removed in production)
router.get('/contoh', protect, authorize('admin'), () => {});

// =============================================
// ==         KELOLA PENGGUNA ROUTES          ==
// =============================================

// Admin Management Routes - Manajemen data admin
// Admin Management Routes

/**
 * @swagger
 * /api/admin/kelolaPengguna/getAdmin:
 *   get:
 *     summary: Mendapatkan semua akun Admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar akun admin berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 */
router.get(
    '/kelolaPengguna/getAdmin',
    protect,
    authorize('admin'),
    adminController.getAllAdmins
);

/**
 * @swagger
 * /api/admin/kelolaPengguna/createAdmin:
 *   post:
 *     summary: Membuat akun Admin baru
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminInput'
 *     responses:
 *       201:
 *         description: Admin berhasil dibuat.
 *       409:
 *         description: Username sudah digunakan.
 */
router.post(
    '/kelolaPengguna/createAdmin',
    protect,
    authorize('admin'),
    adminController.createAdmin
);

/**
 * @swagger
 * /api/admin/kelolaPengguna/deleteAdmin/{id}:
 *   delete:
 *     summary: Menghapus akun Admin berdasarkan ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Admin berhasil dihapus.
 *       404:
 *         description: Admin tidak ditemukan.
 */
router.delete(
    '/kelolaPengguna/deleteAdmin/:id',
    protect,
    authorize('admin'),
    adminController.deleteAdmin
);

/**
 * @swagger
 * /api/admin/kelolaPengguna/updateAdmin/{id}:
 *   put:
 *     summary: Memperbarui akun Admin berdasarkan ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminInput'
 *     responses:
 *       200:
 *         description: Admin berhasil diperbarui.
 *       404:
 *         description: Admin tidak ditemukan.
 *       409:
 *         description: Username sudah digunakan.
 */
router.put(
    '/kelolaPengguna/updateAdmin/:id',
    protect,
    authorize('admin'),
    adminController.updateAdmin
);

// Lecturer Supervisor Management Routes - Manajemen data dosen wali
// Lecturer Supervisor Management Routes
/**
 * @swagger
 * /api/admin/kelolaPengguna/getDosenWali:
 *   get:
 *     summary: Mendapatkan semua data Dosen Wali
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar dosen wali berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dosen'
 */
router.get(
    '/kelolaPengguna/getDosenWali',
    protect,
    authorize('admin'),
    adminController.getAllDosen
);

/**
 * @swagger
 * /api/admin/kelolaPengguna/createDosenWali:
 *   post:
 *     summary: Membuat data Dosen Wali baru
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DosenInput'
 *     responses:
 *       201:
 *         description: Dosen wali berhasil dibuat.
 *       409:
 *         description: NIP atau Kode Dosen sudah ada.
 */
router.post(
    '/kelolaPengguna/createDosenWali',
    protect,
    authorize('admin'),
    adminController.createDosen
);

/**
 * @swagger
 * /api/admin/kelolaPengguna/deleteDosenWali/{nip}:
 *   delete:
 *     summary: Menghapus data Dosen Wali berdasarkan NIP
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nip
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dosen wali berhasil dihapus.
 *       404:
 *         description: Dosen wali tidak ditemukan.
 *       409:
 *         description: Dosen masih menjadi wali kelas.
 */
router.delete(
    '/kelolaPengguna/deleteDosenWali/:nip',
    protect,
    authorize('admin'),
    adminController.deleteDosen
);

/**
 * @swagger
 * /api/admin/kelolaPengguna/updateDosenWali/{nip}:
 *   put:
 *     summary: Memperbarui data Dosen Wali berdasarkan NIP
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nip
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DosenInput'
 *     responses:
 *       200:
 *         description: Dosen wali berhasil diperbarui.
 *       404:
 *         description: Dosen wali tidak ditemukan.
 *       409:
 *         description: Kode dosen sudah digunakan.
 */
router.put(
    '/kelolaPengguna/updateDosenWali/:nip',
    protect,
    authorize('admin'),
    adminController.updateDosen
);

// Student Management Routes - Manajemen data mahasiswa
// Student Management Routes
/**
 * @swagger
 * /api/admin/kelolaPengguna/getMahasiswa:
 *   get:
 *     summary: Mendapatkan semua data Mahasiswa
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar mahasiswa berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mahasiswa'
 */
router.get(
    '/kelolaPengguna/getMahasiswa',
    protect,
    authorize('admin'),
    adminController.getAllMahasiswa
);

/**
 * @swagger
 * /api/admin/kelolaPengguna/createMahasiswa:
 *   post:
 *     summary: Membuat data Mahasiswa baru
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MahasiswaInput'
 *     responses:
 *       201:
 *         description: Mahasiswa berhasil dibuat.
 *       409:
 *         description: NIM sudah terdaftar.
 */
router.post(
    '/kelolaPengguna/createMahasiswa',
    protect,
    authorize('admin'),
    adminController.createMahasiswa
);

/**
 * @swagger
 * /api/admin/kelolaPengguna/deleteMahasiswa/{nim}:
 *   delete:
 *     summary: Menghapus data Mahasiswa berdasarkan NIM
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nim
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mahasiswa berhasil dihapus.
 *       404:
 *         description: Mahasiswa tidak ditemukan.
 *       409:
 *         description: Mahasiswa masih memiliki data terkait.
 */
router.delete(
    '/kelolaPengguna/deleteMahasiswa/:nim',
    protect,
    authorize('admin'),
    adminController.deleteMahasiswa
);

/**
 * @swagger
 * /api/admin/kelolaPengguna/updateMahasiswa/{nim}:
 *   put:
 *     summary: Memperbarui data Mahasiswa berdasarkan NIM
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nim
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MahasiswaInput'
 *     responses:
 *       200:
 *         description: Mahasiswa berhasil diperbarui.
 *       404:
 *         description: Mahasiswa tidak ditemukan.
 */
router.put(
    '/kelolaPengguna/updateMahasiswa/:nim',
    protect,
    authorize('admin'),
    adminController.updateMahasiswaByNim
);

// Utility route untuk mengambil daftar kelas
// Utility route to get class list
/**
 * @swagger
 * /api/admin/kelolaPengguna/getAllKelas:
 *   get:
 *     summary: Mendapatkan semua daftar kelas (untuk dropdown)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kelas berhasil diambil.
 */
router.get(
    '/kelolaPengguna/getAllKelas',
    protect,
    authorize('admin'),
    adminController.getAllKelas
);

// Bulk Import Routes - Route untuk import data secara massal
// Bulk Import Routes for mass data import
/**
 * @swagger
 * /api/admin/kelolaPengguna/bulkCreateMahasiswa:
 *   post:
 *     summary: Impor massal data mahasiswa dari CSV
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File CSV dengan header nim,nama,kelas,password (password opsional).
 *     responses:
 *       200:
 *         description: Proses impor selesai.
 *       400:
 *         description: File tidak diunggah atau format CSV tidak valid.
 */
router.post(
    '/kelolaPengguna/bulkCreateMahasiswa',
    protect,
    authorize('admin'),
    csvUpload.single('file'), // Middleware untuk upload CSV mahasiswa
    adminController.bulkCreateMahasiswa
);

// Future bulk import untuk dosen wali (saat ini di-comment)
// Future bulk import for lecturer supervisors (currently commented)
// router.post(
//     '/kelolaPengguna/bulkCreateDosenWali',
//     protect,
//     authorize('admin'),
//     csvUpload.single('file'),
//     adminController.bulkCreateDosenWali
// );

// =======================================================
// ==         KELOLA KELAS DAN ANGKATAN ROUTES          ==
// =======================================================

// Class Management Routes - Manajemen data kelas dan assignment dosen wali
// Class Management Routes
/**
 * @swagger
 * /api/admin/kelolaKelas/getAllKelas:
 *   get:
 *     summary: Mendapatkan semua kelas dengan data dosen walinya
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kelas berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Kelas'
 */
router.get(
    '/kelolaKelas/getAllKelas',
    protect,
    authorize('admin'),
    adminController.getAllKelasforKelas
);

// Route untuk mendapatkan daftar dosen untuk dropdown
// Route to get lecturer list for dropdown
/**
 * @swagger
 * /api/admin/kelolaKelas/getDosenList:
 *   get:
 *     summary: Mendapatkan daftar dosen (untuk dropdown)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar dosen berhasil diambil.
 */
router.get(
    '/kelolaKelas/getDosenList',
    protect,
    authorize('admin'),
    adminController.getDosenList
);

/**
 * @swagger
 * /api/admin/kelolaKelas/createKelas:
 *   post:
 *     summary: Membuat kelas baru
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tahun_angkatan, kode_kelas]
 *             properties:
 *               tahun_angkatan: { type: integer }
 *               kode_kelas: { type: string }
 *               kode_dosen: { type: string, nullable: true }
 *     responses:
 *       201:
 *         description: Kelas berhasil dibuat.
 *       409:
 *         description: Kode kelas sudah ada.
 */
router.post(
    '/kelolaKelas/createKelas',
    protect,
    authorize('admin'),
    adminController.createKelas
);

/**
 * @swagger
 * /api/admin/kelolaKelas/updateKelas/{id}:
 *   put:
 *     summary: Memperbarui dosen wali untuk sebuah kelas
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kode_kelas: { type: string }
 *               kode_dosen: { type: string, nullable: true }
 *     responses:
 *       200:
 *         description: Kelas berhasil diperbarui.
 *       404:
 *         description: Kelas tidak ditemukan.
 */
router.put(
    '/kelolaKelas/updateKelas/:id',
    protect,
    authorize('admin'),
    adminController.updateKelas
);

/**
 * @swagger
 * /api/admin/kelolaKelas/deleteKelas/{id}:
 *   delete:
 *     summary: Menghapus kelas berdasarkan ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kelas berhasil dihapus.
 *       404:
 *         description: Kelas tidak ditemukan.
 *       409:
 *         description: Kelas masih memiliki mahasiswa.
 */
router.delete(
    '/kelolaKelas/deleteKelas/:id',
    protect,
    authorize('admin'),
    adminController.deleteKelas
);

// =============================================
// ==            KELOLA AKADEMIK              ==
// =============================================

// ============= KELOLA DATA NILAI =============
// Grade Management Routes - Manajemen data nilai mahasiswa
// Grade Management Routes

// Route untuk mengambil daftar mahasiswa untuk kelola akademik
// Route to get student list for academic management
/**
 * @swagger
 * /api/admin/kelolaAkademik/getAllMahasiswa:
 *   get:
 *     summary: Mendapatkan semua mahasiswa untuk manajemen akademik
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar mahasiswa berhasil diambil.
 */
router.get(
    '/kelolaAkademik/getAllMahasiswa',
    protect,
    authorize('admin'),
    adminController.getAllMahasiswaForKelolaAkademik
);

// Route untuk mengambil riwayat nilai mahasiswa berdasarkan NIM
// Route to get student grade history by NIM
/**
 * @swagger
 * /api/admin/kelolaAkademik/getGradesMahasiswa/{nim}:
 *   get:
 *     summary: Mendapatkan riwayat nilai (course history) mahasiswa
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nim
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Riwayat nilai berhasil diambil.
 */
router.get(
    '/kelolaAkademik/getGradesMahasiswa/:nim',
    protect,
    authorize('admin'),
    adminController.getCourseHistory
);

// Route untuk mengambil daftar semua mata kuliah
// Route to get all courses list
/**
 * @swagger
 * /api/admin/kelolaAkademik/getAllCourses:
 *   get:
 *     summary: Mendapatkan semua mata kuliah (untuk dropdown)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar mata kuliah berhasil diambil.
 */
router.get(
    '/kelolaAkademik/getAllCourses',
    protect,
    authorize('admin'),
    adminController.getAllCourses
);

// CRUD Operations untuk nilai mahasiswa
// CRUD Operations for student grades
/**
 * @swagger
 * /api/admin/kelolaAkademik/createGrade:
 *   post:
 *     summary: Membuat data nilai baru
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nimMahasiswa: { type: string }
 *               kodeMK: { type: string }
 *               indeksNilai: { type: string }
 *               semester: { type: string, enum: [GANJIL, GENAP, ANTARA] }
 *               tahunAjaran: { type: string, example: "2023/2024" }
 *     responses:
 *       201:
 *         description: Data nilai berhasil dibuat.
 *       400:
 *         description: NIM atau Kode MK tidak ditemukan.
 */
router.post(
    '/kelolaAkademik/createGrade',
    protect,
    authorize('admin'),
    adminController.createNilai
);

/**
 * @swagger
 * /api/admin/kelolaAkademik/updateGrade/{id}:
 *   put:
 *     summary: Memperbarui data nilai berdasarkan ID nilai
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kodeMK: { type: string }
 *               indeksNilai: { type: string }
 *               semester: { type: string, enum: [GANJIL, GENAP, ANTARA] }
 *               tahunAjaran: { type: string, example: "2023/2024" }
 *     responses:
 *       200:
 *         description: Data nilai berhasil diperbarui.
 *       404:
 *         description: ID nilai tidak ditemukan.
 */
router.put(
    '/kelolaAkademik/updateGrade/:id',
    protect,
    authorize('admin'),
    adminController.updateNilai
);

/**
 * @swagger
 * /api/admin/kelolaAkademik/deleteGrade/{id}:
 *   delete:
 *     summary: Menghapus data nilai berdasarkan ID nilai
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Data nilai berhasil dihapus.
 *       404:
 *         description: ID nilai tidak ditemukan.
 */
router.delete(
    '/kelolaAkademik/deleteGrade/:id',
    protect,
    authorize('admin'),
    adminController.deleteNilai
);

// Bulk import untuk nilai mahasiswa dari CSV
// Bulk import for student grades from CSV
/**
 * @swagger
 * /api/admin/kelolaAkademik/bulkCreateGrades/{nim}:
 *   post:
 *     summary: Impor massal nilai mahasiswa dari CSV
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nim
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File CSV dengan header kode_mk,indeks_nilai,semester,tahun_ajaran.
 *     responses:
 *       200:
 *         description: Proses impor selesai.
 *       400:
 *         description: File tidak diunggah atau format CSV tidak valid.
 */
router.post(
    '/kelolaAkademik/bulkCreateGrades/:nim',
    protect,
    authorize('admin'),
    csvUpload.single('file'), // Middleware untuk upload CSV nilai
    adminController.bulkCreateGrades
);

// ============= KELOLA DATA PRESTASI =============
// Achievement Management Routes - Manajemen data prestasi akademik
// Achievement Management Routes
/**
 * @swagger
 * /api/admin/kelolaAkademik/getPrestasiData/{nim}:
 *   get:
 *     summary: Mendapatkan data prestasi (IPK, SKS, TAK) by NIM
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nim
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data prestasi berhasil diambil.
 */
router.get(
    '/kelolaAkademik/getPrestasiData/:nim',
    protect,
    authorize('admin'),
    adminController.getPrestasiByNIM
);

/**
 * @swagger
 * /api/admin/kelolaAkademik/createPrestasiData:
 *   post:
 *     summary: Membuat data prestasi baru
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nim: { type: string }
 *               tak: { type: number }
 *               sks_lulus: { type: integer }
 *               ipk_lulus: { type: number, format: float }
 *     responses:
 *       201:
 *         description: Data prestasi berhasil dibuat.
 *       400:
 *         description: NIM tidak ditemukan.
 */
router.post(
    '/kelolaAkademik/createPrestasiData',
    protect,
    authorize('admin'),
    adminController.createPrestasi
);

/**
 * @swagger
 * /api/admin/kelolaAkademik/updatePrestasiData/{nim}:
 *   put:
 *     summary: Memperbarui data prestasi by NIM
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nim
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tak: { type: number }
 *               sks_lulus: { type: integer }
 *               ipk_lulus: { type: number, format: float }
 *     responses:
 *       200:
 *         description: Data prestasi berhasil diperbarui.
 *       404:
 *         description: Mahasiswa tidak ditemukan.
 */
router.put(
    '/kelolaAkademik/updatePrestasiData/:nim',
    protect,
    authorize('admin'),
    adminController.updatePrestasi
);

/**
 * @swagger
 * /api/admin/kelolaAkademik/deletePrestasiData/{nim}:
 *   delete:
 *     summary: Menghapus data prestasi by NIM
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nim
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data prestasi berhasil dihapus.
 *       404:
 *         description: Mahasiswa tidak ditemukan.
 */
router.delete(
    '/kelolaAkademik/deletePrestasiData/:nim',
    protect,
    authorize('admin'),
    adminController.deletePrestasi
);

// ============= KELOLA DATA SEMESTER =============
// Semester Management Routes - Manajemen data per semester mahasiswa
// Semester Management Routes
/**
 * @swagger
 * /api/admin/kelolaAkademik/getSemesterData/{nim}:
 *   get:
 *     summary: Mendapatkan data per-semester by NIM
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nim
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data semester berhasil diambil.
 */
router.get(
    '/kelolaAkademik/getSemesterData/:nim',
    protect,
    authorize('admin'),
    adminController.getSemesterByNIM
);

/**
 * @swagger
 * /api/admin/kelolaAkademik/createSemesterData/{nim}:
 *   post:
 *     summary: Membuat data semester baru by NIM
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nim
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ip_semester: { type: number, format: float }
 *               semester: { type: integer }
 *               sks_semester: { type: integer }
 *               tahun_ajaran: { type: string, example: "2023/2024" }
 *               jenis_semester: { type: string, enum: [GANJIL, GENAP, ANTARA] }
 *     responses:
 *       201:
 *         description: Data semester berhasil dibuat.
 *       400:
 *         description: NIM tidak ditemukan.
 */
router.post(
    '/kelolaAkademik/createSemesterData/:nim',
    protect,
    authorize('admin'),
    adminController.createSemester
);

/**
 * @swagger
 * /api/admin/kelolaAkademik/updateSemesterData/{id}:
 *   put:
 *     summary: Memperbarui data semester by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ip_semester: { type: number, format: float }
 *               semester: { type: integer }
 *               sks_semester: { type: integer }
 *               tahun_ajaran: { type: string, example: "2023/2024" }
 *               jenis_semester: { type: string, enum: [GANJIL, GENAP, ANTARA] }
 *     responses:
 *       200:
 *         description: Data semester berhasil diperbarui.
 *       404:
 *         description: ID semester tidak ditemukan.
 */
router.put(
    '/kelolaAkademik/updateSemesterData/:id',
    protect,
    authorize('admin'),
    adminController.updateSemester
);

/**
 * @swagger
 * /api/admin/kelolaAkademik/deleteSemesterData/{id}:
 *   delete:
 *     summary: Menghapus data semester by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Data semester berhasil dihapus.
 *       404:
 *         description: ID semester tidak ditemukan.
 */
router.delete(
    '/kelolaAkademik/deleteSemesterData/:id',
    protect,
    authorize('admin'),
    adminController.deleteSemester
);

// =============================================
// ==           KELOLA KURIKULUM              ==
// =============================================

// Curriculum Management Routes - Manajemen kurikulum dan mata kuliah
// Curriculum Management Routes

// Route untuk mengambil mata kuliah berdasarkan kurikulum tertentu
// Route to get courses by specific curriculum
/**
 * @swagger
 * /api/admin/kelolaKurikulum/getMataKuliahByKurikulum:
 *   get:
 *     summary: Mendapatkan mata kuliah berdasarkan kurikulum
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: kurikulum
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Daftar mata kuliah berhasil diambil.
 */
router.get(
    '/kelolaKurikulum/getMataKuliahByKurikulum',
    protect,
    authorize('admin'),
    adminController.getMataKuliahByKurikulum
);

// Route untuk mengambil daftar semua kurikulum
// Route to get all curriculum list
/**
 * @swagger
 * /api/admin/kelolaKurikulum/getAllKurikulum:
 *   get:
 *     summary: Mendapatkan semua daftar kurikulum
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kurikulum berhasil diambil.
 */
router.get(
    '/kelolaKurikulum/getAllKurikulum',
    protect,
    authorize('admin'),
    adminController.getAllKurikulum
);

// Route untuk mengambil detail mata kuliah berdasarkan ID
// Route to get course details by ID
/**
 * @swagger
 * /api/admin/kelolaKurikulum/getMataKuliahById/{id}:
 *   get:
 *     summary: Mendapatkan detail mata kuliah by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Data mata kuliah berhasil diambil.
 *       404:
 *         description: Mata kuliah tidak ditemukan.
 */
router.get(
    '/kelolaKurikulum/getMataKuliahById/:id',
    protect,
    authorize('admin'),
    adminController.getMataKuliahById
);

// CRUD Operations untuk mata kuliah
// CRUD Operations for courses
/**
 * @swagger
 * /api/admin/kelolaKurikulum/createNewMataKuliah:
 *   post:
 *     summary: Membuat mata kuliah baru
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MataKuliah'
 *     responses:
 *       201:
 *         description: Mata kuliah berhasil dibuat.
 *       409:
 *         description: Kode MK sudah ada di kurikulum ini.
 */
router.post(
    '/kelolaKurikulum/createNewMataKuliah',
    protect,
    authorize('admin'),
    adminController.createMataKuliah
);

/**
 * @swagger
 * /api/admin/kelolaKurikulum/updateMataKuliah/{id}:
 *   put:
 *     summary: Memperbarui mata kuliah by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MataKuliah'
 *     responses:
 *       200:
 *         description: Mata kuliah berhasil diperbarui.
 *       404:
 *         description: Mata kuliah tidak ditemukan.
 *       409:
 *         description: Kode MK sudah ada di kurikulum ini.
 */
router.put(
    '/kelolaKurikulum/updateMataKuliah/:id',
    protect,
    authorize('admin'),
    adminController.updateMataKuliah
);

/**
 * @swagger
 * /api/admin/kelolaKurikulum/deleteMataKuliah/{id}:
 *   delete:
 *     summary: Menghapus mata kuliah by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mata kuliah berhasil dihapus.
 *       404:
 *         description: Mata kuliah tidak ditemukan.
 */
router.delete(
    '/kelolaKurikulum/deleteMataKuliah/:id',
    protect,
    authorize('admin'),
    adminController.deleteMataKuliah
);

// Route untuk mengambil opsi ekuivalensi mata kuliah
// Route to get course equivalency options
/**
 * @swagger
 * /api/admin/kelolaKurikulum/getEkuivalensiOptions/{kurikulum}:
 *   get:
 *     summary: Mendapatkan opsi ekuivalensi untuk mata kuliah
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kurikulum
 *         required: true
 *         schema:
 *           type: integer
 *         description: Kurikulum saat ini, untuk mencari MK dari kurikulum lebih lama.
 *     responses:
 *       200:
 *         description: Opsi ekuivalensi berhasil diambil.
 */
router.get(
    '/kelolaKurikulum/getEkuivalensiOptions/:kurikulum',
    protect,
    authorize('admin'),
    adminController.getEkuivalensiOptions
);

// Route untuk mengambil daftar kelompok keahlian
// Route to get expertise group list
/**
 * @swagger
 * /api/admin/kelolaKurikulum/getAllKelompokKeahlian:
 *   get:
 *     summary: Mendapatkan semua kelompok keahlian
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kelompok keahlian berhasil diambil.
 */
router.get(
    '/kelolaKurikulum/getAllKelompokKeahlian',
    protect,
    authorize('admin'),
    adminController.getKelompokKeahlianList
);

// =============================================
// ==                LOGGING                  ==
// =============================================

// Activity Logging Routes - Route untuk audit trail dan monitoring
// Activity Logging Routes for audit trail and monitoring

/**
 * @swagger
 * /api/admin/logAktivitasAdmin:
 *   get:
 *     summary: Mendapatkan semua log aktivitas admin
 *     tags: [Admin - Logging]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar log berhasil diambil.
 * 
 * @desc    Endpoint untuk mengambil semua log aktivitas admin
 * @route   GET /api/admin/logAktivitasAdmin
 * @access  Private (Admin only)
*/
router.get(
    '/logAktivitasAdmin',
    protect,
    authorize('admin'),
    logController.getAllLogs
);

module.exports = router;