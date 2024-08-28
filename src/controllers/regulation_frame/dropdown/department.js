/*
const { get_query_database } = require("../../../config/database_utils");

exports.get_department = (req, res) => {
    const query = `SELECT id, dep_name FROM master_departments`;
    const error_message = 'Error fetching departments';

    get_query_database(query, res, error_message);
};
*/



// The Codes given below are written b y using promisses and async/await



const { get_query_database } = require("../../../config/database_utils");

exports.get_department = async (req, res) => {
    try {
        const query = `SELECT id, dep_name FROM master_departments`;

        const departments = await get_query_database(query);

        res.json(departments);
    } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ error: "Error fetching departments"});
    }
};

