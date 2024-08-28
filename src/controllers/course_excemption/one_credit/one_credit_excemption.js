const { get_query_database } = require("../../../config/database_utils")

exports.get_one_credit_excemption = async(req, res) => {
    try {
        const { student_id } = req.query;
        const query = `SELECT
        ce_excemption.id,
        course1.course_name AS course_id_1_name,
        course2.course_name AS course_id_2_name,
        course3.course_name AS course_id_3_name,
        ce_excemption.remarks,
        ce_electives.elective,
        ce_excemption.approval_status,
        ce_excemption.rejected_by
    FROM    
        ce_onecredit_registered AS ce_excemption
    JOIN
        ce_onecredit_courselist AS course1 ON ce_excemption.course_1 = course1.course_code
    JOIN
        ce_onecredit_courselist AS course2 ON ce_excemption.course_2 = course2.course_code
    JOIN
        ce_onecredit_courselist AS course3 ON ce_excemption.course_3 = course3.course_code
    LEFT JOIN 
        ce_electives ON ce_excemption.elective = ce_electives.id
    WHERE
        ce_excemption.student = ?
        AND ce_excemption.status = '1'`
        const oc_excemption = await get_query_database(query,[student_id])
        res.status(200).json(oc_excemption)
    } catch (err) {
        console.error("Error fetching One Credit Courses:", err)
        res.status(500).json({
            err: "Error"
        })
    }
}