const { post_query_database,get_query_database } = require("../../../config/database_utils");

exports.add_on_single_upload = async (req, res) => {
  const {selectedSem, student, courseCode, courseName, selectedAcademicYear } = req.body;
    
  if (!student || !selectedSem || !courseCode || !courseName  || !selectedAcademicYear) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const checkSql = `
  SELECT * FROM ce_addon_mappings
  WHERE student = ? AND course_code = ?
`;
  const checkValues = [student, courseCode];

  try {
    const result = await get_query_database(checkSql, checkValues);
    if (result.length > 0) {
      return res.status(400).json({ msg: 'Register Number, Course Code already exists' });
    }

    const insertSql = `
      INSERT INTO ce_addon_mappings (course_code, course_name, student, academic_year, semester)
      VALUES (?, ?, ?, ?, ?)
    `;
    const insertValues = [courseCode, courseName, student, selectedAcademicYear, selectedSem];

    await post_query_database(insertSql, insertValues);
    res.status(200).send('Form submitted successfully');
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('Form submission failed');
  }
};