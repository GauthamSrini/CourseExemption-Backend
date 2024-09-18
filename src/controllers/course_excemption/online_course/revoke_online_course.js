const { post_query_database } = require("../../../config/database_utils");
const { get_query_database } = require("../../../config/database_utils")

exports.revoke_student_status = async (req, res) => {
    const { userId, id, student } = req.body;
    
    try {
        // Fetch the current approval_status
        const fetchApprovalStatusQuery = 'SELECT approval_status FROM ce_oc_registered_sample WHERE id = ?';
        const [currentApprovalStatus] = await get_query_database(fetchApprovalStatusQuery, [id]);

        if (!currentApprovalStatus) {
            return res.status(404).json({ error: "Student record not found" });
        }
        const approval_status = currentApprovalStatus.approval_status;

         // Determine the new approval_status based on userId
         let newApprovalStatus;
         if ((userId === 5)&&(approval_status === 1)) {
             newApprovalStatus = 0;  
         } else if ((userId === 6)&&(approval_status === 2)) {
             newApprovalStatus = 1;  
         } else if ((userId === 4)&&(approval_status === 3)) {
             newApprovalStatus = 2;  
         } else {
             return res.status(400).json({ error: "Invalid userId/You cannot Revoke it" });
         }

        const updateRegisteredQuery = 'UPDATE ce_oc_registered_sample SET approval_status = ? WHERE id = ?';
        await post_query_database(updateRegisteredQuery, [newApprovalStatus, id]);

        // If userId is 4, update the nptel column in ce_overal_total_exemption table
        if (userId === 4) {
            const updateExemptionQuery = 'UPDATE ce_overal_total_exemption SET nptel = nptel - 1 , total = total - 1 WHERE student = ?';
            await post_query_database(updateExemptionQuery, [student]);
        }

        res.status(200).json({ message: "Student status updated successfully" });

    } catch (err) {
        console.error("Error while updating student status", err);
        res.status(500).json({ error: "Error while updating student status" });
    }
};
