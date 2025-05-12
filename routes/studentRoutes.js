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
    studentController.getStudentsTAK
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

module.exports = router;
