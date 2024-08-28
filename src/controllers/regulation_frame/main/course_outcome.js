/*
const { get_query_database, post_query_database } = require("../../../config/database_utils");

exports.get_course_outcome = (req, res) => {
    let course = req.query.course;
    const query = `SELECT id, CONCAT(co_id,'-',description) course_outcome
        FROM course_outcome 
        WHERE status = '1' AND course = ${course}`;
    const error_message = "Error fetching course outcomes";

    get_query_database(query, res, error_message);
};

exports.post_course_outcome = (req, res) => {
    const { course, co_id, description } = req.body;
    if (!course || !co_id || !description) {
        res.status(400).json({
            error: "Course, co id, and description are required"
        });
    }
    const query = `INSERT INTO course_outcome(course, co_id, description, status)
    VALUES (${course}, ${co_id}, ${description}, '1')`;
    const error_message = "Failed to insert course outcome";
    const success_message = "Course outcome added successfully";

    post_query_database(query, res, error_message, success_message);
};

exports.update_course_outcome = (req, res) => {
    const { id, course, co_id, description } = req.body;
    if (!id || !course || !co_id || !description) {
        res.status(400).json({
            error: "ID, Course, co id, and description are required"
        });
    }

    const query = `UPDATE course_outcome
    SET course = ${course}, co_id = ${co_id}, description = ${description}
    WHERE id = ${id}`;
    const error_message = "Failed to update course outcome";
    const success_message = "Course outcome updated successfully";

    post_query_database(query, res, error_message, success_message);
};

exports.delete_course_outcome = (req, res) => {
    const { id } = req.body;
    if (!id) {
        res.status(400).json({
            error: "ID is required"
        });
    }

    const query = `UPDATE course_outcome 
    SET status = '0'
    WHERE id = ${id}`;
    const error_message = "Failed to delete course outcome";
    const success_message = "Course outcome deleted successfully";

    post_query_database(query, res, error_message, success_message);
};
*/



// The Codes given below are written b y using promisses and async/await




const { get_query_database, post_query_database } = require("../../../config/database_utils");

exports.get_course_outcome = async (req, res) => {
    let course = req.query.course;
        if (!course) {
            return res.status(400).json({
                error: "Course is required in query!!",
            });
        }

    try {
        const query = `
            SELECT id, CONCAT(co_id,'-',description) course_outcome
            FROM course_outcome 
            WHERE status = '1' AND course = ?
        `;

        const courseOutcomes = await get_query_database(query, [course]);
        res.json(courseOutcomes);
    } catch (error) {
        console.error("Error fetching course outcomes:", error);
        res.status(500).json({ error: "Error fetching course outcomes" });
    }
};

exports.post_course_outcome = async (req, res) => {
    const { course, co_id, description } = req.body;
        if (!course || !co_id || !description) {
            return res.status(400).json({
                error: "Course, co id, and description are required"
            });
        }
    try {
        const query = `
            INSERT INTO course_outcome(course, co_id, description, status)
            VALUES (?, ?, ?, '1')
        `;
        const success_message = await post_query_database(query, [course],[co_id],[description]);

        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error adding course outcome:", error);
        res.status(500).json({ error:  "Error adding course outcome"});
    }
};

exports.update_course_outcome = async (req, res) => {
    const { id, course, co_id, description } = req.body;
        if (!id || !course || !co_id || !description) {
            return res.status(400).json({
                error: "ID, Course, co id, and description are required"
            });
        }
    try {
        const query = `
            UPDATE course_outcome
            SET course = ?, co_id = ?, description = ?
            WHERE id = ?
        `;
        const success_message = await post_query_database(query, [course],[co_id],[description],[id]);

        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error updating course outcome:", error);
        res.status(500).json({ error: "Error updating course outcome" });
    }
};

exports.delete_course_outcome = async (req, res) => {
    const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                error: "ID is required"
            });
        }
    try {
        const query = `
            UPDATE course_outcome 
            SET status = '0'
            WHERE id = ?
        `;
        const success_message = await post_query_database(query, [id]);

        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error deleting course outcome:", error);
        res.status(500).json({ error: "Error deleting course outcome"});
    }
};





