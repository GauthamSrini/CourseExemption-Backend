const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
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
router.post("/create", upload.fields([{ name: 'certificateFile', maxCount: 1 }]), async (req, res) => {
  try {
    const certificateFile = req.files['certificateFile'][0].filename;
    const {typeinfo} = req.body;
    
    const query = `
      INSERT INTO ce_oc_registered
      (course, student, type, academic_year, semester, start_date, end_date, exam_date, mark, certificate_url, certificate_path, approval_status, certificate_type, elective, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '1')
    `;

    const query1 = ` INSERT INTO ce_oc_registered
      (course, student, type, academic_year, semester, start_date, end_date, exam_date, mark, certificate_url, certificate_path, approval_status, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '1')`

    const values = [
      parseInt(req.body.course),
      req.body.student,
      req.body.type,
      parseInt(req.body.academic_year),
      parseInt(req.body.semester),
      req.body.start_date,
      req.body.end_date,
      req.body.exam_date,
      parseInt(req.body.mark),
      req.body.certificate_url,
      certificateFile,
      parseInt(req.body.approval_status),
      parseInt(req.body.certficate_type),
      parseInt(req.body.electiveId)
    ];

    const values1 = [
      parseInt(req.body.course),
      req.body.student,
      req.body.type,
      parseInt(req.body.academic_year),
      parseInt(req.body.semester),
      req.body.start_date,
      req.body.end_date,
      req.body.exam_date,
      parseInt(req.body.mark),
      req.body.certificate_url,
      certificateFile,
      parseInt(req.body.approval_status),
    ];
    console.log(values);
    console.log(values1);
    console.log(typeinfo);
    if(req.body.type === '1'){
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
