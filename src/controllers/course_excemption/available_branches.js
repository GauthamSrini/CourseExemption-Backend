const { get_query_database } = require("../../config/database_utils")

exports.get_available_branchs = async(req, res) =>{
    try {
        const query = `SELECT id, branch
        FROM master_branch
        WHERE status = '1'`
        const data = await get_query_database(query)
        res.status(200).json(data)
    } catch (err) {
        console.error("Error fetching available:",err)
        res.status(500).json({
            error: "Error fetching available"
        })
    }
}