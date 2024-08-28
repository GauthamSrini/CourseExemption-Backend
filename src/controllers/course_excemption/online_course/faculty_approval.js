const { get_query_database } = require("../../../config/database_utils")

exports.get_faculty_approvals = async (req, res) => {
    const { type, approval_status, department } = req.query;

    // Base query
    let query = `SELECT 
        ce_oc_registered.id, 
        ce_oc_registered.student AS student_id,
        ce_oc_platform.name AS platform_name,
        ce_oc_courselist.name AS course_name,
        ce_oc_courselist.course_code,
        ce_oc_courselist.duration,
        ce_oc_courselist.credit,
        master_students.name AS student_name,
        master_students.register_number AS register_number,
        master_students.year AS year,
        master_branch.branch,
        ce_oc_registered.type,
        master_academic_year.academic_year,
        ce_oc_registered.semester,
        DATE_FORMAT(ce_oc_registered.start_date, '%d-%m-%Y') AS start_date,
        DATE_FORMAT(ce_oc_registered.end_date, '%d-%m-%Y') AS end_date,
        DATE_FORMAT(ce_oc_registered.exam_date, '%d-%m-%Y') AS exam_date,
        ce_oc_registered.mark,
        ce_oc_registered.certificate_url,
        ce_oc_registered.certificate_path,
        ce_oc_registered.approval_status,
        ce_oc_certificate_types.type_name,
        ce_electives.elective,
        ce_oc_registered.remarks,
        ce_oc_registered.rejected_by,
        ce_oc_registered.status
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
    JOIN
        master_academic_year ON ce_oc_registered.academic_year = master_academic_year.id
    LEFT JOIN
        ce_oc_certificate_types ON ce_oc_registered.certificate_type = ce_oc_certificate_types.id
    LEFT JOIN
        ce_electives ON ce_oc_registered.elective = ce_electives.id
    WHERE 
        ce_oc_registered.type = ? AND ce_oc_registered.approval_status = ?`;

    // Parameters array
    const params = [type, approval_status];

    // Conditionally add the department filter if it is provided
    if (department) {
        query += " AND master_students.department = ?";
        params.push(department);
    }

    try {
        const faculty_approvals = await get_query_database(query, params);
        res.status(200).json(faculty_approvals);
    } catch (err) {
        console.error("Error fetching registered details: ", err);
        res.status(500).json({
            err: "Error fetching registered details"
        });
    }
};
