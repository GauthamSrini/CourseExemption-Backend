const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { post_query_database, get_query_database } = require("../../../config/database_utils");

const router = express.Router();

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads/course_excemption/intern_certificates');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

// Define the route for serving uploaded images
router.get('/pdfs/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../../uploads/course_excemption/intern_certificates', filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error in Sending File:', err);
      res.status(500).json({ error: 'Error in Sending File' });
    }
  });
});

// Define the route for the POST API endpoint for internship applications
router.post("/internshipApply", upload.fields([
  { name: 'certificateFile', maxCount: 1 },
  { name: 'reportFile', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Received Body:', req.body);
    console.log('Received Files:', req.files);

    const certificateFile = req.files['certificateFile'] ? req.files['certificateFile'][0].filename : null;
    const reportFile = req.files['reportFile'] ? req.files['reportFile'][0].filename : null;

    const stipend = req.body.stipend;
    let amount = 0;
    if(stipend==="Yes"){
        amount = req.body.amount
    }

    const query = `
      INSERT INTO ce_intern_registered
      (student, academic_year, semester,  mode, industry, start_date, end_date, duration, stipend, amount, type, report_path, certificate_path, elective)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const query1 = `
      INSERT INTO ce_intern_registered
      (student, academic_year, semester,  mode, industry, start_date, end_date, duration, stipend, amount, type, report_path, certificate_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      req.body.rollNo || null,
      req.body.academic_year || null,
      req.body.semester || null,
      req.body.mode || null,
      req.body.Industry || null,
      req.body.StartDate || null,
      req.body.EndDate || null,
      req.body.duration || null,
      req.body.stipend || null,
      amount || null,
      req.body.courseException || null,
      reportFile,
      certificateFile,
      req.body.elective 
    ];

    const values1 = [
        req.body.rollNo || null,
        req.body.academic_year || null,
        req.body.semester || null,
        req.body.mode || null,
        req.body.Industry || null,
        req.body.StartDate || null,
        req.body.EndDate || null,
        req.body.duration || null,
        req.body.stipend || null,
        amount || null,
        req.body.courseException || null,
        reportFile,
        certificateFile, 
      ];

      if(req.body.courseException === '1'){
        await post_query_database(query, values);
        res.status(200).json({ status: 'Success' });
      }
      else{
        await post_query_database(query1, values1);
        res.status(200).json({ status: 'Success' });
      }

  } catch (error) {
    console.error('Error in Insert query:', error);
    res.status(500).json({ error: 'Error in Insert query' });
  }
});

module.exports = router;
