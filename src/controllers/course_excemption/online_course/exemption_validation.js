const { get_query_database } = require("../../../config/database_utils")

exports.get_validation_status = async(req, res) => {
    try {
        const query = `SELECT * FROM ce_oc_exemption_validation`;
        const oc_validation = await get_query_database(query);
        res.status(200).json(oc_validation); // Assuming there will be only one record
    } catch (err) {
        console.error("Error fetching Online Course Platform:", err);
        res.status(500).json({
            err: "Error fetching Online Course Platform"
        });
    }
}