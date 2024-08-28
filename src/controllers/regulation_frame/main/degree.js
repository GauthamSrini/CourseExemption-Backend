/*
const { post_query_database } = require("../../../config/database_utils")

exports.post_degree = (req, res) =>{
    const {regulation, degree} = req.body
    if(!regulation || !degree){
        res.status(400).json({
            error:"Regulation and Degree is required"
        })
    }
    const query = `INSERT INTO master_degree(regulation, degree, status)
    VALUES (${regulation}, ${degree}, '1')`
    const error_message = "Error adding degree"
    const success_message = "Degree added successfully"

    post_query_database(query, res, error_message, success_message)
}

exports.update_degree =(req, res) =>{
    const {id, regulation, degree} = req.body
    if(!id|| !regulation || !degree){
        res.status(400).json({
            error:"ID, Regulation and Degree is required"
        })
    }
    const query = `UPDATE master_degree 
    SET regulation=${regulation}, degree =${degree}
    WHERE id = ${id}`

    const error_message = "Error updating degree"
    const success_message = "Degree updated successfully"

    post_query_database(query, res, error_message, success_message)

}

exports.delete_degree = (req, res)=>{
    const {id} = req.id
    if(!id){
        res.status(400).json({
            error:"ID is required"
        })
    }
    const query = `UPDATE master_degree 
    SET status = '0'
    WHERE id = ${id}`
    const error_message = "Error deleting degree"
    const success_message = "Degree deleted successfully"

    post_query_database(query, res, error_message, success_message)
}
*/




// The Codes given below are written b y using promisses and async/await






const { post_query_database } = require("../../../config/database_utils");

exports.post_degree = async (req, res) => {
    const { regulation, degree } = req.body;
        if (!regulation || !degree) {
            return res.status(400).json({
                error: "Regulation and Degree are required"
            });
        }
    try {
        const query = `
            INSERT INTO master_degree(regulation, degree, status)
            VALUES (?, ?, '1')
        `;
        const success_message = await post_query_database(query, [regulation],[degree]);

        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error adding degree:", error);
        res.status(500).json({ error: "Error adding degree"  });
    }
};

exports.update_degree = async (req, res) => {
    const { id, regulation, degree } = req.body;
        if (!id || !regulation || !degree) {
            return res.status(400).json({
                error: "ID, Regulation, and Degree are required"
            });
        }
    try {
        const query = `
            UPDATE master_degree
            SET regulation = ?, degree = ?
            WHERE id = ?
        `;
        const success_message = await post_query_database(query, [regulation],[degree],[id]);

        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error updating degree:", error);
        res.status(500).json({ error: "Error updating degree" });
    }
};

exports.delete_degree = async (req, res) => {
    const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                error: "ID is required"
            });
        }

    try {
        const query = `
            UPDATE master_degree
            SET status = '0'
            WHERE id = ?
        `;
        const success_message = await post_query_database(query, [id]);

        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error deleting degree:", error);
        res.status(500).json({ error: "Error deleting degree" });
    }
};
