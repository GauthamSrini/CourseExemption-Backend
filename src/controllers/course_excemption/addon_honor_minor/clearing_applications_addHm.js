const { post_query_database } = require("../../../config/database_utils");

exports.post_clearance_addon_honor_minor = async (req, res) => {
  try {
    const { id } = req.body;  

    const query = `UPDATE ce_addon_honor_minor_registered  SET status = '0' WHERE id = ?`;
    await post_query_database(query,[id]);

    return res.status(200).json({ message: 'Cleared Successfully' });
  } catch (error) {
    console.error('Error clearing the db:', error);
    return res.status(500).json({ error: 'Failed to clear' });
  }
};
