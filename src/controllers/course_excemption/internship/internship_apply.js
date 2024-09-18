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
        amount = parseInt(req.body.amount)
    }

    const query = `
      UPDATE ce_intern_registered
      SET stipend = ?, amount = ?, type = '1', report_path = ?, certificate_path = ?, elective = ?
      WHERE id = ?
    `;

    const query1 = `
      UPDATE ce_intern_registered
      SET stipend = ?, amount = ?, type = '0', report_path = ?, certificate_path = ?
      WHERE id = ?
    `;

    const values = [
      String(req.body.stipend),
      amount || null,
      reportFile,
      certificateFile,
      req.body.elective,
      parseInt(req.body.id)
    ];

    const values1 = [
        String(req.body.stipend),
        amount || null,
        reportFile,
        certificateFile, 
        parseInt(req.body.id)
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
