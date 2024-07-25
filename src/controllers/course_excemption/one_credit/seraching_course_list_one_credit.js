const { get_query_database } = require("../../../config/database_utils")

exports.get_CourseList_one_credit = async(req, res) => {
    try {
        const { name } = req.query;
        const query = `SELECT id, course_code, name, student, semester FROM ce_onecredit_mappings WHERE course_code LIKE ? OR name LIKE ?
        OR student LIKE ?`
        const oc_platform = await get_query_database(query,[`%${name}%`,`%${name}%`,`%${name}%`])
        res.status(200).json(oc_platform)
    } catch (err) {
        console.error("Error fetching Online Course Platform:", err)
        res.status(500).json({
            err: "Error fetching Online Course Platform"
        })
    }
}