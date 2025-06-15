const express = require('express');
const router = express.Router();

// Import controller
const adminController = require('../controllers/adminController');
// Import middleware authentikasi
const { protect, authorize } = require('../middlewares/authMiddleware');

// @desc    Endpoint backend untuk ...
router.get('/contoh', protect, authorize('admin'), () => {});

module.exports = router;
