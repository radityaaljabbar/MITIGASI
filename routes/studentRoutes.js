const express = require('express');
const router = express.Router();

// Import controller
const studentController = require('../controllers/studentController');
// Import middleware authentikasi
const { protect, authorize } = require('../middlewares/authMiddleware');

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
module.exports = router;
