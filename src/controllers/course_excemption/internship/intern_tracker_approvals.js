const { get_query_database } = require("../../../config/database_utils")

exports.get_interns_approvals = async (req, res) => {
    const {approval_status } = req.query;

    try {
        const query = `SELECT 
        ce_intern_registered.id,
        master_students.name AS student_name,
        master_students.register_number AS register_number,
        master_students.year AS year,
        master_branch.branch,
        academic.academic_year,
        ce_intern_companies.company_name,
        ce_intern_companies.company_address,
        ce_intern_registered.mode,
        DATE_FORMAT(ce_intern_registered.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(ce_intern_registered.end_date, '%Y-%m-%d') AS end_date,
        ce_intern_registered.duration,
        ce_intern_registered.semester,
        ce_intern_registered.aim_objective_path,
        ce_intern_registered.approval_status,
        ce_intern_registered.tracker_approval,
        ce_intern_registered.remarks,
        ce_intern_registered.certificate_path,
        ce_intern_registered.rejected_by
    FROM ce_intern_registered 
    JOIN 
        master_students ON ce_intern_registered.student = master_students.register_number
    JOIN
        master_branch ON master_students.department = master_branch.id
    JOIN
        ce_intern_companies ON ce_intern_registered.industry = ce_intern_companies.id
    LEFT JOIN 
        ce_electives ON ce_intern_registered.elective = ce_electives.id
    LEFT JOIN
        master_academic_year academic ON ce_intern_registered.academic_year = academic.id
    WHERE 
        ce_intern_registered.tracker_approval = ?`
        const intern_approvals = await get_query_database(query,[approval_status])
        res.status(200).json(intern_approvals)
    } catch (err) {
        console.error("Error fetching registered details: ", err)
        res.status(500).json({
            err:"Error fetching registered details"
        })
    }
};
