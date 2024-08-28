const { post_query_database } = require("../../../config/database_utils");

exports.post_Excemption = async (req, res) => {
  try {
    const { studentId, selectedCourses,electiveId } = req.body;
    // // Validate if the selectedCourses array has exactly 3 courses
    // if (!Array.isArray(selectedCourses) || selectedCourses.length !== 3) {
    //   return res.status(400).json({ error: 'Exactly 3 courses must be selected' });
    // }
    // Insert the selected courses into the ce_onecredit_excemption table
    const query = `
      INSERT INTO ce_onecredit_registered (course_1, course_2, course_3, student, elective)
      VALUES (?, ?, ?, ?, ?)
    `;
    await post_query_database(query, [selectedCourses[0], selectedCourses[1], selectedCourses[2], studentId, electiveId]);

    return res.status(200).json({ message: 'Excemption stored successfully' });
  } catch (error) {
    console.error('Error storing excemption:', error);
    return res.status(500).json({ error: 'Failed to store excemption' });
  }
};
