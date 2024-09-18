const { post_query_database} = require("../../../config/database_utils");
const { get_query_database } = require("../../../config/database_utils");

exports.delete_online_course = async (req,res) => {
    const {selectedCourseId} = req.body;
    const CheckQuery = `SELECT * FROM ce_oc_registered_sample WHERE course_1 = ? OR course_2 = ? OR course_3 = ? AND status = '1' `
    try{
        const checkResult = await get_query_database(CheckQuery,[selectedCourseId,selectedCourseId,selectedCourseId])
        if(checkResult.length===0){
        const query = `DELETE FROM ce_oc_courselist WHERE id = ?`
        const DeleteCourse = await post_query_database(query,[selectedCourseId])
        res.status(200).json(DeleteCourse)
        }
        else {
            let msg = "Deleting Restricted Course is Applied For Exemption";
            console.error(msg);
            res.status(409).json({ msg: "Deleting Restricted Course is Applied For Exemption" }); // Use status 409 (Conflict)
        }
    }
    catch(err){
        console.error("Error While Deleting the Course", err)
        res.status(500).json({
            err: "Error While Deleting the Course"
        })
    }
}