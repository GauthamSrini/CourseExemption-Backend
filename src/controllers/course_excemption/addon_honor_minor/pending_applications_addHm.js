const { get_query_database } = require("../../../config/database_utils");

exports.get_pending_addon_honor_minor = async (req, res) => {
    const { approval_status, type } = req.query;
    console.log(parseInt(type));
    
    try {
        let modeCondition = "";
        if ( parseInt(type) === 1) {
            modeCondition = "AND a.mode_of_exemption = 1";
        } else if (parseInt(type) === 0) {
            modeCondition = "AND a.mode_of_exemption IN (2, 3)";
        }

        const query = `
            SELECT 
                a.id, 
                s.name AS student_name, 
                s.register_number, 
                s.year, 
                b.branch AS branch, 
                a.course_code, 
                a.course_name, 
                ay.academic_year, 
                a.semester, 
                e.elective, 
                a.mode_of_exemption, 
                a.approval_status, 
                a.remarks, 
                a.rejected_by 
            FROM ce_addon_honor_minor_registered a
            JOIN master_students s ON a.student = s.register_number
            JOIN master_branch b ON s.department = b.id
            JOIN master_academic_year ay ON a.academic_year = ay.id
            JOIN ce_electives e ON a.elective = e.id
            WHERE a.approval_status = ? AND a.status = '1' ${modeCondition}
        `;

        const students = await get_query_database(query, [approval_status]);
        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
