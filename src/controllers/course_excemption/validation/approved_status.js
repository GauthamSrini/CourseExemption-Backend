const { get_query_database } = require("../../../config/database_utils")

exports.get_approved_status = async (req, res) => {
    try {
        const { student } = req.query;
        const query = `SELECT * FROM ce_overal_total_exemption WHERE student = ?`;
        const [all_status] = await get_query_database(query, [student]);
        
        // Check if the query returned no rows
        if (!all_status) {
            res.status(200).json({
                approved_nptel: 0,
                approved_oneCredit: 0,
                approved_internship: 0,
                approved_addon: 0,
                approved_honor: 0,
                approved_minor: 0,
                approved_total : 0,
            });
            return;
        }
        const approved_nptel = all_status.nptel;
        const approved_oneCredit = all_status.one_credit;
        const approved_internship = all_status.intern;
        const approved_addon = all_status.addon;
        const approved_honor = all_status.honor;
        const approved_minor = all_status.minor;
        const approved_total = all_status.total;
        
        res.status(200).json({
            approved_nptel,
            approved_oneCredit,
            approved_internship,
            approved_addon,
            approved_honor,
            approved_minor,
            approved_total
        });
    } catch (err) {
        console.error("Error fetching Online Course Platform:", err);
        res.status(500).json({
            err: "Error fetching Online Course Platform"
        });
    }
}