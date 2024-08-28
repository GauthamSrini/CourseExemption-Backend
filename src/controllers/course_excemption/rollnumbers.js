const { get_query_database } = require("../../config/database_utils")

exports.get_available_rollnumbers = async(req, res) =>{
    try {
        const query = `SELECT register_number FROM master_students`
        const data = await get_query_database(query)
        res.status(200).json(data)
    } catch (err) {
        console.error("Error fetching available:",err)
        res.status(500).json({
            error: "Error fetching available"
        })
    }
}