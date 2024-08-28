const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require('dotenv').config();

const router = express.Router();
const sessionStore = new Map(); // In-memory session store, consider using Redis or similar for production

// Middleware setup
router.use(cookieParser());

// Utility function to generate JWT
const generateToken = (user, expiresIn) => {
  const JWT_SECRET = 'your_secret_key_here';
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment");
  }
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn });
};

// Google authentication route
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback route
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    if (req.user && req.user.id) {
      try {
        const token = generateToken(req.user, '10m'); // Token expires in 1 hour

        // Store token in session store
        sessionStore.set(req.user.id, token);

        // Set the token in a secure HTTP-only cookie
        res.cookie('authToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60*10  // 1 hour
        });

        res.redirect("http://localhost:5173/dashboard");
      } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.status(401).redirect("/");
    }
  }
);

// Middleware to check token validity
router.use((req, res, next) => {
  const token = req.cookies.authToken;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token) {
    return res.redirect("/");
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      if (decoded && decoded.userId) {
        sessionStore.delete(decoded.userId);
      }
      return res.redirect("/");
    }

    if (sessionStore.get(decoded.userId) !== token) {
      return res.redirect("/");
    }

    next();
  });
});

// Example endpoint to check authentication
router.get('/auth/check', (req, res) => {
  const token = req.cookies.authToken;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    res.status(200).json({ message: 'Authenticated', user: decoded });
  });
});

module.exports = router;


