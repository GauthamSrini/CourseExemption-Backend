const { get_query_database } = require("../../../config/database_utils")

exports.get_approval_members = async(req, res) => {
    try {
        const query = `SELECT id, member FROM ce_intern_approval_members`
        const approval_members = await get_query_database(query)
        res.status(200).json(approval_members)
    } catch (err) {
        console.error("Error fetching One Credit Courses:", err)
        res.status(500).json({
            err: "Error"
        })
    }
}