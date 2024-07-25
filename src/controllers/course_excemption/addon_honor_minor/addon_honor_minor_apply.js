const { post_query_database } = require("../../../config/database_utils");

exports.apply_addon_honor_minor = async (req, res) => {
  const {selectedSem, student, courseCode, courseName ,  electiveId, modeOfExemption } = req.body;
  let mode_of_exemption = modeOfExemption
    
  if (!student || !selectedSem || !courseCode || !courseName  || !electiveId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if(modeOfExemption===null || modeOfExemption===undefined){
    mode_of_exemption = 1
  }

  try {
    const insertSql = `
      INSERT INTO ce_addon_honor_minor_registered (course_code, course_name, student, semester, elective, mode_of_exemption)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const insertValues = [courseCode, courseName, student, selectedSem, electiveId, mode_of_exemption];

    await post_query_database(insertSql, insertValues);
    res.status(200).send('course Applied Successfully');
  } catch (error) {
    console.error('Error in applying course', error);
    res.status(500).send('Error in applying course');
  }
};