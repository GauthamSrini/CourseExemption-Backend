// src/controllers/course_excemption/online_course/upload_excel.js
const xlsx = require('xlsx');
const { post_query_database } = require("../../../config/database_utils");
const { get_query_database } = require("../../../config/database_utils")

exports.processExcelFileHonorMinor = async (req, res) => {
  const filePath = req.file.path;

  let workbook = xlsx.readFile(filePath);
  let worksheet = workbook.Sheets[workbook.SheetNames[0]];
  let range = xlsx.utils.decode_range(worksheet["!ref"]);

  let count = 0; 
  let skip = 0;
  let added = 0;

  async function processRow(row) {
    let data = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
      let cell = worksheet[xlsx.utils.encode_cell({ r: row, c: col })];
      data.push(cell ? cell.v : null);
    }

    // Check if student_id already exists in the database
    const sqlCheck = `SELECT * FROM ce_honor_minor_mappings
  WHERE student = ? AND course_code = ? AND course_name = ?`;
    const existingStudent = await get_query_database(sqlCheck, [data[2],data[0],data[1]]);
    console.log(existingStudent);
    
    if (existingStudent.length === 0) { // If student_id does not exist
      const sqlInsert = `INSERT INTO ce_honor_minor_mappings (student, semester, mode_of_exemption, course_code, course_name, academic_year)
      VALUES (?, ?, ?, ?, ?, ?)`
      let code = data[0]
      let name = data[1]
      let student = data[2]
      let semester = data[5]
      let academic = String(data[4])
      let modeOfExp = 0;

      const academic_query = `SELECT id FROM master_academic_year WHERE academic_year = ?`;
      const [academic_id] = await get_query_database(academic_query,[academic]) 
      const academic_year_id = academic_id.id

      if (data[3].toUpperCase() === "HONORS" || data[3].toUpperCase() === "HONOR") {
        modeOfExp = 2;
      } else {
        modeOfExp = 3;
      }

      try {
        await post_query_database(sqlInsert,[student,semester,modeOfExp,code,name,academic_year_id]);
        console.log(`Inserted row ${row}: Success`);
        count++;
        added++;
      } catch (error) {
        console.error(`Error inserting row ${row}:`, error);
      }
    }
    else {
      console.log(`Skipped insertion for row ${row}: Student ID ${data[2]} already exists exist with mapping of course ${data[0]}`);
      count++;
      skip++;
    }
  }
  try {
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      await processRow(row);
    }
    res.status(200).json({ message: 'File processed successfully', added ,skip});
  } catch (error) {
    console.error("Error processing Excel file", error);
    res.status(500).json({ error: "Error processing Excel file" });
  }
};
