const { post_query_database } = require("../../../config/database_utils");
const { get_query_database } = require("../../../config/database_utils");

exports.upload_single_online_course = async (req, res) => {
    const { courseCode, courseName, coursePlatform, courseDuration, courseCredits, courseExepmtion } = req.body;
    const checkQuery = `SELECT * FROM ce_oc_courselist WHERE course_code= ? AND platform = ?`;
    try {
        const checkResults = await get_query_database(checkQuery, [courseCode,coursePlatform]);
        if (checkResults.length === 0) {
            const query = `INSERT INTO ce_oc_courselist (course_code, platform, name, duration, credit, excemption) VALUES (?, ?, ?, ?, ?, ?)`;
            const upload_course = await post_query_database(query, [courseCode, coursePlatform, courseName, courseDuration, courseCredits, courseExepmtion]);
            res.status(200).json(upload_course);
        } else {
            let msg = "This course ID already exists";
            console.error("This course ID already exists", msg);
            res.status(409).json({ msg: "This course ID already exists" }); // Use status 409 (Conflict)
        }
    } catch (err) {
        console.error("Error while adding course", err);
        res.status(500).json({
            err: "Error while adding course"
        });
    }
}
