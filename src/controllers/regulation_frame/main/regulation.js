/*
const { post_query_database } = require("../../../config/database_utils");

exports.post_regulation = (req, res) => {
    const {regulation} = req.body;
    if (!regulation) {
        res.status(400).json({
            error: "Regulation is required",
        });
    }
    const query = `INSERT INTO master_regulation (regulation, status)
    VALUES (${regulation}, '1')`;
    const error_message = "Error adding regulation";
    const success_message = "Regulation added Successfully";

    post_query_database(query, res, error_message, success_message);
};

exports.update_regulation = (req, res) => {
    const { id, regulation } = req.body;
    if (!id || !regulation) {
        res.status(400).json({
            error: "Id and Regulation is required",
        });
    }
    const query = `UPDATE master_regulation 
    SET regulation = ${regulation}
    WHERE id = ${id}`;
    const error_message = "Error updating regulation";
    const success_message = "Regulation updated successfully";

    post_query_database(query, res, error_message, success_message);
};

exports.delete_regulation = (req, res) => {
    const {id} = req.body;
    if (!id) {
        res.status(400).json({
            error: "Id is required",
        });
    }
    const query = `UPDATE master_regulation
    SET status = '0'
    WHERE id = ${id}`;
    const error_message = "Error deleting regulation";
    const success_message = "Regulation deleted successfully";

    post_query_database(query, res, error_message, success_message);
};
*/






// The Codes given below are written b y using promisses and async/await






const { post_query_database } = require("../../../config/database_utils");

exports.post_regulation = async (req, res) => {
    const { regulation } = req.body;
        if (!regulation) {
            return res.status(400).json({
                error: "Regulation is required",
            });
        }
    try {
        const query = `
            INSERT INTO master_regulation (regulation, status)
            VALUES (?, '1')
        `;
        const success_message = await post_query_database(query, [regulation]);

        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error adding regulation:", error);
        res.status(500).json({ error: "Error adding regulation" });
    }
};

exports.update_regulation = async (req, res) => {
    const { id, regulation } = req.body;
        if (!id || !regulation) {
            return res.status(400).json({
                error: "ID and Regulation are required",
            });
        }
    try {
        const query = `
            UPDATE master_regulation 
            SET regulation = ?
            WHERE id = ?
        `;
        const success_message =  await post_query_database(query, [regulation],[id]);

        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error updating regulation:", error);
        res.status(500).json({ error:  "Error updating regulation"});
    }
};

exports.delete_regulation = async (req, res) => {
    const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                error: "ID is required",
            });
        }
    try {
        const query = `
            UPDATE master_regulation
            SET status = '0'
            WHERE id = ?
        `;
        const success_message = await post_query_database(query, [id]);

        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error deleting regulation:", error);
        res.status(500).json({ error: "Error deleting regulation" });
    }
};

