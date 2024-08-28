/*
const { get_query_database } = require("../../../config/database_utils");

exports.get_regulation = (req, res) => {
    const query = `SELECT id, regulation FROM master_regulation`;
    const error_message = 'Error fetching regulations';

    get_query_database(query, res, error_message);
};
*/



// The Codes given below are written b y using promisses and async/await





const { get_query_database } = require("../../../config/database_utils");

exports.get_regulation = async (req, res) => {
    try {
        const query = `SELECT id, regulation FROM master_regulation`;

        const regulations = await get_query_database(query);
        res.json(regulations);
    } catch (error) {
        console.error("Error fetching regulations:", error);
        res.status(500).json({ error: "Error fetching regulations" });
    }
};
