const express = require('express');
const router = express.Router();

// Import controller
const facultyController = require('../controllers/facultyController');

// Import middleware authentikasi
const { protect, authorize } = require('../middlewares/authMiddleware');

// studentList.jsx route
router.get(
    '/listMahasiswa',
    protect,
    authorize('dosen_wali'),
    facultyController.getStudentList
);

module.exports = router;
