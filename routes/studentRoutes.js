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

/**
 * @swagger
 * components:
 *   schemas:
 *     MyProgress:
 *       type: object
 *       properties:
 *         ipk:
 *           type: number
 *         sksTotal:
 *           type: integer
 *         tak:
 *           type: integer
 *         ips:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               semester:
 *                 type: integer
 *               ipSemester:
 *                 type: number
 *         klasifikasi:
 *           type: string
 *     CourseHistory:
 *       type: object
 *       properties:
 *         nama_mata_kuliah:
 *           type: string
 *         kode_mata_kuliah:
 *           type: string
 *         jenis:
 *           type: string
 *         sks:
 *           type: integer
 *         semester:
 *           type: integer
 *         nilai:
 *           type: string
 *         tahun_ajaran:
 *           type: string
 */

// =============================================
// ==            MY PROGRESS ROUTES           ==
// =============================================

/**
 * @swagger
 * /api/student/takMahasiswa:
 *   get:
 *     summary: Mendapatkan ringkasan progres akademik saya
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data progres akademik berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MyProgress'
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
 * @swagger
 * /api/student/riwayatMataKuliah:
 *   get:
 *     summary: Mendapatkan riwayat mata kuliah saya
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Riwayat mata kuliah berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseHistory'
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
 * @swagger
 * /api/student/rekomendasiMataKuliah:
 *   get:
 *     summary: Mendapatkan rekomendasi mata kuliah dari dosen wali
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rekomendasi mata kuliah berhasil diambil.
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
 * @swagger
 * /api/student/sendPeminatanMahasiswa:
 *   put:
 *     summary: Mengirim atau memperbarui pilihan peminatan/konsentrasi
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               peminatan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Peminatan berhasil diperbarui.
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
 * @swagger
 * /api/student/getAllListPeminatan:
 *   get:
 *     summary: Mendapatkan daftar semua peminatan yang tersedia
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar peminatan berhasil diambil.
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
 * @swagger
 * /api/student/getPeminatanMahasiswa:
 *   get:
 *     summary: Mendapatkan peminatan saya saat ini
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Peminatan saat ini berhasil diambil.
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
 * @swagger
 * /api/student/getPsiResult:
 *   get:
 *     summary: Mendapatkan riwayat hasil tes psikologi saya
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hasil tes berhasil diambil.
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
 * @swagger
 * /api/student/sendPsiResult:
 *   post:
 *     summary: Mengirim hasil tes psikologi (kuesioner DASS)
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skor_depression:
 *                 type: integer
 *               skor_anxiety:
 *                 type: integer
 *               skor_stress:
 *                 type: integer
 *               total_skor:
 *                 type: integer
 *               kesimpulan:
 *                 type: string
 *               saran:
 *                 type: string
 *               klasifikasi:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hasil tes berhasil disimpan.
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
 * @swagger
 * /api/student/uploadLampiranKeluhan:
 *   post:
 *     summary: Mengirim keluhan/feedback baru ke dosen wali
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title_keluhan:
 *                 type: string
 *               detail_keluhan:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File lampiran (opsional).
 *     responses:
 *       201:
 *         description: Keluhan berhasil dikirim.
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
 * @swagger
 * /api/student/myKeluhan:
 *   get:
 *     summary: Mendapatkan riwayat keluhan saya
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar keluhan berhasil diambil.
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
 * @swagger
 * /api/student/myKeluhan/{id}:
 *   get:
 *     summary: Mendapatkan detail keluhan beserta respons dosen
 *     tags: [Mahasiswa]
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
 * @swagger
 * /api/student/sendRelief:
 *   post:
 *     summary: Mengirim pengajuan keringanan biaya kuliah
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               penghasilanBulanan:
 *                 type: integer
 *               penghasilanOrangTua:
 *                 type: integer
 *               tanggunganOrangTua:
 *                 type: integer
 *               tempatTinggal:
 *                 type: string
 *               pengeluaranPerbulan:
 *                 type: integer
 *               jenisKeringanan:
 *                 type: string
 *               alasankeringanan:
 *                 type: string
 *               jumlahDiajukan:
 *                 type: integer
 *               detailAlasan:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File lampiran bukti pendukung.
 *     responses:
 *       201:
 *         description: Pengajuan berhasil dikirim.
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
 * @swagger
 * /api/student/getStudentsRelief:
 *   get:
 *     summary: Mendapatkan riwayat pengajuan keringanan biaya saya
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Riwayat pengajuan berhasil diambil.
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