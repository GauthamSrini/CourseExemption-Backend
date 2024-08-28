/*
const { get_query_database } = require("../../../config/database_utils");

exports.get_program_types = (req, res) => {
    const query = `SELECT id, type
    FROM program_type
    WHERE status = '1'`;
    const error_message = "Error fetching Program types";
    
    get_query_database(query, res, error_message);
};
*/



// The Codes given below are written b y using promisses and async/await




const { get_query_database } = require("../../../config/database_utils");

exports.get_program_types = async (req, res) => {
    try {
        const query = `
            SELECT id, type
            FROM program_type
            WHERE status = '1'
        `;

        const programTypes = await get_query_database(query);
        res.json(programTypes);
    } catch (error) {
        console.error("Error fetching Program types:", error);
        res.status(500).json({ error: "Error fetching Program types"});
    }
};
