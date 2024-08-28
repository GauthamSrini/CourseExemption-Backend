const { post_query_database, get_query_database } = require("../../../config/database_utils");

exports.add_company = async (req, res) => {
  let { companyName, companyAddress, companyPhoneNumber } = req.body;
  companyName = companyName.toUpperCase();
  companyAddress = companyAddress.toUpperCase();
  try {
    // Check if the company name and address combination already exists
    const checkQuery = `SELECT * FROM ce_intern_companies WHERE company_name = ? AND company_address = ?`;
    const checkResult = await get_query_database(checkQuery, [companyName, companyAddress]);

    if (checkResult.length > 0) {
      // If the combination exists, do not add to the table
      let msg = "Company name and address combination already exists";
      console.error(msg);
      return res.status(409).json({ msg }); // 409 Conflict
    } else {
      // If the combination does not exist, add to the table
      const insertQuery = `INSERT INTO ce_intern_companies (company_name, company_address, company_phone) VALUES (?, ?, ?)`;
      const insertResult = await post_query_database(insertQuery, [companyName, companyAddress, companyPhoneNumber]);
      res.status(200).json(insertResult); // 201 Created
    }
  } catch (err) {
    console.error("Error adding the company:", err);
    res.status(500).json({
      err: "Error adding the company"
    });
  }
};
