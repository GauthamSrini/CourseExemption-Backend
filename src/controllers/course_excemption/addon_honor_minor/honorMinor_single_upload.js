const { post_query_database } = require("../../../config/database_utils");

exports.honor_minor_single_upload = async (req, res) => {
  const { student, semester, modeOfExemption, courseCode, courseName } = req.body;
    
  if (!student || !semester || !modeOfExemption || !courseCode || !courseName ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const checkSql = `
  SELECT COUNT(*) AS count
  FROM ce_honor_minor_mappings
  WHERE student = ? AND course_code = ? AND course_name = ?
`;
  const checkValues = [student, courseCode, courseName];

  try {
    const [result] = await post_query_database(checkSql, checkValues);
    if (result.count > 0) {
      return res.status(400).json({ error: 'The combination of Register Number, Course Code, and Course Name already exists' });
    }

    const insertSql = `
      INSERT INTO ce_honor_minor_mappings (student, semester, mode_of_exemption, course_code, course_name)
      VALUES (?, ?, ?, ?, ?)
    `;
    const insertValues = [student, semester, modeOfExemption, courseCode, courseName];

    await post_query_database(insertSql, insertValues);
    res.status(200).send('Form submitted successfully');
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('Form submission failed');
  }
};