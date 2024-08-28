// middleware/authMiddleware.js
const { verifyToken } = require('../utils/jwtUtils');

const ensureAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = await verifyToken(token);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(`JWT Error: ${err.message}`);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = ensureAuthenticated;
