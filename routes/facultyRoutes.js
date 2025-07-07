// Faculty Routes - Routing untuk fitur dosen wali dalam sistem akademik
// Faculty Routes for lecturer supervisor features in academic system
const express = require('express');
const router = express.Router();

// Import controller untuk operasi dosen wali
// Import controller for faculty operations
const facultyController = require('../controllers/facultyController');

// Import middleware autentikasi dan otorisasi
// Import authentication and authorization middleware
const { protect, authorize } = require('../middlewares/authMiddleware');

// Import middleware untuk upload file
// Import middleware for file upload
const upload = require('../middlewares/uploadMiddleware');

// =============================================
// ==           MY STUDENTS ROUTES             ==
// =============================================

/**
 * @desc    Endpoint untuk daftar mahasiswa bimbingan
 * @route   GET /api/faculty/listMahasiswa
 * @access  Private (dosen_wali only)
 * @fitur   FR-01.1 - MyStudents-Overview
 */
router.get(
    '/listMahasiswa',
    protect,
    authorize('dosen_wali'),
    facultyController.getStudentList
);

/**
 * @desc    Endpoint untuk analisis psikologi mahasiswa
 * @route   GET /api/faculty/analisisPsikologi/:nim
 * @access  Private (dosen_wali only)
 * @fitur   FR-01.3 - MyStudents - WellnessAnalysis
 */
router.get(
    '/analisisPsikologi/:nim',
    protect,
    authorize('dosen_wali'),
    facultyController.getStudentWellness
);

/**
 * @desc    Endpoint untuk analisis finansial mahasiswa
 * @route   GET /api/faculty/analisisFinansial/:nim
 * @access  Private (dosen_wali only)
 */
router.get(
    '/analisisFinansial/:nim',
    protect,
    authorize('dosen_wali'),
    facultyController.getStudentFinancial
);

/**
 * @desc    Endpoint untuk detail akademik mahasiswa (TAK, IPK, SKS)
 * @route   GET /api/faculty/takipksksMahasiswa
 * @access  Private (dosen_wali only)
 */
router.get(
    '/takipksksMahasiswa',
    protect,
    authorize('dosen_wali'),
    facultyController.getStudentAcademicDetails
);

/**
 * @desc    Endpoint untuk detail nilai mata kuliah mahasiswa
 * @route   GET /api/faculty/MyStudentDetailNilaiMK/:nim
 * @access  Private (dosen_wali only)
 */
router.get(
    '/MyStudentDetailNilaiMK/:nim',
    protect,
    authorize('dosen_wali'),
    facultyController.getHistoryMKMyCourseAdvisor
);

// =============================================
// ==         MY COURSE ADVISOR ROUTES        ==
// =============================================

/**
 * @desc    Endpoint untuk daftar kelas dan mahasiswa yang diampu
 * @route   GET /api/faculty/courseAdvisor/classesAndStudents
 * @access  Private (dosen_wali only)
 * @fitur   FR-02 - MyCourseAdvisor-ChooseClassandStudent
 */
router.get(
    '/courseAdvisor/classesAndStudents',
    protect,
    authorize('dosen_wali'),
    facultyController.getClassesAndStudents
);

/**
 * @desc    Endpoint untuk riwayat mata kuliah mahasiswa
 * @route   GET /api/faculty/courseAdvisor/courseHistory
 * @access  Private (dosen_wali only)
 * @fitur   FR-02 - MyCourseAdvisor-riwayatMK
 */
router.get(
    '/courseAdvisor/courseHistory',
    protect,
    authorize('dosen_wali'),
    facultyController.getHistoryMKMyCourseAdvisor
);

/**
 * @desc    Endpoint untuk mata kuliah yang tersedia
 * @route   GET /api/faculty/courseAdvisor/mataKuliahAvail
 * @access  Private (dosen_wali only)
 * @fitur   FR-02 - MyCourseAdvisor-MKTersedia
 */
router.get(
    '/courseAdvisor/mataKuliahAvail',
    protect,
    authorize('dosen_wali'),
    facultyController.getAvailableCourse
);

/**
 * @desc    Endpoint untuk mengirim rekomendasi mata kuliah
 * @route   POST /api/faculty/courseAdvisor/sendRekomendasiMK
 * @access  Private (dosen_wali only)
 * @fitur   FR-02 - MyCourseAdvisor - Mengirim Rekomendasi MK
 */
router.post(
    '/courseAdvisor/sendRekomendasiMK',
    protect,
    authorize('dosen_wali'),
    facultyController.sendCourseRecommendation
);

/**
 * @desc    Endpoint untuk mendapatkan mata kuliah yang sudah direkomendasikan
 * @route   GET /api/faculty/courseAdvisor/getRecommendedMK
 * @access  Private (dosen_wali only)
 */
router.get(
    '/courseAdvisor/getRecommendedMK',
    protect,
    authorize('dosen_wali'),
    facultyController.getRecommendedCourses
);

/**
 * @desc    Endpoint untuk mendapatkan IP semester terakhir mahasiswa
 * @route   GET /api/faculty/courseAdvisor/getLastIPSemester
 * @access  Private (dosen_wali only)
 */
router.get(
    '/courseAdvisor/getLastIPSemester',
    protect,
    authorize('dosen_wali'),
    facultyController.getLastIPSemester
);

/**
 * @desc    Endpoint untuk mendapatkan data SKS mahasiswa
 * @route   GET /api/faculty/getStudentNimSKS
 * @access  Private (dosen_wali only)
 */
router.get(
    '/getStudentNimSKS',
    protect,
    authorize('dosen_wali'),
    facultyController.getStudentNIMSKS
);

// =============================================
// ==            MY REPORT ROUTES             ==
// =============================================

/**
 * @desc    Endpoint untuk daftar keluhan mahasiswa
 * @route   GET /api/faculty/keluhanMahasiswa
 * @access  Private (dosen_wali only)
 * @fitur   FR-03.1 - MyReport - Overview
 */
router.get(
    '/keluhanMahasiswa',
    protect,
    authorize('dosen_wali'),
    facultyController.getKeluhanMahasiswa
);

/**
 * @desc    Endpoint untuk detail keluhan mahasiswa
 * @route   GET /api/faculty/keluhanMahasiswa/:id
 * @access  Private (dosen_wali only)
 */
router.get(
    '/keluhanMahasiswa/:id',
    protect,
    authorize('dosen_wali'),
    facultyController.getKeluhanDetail
);

/**
 * @desc    Endpoint untuk respons dosen wali terhadap keluhan
 * @route   GET /api/faculty/responseDosenWali
 * @access  Private (dosen_wali only)
 */
router.get(
    '/responseDosenWali/',
    protect,
    authorize('dosen_wali'),
    facultyController.getResponDosWal
);

/**
 * @desc    Endpoint untuk mengirim respons dengan lampiran file
 * @route   POST /api/faculty/sendResponDosWal
 * @access  Private (dosen_wali only)
 */
router.post(
    '/sendResponDosWal',
    protect,
    authorize('dosen_wali'),
    upload.single('file'), // Middleware untuk upload file lampiran
    facultyController.sendResponDosWal
);

// =============================================
// ==         FINANCIAL ANALYSIS ROUTES       ==
// =============================================

/**
 * @desc    Endpoint untuk respons pengajuan finansial mahasiswa
 * @route   POST /api/faculty/analisisFinansial/responseFinancial/:id
 * @access  Private (dosen_wali only)
 */
router.post(
    '/analisisFinansial/responseFinancial/:id',
    protect,
    authorize('dosen_wali'),
    facultyController.sendResponseFinancial
);

// =============================================
// ==       MACHINE LEARNING ROUTES           ==
// =============================================

/**
 * @desc    Endpoint untuk testing environment Machine Learning
 * @route   GET /api/faculty/ml/test
 * @access  Private (dosen_wali only)
 */
router.get('/ml/test', facultyController.testMLEnvironment);

/**
 * @desc    Endpoint untuk prediksi status mahasiswa menggunakan ML
 * @route   POST /api/faculty/ml/predict/:nim
 * @access  Private (dosen_wali only)
 */
router.post(
    '/ml/predict/:nim',
    protect,
    authorize('dosen_wali'),
    facultyController.predictStudentByNim
);

// =============================================
// ==            FUTURE ROUTES                ==
// =============================================

// Route placeholder untuk pengembangan masa depan
// Placeholder route for future development
router.get('/datamahasiswa', protect, authorize('dosen_wali'));

module.exports = router;
