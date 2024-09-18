const {
  post_query_database,
  get_query_database,
} = require("../../../config/database_utils");

exports.post_approve_internships = async (req, res) => {
  const { id, user_id, student, tracker } = req.body;

  try {
    // finding the cuurent approval Status
    const fetchApprovalStatusQuery =
      "SELECT approval_status FROM ce_intern_registered WHERE id = ?";
    const [currentApprovalStatus] = await get_query_database(
      fetchApprovalStatusQuery,
      [id]
    );

    if (!currentApprovalStatus) {
      return res.status(404).json({ error: "Student record not found" });
    }

    const approval_status = currentApprovalStatus.approval_status;
    // Increment the approval_status based on userId
    let queryUpdateApproval;
    if (user_id === 5 && approval_status === 0) {
      queryUpdateApproval =
        "UPDATE ce_intern_registered SET approval_status = 1 WHERE id = ?";
    } else if (user_id === 7) {
      if(tracker === true)
      queryUpdateApproval = "UPDATE ce_intern_registered SET tracker_approval = 1 WHERE id = ?";
      else if (approval_status === 1)
      queryUpdateApproval = "UPDATE ce_intern_registered SET approval_status = 2 WHERE id = ?";
    } else if (user_id === 8 && approval_status === 2) {
      queryUpdateApproval =
        "UPDATE ce_intern_registered SET approval_status = 3 WHERE id = ?";
    } else if (user_id === 4 && approval_status === 3) {
      queryUpdateApproval =
        "UPDATE ce_intern_registered SET approval_status = 4 WHERE id = ?";
    } else {
      return res
        .status(400)
        .json({ error: "Invalid userId/You cannot Approve it" });
    }

    const approve_student = await post_query_database(queryUpdateApproval, [
      id,
    ]);

    if (approve_student.affectedRows === 0) {
      throw new Error("Student approval failed");
    }

    if (user_id === 4) {
      // Get current values
      const queryGetValues =
        "SELECT nptel, one_credit, intern, addon, honor, minor FROM ce_overal_total_exemption WHERE student = ?";
      const result = await get_query_database(queryGetValues, [student]);

      let nptel = 0,
        oneCredit = 0,
        currentIntern = 0,
        addon = 0,
        honor = 0,
        minor = 0;

      if (result.length > 0) {
        nptel = result[0].nptel;
        oneCredit = result[0].one_credit;
        currentIntern = result[0].intern;
        addon = result[0].addon;
        honor = result[0].honor;
        minor = result[0].minor;

        // Update the nptel value by incrementing it by 1
        currentIntern += 1;
        const queryUpdateNptel =
          "UPDATE ce_overal_total_exemption SET intern = ? WHERE student = ?";
        await post_query_database(queryUpdateNptel, [currentIntern, student]);
      } else {
        currentIntern = 1;
        // Insert new record if the student doesn't exist in ce_overal_total_exemption
        const queryInsertNptel =
          "INSERT INTO ce_overal_total_exemption (student, nptel, one_credit, intern, addon, honor, minor, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await post_query_database(queryInsertNptel, [
          student,
          nptel,
          oneCredit,
          currentIntern,
          addon,
          honor,
          minor,
          currentIntern,
        ]);
      }

      // Calculate the new total
      const newTotal =
        nptel + oneCredit + currentIntern + addon + honor + minor;
      console.log("New Total:", newTotal);

      // Update the total column
      const queryUpdateTotal =
        "UPDATE ce_overal_total_exemption SET total = ? WHERE student = ?";
      const updateTotalResult = await post_query_database(queryUpdateTotal, [
        newTotal,
        student,
      ]);
      console.log("Update Total Result:", updateTotalResult);
    }

    res.status(200).json({ message: "Student approved successfully" });
  } catch (err) {
    console.error("Error while Approving Student", err);
    return res.status(500).json({
      error: "Error while Approving Student",
    });
  }
};
