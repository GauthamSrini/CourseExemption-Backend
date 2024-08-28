const { get_query_database } = require("../../../config/database_utils")

exports.get_rejected_interns = async (req, res) => {
    const { type, approval_status, department, rejected_by } = req.query;

    // Base query
    let query = `SELECT 
        ce_intern_registered.id, 
        ce_intern_registered.student AS student_id,
        ce_intern_companies.company_name,
        ce_intern_companies.company_address,
        master_students.name AS student_name,
        master_students.register_number AS register_number,
        master_students.year AS year,
        master_branch.branch,
        ce_intern_registered.type,
        master_academic_year.academic_year,
        ce_intern_registered.semester,
        DATE_FORMAT(ce_intern_registered.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(ce_intern_registered.end_date, '%Y-%m-%d') AS end_date,
        ce_intern_registered.mode,
        ce_intern_registered.duration,
        ce_intern_registered.stipend,
        ce_intern_registered.amount,
        ce_intern_registered.report_path,
        ce_intern_registered.certificate_path,
        ce_intern_registered.approval_status,
        ce_electives.elective,
        ce_intern_registered.remarks,
        ce_intern_registered.rejected_by,
        ce_intern_registered.status
    FROM 
        ce_intern_registered
    JOIN 
        master_students ON ce_intern_registered.student = master_students.register_number
    JOIN
        master_branch ON master_students.department = master_branch.id
    JOIN
        master_academic_year ON ce_intern_registered.academic_year = master_academic_year.id
    JOIN
        ce_intern_companies ON ce_intern_registered.industry = ce_intern_companies.id
    LEFT JOIN
        ce_electives ON ce_intern_registered.elective = ce_electives.id
    WHERE 
        ce_intern_registered.type = ? AND ce_intern_registered.approval_status = ? AND ce_intern_registered.rejected_by >= ?`;

    // Parameters array
    const params = [type, approval_status, rejected_by];

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
