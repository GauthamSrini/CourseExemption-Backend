/*
const { post_query_database } = require("../../../config/database_utils");

exports.post_branch = (req, res) => {
    const { degree, branch } = req.body;
    if (!degree || !branch) {
        res.status(400).json({
            error: "Degree and Branch is required",
        });
    }
    const query = `INSERT INTO master_branch(degree, branch, status)
    VALUES(${degree}, ${branch}, '1')`;
    const error_message = "Failed to Add Branch";
    const success_message = "Branch Added successfully";

    post_query_database(query, res, error_message, success_message);
};

exports.update_branch = (req, res) => {
    const { id, degree, branch } = req.body;
    if (!id || !degree || !branch) {
        res.status(400).json({
            error: "ID, Degree and Branch is required",
        });
    }
    const query = `UPDATE master_branch
    SET degree = ${degree}, branch =${branch}
    WHERE id = ${id}`;
    const error_message = "Failed to update Branch";
    const success_message = "Branch Updated successfully";

    post_query_database(query, res, error_message, success_message);
};

exports.delete_branch = (req, res) => {
    const {id} = req.body;
    if (!id) {
        res.status(400).json({
            error: "ID is required",
        });
    }
    const query = `UPDATE master_branch
    SET status = '0'
    WHERE id = ${id}`;

    const error_message = "Failed to delete branch";
    const success_message = "Branch Deleted successfully";

    post_query_database(query, res, error_message, success_message);
};
*/




// The Codes given below are written b y using promisses and async/await





const { post_query_database } = require("../../../config/database_utils");

exports.post_branch = async (req, res) => {
    const { degree, branch } = req.body;
        if (!degree || !branch) {
            return res.status(400).json({
                error: "Degree and Branch is required",
            });
        }
    try {
        const query = `
            INSERT INTO master_branch(degree, branch, status)
            VALUES (?, ?, '1')
        `;
        const success_message = await post_query_database(query, [degree],[branch]);
  
        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error adding branch:", error);
        res.status(500).json({ error: "Error adding branch" });
    }
};

exports.update_branch = async (req, res) => {
    const { id, degree, branch } = req.body;
        if (!id || !degree || !branch) {
            return res.status(400).json({
                error: "ID, Degree and Branch is required",
            });
        }
    try {
        const query = `
            UPDATE master_branch
            SET degree = ?, branch = ?
            WHERE id = ?
        `;
        const success_message = await post_query_database(query, [degree],[branch],[id]);

        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error updating branch:", error);
        res.status(500).json({ error: "Error updating branch" });
    }
};

exports.delete_branch = async (req, res) => {
    const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                error: "ID is required",
            });
        }
    try {
        const query = `
            UPDATE master_branch
            SET status = '0'
            WHERE id = ?
        `;
        const success_message = await post_query_database(query, [id]);

        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error deleting branch:", error);
        res.status(500).json({ error: "Error updating branch" });
    }
};







