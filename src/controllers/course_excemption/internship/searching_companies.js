const { get_query_database } = require("../../../config/database_utils")

exports.get_company_list = async(req, res) => {
    try {
        const { name } = req.query;
        const query = `SELECT id, company_name, company_address, company_phone FROM ce_intern_companies WHERE company_name LIKE ? OR company_address LIKE ?
        OR company_phone LIKE ?`
        const oc_platform = await get_query_database(query,[`%${name}%`,`%${name}%`,`%${name}%`])
        res.status(200).json(oc_platform)
    } catch (err) {
        console.error("Error fetching Online Course Platform:", err)
        res.status(500).json({
            err: "Error fetching Online Course Platform"
        })
    }
}