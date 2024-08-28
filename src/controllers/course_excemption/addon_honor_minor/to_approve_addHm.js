const {
    post_query_database,
    get_query_database,
  } = require("../../../config/database_utils");
  
  exports.post_approve_addon_honor_minor = async (req, res) => {
    const { id, user_id, student, mode_of_exemption } = req.body;
  
    try {

      const fetchApprovalStatusQuery = 'SELECT approval_status FROM ce_addon_honor_minor_registered WHERE id = ?';
      const [currentApprovalStatus] = await get_query_database(fetchApprovalStatusQuery, [id]);

      if (!currentApprovalStatus) {
          return res.status(404).json({ error: "Student record not found" });
      }

      const approval_status = currentApprovalStatus.approval_status;
      // Increment the approval_status based on userId
      let queryUpdateApproval;
      if ((user_id === 2)&&(approval_status === 0)) {
        queryUpdateApproval = "UPDATE ce_addon_honor_minor_registered SET approval_status = 1 WHERE id = ?";
      } else if ((user_id === 3)&&(approval_status === 1)) {
        queryUpdateApproval = "UPDATE ce_addon_honor_minor_registered SET approval_status = 2 WHERE id = ?";
      } else if ((user_id === 4)&&(approval_status === 2)) {
        queryUpdateApproval = "UPDATE ce_addon_honor_minor_registered SET approval_status = 3 WHERE id = ?";
      } else {
        return res.status(400).json({ error: "Invalid userId/You cannot Approve it" });
      }

      const approve_student = await post_query_database(queryUpdateApproval, [id]);
  
      if (approve_student.affectedRows === 0) {
        throw new Error("Student approval failed");
      }
  
      if (user_id === 4) {
        // Get current values
        const queryGetValues =
          "SELECT nptel, one_credit, intern, addon, honor, minor FROM ce_overal_total_exemption WHERE student = ?";
        const result = await get_query_database(queryGetValues, [student]);
  
        let nptel = 0, one_credit = 0, intern = 0, addon = 0, honor = 0, minor = 0;
  
        if (result.length > 0) {
          nptel = result[0].nptel;
          one_credit = result[0].one_credit;
          intern = result[0].intern;
          addon = result[0].addon;
          honor = result[0].honor;
          minor = result[0].minor;
        }
  
        if (mode_of_exemption === 1) {
          addon += 1;
        } else if (mode_of_exemption === 2) {
          honor += 1;
        } else if (mode_of_exemption === 3) {
          minor += 1;
        }
  
        const newTotal = nptel + one_credit + intern + addon + honor + minor;
        console.log("New Total:", newTotal);
  
        if (result.length > 0) {
          const queryUpdateExemption =
            "UPDATE ce_overal_total_exemption SET addon = ?, honor = ?, minor = ?, total = ? WHERE student = ?";
          await post_query_database(queryUpdateExemption, [
            addon, honor, minor, newTotal, student
          ]);
        } else {
          const queryInsertExemption =
            "INSERT INTO ce_overal_total_exemption (student, nptel, one_credit, intern, addon, honor, minor, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
          await post_query_database(queryInsertExemption, [
            student, nptel, one_credit, intern, addon, honor, minor, newTotal
          ]);
        }
      }
  
      res.status(200).json({ message: "Student approved successfully" });
    } catch (err) {
      console.error("Error while Approving Student", err);
      return res.status(500).json({
        error: "Error while Approving Student",
      });
    }
  };
  