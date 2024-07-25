const { get_query_database } = require("../../../config/database_utils")

exports.get_registered = async(req, res)=>{
    const { student } = req.query;
    try {
        const query = `SELECT 
        ce_oc_registered.id,
        ce_oc_platform.name AS platform_name,
        ce_oc_courselist.name AS course_name,
        master_students.name AS student_name,
        ce_oc_registered.type,
        ce_oc_registered.semester,
        DATE_FORMAT(ce_oc_registered.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(ce_oc_registered.end_date, '%Y-%m-%d') AS end_date,
        DATE_FORMAT(ce_oc_registered.exam_date, '%Y-%m-%d') AS exam_date,
        ce_oc_registered.mark,
        ce_oc_registered.certificate_url,
        ce_oc_registered.certificate_path,
        ce_oc_registered.approval_status,
        ce_oc_certificate_types.type_name,
        ce_oc_registered.remarks,
        ce_oc_registered.status
    FROM 
        ce_oc_registered
    JOIN 
        ce_oc_courselist ON ce_oc_registered.course = ce_oc_courselist.id
    JOIN 
        master_students ON ce_oc_registered.student = master_students.register_number
    JOIN 
        ce_oc_platform ON ce_oc_courselist.platform = ce_oc_platform.id
    LEFT JOIN
        ce_oc_certificate_types ON ce_oc_registered.certificate_type = ce_oc_certificate_types.id
    WHERE 
        ce_oc_registered.student = ?`
        const registered_details = await get_query_database(query,[student])
        res.status(200).json(registered_details)
    } catch (err) {
        console.error("Error fetching registered details: ", err)
        res.status(500).json({
            err:"Error fetching registered details"
        })
    }
}


