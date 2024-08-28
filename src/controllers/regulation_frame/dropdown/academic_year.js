/*
const { get_query_database } = require('../../../config/database_utils');


exports.get_academic_years = (request, response) => {
    const query = `SELECT id, year FROM academic_year`;
    const error_message = "Error fetching academic years";

    get_query_database(query, response, error_message);
};
*/



// The Codes given below are written b y using promisses and async/await




const { get_query_database } = require("../../../config/database_utils");

exports.get_academic_years = async (req, res) => {
    try {
        const query = `SELECT id, year FROM academic_year`;
        const academicYears = await get_query_database(query);
        res.json(academicYears);
    } catch (error) {
        console.error("Error fetching academic years:", error);
        res.status(500).json({ error: "Error fetching academic years"});
    }
};
