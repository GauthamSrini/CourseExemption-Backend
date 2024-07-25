const { get_query_database } = require("../../../config/database_utils")

exports.get_completed = async(req, res) => {
    try {
        const { student_id } = req.query;
        const query = `SELECT id, course_code, name, semester FROM ce_onecredit_mappings WHERE student = ?`
        const oc_completed = await get_query_database(query,[student_id])
        res.status(200).json(oc_completed)
    } catch (err) {
        console.error("Error fetching One Credit Courses:", err)
        res.status(500).json({
            err: "Error"
        })
    }
}