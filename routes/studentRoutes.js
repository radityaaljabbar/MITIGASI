const express = require('express');
const router = express.Router();

// Import controller
const studentController = require('../controllers/studentController');
// Import middleware authentikasi
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

/**
 * @desc Endpoint backend untuk fitur MyProgress - TAK
 * FR-04 - MyProgress
 * MyProgress.jsx frontend page
 */
router.get(
    '/takMahasiswa',
    protect,
    authorize('mahasiswa'),
    studentController.getStudentsTAKSKSIPK
);

/**
 * @desc Endpoint backend untuk fitur MyCourse
 * @FR-05 - MyCourse
 * RiwayatMataKuliah.jsx frontend component
 */
router.get(
    '/riwayatMataKuliah',
    protect,
    authorize('mahasiswa'),
    studentController.getCourseHistory
);

/**
 * @desc Endpoint backend untuk fitur MyCourse
 * @FR-05 - MyCourse - Tabel rekomendasi mata kuliah
 * RekomendasiMataKuliah.jsx frontend component
 */
router.get(
    '/rekomendasiMataKuliah',
    protect,
    authorize('mahasiswa'),
    studentController.getCourseRecommendation
);

router.put(
    '/sendPeminatanMahasiswa',
    protect,
    authorize('mahasiswa'),
    studentController.sendPeminatanMahasiswa
)

router.get(
    '/getAllListPeminatan',
    protect,
    authorize('mahasiswa'),
    studentController.getAllPeminatanList
);

// Endpoint backend untuk fitur MyCourse - Ambil peminatan
router.get(
    '/getPeminatanMahasiswa',
    protect,
    authorize('mahasiswa'),
    studentController.getStudentPeminatan
);

/**
 * @desc Endpoint backend untuk fitur MyWellness
 * @FR-05 - MyWellness - Fetching all nim list from result
 * MyWellnessPage.jsx frontend component
 */
router.get(
    '/getPsiResult',
    protect,
    authorize('mahasiswa'),
    studentController.getPsiResults
);

/**
 * @desck Endpoint backend untuk fitur MyWellness
 * FR-05 - MyWellness - Sending / Mengirim hasil tes mahasiswa untuk disimpan di database
 */
router.post(
    '/sendPsiResult',
    protect,
    authorize('mahasiswa'),
    studentController.sendPsiResult
);

/**
 * @desc Endpoint backend untuk fitur MyFeedback
 * FR-08 - MyFeedback - Upload Files to gcp
 */
router.post(
    '/uploadLampiranKeluhan',
    protect,
    authorize('mahasiswa'),
    upload.single('file'),
    studentController.uploadLampiranKeluhan
);

/**
 * @desc Endpoint backend untuk fitur MyFeedback
 * FR-08 - MyFeedback - Ambil list keluhan mahasiswa in session / logged in
 */
router.get(
    '/myKeluhan',
    protect,
    authorize('mahasiswa'),
    studentController.getMyKeluhan
);

/**
 * @desc Endpoint backend untuk fitur MyFeedback
 * FR-08 - MyFeedback - Ambil detail keluhan berdasarkan ID
 */
router.get(
    '/myKeluhan/:id',
    protect,
    authorize('mahasiswa'),
    studentController.getKeluhanDetail
);

/**
 * @desck Endpoint backend untuk fitur MyWellness
 * FR-07 - MyFinance - Sending / Mengirim jawaban formulir keringanan biaya kuliah mahasiswa untuk disimpan di database
 */
router.post(
    '/sendRelief',
    protect,
    authorize('mahasiswa'),
    studentController.sendRelief
);

/**
 * @desck Endpoint backend untuk fitur MyWellness
 * FR-07 - MyFinance - fetching / Menangkap jawaban formulir keringanan biaya kuliah mahasiswa untuk disimpan di database
 */
router.get(
    '/getStudentsRelief',
    protect,
    authorize('mahasiswa'),
    studentController.getStudentsRelief
);


module.exports = router;
