// Student Routes - Routing untuk fitur mahasiswa dalam sistem akademik
// Student Routes for student features in academic system
const express = require('express');
const router = express.Router();

// Import controller untuk operasi mahasiswa
// Import controller for student operations
const studentController = require('../controllers/studentController');

// Import middleware autentikasi dan otorisasi
// Import authentication and authorization middleware
const { protect, authorize } = require('../middlewares/authMiddleware');

// Import middleware untuk upload file
// Import middleware for file upload
const upload = require('../middlewares/uploadMiddleware');

// =============================================
// ==            MY PROGRESS ROUTES           ==
// =============================================

/**
 * @desc    Endpoint untuk data akademik mahasiswa (TAK, SKS, IPK, IPS)
 * @route   GET /api/student/takMahasiswa
 * @access  Private (mahasiswa only)
 * @fitur   FR-04 - MyProgress
 */
router.get(
    '/takMahasiswa',
    protect,
    authorize('mahasiswa'),
    studentController.getStudentsTAKSKSIPK
);

// =============================================
// ==             MY COURSE ROUTES            ==
// =============================================

/**
 * @desc    Endpoint untuk riwayat mata kuliah mahasiswa
 * @route   GET /api/student/riwayatMataKuliah
 * @access  Private (mahasiswa only)
 * @fitur   FR-05 - MyCourse
 */
router.get(
    '/riwayatMataKuliah',
    protect,
    authorize('mahasiswa'),
    studentController.getCourseHistory
);

/**
 * @desc    Endpoint untuk rekomendasi mata kuliah dari dosen wali
 * @route   GET /api/student/rekomendasiMataKuliah
 * @access  Private (mahasiswa only)
 * @fitur   FR-05 - MyCourse - Tabel rekomendasi mata kuliah
 */
router.get(
    '/rekomendasiMataKuliah',
    protect,
    authorize('mahasiswa'),
    studentController.getCourseRecommendation
);

/**
 * @desc    Endpoint untuk mengirim pilihan peminatan mahasiswa
 * @route   PUT /api/student/sendPeminatanMahasiswa
 * @access  Private (mahasiswa only)
 */
router.put(
    '/sendPeminatanMahasiswa',
    protect,
    authorize('mahasiswa'),
    studentController.sendPeminatanMahasiswa
);

/**
 * @desc    Endpoint untuk mendapatkan daftar semua peminatan
 * @route   GET /api/student/getAllListPeminatan
 * @access  Private (mahasiswa only)
 */
router.get(
    '/getAllListPeminatan',
    protect,
    authorize('mahasiswa'),
    studentController.getAllPeminatanList
);

/**
 * @desc    Endpoint untuk mendapatkan peminatan mahasiswa saat ini
 * @route   GET /api/student/getPeminatanMahasiswa
 * @access  Private (mahasiswa only)
 */
router.get(
    '/getPeminatanMahasiswa',
    protect,
    authorize('mahasiswa'),
    studentController.getStudentPeminatan
);

// =============================================
// ==           MY WELLNESS ROUTES            ==
// =============================================

/**
 * @desc    Endpoint untuk mendapatkan hasil tes psikologi mahasiswa
 * @route   GET /api/student/getPsiResult
 * @access  Private (mahasiswa only)
 * @fitur   FR-06 - MyWellness - Fetching hasil tes psikologi
 */
router.get(
    '/getPsiResult',
    protect,
    authorize('mahasiswa'),
    studentController.getPsiResults
);

/**
 * @desc    Endpoint untuk mengirim hasil tes psikologi ke database
 * @route   POST /api/student/sendPsiResult
 * @access  Private (mahasiswa only)
 * @fitur   FR-06 - MyWellness - Menyimpan hasil tes psikologi
 */
router.post(
    '/sendPsiResult',
    protect,
    authorize('mahasiswa'),
    studentController.sendPsiResult
);

// =============================================
// ==           MY FEEDBACK ROUTES            ==
// =============================================

/**
 * @desc    Endpoint untuk upload keluhan dengan lampiran file
 * @route   POST /api/student/uploadLampiranKeluhan
 * @access  Private (mahasiswa only)
 * @fitur   FR-08 - MyFeedback - Upload Files to GCP
 */
router.post(
    '/uploadLampiranKeluhan',
    protect,
    authorize('mahasiswa'),
    upload.single('file'), // Middleware untuk upload file lampiran
    studentController.uploadLampiranKeluhan
);

/**
 * @desc    Endpoint untuk mendapatkan daftar keluhan mahasiswa
 * @route   GET /api/student/myKeluhan
 * @access  Private (mahasiswa only)
 * @fitur   FR-08 - MyFeedback - List keluhan mahasiswa
 */
router.get(
    '/myKeluhan',
    protect,
    authorize('mahasiswa'),
    studentController.getMyKeluhan
);

/**
 * @desc    Endpoint untuk mendapatkan detail keluhan berdasarkan ID
 * @route   GET /api/student/myKeluhan/:id
 * @access  Private (mahasiswa only)
 * @fitur   FR-08 - MyFeedback - Detail keluhan dan respons
 */
router.get(
    '/myKeluhan/:id',
    protect,
    authorize('mahasiswa'),
    studentController.getKeluhanDetail
);

// =============================================
// ==            MY FINANCE ROUTES            ==
// =============================================

/**
 * @desc    Endpoint untuk mengirim pengajuan keringanan biaya kuliah
 * @route   POST /api/student/sendRelief
 * @access  Private (mahasiswa only)
 * @fitur   FR-07 - MyFinance - Pengajuan keringanan biaya
 */
router.post(
    '/sendRelief',
    protect,
    authorize('mahasiswa'),
    upload.single('file'), // Middleware untuk upload file lampiran finansial
    studentController.sendRelief
);

/**
 * @desc    Endpoint untuk mendapatkan riwayat pengajuan keringanan biaya
 * @route   GET /api/student/getStudentsRelief
 * @access  Private (mahasiswa only)
 * @fitur   FR-07 - MyFinance - Riwayat pengajuan keringanan
 */
router.get(
    '/getStudentsRelief',
    protect,
    authorize('mahasiswa'),
    studentController.getStudentsRelief
);

module.exports = router;
