const { post_query_database } = require("../../../config/database_utils");

exports.post_approve_student = async (req, res) => {
    const { id, type, student } = req.body;
    let isFirstTrySuccessful = false;
    let approve_student = null;

    try {
        const query = 'UPDATE ce_oc_registered SET approval_status = 1 WHERE id = ?';
        approve_student = await post_query_database(query, [id]);
        isFirstTrySuccessful = true;
    } catch (err) {
        console.error("Error while Approving Student", err);
        return res.status(500).json({
            error: "Error while Approving Student"
        });
    }

    if (isFirstTrySuccessful) {
        try {
            if (type === "1") {
                const query2 = 'UPDATE students_course_exemption_status SET nptel = nptel+1 WHERE student= ?';
                const updateStatusExp = await post_query_database(query2, [student]);
                return res.status(200).json({ updateStatusExp, approve_student });
            } else if (type === "0") {
                const query3 = 'UPDATE students_rewards_status SET rewards_status = rewards_status+1 WHERE student= ?';
                const updateStatusRp = await post_query_database(query3, [student]);
                return res.status(200).json({ updateStatusRp, approve_student });
            }
        } catch (err) {
            console.error("Error while updating Student Status", err);
            return res.status(500).json({
                error: "Error while updating Student Status"
            });
        }
    }
};
