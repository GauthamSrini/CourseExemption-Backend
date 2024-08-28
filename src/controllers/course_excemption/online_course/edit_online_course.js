const { post_query_database} = require("../../../config/database_utils");

exports.edit_online_course = async (req,res) => {
    const {courseCode,courseName,coursePlatform,courseDuration,courseCredits,courseExepmtion,selectedCourseId} = req.body;
    try{
        const query = `UPDATE ce_oc_courselist SET course_code = ? ,platform = ? , name = ?, duration = ? , credit = ? , excemption = ?
        WHERE id = ?`
        const updateCourse = await post_query_database(query,[courseCode,coursePlatform,courseName,courseDuration,courseCredits,courseExepmtion,selectedCourseId])
        res.status(200).json(updateCourse)
    }
    catch(err){
        console.error("Error while updating the Course", err)
        res.status(500).json({
            err: "Error while Updating the Course"
        })
    }

}