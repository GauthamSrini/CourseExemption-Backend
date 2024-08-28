const { post_query_database} = require("../../../config/database_utils");

exports.edit_company_details = async (req,res) => {
    let {companyName,companyAddress,companyPhoneNumber,selectedCompanyId} = req.body;
    companyName = companyName.toUpperCase();
    companyAddress = companyAddress.toUpperCase();
    try{
        const query = `UPDATE ce_intern_companies SET company_name = ? , company_address = ? , company_phone = ?
        WHERE id = ?`
        const updateCompany = await post_query_database(query,[companyName,companyAddress,companyPhoneNumber,selectedCompanyId])
        res.status(200).json(updateCompany)
    }
    catch(err){
        console.error("Error while updating the Course", err)
        res.status(500).json({
            err: "Error while Updating the Course"
        })
    }
}