const express = require('express');
const router = express.Router();

// Import controller
const facultyController = require('../controllers/facultyController');
// Import middleware authentikasi
const { protect, authorize } = require('../middlewares/authMiddleware');

// @desc Endpoint backend untuk fitur MyStudent List Mahasiswa
// @FR-01.1 - MyStudents-Overview
// studentList.jsx route
router.get(
    '/listMahasiswa',
    protect,
    authorize('dosen_wali'),
    facultyController.getStudentList
);

// @desc Endpoint backend untuk fitur MyReport
// FR-03.1 - MyReport - Overview
// /src/pages/lecturer/MyReport/MyReportPage.jsx || StudentDetailView.jsx || StudentListView.jsx
router.get(
    '/keluhanMahasiswa',
    protect,
    authorize('dosen_wali'),
    facultyController.getKeluhanMahasiswa
);

router.get(
    '/responseDosenWali',
    protect,
    authorize('dosen_wali'),
    facultyController.getResponDosWal
);

router.get(
    '/datamahasiswa',
    protect,
    authorize('dosen_wali')
)

router.get(
    '/takipksksMahasiswa',
    protect,
    authorize('dosen_wali'),
    facultyController.getStudentAcademicDetails
);

module.exports = router;
