// src/controllers/course_excemption/online_course/upload_excel.js
const xlsx = require('xlsx');
const { post_query_database } = require("../../../config/database_utils");
const { get_query_database } = require("../../../config/database_utils")

exports.processExcelFileIntern = async (req, res) => {
  const filePath = req.file.path;

  let workbook = xlsx.readFile(filePath);
  let worksheet = workbook.Sheets[workbook.SheetNames[0]];
  let range = xlsx.utils.decode_range(worksheet["!ref"]);

  let count = 0;
  let added = 0;
  let skip = 0;
  let updated = 0;

  async function processRow(row) {
    let data = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
      let cell = worksheet[xlsx.utils.encode_cell({ r: row, c: col })];
      data.push(cell ? cell.v : null);
    }

    // Check if student_id already exists in the database
    const sqlCheck = `SELECT * FROM ce_intern_companies WHERE company_name = ? AND company_address = ?`;
    const existingStudent = await get_query_database(sqlCheck, [data[0],data[1]]);
    console.log(existingStudent);
    
    if (existingStudent.length === 0) { // If student_id does not exist
      const sqlInsert = `INSERT INTO ce_intern_companies (company_name, company_address, company_phone) VALUES (?, ?, ?)`
      let name = (data[0]).toUpperCase()
      let address = (data[1]).toUpperCase()
      let phone = data[2]
      try {
        await post_query_database(sqlInsert,[name,address,phone]);
        console.log(`Inserted row ${row}: Success`);
        count++;
        added++;
      } catch (error) {
        console.error(`Error inserting row ${row}:`, error);
      }
    }
    else {
      console.log(`Skipped insertion for row ${row}: Company code ${data[0]} and name already exists`);
      count++;
      skip++;
    }
  }
  try {
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      await processRow(row);
    }
    res.status(200).json({ message: 'File processed successfully', added, updated, skip });
  } catch (error) {
    console.error("Error processing Excel file", error);
    res.status(500).json({ error: "Error processing Excel file" });
  }
};
