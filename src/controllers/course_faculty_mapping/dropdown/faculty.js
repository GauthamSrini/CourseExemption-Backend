const { get_query_database } = require("../../../config/database_utils");

exports.get_faculty = async (req, res) => {
  const department_id = req.query.department;

  if (!department_id) {
    return res.status(400).json({
      error: "Department ID is required in query!!",
    });
  }

  try {
    const query = `
      SELECT id, CONCAT(user_id, '-' ,user_name) faculty_name
      FROM master_user 
      WHERE user_type = 'faculty' AND  dep_id = ?
    `;

    const faculty = await get_query_database(query, [department_id]);
    res.json(faculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ error: "Error fetching faculty" });
  }
};
