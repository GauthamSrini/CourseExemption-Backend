const { get_query_database } = require("../../../config/database_utils");

// Define the API endpoint
exports.filter_online_report = async (req, res) => {
  const { years, departments, semesters, electives } = req.body;
  try {
    const filters = [];
    const values = [];

    if (years && years.length) {
      filters.push(`ce_oc_registered.academic_year IN (${years.map(() => '?').join(', ')})`);
      values.push(...years);
    }

    if (departments && departments.length) {
      filters.push(`master_students.department IN (${departments.map(() => '?').join(', ')})`);
      values.push(...departments);
    }

    if (semesters && semesters.length) {
      filters.push(`ce_oc_registered.semester IN (${semesters.map(() => '?').join(', ')})`);
      values.push(...semesters);
    }

    if (electives && electives.length) {
      filters.push(`ce_oc_registered.elective IN (${electives.map(() => '?').join(', ')})`);
      values.push(...electives);
    }

    filters.push(`ce_oc_registered.approval_status = 3 AND ce_oc_registered.status = '1' AND ce_oc_registered.type = '1' `);

    const query = `
      SELECT 
        ce_oc_registered.id,
        ce_oc_registered.student AS register_number,
        ce_oc_platform.name AS platform_name,
        ce_oc_courselist.name AS course_name,
        ce_oc_courselist.duration,
        ce_oc_courselist.credit,
        master_students.name AS student_name,
        academic.academic_year,
        ce_oc_registered.semester,
        DATE_FORMAT(ce_oc_registered.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(ce_oc_registered.end_date, '%Y-%m-%d') AS end_date,
        DATE_FORMAT(ce_oc_registered.exam_date, '%Y-%m-%d') AS exam_date,
        ce_oc_registered.mark,
        ce_oc_registered.certificate_url,
        ce_oc_registered.certificate_path,
        ce_oc_certificate_types.type_name,
        master_branch.branch,
        ce_electives.elective
      FROM 
        ce_oc_registered
      JOIN 
        ce_oc_courselist ON ce_oc_registered.course = ce_oc_courselist.id
      JOIN 
        master_students ON ce_oc_registered.student = master_students.register_number
      JOIN 
        master_branch ON master_students.department = master_branch.id
      JOIN 
        ce_oc_platform ON ce_oc_courselist.platform = ce_oc_platform.id
      LEFT JOIN
        ce_electives ON ce_oc_registered.elective = ce_electives.id
      LEFT JOIN
        ce_oc_certificate_types ON ce_oc_registered.certificate_type = ce_oc_certificate_types.id
      LEFT JOIN
        master_academic_year academic ON ce_oc_registered.academic_year = academic.id
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

