const { post_query_database} = require("../../../config/database_utils");

exports.post_reject_student = async (req,res) => {
    const {remark,id} = req.body;
    try{ 
    const query = `UPDATE ce_oc_registered SET approval_status = -1, remarks = ?, status = '0' WHERE id = ?`;
    const reject_student = await post_query_database(query,[remark,id])
    res.status(200).json(reject_student)
    }
    catch (err) {
        console.error("Error while Rejecting Student", err)
        res.status(500).json({
            err: "Error while Rejecting Student"
        })
    }
}