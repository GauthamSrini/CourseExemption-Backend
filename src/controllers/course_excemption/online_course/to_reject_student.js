const { post_query_database, get_query_database } = require("../../../config/database_utils");

exports.post_reject_student = async (req, res) => {
    const { remark, id ,user_id } = req.body;

    try {
        // Step 1: Fetch the current approval_status
        const queryFetchStatus = 'SELECT approval_status FROM ce_oc_registered WHERE id = ?';
        const result = await get_query_database(queryFetchStatus, [id]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'Student record not found' });
        }

        const currentApprovalStatus = result[0].approval_status;

        //checking the updation is valid based on the userid and the approval_status
        let isAllowedToUpdate = false;
        if (user_id === 5 && currentApprovalStatus === 0) {
            isAllowedToUpdate = true;
        } else if (user_id === 6 && currentApprovalStatus === 1) {
            isAllowedToUpdate = true;
        } else if (user_id === 4 && currentApprovalStatus === 2) {
            isAllowedToUpdate = true;
        }

        if (!isAllowedToUpdate) {
            return res.status(400).json({ error: 'Invalid userId or approval status for rejection' });
        }

        // Step 2: Update the respective row
        const queryUpdate = `
            UPDATE ce_oc_registered 
            SET approval_status = -1, remarks = ?, status = '0', rejected_by = ? 
            WHERE id = ?
        `;
        await post_query_database(queryUpdate, [remark, (currentApprovalStatus+1), id]);

        res.status(200).json({ message: 'Student rejected successfully' });
    } catch (err) {
        console.error("Error while Rejecting Student", err);
        res.status(500).json({
            error: "Error while Rejecting Student"
        });
    }
};
