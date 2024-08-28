const { post_query_database, get_query_database  } = require("../../../config/database_utils");

exports.apply_addon_honor_minor = async (req, res) => {
  const {selectedSem, student, courseCode, courseName ,  electiveId, modeOfExemption, selectedAcademicYear } = req.body;
  let mode_of_exemption = modeOfExemption
    
  if (!student || !selectedSem || !courseCode || !courseName  || !electiveId || !selectedAcademicYear) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  let academic = selectedAcademicYear
  const academic_query = `SELECT id FROM master_academic_year WHERE academic_year = ?`;
  const [academic_id] = await get_query_database(academic_query,[academic]) 
  const academic_year_id = academic_id.id

  if(modeOfExemption===null || modeOfExemption===undefined){
    mode_of_exemption = 1
  }

  try {
    const insertSql = `
      INSERT INTO ce_addon_honor_minor_registered (course_code, course_name, student, semester, elective, mode_of_exemption, academic_year)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const insertValues = [courseCode, courseName, student, selectedSem, electiveId, mode_of_exemption, academic_year_id];

    await post_query_database(insertSql, insertValues);
    res.status(200).send('course Applied Successfully');
  } catch (error) {
    console.error('Error in applying course', error);
    res.status(500).send('Error in applying course');
  }
};