const { get_query_database } = require("../../../config/database_utils")

exports.get_mode_of_exemption = async(req, res) => {
    try {
        const query = `SELECT id, mode_of_exemption FROM ce_mode_of_exemption`
        const mode_of_exemption = await get_query_database(query)
        res.status(200).json(mode_of_exemption)
    } catch (err) {
        console.error("Error fetching One Credit Courses:", err)
        res.status(500).json({
            err: "Error"
        })
    }
}