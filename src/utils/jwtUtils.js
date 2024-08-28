
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Generate JWT token with 1 hour expiration
const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '8h' });
};

// Generate Refresh Token with 7 days expiration
const generateRefreshToken = (user) => {
  return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
};

// Verify JWT Token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};

// Verify Refresh Token
const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
