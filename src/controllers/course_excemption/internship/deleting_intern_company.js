const { post_query_database} = require("../../../config/database_utils");
const { get_query_database } = require("../../../config/database_utils");

exports.delete_company = async (req,res) => {
    const {selectedCompanyId} = req.body;
    console.log(selectedCompanyId);
    const CheckQuery = `SELECT * FROM ce_intern_registered WHERE industry = ? AND status = '1' `
    try{
        const checkResult = await get_query_database(CheckQuery,[selectedCompanyId])
        if(checkResult.length===0){
        const query = `DELETE FROM ce_intern_companies WHERE id = ?`
        const DeleteCourse = await post_query_database(query,[selectedCompanyId])
        res.status(200).json(DeleteCourse)
        }
        else {
            let msg = "Deleting Restricted As this company Is applied by Some students and still active";
            console.error(msg);
            res.status(409).json({ msg: "Deleting Restricted As this company Is applied by Some students and still active" }); // Use status 409 (Conflict)
        }
    }
    catch(err){
        console.error("Error While Deleting the company", err)
        res.status(500).json({
            err: "Error While Deleting the company"
        })
    }
}