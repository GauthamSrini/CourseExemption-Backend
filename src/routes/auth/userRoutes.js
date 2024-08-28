// routes/userRoutes.js
const express = require('express');
const ensureAuthenticated = require('../../middleware/authMiddleware');
const {
  refreshToken,
  getUserData,
  getRolesAndResources,
} = require('../../controllers/login/userController');

const router = express.Router();

router.post('/api/token/refresh', refreshToken);
router.get('/api/user-data', ensureAuthenticated, getUserData);
router.get('/api/roles-resources', ensureAuthenticated, getRolesAndResources);

module.exports = router;
