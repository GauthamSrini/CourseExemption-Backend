const { post_query_database } = require("../../../config/database_utils");
const { get_query_database } = require("../../../config/database_utils")

exports.revoke_addon_honor_minor = async (req, res) => {
    const { userId, id, student ,mode_of_exemption} = req.body;
    
    try {
        // Fetch the current approval_status
        const fetchApprovalStatusQuery = 'SELECT approval_status FROM ce_addon_honor_minor_registered WHERE id = ?';
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

        // Update the approval_status
        const updateRegisteredQuery = 'UPDATE ce_addon_honor_minor_registered SET approval_status = ? WHERE id = ?';
        const updateResult = await post_query_database(updateRegisteredQuery, [newApprovalStatus, id]);

        if (updateResult.affectedRows === 0) {
          throw new Error("Student revocation failed");
        }

        // If userId is 4, update the nptel column in ce_overal_total_exemption table
        if (userId === 4) {
            let columnToUpdate;
            if (mode_of_exemption === 1) {
              columnToUpdate = 'addon';
            } else if (mode_of_exemption === 2) {
              columnToUpdate = 'honor';
            } else if (mode_of_exemption === 3) {
              columnToUpdate = 'minor';
            }
      
            if (columnToUpdate) {
              const updateExemptionQuery = `UPDATE ce_overal_total_exemption SET ${columnToUpdate} = ${columnToUpdate} - 1, total = total - 1 WHERE student = ?`;
              await post_query_database(updateExemptionQuery, [student]);
            }
          }

        res.status(200).json({ message: "Student status updated successfully" });

    } catch (err) {
        console.error("Error while updating student status", err);
        res.status(500).json({ error: "Error while updating student status" });
    }
};
