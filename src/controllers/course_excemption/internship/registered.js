const { get_query_database } = require("../../../config/database_utils")

exports.get_registered_intern = async(req, res)=>{
    const { student } = req.query;
    try {
        const query = `SELECT 
        ce_intern_registered.id,
        master_students.name,
        academic.academic_year,
        ce_intern_companies.company_name,
        ce_intern_companies.company_address,
        ce_intern_registered.mode,
        DATE_FORMAT(ce_intern_registered.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(ce_intern_registered.end_date, '%Y-%m-%d') AS end_date,
        ce_intern_registered.duration,
        ce_intern_registered.stipend,
        ce_intern_registered.semester,
        ce_intern_registered.amount,
        ce_intern_registered.type,
        ce_intern_registered.report_path,
        ce_intern_registered.certificate_path,
        ce_electives.elective,
        ce_intern_registered.approval_status,
        ce_intern_registered.remarks,
        ce_intern_registered.rejected_by
    FROM ce_intern_registered 
    JOIN 
        master_students ON ce_intern_registered.student = master_students.register_number
    JOIN
        ce_intern_companies ON ce_intern_registered.industry = ce_intern_companies.id
    LEFT JOIN 
        ce_electives ON ce_intern_registered.elective = ce_electives.id
    LEFT JOIN
        master_academic_year academic ON ce_intern_registered.academic_year = academic.id
    WHERE 
        ce_intern_registered.student = ?`
        const registered_details = await get_query_database(query,[student])
        res.status(200).json(registered_details)
    } catch (err) {
        console.error("Error fetching registered details: ", err)
        res.status(500).json({
            err:"Error fetching registered details"
        })
    }
}

