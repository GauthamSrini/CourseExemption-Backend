/*
const { get_query_database } = require('../../../config/database_utils');

exports.get_degree = (request, response) => {
    let regulation = request.query.regulation;
    const query = `SELECT id, degree FROM master_degree WHERE regulation = ${regulation}`;
    const errorMessage = "Error fetching Degree details";

    get_query_database(query, response, errorMessage);
};
*/



// The Codes given below are written b y using promisses and async/await




const { get_query_database } = require("../../../config/database_utils");

exports.get_degree = async (req, res) => {
    let regulation = req.query.regulation;
        if (!regulation) {
            return res.status(400).json({
                error: "Regulation is required in query!!",
            });
        }
    try {
        const query = `SELECT id, degree FROM master_degree WHERE regulation = ?`;

        const degrees = await get_query_database(query, [regulation]);
        res.json(degrees);
    } catch (error) {
        console.error("Error fetching Degree details:", error);
        res.status(500).json({ error: "Error fetching Degree details" });
    }
};






