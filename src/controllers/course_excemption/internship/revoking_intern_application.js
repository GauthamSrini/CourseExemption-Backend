const { post_query_database } = require("../../../config/database_utils");
const { get_query_database } = require("../../../config/database_utils")

exports.revoke_intern_status = async (req, res) => {
    const { userId, id, student, tracker } = req.body;
    
    try {
        // Fetch the current approval_status
        const fetchApprovalStatusQuery = 'SELECT approval_status, certificate_path FROM ce_intern_registered WHERE id = ?';
        const [currentApprovalStatus] = await get_query_database(fetchApprovalStatusQuery, [id]);

        if (!currentApprovalStatus) {
            return res.status(404).json({ error: "Student record not found" });
        }

        const approval_status = currentApprovalStatus.approval_status;
        const certificate = currentApprovalStatus.certificate_path;

        // Determine the new approval_status based on userId
        let newApprovalStatus;
        if ((userId === 5)&&(approval_status === 1)) {
            newApprovalStatus = 0;  
        } else if ((userId === 7)&&(approval_status === 2)) {
            newApprovalStatus = 1;  
        } else if ((userId === 8)&&(approval_status === 3)) {
            newApprovalStatus = 2;  
        } else if ((userId === 4)&&(approval_status === 4)) {
            newApprovalStatus = 3;  
        }else {
            return res.status(400).json({ error: "Invalid userId/You cannot Revoke it" });
        }

        let updateRegisteredQuery;
        if(userId===7 && tracker === 1 && (certificate === null || certificate === undefined)){
        updateRegisteredQuery = 'UPDATE ce_intern_registered SET tracker_approval = ? WHERE id = ?';
        newApprovalStatus = 0;
        }
        else
        {
        updateRegisteredQuery = 'UPDATE ce_intern_registered SET approval_status = ? WHERE id = ?';
        }
        await post_query_database(updateRegisteredQuery, [newApprovalStatus, id]);

        // If userId is 4, update the nptel column in ce_overal_total_exemption table
        if (userId === 4) {
            const updateExemptionQuery = 'UPDATE ce_overal_total_exemption SET intern = intern - 1 , total = total - 1 WHERE student = ?';
            await post_query_database(updateExemptionQuery, [student]);
        }

        res.status(200).json({ message: "Student status updated successfully" });

    } catch (err) {
        console.error("Error while updating student status", err);
        res.status(500).json({ error: "Error while updating student status" });
    }
};
