const { get_query_database } = require("../../config/database_utils");

exports.get_academic_semester = async (req, res) => {
  const { id } = req.query;

  try {
    // Fetch the academic year record based on the provided id
    const academicYearQuery = `SELECT odd_even FROM master_academic_year WHERE id = ?`;
    const academicYearResults = await get_query_database(academicYearQuery, [id]);

    if (academicYearResults.length === 0) {
      return res.status(404).json({ msg: "Academic year not found" });
    }

    const oddEven = academicYearResults[0].odd_even;

    // Determine which semester record to fetch based on odd_even value
    let semesterQuery = `SELECT * FROM master_academic_semester WHERE id = ?`;
    const semesterResults = await get_query_database(semesterQuery, [oddEven]);

    res.status(200).json(semesterResults);
  } catch (err) {
    console.error("Error fetching academic year:", err);
    res.status(500).json({
      err: "Error fetching academic year"
    });
  }
};