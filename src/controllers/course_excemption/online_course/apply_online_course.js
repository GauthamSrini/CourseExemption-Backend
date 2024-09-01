const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const pool = require("../../../config/database");
const { PDFDocument } = require('pdf-lib');
const { post_query_database, get_query_database } = require("../../../config/database_utils");
// const ensureAuthenticated = require("../../../middleware/authMiddleware")

const router = express.Router();

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads/course_excemption/oc_certificates');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

// Define the route for the POST API endpoint
router.post("/create", upload.fields([{ name: 'certificateFile', maxCount: 1 }, { name: 'marksheet', maxCount: 1 }]), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const certificateFile = req.files['certificateFile'][0].filename;
    const marksheet = req.files['marksheet'] ? req.files['marksheet'][0].filename : null
    let c1_id;

    const insertCourse1Query = `
        INSERT INTO ce_oc_course_details (course_code, student, academic_year, semester, start_date, end_date, exam_date, marks, certificate_url, certificate_path, certificate_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const course1Values = [
        parseInt(req.body.course),
        req.body.student,
        parseInt(req.body.academic_year),
        parseInt(req.body.semester),
        req.body.start_date,
        req.body.end_date,
        req.body.exam_date,
        parseInt(req.body.mark),
        req.body.certificate_url,
        certificateFile,
        parseInt(req.body.certficate_type),
      ];

    const [result1] = await connection.query(insertCourse1Query, course1Values);
    c1_id = result1.insertId;

    if(parseInt(req.body.type) === 1){
      // Insert a record into ce_oc_registered_sample
      const insertRegisteredSampleQuery = `
        INSERT INTO ce_oc_registered_sample (course_1, student, type, c1_details, elective_1, mark_sheet_path, approval_status, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, '1')
      `;
      const registeredSampleValues = [
        parseInt(req.body.course),
        req.body.student,
        req.body.type,
        c1_id,
        req.body.electiveId,
        marksheet,
        req.body.approval_status
      ];
      await connection.query(insertRegisteredSampleQuery, registeredSampleValues);
    }
    else if(parseInt(req.body.type) === 0){
      // Insert a record into ce_oc_registered_sample
      const insertRegisteredSampleQuery = `
        INSERT INTO ce_oc_registered_sample (course_1, student, type, c1_details, approval_status, status)
        VALUES (?, ?, ?, ?, ?, '1')
      `;
      const registeredSampleValues = [
        parseInt(req.body.course),
        req.body.student,
        req.body.type,
        c1_id,
        req.body.approval_status
      ];
      await connection.query(insertRegisteredSampleQuery, registeredSampleValues);
    }
// Commit the transaction
await connection.commit();
res.status(200).json({ status: 'Success' });

  }catch (error) {
    // Rollback the transaction in case of error
    await connection.rollback();
    console.error('Error in Insert query:', error);
    res.status(500).json({ error: 'Error in Insert query' });
  } finally {
    connection.release(); // Release the connection back to the pool
  }
})

/// function for fetching the pdfs
router.get('/pdfs/:filename',(req,res)=>{
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../../uploads/course_excemption/oc_certificates', filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error in Sending File:', err);
      res.status(500).json({ error: 'Error in Sending File' });
    }
  });
})

router.get('/merge-pdfs', async (req, res) => {
  try {
    const pdfPaths = [
      '1714716183919_Online course.pdf',
      '1714716823227_One credit course.pdf',
      '1714717437151_modified_pdf-42.pdf'
      // Add more PDF file names as needed
    ];

    const mergedPdfPath = await mergePDFs(pdfPaths);

    // Respond with the path of the merged PDF file
    res.status(200).json({ path: mergedPdfPath });
  } catch (error) {
    console.error('Error merging PDFs:', error);
    res.status(500).json({ error: 'Error merging PDFs' });
  }
});

// Function to merge PDFs
async function mergePDFs(pdfPaths) {
  const mergedPdf = await PDFDocument.create();

  for (const pdfPath of pdfPaths) {
    const pdfBytes = fs.readFileSync(path.join(__dirname, '../../../uploads/course_excemption/oc_certificates', pdfPath));
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }

  const outputPath = 'merged.pdf'; // Change the output path as needed
  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(outputPath, mergedPdfBytes);

  return outputPath;
}



module.exports = router;
