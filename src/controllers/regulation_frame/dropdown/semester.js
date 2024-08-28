/*
const { get_query_database } = require("../../../config/database_utils");

exports.get_semester = (req, res) => {
    const query = `SELECT id, semester FROM master_semester`;
    const error_message = 'Error fetching semester';
    get_query_database(query, res, error_message);
};
*/



// The Codes given below are written b y using promisses and async/await




const { get_query_database } = require("../../../config/database_utils");

exports.get_semester = async (req, res) => {
    try {
        const query = `SELECT id, semester FROM master_semester`;

        const semesters = await get_query_database(query);
        res.json(semesters);
    } catch (error) {
        console.error("Error fetching semester:", error);
        res.status(500).json({ error: "Error fetching semester" });
    }
};
