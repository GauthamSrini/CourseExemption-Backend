/*
const { get_query_database } = require("../../../config/database_utils");

exports.get_courses = (req, res) => {
    let branch = req.query.branch;
    let semester = req.query.semester;
    const query = `
    SELECT id, CONCAT(code,'-',name) course FROM master_courses 
    WHERE branch = ${branch} AND semester = ${semester} AND status ='1'`;
    const error_message = "Error Fetching courses";

    get_query_database(query, res, error_message);
};
*/



// The Codes given below are written b y using promisses and async/await



const { get_query_database } = require("../../../config/database_utils");

exports.get_courses = async (req, res) => {
    let branch = req.query.branch;
        let semester = req.query.semester;
        if (!branch || !semester) {
            return res.status(400).json({
                error: "Branch and semester are required in query!!",
            });
        }
    try {
        const query = `
            SELECT id, CONCAT(code,'-',name) course FROM master_courses 
            WHERE branch = ? AND semester = ? AND status = '1'
        `;

        const courses = await get_query_database(query, [branch, semester]);
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "Error fetching courses" });
    }
};



