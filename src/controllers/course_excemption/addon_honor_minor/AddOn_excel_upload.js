const xlsx = require('xlsx');
const { post_query_database, get_query_database } = require("../../../config/database_utils");

exports.processExcelFileAddOn = async (req, res) => {
  const filePath = req.file.path;

  let workbook = xlsx.readFile(filePath);
  let worksheet = workbook.Sheets[workbook.SheetNames[0]];
  let range = xlsx.utils.decode_range(worksheet["!ref"]);

  let count = 0;
  let added = 0;
  let skip = 0;
  let updated = 0; // Counter to track the number of successful insertions

  async function processRow(row) {
    let data = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
      let cell = worksheet[xlsx.utils.encode_cell({ r: row, c: col })];
      data.push(cell ? cell.v : null);
    }
    let code = data[0];
    let name = data[1];
    let student = String(data[2]);
    let academic = String(data[3]);
    let semester = data[4];

    const academic_query = `SELECT id FROM master_academic_year WHERE academic_year = ?`;
    const [academic_id] = await get_query_database(academic_query,[academic]) 
    const academic_year_id = academic_id.id

    const sqlCheck = `SELECT * FROM ce_addon_mappings WHERE course_code = ? AND student = ?`;
    const existingStudent = await get_query_database(sqlCheck,[code,student]);
    console.log(existingStudent);

    if (existingStudent.length === 0) { // If student_id does not exist
      const sqlInsert = `INSERT INTO ce_addon_mappings (course_code, course_name, student, semester , academic_year) VALUES (?, ?, ?, ?, ?)`
      try {
        await post_query_database(sqlInsert,[code,name,student,semester,academic_year_id]);
        console.log(`Inserted row ${row}: Success`);
        count++;
        added++;
      } catch (error) {
        console.error(`Error inserting row ${row}:`, error);
      }
    }
    else if(existingStudent.length===1){
      const sqlInsert1 = `UPDATE ce_addon_mappings SET course_name = ?, semester = ? WHERE course_code = ? AND student = ?`
    try {
      await post_query_database(sqlInsert1,[name,semester,code,student]);
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
    res.status(200).json({ message: 'Added All the Details in Database', added, updated, skip });
  } catch (error) {
    console.error("Error processing Excel file", error);
    res.status(500).json({ error: "Error processing Excel file" });
  }
};
