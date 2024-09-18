const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { post_query_database, get_query_database } = require("../../../config/database_utils");

const router = express.Router();

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads/course_excemption/intern_tracker_aim_objective');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

// Define the route for serving uploaded images
router.get('/pdfs/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../../uploads/course_excemption/intern_tracker_aim_objective', filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error in Sending File:', err);
      res.status(500).json({ error: 'Error in Sending File' });
    }
  });
});

// Define the route for the POST API endpoint for internship tracker applications
router.post("/internshipTrackerApply", upload.fields([
  { name: 'AimObjective', maxCount: 1 },
]), async (req, res) => {
  try {

    const AimObjective = req.files['AimObjective'] ? req.files['AimObjective'][0].filename : null;

    const query = `
      INSERT INTO ce_intern_registered
      (student, academic_year, semester,  mode, industry, start_date, end_date, duration, aim_objective_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      req.body.student || null,
      req.body.academic_year || null,
      req.body.semester || null,
      req.body.mode || null,
      req.body.Industry || null,
      req.body.StartDate || null,
      req.body.EndDate || null,
      req.body.duration || null,
      AimObjective
    ];
        await post_query_database(query, values);
        res.status(200).json({ status: 'Success' });

  } catch (error) {
    console.error('Error in Insert query:', error);
    res.status(500).json({ error: 'Error in Insert query' });
  }
});

module.exports = router;
