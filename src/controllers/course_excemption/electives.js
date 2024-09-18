const { get_query_database } = require("../../config/database_utils");

exports.get_available_elective = async (req,res) => {
  const {student} = req.query;
    try {
        // SQL query to fetch available electives
        const sqlQuery = `
          SELECT e.id, e.elective
          FROM ce_electives e
          WHERE e.id NOT IN (
            SELECT elective_1 FROM ce_oc_registered_sample WHERE status = '1' AND type = '1' AND student = ?
            UNION
            SELECT elective_2 FROM ce_oc_registered_sample WHERE status = '1' AND type = '1' AND student = ?
            UNION
            SELECT elective FROM ce_onecredit_registered WHERE status = '1' AND student = ?
            UNION
            SELECT elective FROM ce_intern_registered WHERE status = '1' AND type = '1' AND student = ?
            UNION
            SELECT elective FROM ce_addon_honor_minor_registered WHERE status = '1' AND student = ?
          );
        `;
    
        // Execute the query
        const results = await get_query_database(sqlQuery,[student,student,student,student,student]);
    
        // Return the results
        res.status(200).json(results);
      } catch (error) {
        console.error('Error fetching available electives:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}