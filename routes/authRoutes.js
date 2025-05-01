const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');

// Import middleware
const { protect } = require('../middlewares/authMiddleware');

// Login route
router.post('/login', authController.login);

// Get current user
router.get('/me', protect, authController.getMe);

// Logout route
router.get('/logout', protect, authController.logout);

module.exports = router;
