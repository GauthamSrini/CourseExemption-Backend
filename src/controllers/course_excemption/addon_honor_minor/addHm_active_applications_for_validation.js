const { get_query_database } = require("../../../config/database_utils")

exports.get_active_applications_addHm_for_validation = async (req, res)=>{
    const {student,course_code} = req.query
    try {
        const query = `
            SELECT * FROM ce_addon_honor_minor_registered 
            WHERE student = ? AND course_code = ? AND status = '1'
        `;
        const rows = await get_query_database(query, [student, course_code]);

        if (rows.length > 0) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}  