const { get_query_database } = require("../../../config/database_utils")

exports.get_CourseList_one_credit = async(req, res) => {
    try {
        const { name } = req.query;
        const query = `SELECT ce_onecredit_mappings.id,ce_onecredit_mappings.course_code,ce_onecredit_mappings.name,ce_onecredit_mappings.student,academic.academic_year,
        ce_onecredit_mappings.semester FROM ce_onecredit_mappings JOIN master_academic_year AS academic ON ce_onecredit_mappings.academic_year = academic.id
        WHERE ce_onecredit_mappings.course_code LIKE ? OR ce_onecredit_mappings.name LIKE ?
        OR ce_onecredit_mappings.student LIKE ?`
        const oc_platform = await get_query_database(query,[`%${name}%`,`%${name}%`,`%${name}%`])
        res.status(200).json(oc_platform)
    } catch (err) {
        console.error("Error fetching in course data", err)
        res.status(500).json({
            err: "Error fetching in course Data"
        })
    }
}