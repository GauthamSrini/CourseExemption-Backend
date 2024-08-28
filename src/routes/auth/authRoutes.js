// routes/authRoutes.js
const express = require('express');
const { googleAuth, googleCallback } = require('../../controllers/login/authController');

const router = express.Router();

router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleCallback);

module.exports = router;
