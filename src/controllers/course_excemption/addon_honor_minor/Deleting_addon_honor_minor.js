const { post_query_database, get_query_database } = require("../../../config/database_utils");

exports.delete_addon_honor_minor = async (req, res) => {
  const { courseCode, student, modeOfExemption } = req.body;

  const CheckQuery = `SELECT * FROM ce_addon_honor_minor_registered WHERE course_code = ? AND student = ? AND status = '1'`;
  
  try {
    const checkResult = await get_query_database(CheckQuery, [courseCode,student]);

    if (checkResult.length === 0) {
      let query;
      
      if (modeOfExemption === null || modeOfExemption === undefined) {
        // Delete from ce_addon_mappings table
        query = `DELETE FROM ce_addon_mappings WHERE course_code = ? AND student = ?`;
      } else if (modeOfExemption === 1 || modeOfExemption === 2 || modeOfExemption === 3) {
        // Delete from ce_honor_minor_mappings table
        query = `DELETE FROM ce_honor_minor_mappings WHERE course_code = ? AND student = ?`;
      } else {
        let msg = "Invalid modeOfExemption value";
        console.error(msg);
        return res.status(400).json({ msg });
      }

      const deleteResult = await post_query_database(query, [courseCode, student]);
      res.status(200).json(deleteResult);
    } else {
      let msg = "Deleting Restricted Course is Applied For Exemption";
      console.error(msg);
      res.status(409).json({ msg });
    }
  } catch (err) {
    console.error("Error While Deleting the Course", err);
    res.status(500).json({
      err: "Error While Deleting the Course"
    });
  }
};
