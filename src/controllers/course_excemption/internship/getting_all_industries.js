const { get_query_database } = require("../../../config/database_utils")

exports.get_all_industries = async(req, res) => {
    const {student} = req.query
    try {
        const query = `SELECT id, company_name, company_address, company_phone FROM ce_intern_companies WHERE id NOT IN (SELECT industry
    FROM ce_intern_registered WHERE student = ? AND status = '1')`
        const allIndusties = await get_query_database(query,[student])
        res.status(200).json(allIndusties)
    } catch (err) {
        console.error("Error fetching Industries", err)
        res.status(500).json({
            err: "Error"
        })
    }
}
