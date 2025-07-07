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

// Contoh endpoint untuk testing (dapat dihapus di production)
// Example endpoint for testing (can be removed in production)
router.get('/contoh', protect, authorize('admin'), () => {});

// =============================================
// ==         KELOLA PENGGUNA ROUTES          ==
// =============================================

// Admin Management Routes - Manajemen data admin
// Admin Management Routes
router.get(
    '/kelolaPengguna/getAdmin',
    protect,
    authorize('admin'),
    adminController.getAllAdmins
);

router.post(
    '/kelolaPengguna/createAdmin',
    protect,
    authorize('admin'),
    adminController.createAdmin
);

router.delete(
    '/kelolaPengguna/deleteAdmin/:id',
    protect,
    authorize('admin'),
    adminController.deleteAdmin
);

router.put(
    '/kelolaPengguna/updateAdmin/:id',
    protect,
    authorize('admin'),
    adminController.updateAdmin
);

// Lecturer Supervisor Management Routes - Manajemen data dosen wali
// Lecturer Supervisor Management Routes
router.get(
    '/kelolaPengguna/getDosenWali',
    protect,
    authorize('admin'),
    adminController.getAllDosen
);

router.post(
    '/kelolaPengguna/createDosenWali',
    protect,
    authorize('admin'),
    adminController.createDosen
);

router.delete(
    '/kelolaPengguna/deleteDosenWali/:nip',
    protect,
    authorize('admin'),
    adminController.deleteDosen
);

router.put(
    '/kelolaPengguna/updateDosenWali/:nip',
    protect,
    authorize('admin'),
    adminController.updateDosen
);

// Student Management Routes - Manajemen data mahasiswa
// Student Management Routes
router.get(
    '/kelolaPengguna/getMahasiswa',
    protect,
    authorize('admin'),
    adminController.getAllMahasiswa
);

router.post(
    '/kelolaPengguna/createMahasiswa',
    protect,
    authorize('admin'),
    adminController.createMahasiswa
);

router.delete(
    '/kelolaPengguna/deleteMahasiswa/:nim',
    protect,
    authorize('admin'),
    adminController.deleteMahasiswa
);

router.put(
    '/kelolaPengguna/updateMahasiswa/:nim',
    protect,
    authorize('admin'),
    adminController.updateMahasiswaByNim
);

// Utility route untuk mengambil daftar kelas
// Utility route to get class list
router.get(
    '/kelolaPengguna/getAllKelas',
    protect,
    authorize('admin'),
    adminController.getAllKelas
);

// Bulk Import Routes - Route untuk import data secara massal
// Bulk Import Routes for mass data import
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
router.get(
    '/kelolaKelas/getAllKelas',
    protect,
    authorize('admin'),
    adminController.getAllKelasforKelas
);

// Route untuk mendapatkan daftar dosen untuk dropdown
// Route to get lecturer list for dropdown
router.get(
    '/kelolaKelas/getDosenList',
    protect,
    authorize('admin'),
    adminController.getDosenList
);

router.post(
    '/kelolaKelas/createKelas',
    protect,
    authorize('admin'),
    adminController.createKelas
);

router.put(
    '/kelolaKelas/updateKelas/:id',
    protect,
    authorize('admin'),
    adminController.updateKelas
);

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
router.get(
    '/kelolaAkademik/getAllMahasiswa',
    protect,
    authorize('admin'),
    adminController.getAllMahasiswaForKelolaAkademik
);

// Route untuk mengambil riwayat nilai mahasiswa berdasarkan NIM
// Route to get student grade history by NIM
router.get(
    '/kelolaAkademik/getGradesMahasiswa/:nim',
    protect,
    authorize('admin'),
    adminController.getCourseHistory
);

// Route untuk mengambil daftar semua mata kuliah
// Route to get all courses list
router.get(
    '/kelolaAkademik/getAllCourses',
    protect,
    authorize('admin'),
    adminController.getAllCourses
);

// CRUD Operations untuk nilai mahasiswa
// CRUD Operations for student grades
router.post(
    '/kelolaAkademik/createGrade',
    protect,
    authorize('admin'),
    adminController.createNilai
);

router.put(
    '/kelolaAkademik/updateGrade/:id',
    protect,
    authorize('admin'),
    adminController.updateNilai
);

router.delete(
    '/kelolaAkademik/deleteGrade/:id',
    protect,
    authorize('admin'),
    adminController.deleteNilai
);

// Bulk import untuk nilai mahasiswa dari CSV
// Bulk import for student grades from CSV
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

router.get(
    '/kelolaAkademik/getPrestasiData/:nim',
    protect,
    authorize('admin'),
    adminController.getPrestasiByNIM
);

router.post(
    '/kelolaAkademik/createPrestasiData',
    protect,
    authorize('admin'),
    adminController.createPrestasi
);

router.put(
    '/kelolaAkademik/updatePrestasiData/:nim',
    protect,
    authorize('admin'),
    adminController.updatePrestasi
);

router.delete(
    '/kelolaAkademik/deletePrestasiData/:nim',
    protect,
    authorize('admin'),
    adminController.deletePrestasi
);

// ============= KELOLA DATA SEMESTER =============
// Semester Management Routes - Manajemen data per semester mahasiswa
// Semester Management Routes

router.get(
    '/kelolaAkademik/getSemesterData/:nim',
    protect,
    authorize('admin'),
    adminController.getSemesterByNIM
);

router.post(
    '/kelolaAkademik/createSemesterData/:nim',
    protect,
    authorize('admin'),
    adminController.createSemester
);

router.put(
    '/kelolaAkademik/updateSemesterData/:id',
    protect,
    authorize('admin'),
    adminController.updateSemester
);

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
router.get(
    '/kelolaKurikulum/getMataKuliahByKurikulum',
    protect,
    authorize('admin'),
    adminController.getMataKuliahByKurikulum
);

// Route untuk mengambil daftar semua kurikulum
// Route to get all curriculum list
router.get(
    '/kelolaKurikulum/getAllKurikulum',
    protect,
    authorize('admin'),
    adminController.getAllKurikulum
);

// Route untuk mengambil detail mata kuliah berdasarkan ID
// Route to get course details by ID
router.get(
    '/kelolaKurikulum/getMataKuliahById/:id',
    protect,
    authorize('admin'),
    adminController.getMataKuliahById
);

// CRUD Operations untuk mata kuliah
// CRUD Operations for courses
router.post(
    '/kelolaKurikulum/createNewMataKuliah',
    protect,
    authorize('admin'),
    adminController.createMataKuliah
);

router.put(
    '/kelolaKurikulum/updateMataKuliah/:id',
    protect,
    authorize('admin'),
    adminController.updateMataKuliah
);

router.delete(
    '/kelolaKurikulum/deleteMataKuliah/:id',
    protect,
    authorize('admin'),
    adminController.deleteMataKuliah
);

// Route untuk mengambil opsi ekuivalensi mata kuliah
// Route to get course equivalency options
router.get(
    '/kelolaKurikulum/getEkuivalensiOptions/:kurikulum',
    protect,
    authorize('admin'),
    adminController.getEkuivalensiOptions
);

// Route untuk mengambil daftar kelompok keahlian
// Route to get expertise group list
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
