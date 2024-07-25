const { get_query_database } = require("../../../config/database_utils")

exports.get_courselist = async (req, res)=>{
    const {platform,student} = req.query
    if(!platform || !student){
        return res.status(400).json({
            err:"platform and student is required"
        })
    }
    try {
        const query = `SELECT id, name, duration, credit
        FROM ce_oc_courselist
        WHERE platform = ? AND status = '1' AND id NOT IN (SELECT course
        FROM ce_oc_registered
        WHERE student = ? AND status = '1')`
        const courselist = await get_query_database(query, [platform,student])
        res.status(200).json(courselist)
    } catch (err) {
        console.error("Error fetching course list",err)
        res.status(500).json({
            err:"Error fetching course list"
        })
    }
}  