const { get_query_database } = require("../../../config/database_utils")

exports.get_completed = async(req, res) => {
    try {
        const { student_id } = req.query;
        const query = `SELECT c.id, c.course_code, c.name, c.semester, a.academic_year FROM ce_onecredit_mappings c
        LEFT JOIN master_academic_year a ON c.academic_year = a.id WHERE student = ?`
        const oc_completed = await get_query_database(query,[student_id])
        res.status(200).json(oc_completed)
    } catch (err) {
        console.error("Error fetching One Credit Courses:", err)
        res.status(500).json({
            err: "Error"
        })
    }
}