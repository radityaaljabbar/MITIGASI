const express = require('express')
const router = express.Router();
const {pool} = require('../config/database')
const response = require('../utils/response')
const { protect, authorize } = require('../middlewares/authMiddleware');
const getDoswal = require('../controllers/responseDosenWaliController')

router.get('/keluhanMahasiswa', protect, authorize('dosen_wali'), getDoswal.getKeluhanMahasiswa)

router.get('/responseDosenWali',protect, authorize('dosen_wali'), getDoswal.getResponDosWal)

module.exports = router;

