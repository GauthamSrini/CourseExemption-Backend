const xlsx = require('xlsx');
const { post_query_database, get_query_database } = require("../../../config/database_utils");
const nodemailer = require('nodemailer');

exports.processExcelFileOneCredit = async (req, res) => {
  const filePath = req.file.path;

  let workbook = xlsx.readFile(filePath);
  let worksheet = workbook.Sheets[workbook.SheetNames[0]];
  let range = xlsx.utils.decode_range(worksheet["!ref"]);

  let count = 0;
  let added = 0;
  let skip = 0;
  let updated = 0; // Counter to track the number of successful insertions

  async function processRow(row) {
    let data = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
      let cell = worksheet[xlsx.utils.encode_cell({ r: row, c: col })];
      data.push(cell ? cell.v : null);
    }

    let code = data[0];
    let name = data[1];
    let student = String(data[2]);
    let academic = String(data[3]);
    let semester = data[4];

    const academic_query = `SELECT id FROM master_academic_year WHERE academic_year = ?`;
    const [academic_id] = await get_query_database(academic_query,[academic]) 
    const academic_year_id = academic_id.id

    const sqlCheck = `SELECT * FROM ce_onecredit_mappings WHERE course_code = ? AND student = ?`;
    const existingStudent = await get_query_database(sqlCheck,[code,student]);
    console.log(existingStudent);

    if (existingStudent.length === 0) { // If student_id does not exist
      const sqlInsert = `INSERT INTO ce_onecredit_mappings (course_code, name, student, semester, academic_year) VALUES (?, ?, ?, ?, ?)`
      try {
        await post_query_database(sqlInsert,[code,name,student,semester,academic_year_id]);
        console.log(`Inserted row ${row}: Success`);
        count++;
        added++;
      } catch (error) {
        console.error(`Error inserting row ${row}:`, error);
      }
    }
    else if(existingStudent.length===1){
      const sqlInsert1 = `UPDATE ce_onecredit_mappings SET name = ?, semester = ?, academic_year = ? WHERE course_code = ? AND student = ?`
    try {
      await post_query_database(sqlInsert1,[name,semester,academic_year_id,code,student]);
      console.log(`Updated row ${row}: Success`);
      count++;
      updated++;
    } catch (error) {
      console.error(`Error updating row ${row}:`, error);
    }
  }
  else {
    console.log(`Skipped insertion for row ${row}: Student ID ${data[0]} already exists`);
    count++;
    skip++;
  }

  }

  try {
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      await processRow(row);
    }

    // Fetch unique course_code and name from ce_onecredit_mappings
    const uniqueCoursesQuery = `SELECT DISTINCT course_code, name, academic_year, semester FROM ce_onecredit_mappings`;
    const uniqueCourses = await get_query_database(uniqueCoursesQuery);

    // Check and insert into ce_onecredit_courselist
    for (const course of uniqueCourses) {
      const checkQuery = `SELECT * FROM ce_onecredit_courselist WHERE course_code = ? `;
      const existingCourse = await get_query_database(checkQuery, [course.course_code]);

      if (existingCourse.length === 0) {
        const insertQuery = `INSERT INTO ce_onecredit_courselist (course_code, course_name, academic_year, semester) VALUES (?, ?, ?, ?)`;
        try {
          await post_query_database(insertQuery, [course.course_code, course.name, course.academic_year, course.semester]);
          console.log(`Inserted course ${course.course_code}: ${course.name}`);
        } catch (error) {
          console.error(`Error inserting course ${course.course_code}: ${course.name}`, error);
        }
      }
    }

    // Fetch students with a count of courses greater than or equal to 3
    const studentsQuery = `
      SELECT one.student, COUNT(one.student) as numbers, st.email 
      FROM ce_onecredit_mappings one 
      INNER JOIN master_students st ON one.student = st.register_number 
      GROUP BY one.student 
      HAVING numbers >= 3
    `;
    const students = await get_query_database(studentsQuery);

    // Send reminder emails to those students
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pragalya296@gmail.com",
        pass: "fgfz nktp vbwc dzna" // Your Gmail password
      },
      secure: true
    });

    for (const student of students) {
      const { student: studentId, email: studentEmail } = student;
      
      // Check if email has already been sent to the student
      const checkQuery = `SELECT * FROM ce_oc_mail_status WHERE student = ?`;
      const checkResult = await get_query_database(checkQuery, [studentId]);
      
      if (checkResult.length > 0) {
        // Email already sent, skip
        console.log(`Email already sent to student ${studentId}`);
        continue;
      }

      const mailOptions = {
        from: "pragalya296@gmail.com",
        to: studentEmail,
        subject: "Reminder: One Credit Course",
        text: "Dear student, As you have completed 3 One credit Course you are now eligible for Course Exemption...kindky apply through IQAC protal for furthur Reference"
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${studentEmail}`);
        
        // Update the status to indicate that the email has been sent
        const updateQuery = `INSERT INTO ce_oc_mail_status (student,status) VALUES ( ?, 1)`;
        await post_query_database(updateQuery, [studentId]);
      } catch (error) {
        console.error(`Error sending email to ${studentEmail}:`, error);
      }
    }

    res.status(200).json({ message: 'Added All the Details in Database ', added, updated, skip });
  } catch (error) {
    console.error("Error processing Excel file", error);
    res.status(500).json({ error: "Error processing Excel file" });
  }
};
