const { get_query_database } = require("../../../config/database_utils")

exports.get_CourseListEdit = async(req, res) => {
    try {
        const { name } = req.query;
        const query = `SELECT l.id, l.course_code, p.name as platform, l.name, l.duration, l.credit, l.excemption FROM ce_oc_courselist l 
        INNER JOIN ce_oc_platform p ON l.platform = p.id WHERE l.name LIKE ?`
        const oc_platform = await get_query_database(query,[`%${name}%`])
        res.status(200).json(oc_platform)
    } catch (err) {
        console.error("Error fetching Online Course Platform:", err)
        res.status(500).json({
            err: "Error fetching Online Course Platform"
        })
    }
}