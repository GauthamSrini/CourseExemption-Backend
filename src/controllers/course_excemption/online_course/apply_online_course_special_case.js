const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("../../../config/database");

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
router.post("/create", upload.fields([
  { name: 'certificateFile_1', maxCount: 1 },
  { name: 'certificateFile_2', maxCount: 1 },
  { name: 'certificateFile_3', maxCount: 1 },
  { name: 'marksheet', maxCount: 1 }
]), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const {
      type,
      student,
      academic_year_1,
      academic_year_2,
      semester_1,
      semester_2,
      start_date_1,
      start_date_2,
      end_date_1,
      end_date_2,
      exam_date_1,
      exam_date_2,
      mark_1,
      mark_2,
      certificate_url_1,
      certificate_url_2,
      certficate_type_1,
      certficate_type_2,
      electiveId_1,
      approval_status
    } = req.body;

    const certificateFile1 = req.files['certificateFile_1'][0].filename;
    const certificateFile2 = req.files['certificateFile_2'][0].filename;
    const certificateFile3 = req.files['certificateFile_3'] ? req.files['certificateFile_3'][0].filename : null;
    const marksheet = req.files['marksheet'][0].filename;

    let c1_id, c2_id, c3_id;
    
    if (parseInt(type) === 1 || parseInt(type) === 2) {
      // Insert course details for course 1
      const insertCourse1Query = `
        INSERT INTO ce_oc_course_details (course_code, student, academic_year, semester, start_date, end_date, exam_date, marks, certificate_url, certificate_path, certificate_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const course1Values = [
        req.body.course_1,
        student,
        academic_year_1,
        semester_1,
        start_date_1,
        end_date_1,
        exam_date_1,
        mark_1,
        certificate_url_1,
        certificateFile1,
        certficate_type_1
      ];
      const [result1] = await connection.query(insertCourse1Query, course1Values);
      c1_id = result1.insertId;
      // Insert course details for course 2
      const insertCourse2Query = `
        INSERT INTO ce_oc_course_details (course_code, student, academic_year, semester, start_date, end_date, exam_date, marks, certificate_url, certificate_path, certificate_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const course2Values = [
        req.body.course_2,
        student,
        academic_year_2,
        semester_2,
        start_date_2,
        end_date_2,
        exam_date_2,
        mark_2,
        certificate_url_2,
        certificateFile2,
        certficate_type_2
      ];
      const [result2] = await connection.query(insertCourse2Query, course2Values);
      c2_id = result2.insertId;

      if (parseInt(type) === 2) {
        // Insert course details for course 3 (only if type === 2)
        const insertCourse3Query = `
          INSERT INTO ce_oc_course_details (course_code, student, academic_year, semester, start_date, end_date, exam_date, marks, certificate_url, certificate_path, certificate_type)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const course3Values = [
          req.body.course_3,
          student,
          req.body.academic_year_3,
          req.body.semester_3,
          req.body.start_date_3,
          req.body.end_date_3,
          req.body.exam_date_3,
          req.body.mark_3,
          req.body.certificate_url_3,
          certificateFile3,
          req.body.certficate_type_3
        ];
        const [result3] = await connection.query(insertCourse3Query, course3Values);
        c3_id = result3.insertId;
      }

      // Insert a record into ce_oc_registered_sample
      const insertRegisteredSampleQuery = `
        INSERT INTO ce_oc_registered_sample (course_1, course_2, course_3, student, type, c1_details, c2_details, c3_details, elective_1, elective_2, mark_sheet_path, approval_status, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '1')
      `;
      const registeredSampleValues = [
        req.body.course_1,
        req.body.course_2,
        parseInt(type) === 2 ? req.body.course_3 : null,
        student,
        type,
        c1_id,
        c2_id,
        parseInt(type) === 2 ? c3_id : null,
        electiveId_1,
        req.body.electiveId_2,
        marksheet,
        approval_status
      ];
      await connection.query(insertRegisteredSampleQuery, registeredSampleValues);
    }
// Commit the transaction
await connection.commit();

res.status(200).json({ status: 'Success' });
  } catch (error) {
    // Rollback the transaction in case of error
    await connection.rollback();
    console.error('Error in Insert query:', error);
    res.status(500).json({ error: 'Error in Insert query' });
  } finally {
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = router;
