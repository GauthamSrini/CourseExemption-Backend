const { post_query_database } = require("../../../config/database_utils");

exports.post_clearance_one_credit = async (req, res) => {
  try {
    const { studentId } = req.body;

    const query = `UPDATE ce_onecredit_registered  SET status = '0' WHERE student = ?`;
    await post_query_database(query,[studentId]);

    return res.status(200).json({ message: 'Cleared Successfully' });
  } catch (error) {
    console.error('Error clearing the db:', error);
    return res.status(500).json({ error: 'Failed to clear' });
  }
};
