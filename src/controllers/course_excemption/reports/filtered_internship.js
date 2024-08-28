const { get_query_database } = require("../../../config/database_utils");

// Define the API endpoint
exports.filter_intern_report = async (req, res) => {
  const { years, departments, semesters, electives } = req.body;
  try {
    const filters = [];
    const values = [];

    if (years && years.length) {
      filters.push(`ce_intern_registered.academic_year IN (${years.map(() => '?').join(', ')})`);
      values.push(...years);
    }

    if (departments && departments.length) {
      filters.push(`master_students.department IN (${departments.map(() => '?').join(', ')})`);
      values.push(...departments);
    }

    if (semesters && semesters.length) {
      filters.push(`ce_intern_registered.semester IN (${semesters.map(() => '?').join(', ')})`);
      values.push(...semesters);
    }

    if (electives && electives.length) {
      filters.push(`ce_intern_registered.elective IN (${electives.map(() => '?').join(', ')})`);
      values.push(...electives);
    }

    filters.push(`ce_intern_registered.approval_status = 4 AND ce_intern_registered.status = '1' AND ce_intern_registered.type = '1' `);

    const query = `
      SELECT 
        ce_intern_registered.id,
        ce_intern_registered.student AS register_number,
        ce_intern_companies.company_name AS company_name,
        ce_intern_companies.company_address AS company_address,
        master_branch.branch,
        ce_intern_registered.duration,
        ce_intern_registered.mode,
        master_students.name AS student_name,
        academic.academic_year,
        ce_intern_registered.semester,
        DATE_FORMAT(ce_intern_registered.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(ce_intern_registered.end_date, '%Y-%m-%d') AS end_date,
        ce_intern_registered.stipend,
        ce_intern_registered.amount,
        ce_intern_registered.report_path,
        ce_intern_registered.certificate_path,
        ce_electives.elective
      FROM 
        ce_intern_registered
      JOIN 
        ce_intern_companies ON ce_intern_registered.industry = ce_intern_companies.id
      JOIN 
        master_students ON ce_intern_registered.student = master_students.register_number
      JOIN 
        master_branch ON master_students.department = master_branch.id
      LEFT JOIN
        ce_electives ON ce_intern_registered.elective = ce_electives.id
      LEFT JOIN
        master_academic_year academic ON ce_intern_registered.academic_year = academic.id
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
