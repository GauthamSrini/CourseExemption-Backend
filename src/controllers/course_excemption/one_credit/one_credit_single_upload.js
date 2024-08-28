const { post_query_database } = require("../../../config/database_utils");
const { get_query_database } = require("../../../config/database_utils");


exports.post_single_one_credit = async (req, res) => {
    const { courseCode, courseName, student, semester, selectedAcademicYear} = req.body;
    const checkQuery = `SELECT * FROM ce_onecredit_mappings WHERE course_code = ? AND student = ?`
  try {
    const checkResults = await get_query_database(checkQuery,[courseCode,student])
    if(checkResults.length === 0){
    const query = `
      INSERT INTO ce_onecredit_mappings (course_code,name,student,semester,academic_year)
      VALUES (?, ?, ?, ?, ?)
    `;
    const Upload_course = await post_query_database(query,[courseCode,courseName,student,semester,selectedAcademicYear])
    res.status(200).json(Upload_course);
    }else {
        let msg = "This course ID Student is Already Mapped";
        console.error(msg);
        res.status(409).json({ msg: "This course ID Student is Already Mapped" }); // Use status 409 (Conflict)
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
    
  } catch (error) {
    console.error('Error in storing Data:', error);
    return res.status(500).json({ error: 'Failed to store Data' });
  }
};

