const express = require('express');
const router = express.Router();

// Import controller
const facultyController = require('../controllers/facultyController');
// Import middleware authentikasi
const { protect, authorize } = require('../middlewares/authMiddleware');

// @desc    Endpoint backend untuk fitur MyStudent List Mahasiswa
// @Fitur   FR-01.1 - MyStudents-Overview
// studentList.jsx route
router.get(
    '/listMahasiswa',
    protect,
    authorize('dosen_wali'),
    facultyController.getStudentList
);

// @desc    Endpoint backend untuk fitur MyCourseAdvisor
// @fitur   FR-02 - MyCourseAdvisor-ChooseClassandStudent
// MyCourseAdvisorPage.jsx
router.get(
    '/courseAdvisor/classesAndStudents',
    protect,
    authorize('dosen_wali'),
    facultyController.getClassesAndStudents
);

// @desc    Endpoint backend untuk fitur MyCourseAdvisor
// @fitur   FR-02 - MyCourseAdvisor-riwayatMK
// MyCourseAdvisorPage.jsx
router.get(
    '/courseAdvisor/courseHistory',
    protect,
    authorize('dosen_wali'),
    facultyController.getHistoryMKMyCourseAdvisor
);

// @desc    Endpoint backend untuk fitur MyCourseAdvisor
// @fitur   FR-02 - MyCourseAdvisor-MKTersedia
// MyCourseAdvisorPage.jsx
router.get(
    '/courseAdvisor/mataKuliahAvail',
    protect,
    authorize('dosen_wali'),
    facultyController.getAvailableCourse
);

// @desc    Endpoint backend untuk fitur MyCourseAdvisor
// @fitur   FR-02 - MyCourseAdvisor - Mengirim Rekomendasi Mata Kuliah
// MyCourseAdvisorPage.jsx
router.post(
    '/courseAdvisor/sendRekomendasiMK',
    protect,
    authorize('dosen_wali'),
    facultyController.sendCourseRecommendation
);

// @desc    Endpoint backend untuk fitur MyReport
// @fitur   FR-03.1 - MyReport - Overview
// /src/pages/lecturer/MyReport/MyReportPage.jsx || StudentDetailView.jsx || StudentListView.jsx
router.get(
    '/keluhanMahasiswa',
    protect,
    authorize('dosen_wali'),
    facultyController.getKeluhanMahasiswa
);

router.get(
    '/responseDosenWali/',
    protect,
    authorize('dosen_wali'),
    facultyController.getResponDosWal
);

// Route to get detail of a specific keluhan/feedback
router.get(
    '/keluhanMahasiswa/:id',
    protect,
    authorize('dosen_wali'),
    facultyController.getKeluhanDetail
);

// Route to send/update response to student feedback
router.post(
    '/sendResponDosWal',
    protect,
    authorize('dosen_wali'),
    facultyController.sendResponDosWal
);

router.get('/datamahasiswa', protect, authorize('dosen_wali'));

router.get(
    '/takipksksMahasiswa',
    protect,
    authorize('dosen_wali'),
    facultyController.getStudentAcademicDetails
);

/**
 * @desc Endpoint backend untuk fitur MyStudents - Analisis Psikologi
 * @fitur FR-01.3 - MyStudents - WellnessAnalysis
 */

router.get(
    '/analisisPsikologi/:nim',
    protect,
    authorize('dosen_wali'),
    facultyController.getStudentWellness
);

router.get(
    '/analisisFinansial/:nim',
    protect,
    authorize('dosen_wali'),
    facultyController.getStudentFinancial
)

module.exports = router;
