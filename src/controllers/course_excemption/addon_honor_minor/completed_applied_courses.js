const { get_query_database } = require("../../../config/database_utils");

exports.get_completed_addon_honor_minor = async (req, res) => {
  const { category, student } = req.query;

  try {
    let query;

    // Determine which table to query based on the category
    if (parseInt(category) === 1) {
      // Fetch from ce_addon_mappings table
      query = `SELECT addon.id, addon.course_code, addon.course_name, addon.student, 1 AS mode_of_exemption,  academic.academic_year, 
      addon.semester FROM ce_addon_mappings addon LEFT JOIN master_academic_year academic ON addon.academic_year = academic.id
      WHERE student = ? AND course_code NOT IN (SELECT course_code FROM ce_addon_honor_minor_registered WHERE student = ? AND status = '1')`;
    } else if (parseInt(category) === 2) {
      // Fetch from ce_honor_minor_mappings table
      query = `SELECT hm.id, hm.course_code, hm.course_name, hm.student, hm.mode_of_exemption, academic.academic_year, 
      hm.semester FROM ce_honor_minor_mappings hm LEFT JOIN master_academic_year academic ON hm.academic_year = academic.id
       WHERE student = ? AND course_code NOT IN (SELECT course_code FROM ce_addon_honor_minor_registered WHERE student = ? AND status ='1')`;
    } else {
      let msg = "Invalid category value";
      console.error(msg);
      return res.status(400).json({ msg });
    }
    // Fetch records based on the category
    const primaryResults = await get_query_database(query, [student, student]);

    let query1;

    if (parseInt(category) === 1) {
      query1 = `SELECT register.id,
      register.course_code,
      register.course_name,
      register.student,academic.academic_year,register.semester,ce_electives.elective,
    register.mode_of_exemption,register.approval_status,register.remarks,register.rejected_by,register.status FROM ce_addon_honor_minor_registered register
    JOIN ce_electives ON register.elective = ce_electives.id 
    LEFT JOIN master_academic_year academic ON register.academic_year = academic.id
    WHERE student = ? AND mode_of_exemption = 1`;
    } else if (parseInt(category) === 2) {
      query1 = `SELECT register.id,register.course_code,register.course_name,register.student,academic.academic_year,register.semester,ce_electives.elective,
    register.mode_of_exemption,register.approval_status,register.remarks,register.rejected_by,register.status FROM ce_addon_honor_minor_registered register
    JOIN ce_electives ON register.elective = ce_electives.id 
    LEFT JOIN master_academic_year academic ON register.academic_year = academic.id
    WHERE student = ? AND (mode_of_exemption = 2 OR mode_of_exemption = 3)`;
    }
    const registeredResults = await get_query_database(query1, [student]);

    // Combine the results
    const combinedResults = [...primaryResults, ...registeredResults];

    res.status(200).json(combinedResults);
  } catch (err) {
    console.error("Error fetching student courses:", err);
    res.status(500).json({
      err: "Error fetching student courses",
    });
  }
};
