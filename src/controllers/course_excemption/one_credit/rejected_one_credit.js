const { get_query_database } = require("../../../config/database_utils")

exports.get_rejected_one_credit = async (req, res) => {
    const {approval_status, rejected_by} = req.query;

    const query = `
    SELECT 
        oc.id, 
        s.name as student_name, 
        s.register_number, 
        s.year, 
        b.branch as branch, 
        oc.course_1 as course_1_code, 
        cl1.course_name as course_1_name, 
        ay1.academic_year as academic_year_1, 
        cl1.semester as semester_1, 
        oc.course_2 as course_2_code, 
        cl2.course_name as course_2_name, 
        ay2.academic_year as academic_year_2, 
        cl2.semester as semester_2, 
        oc.course_3 as course_3_code, 
        cl3.course_name as course_3_name, 
        ay3.academic_year as academic_year_3, 
        cl3.semester as semester_3, 
        e.elective as elective,
        oc.remarks,
        oc.rejected_by,
        oc.approval_status
    FROM ce_onecredit_registered oc
    JOIN master_students s ON oc.student = s.register_number
    JOIN master_branch b ON s.department = b.id
    LEFT JOIN ce_onecredit_courselist cl1 ON oc.course_1 = cl1.course_code
    LEFT JOIN ce_onecredit_courselist cl2 ON oc.course_2 = cl2.course_code
    LEFT JOIN ce_onecredit_courselist cl3 ON oc.course_3 = cl3.course_code
    LEFT JOIN master_academic_year ay1 ON cl1.academic_year = ay1.id
    LEFT JOIN master_academic_year ay2 ON cl2.academic_year = ay2.id
    LEFT JOIN master_academic_year ay3 ON cl3.academic_year = ay3.id
    LEFT JOIN ce_electives e ON oc.elective = e.id
    WHERE oc.approval_status = ? AND oc.status = '1' AND oc.rejected_by >= ?
`;
    try {
        const oneCredit_rejected = await get_query_database(query,[approval_status,rejected_by]);
        res.status(200).json(oneCredit_rejected);
    } catch (err) {
        console.error("Error fetching pending One Credit", err);
        res.status(500).json({
            err: "Error fetching pending One Credit"
        });
    }
};