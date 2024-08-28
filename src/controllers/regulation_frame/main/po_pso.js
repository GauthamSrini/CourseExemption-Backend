/*
const {
    get_query_database,
    post_query_database,
} = require("../../../config/database_utils");

exports.get_po_pso = (req, res) => {
    const query = `SELECT id, CONCAT(code_name,'-',description) name
        FROM outcome 
        WHERE status = '1'`;
    const error_message = "Error fetching PO and PSO's";

    get_query_database(query, res, query, error_message);
};

exports.post_po_pso = (req, res) => {
    const { type, code_name, description } = req.body;
    if (!type || !code_name || !description) {
        res.status(400).json({
            error: "Fields 'type', 'code_name', and 'description' are required",
        });
    }
    const query = `INSERT INTO outcome(type, code_name, description, status)
    VALUES(${type}, ${code_name}, ${description}, '1')`;
    const error_message = "Failed to Add PO/PSO";
    const success_message = "PO/PSO Added successfully";

    post_query_database(query, res, error_message, success_message);
};

const { post_query_database } = require("../../../config/database_utils");

exports.update_po_pso = (req, res) => {
    const { id, type, code_name, description } = req.body;
    if (!id || !type || !code_name || !description) {
        res.status(400).json({
            error: "Fields 'id', 'type', 'code_name', and 'description' are required",
        });
    }
    const query = `UPDATE outcome
    SET type = ${type}, code_name = ${code_name}, description = ${description}
    WHERE id = ${id}`;
    const error_message = "Failed to update PO/PSO";
    const success_message = "PO/PSO Updated successfully";

    post_query_database(query, res, error_message, success_message);
};

exports.delete_po_pso = (req, res) => {
    const {id} = req.body;
    if (!id) {
        res.status(400).json({
            error: "ID is required",
        });
    }
    const query = `UPDATE outcome
    SET status = '0'
    WHERE id = ${id}`;

    const error_message = "Failed to delete PO/PSO";
    const success_message = "PO/PSO Deleted successfully";

    post_query_database(query, res, error_message, success_message);
};
*/





// The Codes given below are written b y using promisses and async/await






const { get_query_database, post_query_database } = require("../../../config/database_utils");

exports.get_po_pso = async (req, res) => {
    try {
        const query = `
            SELECT id, CONCAT(code_name, '-', description) AS name
            FROM outcome 
            WHERE status = '1'
        `;

        const po_pso = await get_query_database(query);
        res.status(200).json(po_pso);
    } catch (error) {
        console.error("Error fetching PO and PSO's:", error);
        res.status(500).json({ error:  "Error fetching PO and PSO's"});
    }
};

exports.post_po_pso = async (req, res) => {
    const { type, code_name, description } = req.body;
        if (!type || !code_name || !description) {
            return res.status(400).json({
                error: "Fields 'type', 'code_name', and 'description' are required",
            });
        }
    try {
        const query = `
            INSERT INTO outcome(type, code_name, description, status)
            VALUES(?, ?, ?, '1')
        `;
        const success_message = await post_query_database(query, [type],[code_name],[description]);

        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error adding PO/PSO:", error);
        res.status(500).json({ error:  "Error adding PO/PSO"});
    }
};

exports.update_po_pso = async (req, res) => {
    const { id, type, code_name, description } = req.body;
        if (!id || !type || !code_name || !description) {
            return res.status(400).json({
                error: "Fields 'id', 'type', 'code_name', and 'description' are required",
            });
        }

    try {
        const query = `
            UPDATE outcome
            SET type = ?, code_name = ?, description = ?
            WHERE id = ?
        `;
        const success_message = await post_query_database(query, [type],[code_name],[description],[id]);

        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error updating PO/PSO:", error);
        res.status(500).json({ error: "Error updating PO/PSO"});
    }
};

exports.delete_po_pso = async (req, res) => {
    const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                error: "ID is required",
            });
        }
    try {
        const query = `
            UPDATE outcome
            SET status = '0'
            WHERE id = ?
        `;
        const success_message = await post_query_database(query, [id]);

        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error deleting PO/PSO:", error);
        res.status(500).json({ error: "Error deleting PO/PSO" });
    }
};

