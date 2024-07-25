// src/controllers/course_excemption/online_course/upload_excel.js
const xlsx = require('xlsx');
const { post_query_database } = require("../../../config/database_utils");
const { get_query_database } = require("../../../config/database_utils")

exports.processExcelFile = async (req, res) => {
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
    const sqlCheck = `SELECT * FROM ce_oc_courselist WHERE course_code = ? `;
    const existingStudent = await get_query_database(sqlCheck, [data[0]]);
    console.log(existingStudent);
    
    if (existingStudent.length === 0) { // If student_id does not exist
      const sqlInsert = `INSERT INTO ce_oc_courselist (course_code, name, duration, credit, excemption) VALUES (?, ? ,?, ?, ?)`
      let code = data[0]
      let name = data[1]
      let duration = data[2]
      let credit = data[3]
      let excemption = String(data[4])
      try {
        await post_query_database(sqlInsert,[code,name,duration,credit,excemption]);
        console.log(`Inserted row ${row}: Success`);
        count++;
        added++;
      } catch (error) {
        console.error(`Error inserting row ${row}:`, error);
      }
    }
    else if(existingStudent.length===1){
        const sqlInsert1 = `UPDATE ce_oc_courselist SET name = ?, duration = ?, credit = ?, excemption = ? WHERE course_code = ?`
        let code = data[0]
        let name = data[1]
        let duration = data[2]
      let credit = data[3]
      let excemption = String(data[4])
      try {
        await post_query_database(sqlInsert1,[name,duration,credit,excemption,code]);
        console.log(`Updated row ${row}: Success`);
        count++;
        updated++;
      } catch (error) {
        console.error(`Error updating row ${row}:`, error);
      }
    }
    else {
      console.log(`Skipped insertion for row ${row}: Student ID ${data[0]} already exists`);
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
