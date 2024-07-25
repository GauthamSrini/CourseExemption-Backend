const { get_query_database } = require("../../../config/database_utils")

exports.get_platform = async(req, res) => {
    try {
        const query = `SELECT id, name, excemption 
        FROM ce_oc_platform
        WHERE status = '1'`
        const oc_platform = await get_query_database(query)
        res.status(200).json(oc_platform)
    } catch (err) {
        console.error("Error fetching Online Course Platform:", err)
        res.status(500).json({
            err: "Error fetching Online Course Platform"
        })
    }
}

exports.get_platform_excemption = async (req, res) => {
    try {
        const { id } = req.query;
        const query = `SELECT excemption 
        FROM ce_oc_platform
        WHERE status = '1' AND id = ?`;
        const oc_platform = await get_query_database(query, [id]);
        res.status(200).json(oc_platform); // Assuming there will be only one record
    } catch (err) {
        console.error("Error fetching Online Course Platform:", err);
        res.status(500).json({
            err: "Error fetching Online Course Platform"
        });
    }
};
