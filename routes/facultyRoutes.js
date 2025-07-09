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

/**
 * @swagger
 * components:
 *   schemas:
 *     StudentSupervision:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         nim:
 *           type: string
 *         kelas:
 *           type: string
 *         ipk:
 *           type: number
 *         sks:
 *           type: integer
 *         semester:
 *           type: integer
 *         tak:
 *           type: integer
 *         status:
 *           type: string
 *           description: Hasil prediksi status mahasiswa.
 *         skor_psikologi:
 *           type: number
 *         status_fin:
 *           type: integer
 *           description: Status finansial (0=aman, 1=bermasalah).
 *         details:
 *           type: object
 *           properties:
 *             akademik:
 *               type: string
 *             psikologis:
 *               type: string
 *             finansial:
 *               type: string
 *     KeluhanMahasiswa:
 *       type: object
 *       properties:
 *         id_keluhan:
 *           type: integer
 *         nim:
 *           type: string
 *         nama:
 *           type: string
 *         kelas:
 *           type: string
 *         title_keluhan:
 *           type: string
 *         tanggal_keluhan:
 *           type: string
 *           format: date-time
 *         has_response:
 *           type: boolean
 *         status:
 *           type: string
 *           enum: [Sudah Direspon, Menunggu Respon]
 */

// =============================================
// ==           MY STUDENTS ROUTES             ==
// =============================================

/**
 * @swagger
 * /api/faculty/listMahasiswa:
 *   get:
 *     summary: Mendapatkan daftar mahasiswa bimbingan
 *     tags: [Dosen Wali]
 *     security:
 *       - bearerAuth: []
 *     description: Mengambil semua mahasiswa yang berada di bawah perwalian dosen yang sedang login.
 *     responses:
 *       200:
 *         description: Daftar mahasiswa berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StudentSupervision'
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
 * @swagger
 * /api/faculty/analisisPsikologi/{nim}:
 *   get:
 *     summary: Mendapatkan analisis psikologi mahasiswa
 *     tags: [Dosen Wali]
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
 *         description: Hasil kuesioner psikologi berhasil diambil.
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
 * @swagger
 * /api/faculty/analisisFinansial/{nim}:
 *   get:
 *     summary: Mendapatkan riwayat pengajuan finansial mahasiswa
 *     tags: [Dosen Wali]
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
 *         description: Data finansial mahasiswa berhasil diambil.
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
 * @swagger
 * /api/faculty/takipksksMahasiswa:
 *   get:
 *     summary: Mendapatkan detail akademik lengkap mahasiswa
 *     tags: [Dosen Wali]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nim
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data akademik lengkap berhasil diambil.
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
 * /api/faculty/MyStudentDetailNilaiMK/{nim}:
 *   get:
 *     summary: Mendapatkan riwayat nilai mata kuliah mahasiswa
 *     tags: [Dosen Wali]
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
 * @desc    Endpoint untuk detail nilai mata kuliah mahasiswa
 * @route   GET /api/faculty/MyStudentDetailNilaiMK/:nim
 * @access  Private (dosen_wali only)
 * @swagger
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
 * @swagger
 * /api/faculty/courseAdvisor/classesAndStudents:
 *   get:
 *     summary: Mendapatkan daftar kelas dan mahasiswa yang diampu
 *     tags: [Dosen Wali]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data kelas dan mahasiswa berhasil diambil.
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
 * @swagger
 * /api/faculty/courseAdvisor/courseHistory:
 *   get:
 *     summary: Mendapatkan riwayat MK mahasiswa untuk bimbingan
 *     tags: [Dosen Wali]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nim
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Riwayat mata kuliah berhasil diambil.
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
 * @swagger
 * /api/faculty/courseAdvisor/mataKuliahAvail:
 *   get:
 *     summary: Mendapatkan daftar mata kuliah yang tersedia untuk direkomendasikan
 *     tags: [Dosen Wali]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar mata kuliah tersedia berhasil diambil.
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
 * @swagger
 * /api/faculty/courseAdvisor/sendRekomendasiMK:
 *   post:
 *     summary: Mengirimkan rekomendasi mata kuliah untuk mahasiswa
 *     tags: [Dosen Wali]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nim:
 *                 type: string
 *               courseCodes:
 *                 type: array
 *                 items:
 *                   type: string
 *               targetSemester:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Rekomendasi berhasil disimpan.
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
 * @swagger
 * /api/faculty/courseAdvisor/getRecommendedMK:
 *   get:
 *     summary: Mendapatkan MK yang telah direkomendasikan untuk seorang mahasiswa
 *     tags: [Dosen Wali]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nim
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data rekomendasi berhasil diambil.
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
 * @swagger
 * /api/faculty/courseAdvisor/getLastIPSemester:
 *   get:
 *     summary: Mendapatkan IP semester terakhir mahasiswa untuk menentukan SKS maks
 *     tags: [Dosen Wali]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nim
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data IP semester berhasil diambil.
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
 * @swagger
 * /api/faculty/getStudentNimSKS:
 *   get:
 *     summary: Mendapatkan total SKS lulus mahasiswa
 *     tags: [Dosen Wali]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nim
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data SKS berhasil diambil.
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
 * @swagger
 * /api/faculty/keluhanMahasiswa:
 *   get:
 *     summary: Mendapatkan daftar keluhan dari mahasiswa bimbingan
 *     tags: [Dosen Wali]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar keluhan berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/KeluhanMahasiswa'
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
 * @swagger
 * /api/faculty/keluhanMahasiswa/{id}:
 *   get:
 *     summary: Mendapatkan detail keluhan mahasiswa
 *     tags: [Dosen Wali]
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
 *         description: Detail keluhan berhasil diambil.
 *       404:
 *         description: Keluhan tidak ditemukan.
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
 * @swagger
 * /api/faculty/responseDosenWali:
 *   get:
 *     summary: Mendapatkan riwayat respons yang telah diberikan dosen
 *     tags: [Dosen Wali]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: feedbackId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan ID feedback/keluhan tertentu.
 *     responses:
 *       200:
 *         description: Daftar respons berhasil diambil.
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
 * @swagger
 * /api/faculty/sendResponDosWal:
 *   post:
 *     summary: Mengirim atau memperbarui respons untuk keluhan mahasiswa
 *     tags: [Dosen Wali]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id_keluhan:
 *                 type: integer
 *               response_keluhan:
 *                 type: string
 *               status_keluhan:
 *                 type: integer
 *                 description: Status keluhan 
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File lampiran (opsional).
 *     responses:
 *       200:
 *         description: Respons berhasil dikirim atau diperbarui.
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
 * @swagger
 * /api/faculty/analisisFinansial/responseFinancial/{id}:
 *   post:
 *     summary: Memberikan persetujuan/penolakan untuk pengajuan finansial
 *     tags: [Dosen Wali]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dari pengajuan finansial.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *     responses:
 *       200:
 *         description: Respons berhasil disimpan.
 *       409:
 *         description: Respons untuk pengajuan ini sudah ada.
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
 * @swagger
 * /api/faculty/ml/test:
 *   get:
 *     summary: Menguji lingkungan eksekusi Python untuk ML
 *     tags: [Dosen Wali]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lingkungan Python siap.
 *       503:
 *         description: Lingkungan Python gagal diinisialisasi.
 * @desc    Endpoint untuk testing environment Machine Learning
 * @route   GET /api/faculty/ml/test
 * @access  Private (dosen_wali only)
 */
router.get('/ml/test', facultyController.testMLEnvironment);

/**
 * @swagger
 * /api/faculty/ml/predict/{nim}:
 *   post:
 *     summary: Memprediksi status kelulusan mahasiswa menggunakan model ML
 *     tags: [Dosen Wali]
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
 *               ipk:
 *                 type: number
 *               skor_psikologi:
 *                 type: number
 *               finansial:
 *                 type: integer
 *                 description: Status finansial (0=aman, 1=bermasalah).
 *     responses:
 *       200:
 *         description: Prediksi berhasil dan disimpan ke database.
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