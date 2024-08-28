const { get_query_database } = require("../../../config/database_utils");

// Define the API endpoint
exports.filter_one_credit_report = async (req, res) => {
  const { years, semesters, electives, departments } = req.body;
  try {
    const filters = [];
    const values = [];

    if (years && years.length) {
      filters.push(`(
        course1.academic_year IN (${years.map(() => '?').join(', ')})
        OR course2.academic_year IN (${years.map(() => '?').join(', ')})
        OR course3.academic_year IN (${years.map(() => '?').join(', ')})
      )`);
      values.push(...years, ...years, ...years);
    }

    if (semesters && semesters.length) {
      filters.push(`(
        course1.semester IN (${semesters.map(() => '?').join(', ')})
        OR course2.semester IN (${semesters.map(() => '?').join(', ')})
        OR course3.semester IN (${semesters.map(() => '?').join(', ')})
      )`);
      values.push(...semesters, ...semesters, ...semesters);
    }

    if (electives && electives.length) {
      filters.push(`ce_onecredit_registered.elective IN (${electives.map(() => '?').join(', ')})`);
      values.push(...electives);
    }

    if (departments && departments.length) {
      filters.push(`master_students.department IN (${departments.map(() => '?').join(', ')})`);
      values.push(...departments);
    }

    filters.push(`ce_onecredit_registered.approval_status = 3 AND ce_onecredit_registered.status = '1' `);

    const query = `
    SELECT
      ce_onecredit_registered.id,
      course1.course_name AS course_1_name,
      course1_academic_year.academic_year AS academic_year_1,
      course1.semester AS semester_1,
      course2.course_name AS course_2_name,
      course2_academic_year.academic_year AS academic_year_2,
      course2.semester AS semester_2,
      course3.course_name AS course_3_name,
      course3_academic_year.academic_year AS academic_year_3,
      course3.semester AS semester_3,
      ce_onecredit_registered.student,
      master_students.name AS student_name,
      ce_electives.elective,
      master_branch.branch
    FROM
      ce_onecredit_registered
    JOIN
      ce_onecredit_courselist AS course1 ON ce_onecredit_registered.course_1 = course1.course_code
    JOIN
      ce_onecredit_courselist AS course2 ON ce_onecredit_registered.course_2 = course2.course_code
    JOIN
      ce_onecredit_courselist AS course3 ON ce_onecredit_registered.course_3 = course3.course_code
    JOIN
      master_academic_year AS course1_academic_year ON course1.academic_year = course1_academic_year.id
    JOIN
      master_academic_year AS course2_academic_year ON course2.academic_year = course2_academic_year.id
    JOIN
      master_academic_year AS course3_academic_year ON course3.academic_year = course3_academic_year.id
    LEFT JOIN
      ce_electives ON ce_onecredit_registered.elective = ce_electives.id
    LEFT JOIN
      master_students ON ce_onecredit_registered.student = master_students.register_number
    JOIN 
        master_branch ON master_students.department = master_branch.id
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
