const { post_query_database } = require("../../../config/database_utils");
const { get_query_database } = require("../../../config/database_utils")

exports.revoke_one_credit_status = async (req, res) => {
    const { userId, id, student } = req.body;
    
    try {
        // Fetch the current approval_status
        const fetchApprovalStatusQuery = 'SELECT approval_status FROM ce_onecredit_registered WHERE id = ?';
        const [currentApprovalStatus] = await get_query_database(fetchApprovalStatusQuery, [id]);

        if (!currentApprovalStatus) {
            return res.status(404).json({ error: "Student record not found" });
        }
        const approval_status = currentApprovalStatus.approval_status;
         // Determine the new approval_status based on userId
         let newApprovalStatus;
         if ((userId === 2)&&(approval_status === 1)) {
             newApprovalStatus = 0;  // assuming we want to set it back to the initial state
         } else if ((userId === 3)&&(approval_status === 2)) {
             newApprovalStatus = 1;  // assuming we want to set it to the previous state
         } else if ((userId === 4)&&(approval_status === 3)) {
             newApprovalStatus = 2;  // assuming we want to set it to the previous state
         } else {
             return res.status(400).json({ error: "Invalid userId/You cannot Revoke it" });
         }

        // Update the approval_status by decreasing its value by one
        const updateRegisteredQuery = 'UPDATE ce_onecredit_registered SET approval_status = ? WHERE id = ?';
        await post_query_database(updateRegisteredQuery, [newApprovalStatus, id]);

        // If userId is 4, update the nptel column in ce_overal_total_exemption table
        if (userId === 4) {
            const updateExemptionQuery = 'UPDATE ce_overal_total_exemption SET one_credit = one_credit - 1 , total = total - 1 WHERE student = ?';
            await post_query_database(updateExemptionQuery, [student]);
        }

        res.status(200).json({ message: "Student status updated successfully" });

    } catch (err) {
        console.error("Error while updating student status", err);
        res.status(500).json({ error: "Error while updating student status" });
    }
};
