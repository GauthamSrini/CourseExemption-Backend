const { get_query_database } = require("../../../config/database_utils");

exports.get_course_student_mappings = async (req, res) => {
  try {
    const { name } = req.query;

    // Query for the first table
    const query1 = `SELECT ce_addon_mappings.course_code, ce_addon_mappings.course_name, ce_addon_mappings.student, academic.academic_year,
    ce_addon_mappings.semester, NULL as mode_of_exemption FROM ce_addon_mappings JOIN master_academic_year AS academic ON ce_addon_mappings.academic_year = academic.id
                    WHERE ce_addon_mappings.course_code LIKE ? 
                    OR ce_addon_mappings.course_name LIKE ? 
                    OR ce_addon_mappings.student LIKE ?`;
    const result1 = await get_query_database(query1, [`%${name}%`, `%${name}%`, `%${name}%`]);

    // Query for the second table
    const query2 = `SELECT ce_honor_minor_mappings.course_code, ce_honor_minor_mappings.course_name, ce_honor_minor_mappings.student,academic.academic_year, 
    ce_honor_minor_mappings.semester, ce_honor_minor_mappings.mode_of_exemption 
                    FROM ce_honor_minor_mappings JOIN master_academic_year AS academic ON ce_honor_minor_mappings.academic_year = academic.id 
                    WHERE ce_honor_minor_mappings.course_code LIKE ? 
                    OR ce_honor_minor_mappings.course_name LIKE ? 
                    OR ce_honor_minor_mappings.student LIKE ?`;
    const result2 = await get_query_database(query2, [`%${name}%`, `%${name}%`, `%${name}%`]);

    // Merge results from both tables
    const mergedResults = [...result1, ...result2];

    // Send the merged result as a response
    res.status(200).json(mergedResults);
  } catch (err) {
    console.error("Error fetching course-student mappings:", err);
    res.status(500).json({
      err: "Error fetching course-student mappings"
    });
  }
};
