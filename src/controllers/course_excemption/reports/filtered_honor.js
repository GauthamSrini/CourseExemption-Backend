const { get_query_database } = require("../../../config/database_utils");

// Define the API endpoint
exports.filter_honor_report = async (req, res) => {
  const { years, departments, semesters, electives } = req.body;
  try {
    const filters = [];
    const values = [];

    if (years && years.length) {
      filters.push(`ce_addon_honor_minor_registered.academic_year IN (${years.map(() => '?').join(', ')})`);
      values.push(...years);
    }

    if (departments && departments.length) {
      filters.push(`master_students.department IN (${departments.map(() => '?').join(', ')})`);
      values.push(...departments);
    }

    if (semesters && semesters.length) {
      filters.push(`ce_addon_honor_minor_registered.semester IN (${semesters.map(() => '?').join(', ')})`);
      values.push(...semesters);
    }

    if (electives && electives.length) {
      filters.push(`ce_addon_honor_minor_registered.elective IN (${electives.map(() => '?').join(', ')})`);
      values.push(...electives);
    }

    filters.push(`ce_addon_honor_minor_registered.approval_status = 3 AND ce_addon_honor_minor_registered.status = '1' AND ce_addon_honor_minor_registered.mode_of_exemption = 2 `);

    const query = `
      SELECT 
        ce_addon_honor_minor_registered.id,
        ce_addon_honor_minor_registered.student AS register_number,
        ce_addon_honor_minor_registered.course_code,
        ce_addon_honor_minor_registered.course_name,
        master_students.name AS student_name,
        academic.academic_year,
        ce_addon_honor_minor_registered.semester,
        ce_electives.elective,
        master_branch.branch
      FROM 
        ce_addon_honor_minor_registered
      JOIN 
        master_students ON ce_addon_honor_minor_registered.student = master_students.register_number
      JOIN
        master_branch ON master_students.department = master_branch.id
      LEFT JOIN
        ce_electives ON ce_addon_honor_minor_registered.elective = ce_electives.id
      LEFT JOIN
        master_academic_year academic ON ce_addon_honor_minor_registered.academic_year = academic.id
      ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
    `;

    const registeredDetails = await get_query_database(query, values);
    res.status(200).json(registeredDetails);
  } catch (err) {
    console.error("Error fetching registered details: ", err);
    res.status(500).json({
      error: "Error fetching registered details"
    });
  }
};
