// const { get_query_database } = require("../../../config/database_utils")

// exports.get_rejected_applications = async (req, res) => {
//     const { type, approval_status, department, rejected_by } = req.query;

//     // Base query
//     let query = `SELECT 
//         ce_oc_registered.id, 
//         ce_oc_registered.student AS student_id,
//         ce_oc_platform.name AS platform_name,
//         ce_oc_courselist.name AS course_name,
//         ce_oc_courselist.course_code,
//         ce_oc_courselist.duration,
//         ce_oc_courselist.credit,
//         master_students.name AS student_name,
//         master_students.register_number AS register_number,
//         master_students.year AS year,
//         master_branch.branch,
//         ce_oc_registered.type,
//         master_academic_year.academic_year,
//         ce_oc_registered.semester,
//         DATE_FORMAT(ce_oc_registered.start_date, '%d/%m/%Y') AS start_date,
//         DATE_FORMAT(ce_oc_registered.end_date, '%d/%m/%Y') AS end_date,
//         DATE_FORMAT(ce_oc_registered.exam_date, '%d/%m/%Y') AS exam_date,
//         ce_oc_registered.mark,
//         ce_oc_registered.certificate_url,
//         ce_oc_registered.certificate_path,
//         ce_oc_registered.approval_status,
//         ce_oc_certificate_types.type_name,
//         ce_electives.elective,
//         ce_oc_registered.remarks,
//         ce_oc_registered.rejected_by,
//         ce_oc_registered.status
//     FROM 
//         ce_oc_registered
//     JOIN 
//         ce_oc_courselist ON ce_oc_registered.course = ce_oc_courselist.id
//     JOIN 
//         master_students ON ce_oc_registered.student = master_students.register_number
//     JOIN
//         master_branch ON master_students.department = master_branch.id
//     JOIN 
//         ce_oc_platform ON ce_oc_courselist.platform = ce_oc_platform.id
//     JOIN
//         master_academic_year ON ce_oc_registered.academic_year = master_academic_year.id
//     JOIN
//         ce_oc_certificate_types ON ce_oc_registered.certificate_type = ce_oc_certificate_types.id
//     JOIN
//         ce_electives ON ce_oc_registered.elective = ce_electives.id
//     WHERE 
//         ce_oc_registered.type = ? AND ce_oc_registered.approval_status = ? AND ce_oc_registered.rejected_by >= ? `;

//     // Parameters array
//     const params = [type, approval_status, rejected_by];

//     // Conditionally add the department filter if it is provided
//     if (department) {
//         query += " AND master_students.department = ?";
//         params.push(department);
//     }

//     try {
//         const faculty_approvals = await get_query_database(query, params);
//         res.status(200).json(faculty_approvals);
//     } catch (err) {
//         console.error("Error fetching registered details: ", err);
//         res.status(500).json({
//             err: "Error fetching registered details"
//         });
//     }
// };

const { get_query_database } = require("../../../config/database_utils");

exports.get_rejected_applications = async (req, res) => {
  const { type, approval_status, department ,rejected_by} = req.query;
  try {
    let query = `
      SELECT 
        ce_oc_registered_sample.id,
        master_students.name AS student_name,
        ce_oc_registered_sample.type,
        ce_oc_registered_sample.student AS register_number,
        master_branch.branch AS branch,

        -- Course 1 details
        course1.name AS course_name1,
        course1.course_code AS course_code1,
        course1.duration AS duration1,
        course1.credit AS credit1,
        platform1.name AS platform_name1,
        academic1.academic_year AS academic_year1,
        details1.semester AS semester1,
        DATE_FORMAT(details1.start_date, '%d-%m-%Y') AS start_date_1,
        DATE_FORMAT(details1.end_date, '%d-%m-%Y') AS end_date_1,
        DATE_FORMAT(details1.exam_date, '%d-%m-%Y') AS exam_date_1,
        details1.marks AS marks1,
        details1.certificate_url AS certificate_url1,
        details1.certificate_path AS certificate_path1,
        cerf1.type_name AS certificate_type1,

        -- Course 2 details (if exists)
        course2.name AS course_name2,
        course2.course_code AS course_code2,
        course2.duration AS duration2,
        course2.credit AS credit2,
        platform2.name AS platform_name2,
        academic2.academic_year AS academic_year2,
        details2.semester AS semester2,
        DATE_FORMAT(details2.start_date, '%d-%m-%Y') AS start_date_2,
        DATE_FORMAT(details2.end_date, '%d-%m-%Y') AS end_date_2,
        DATE_FORMAT(details2.exam_date, '%d-%m-%Y') AS exam_date_2,
        details2.marks AS marks2,
        details2.certificate_url AS certificate_url2,
        details2.certificate_path AS certificate_path2,
        cerf2.type_name AS certificate_type2,

        -- Course 3 details (if exists)
        course3.name AS course_name3,
        course3.course_code AS course_code3,
        course3.duration AS duration3,
        course3.credit AS credit3,
        platform3.name AS platform_name3,
        academic3.academic_year AS academic_year3,
        details3.semester AS semester3,
        DATE_FORMAT(details3.start_date, '%d-%m-%Y') AS start_date_3,
        DATE_FORMAT(details3.end_date, '%d-%m-%Y') AS end_date_3,
        DATE_FORMAT(details3.exam_date, '%d-%m-%Y') AS exam_date_3,
        details3.marks AS marks3,
        details3.certificate_url AS certificate_url3,
        details3.certificate_path AS certificate_path3,
        cerf3.type_name AS certificate_type3,

        ce_oc_registered_sample.mark_sheet_path,
        ce_oc_registered_sample.remarks,
        ce_oc_registered_sample.rejected_by,
        ce_oc_registered_sample.approval_status,
        elective1.elective AS elective1,
        elective2.elective AS elective2,
        ce_oc_registered_sample.status
      FROM 
        ce_oc_registered_sample
      JOIN 
        master_students ON ce_oc_registered_sample.student = master_students.register_number
      JOIN
        master_branch ON master_students.department = master_branch.id
      LEFT JOIN
        ce_electives AS elective1 ON ce_oc_registered_sample.elective_1 = elective1.id
      LEFT JOIN
        ce_electives AS elective2 ON ce_oc_registered_sample.elective_2 = elective2.id

      -- Join for Course 1
      LEFT JOIN 
        ce_oc_courselist AS course1 ON ce_oc_registered_sample.course_1 = course1.id
      LEFT JOIN 
        ce_oc_platform AS platform1 ON course1.platform = platform1.id
      LEFT JOIN 
        ce_oc_course_details AS details1 ON ce_oc_registered_sample.c1_details = details1.id
      LEFT JOIN
        master_academic_year AS academic1 ON details1.academic_year = academic1.id
      LEFT JOIN
        ce_oc_certificate_types AS cerf1 ON details1.certificate_type = cerf1.id
      
      -- Join for Course 2 (if exists)
      LEFT JOIN 
        ce_oc_courselist AS course2 ON ce_oc_registered_sample.course_2 = course2.id
      LEFT JOIN 
        ce_oc_platform AS platform2 ON course2.platform = platform2.id
      LEFT JOIN 
        ce_oc_course_details AS details2 ON ce_oc_registered_sample.c2_details = details2.id
      LEFT JOIN
        master_academic_year AS academic2 ON details2.academic_year = academic2.id
      LEFT JOIN
        ce_oc_certificate_types AS cerf2 ON details2.certificate_type = cerf2.id

      -- Join for Course 3 (if exists)
      LEFT JOIN 
        ce_oc_courselist AS course3 ON ce_oc_registered_sample.course_3 = course3.id
      LEFT JOIN 
        ce_oc_platform AS platform3 ON course3.platform = platform3.id
      LEFT JOIN 
        ce_oc_course_details AS details3 ON ce_oc_registered_sample.c3_details = details3.id
      LEFT JOIN
        master_academic_year AS academic3 ON details3.academic_year = academic3.id
      LEFT JOIN
        ce_oc_certificate_types AS cerf3 ON details3.certificate_type = cerf3.id

      WHERE 
        ce_oc_registered_sample.type = ? AND ce_oc_registered_sample.approval_status = ? AND ce_oc_registered_sample.rejected_by >= ? `;

    // Parameters array
    const params = [type, approval_status, rejected_by];

    // Conditionally add the department filter if it is provided
    if (department) {
        query += " AND master_students.department = ?";
        params.push(department);
    }

    const faculty_approvals = await get_query_database(query,params);
    res.status(200).json(faculty_approvals);
  } catch (err) {
    console.error("Error fetching registered sample details: ", err);
    res.status(500).json({
      err: "Error fetching registered sample details",
    });
  }
};