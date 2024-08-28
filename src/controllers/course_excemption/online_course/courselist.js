const { get_query_database } = require("../../../config/database_utils")

exports.get_courselist = async (req, res)=>{
    const {platform,student,type} = req.query
    console.log(type);
    if(!platform || !student){
        return res.status(400).json({
            err:"platform and student is required"
        })
    }
    let week=0;
    if(parseInt(type)===1){
        week = 12
    }
    else if(parseInt(type)===2){
        week = 8
    }
    else if(parseInt(type)==3){
        week = 4
    }
    else{
        week = 8
    }
    try {
        const query = `SELECT id, name, duration, credit
        FROM ce_oc_courselist
        WHERE platform = ? AND status = '1' AND duration = ? AND id NOT IN (SELECT course
        FROM ce_oc_registered
        WHERE student = ? AND status = '1')`
        const courselist = await get_query_database(query, [platform,week,student])
        res.status(200).json(courselist)
    } catch (err) {
        console.error("Error fetching course list",err)
        res.status(500).json({
            err:"Error fetching course list"
        })
    }
}  