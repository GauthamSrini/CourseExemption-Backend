const { post_query_database } = require("../../../config/database_utils");
const { get_query_database } = require("../../../config/database_utils");


exports.post_single_one_credit = async (req, res) => {
    const { courseCode, courseName, student, semester } = req.body;
    const checkQuery = `SELECT * FROM ce_onecredit_mappings WHERE course_code = ? AND student = ?`
  try {
    const checkResults = await get_query_database(checkQuery,[courseCode,student])
    if(checkResults.length === 0){
    const query = `
      INSERT INTO ce_onecredit_mappings (course_code,name,student,semester)
      VALUES (?, ?, ?, ?)
    `;
    const Upload_course = await post_query_database(query,[courseCode,courseName,student,semester])
    res.status(200).json(Upload_course);
    }else {
        let msg = "This course ID Student is Already Mapped";
        console.error(msg);
        res.status(409).json({ msg: "This course ID Student is Already Mapped" }); // Use status 409 (Conflict)
    }
  } catch (error) {
    console.error('Error in storing Data:', error);
    return res.status(500).json({ error: 'Failed to store Data' });
  }
};

