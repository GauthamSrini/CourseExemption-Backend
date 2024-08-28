/*
const { get_query_database } = require("../../../config/database_utils");

exports.get_branch = (req, res) => {
    let degree = req.query.degree;
    const query = `
        SELECT id, branch 
        FROM master_branch  
        WHERE degree = ${degree} AND status='1';`;
    const error_message = 'Error fetching branches';

    get_query_database(query, res, error_message);
};
*/



// The Codes given below are written b y using promisses and async/await




const { get_query_database } = require("../../../config/database_utils");

exports.get_branch = async (req, res) => {
    let degree = req.query.degree;
        if (!degree) {
            return res.status(400).json({
                error: "Degree is required in query!!",
            });
        }
    try {
        const query = `
            SELECT id, branch 
            FROM master_branch  
            WHERE degree = ? AND status = '1';
        `;

        const branches = await get_query_database(query, [degree]);
        res.json(branches);
    } catch (error) {
        console.error("Error fetching branches:", error);
        res.status(500).json({ error: "Error fetching branches" });
    }
};






