/*
const { get_query_database, post_query_database } = require("../../../config/database_utils");

exports.get_mapped_faculty = (req, res) => {
    let course = req.query.course;
    let academic_year = req.query.academic_year;
    let query = `SELECT 
        fcm.id,
        ay.year, 
        CONCAT(mu.user_id, '-', mu.user_name) AS faculty_name, 
        CONCAT(mc.code, '-', mc.name) AS course_name
        FROM 
            faculty_course_mapping fcm
        INNER JOIN 
            academic_year ay ON fcm.year = ay.id
        INNER JOIN 
            master_user mu ON fcm.faculty = mu.id
        INNER JOIN 
            master_courses mc ON fcm.course = mc.id
        WHERE 
            fcm.status = '1'`;

    const error_message = "Error fetching mapped faculty";

    if (academic_year && course) {
        query += ` AND ay.id = ${academic_year} AND mc.id = ${course}`;
    }

    get_query_database(query, res, error_message);
};

exports.post_faculty_mapping = (req, res) => {
    const { academic_year, faculty_id, course_id } = req.body;
    if (!academic_year || !faculty_id || !course_id) {
        return res.status(400).json({
            error: "Academic year, faculty ID, and course ID are required.",
        });
    }
    const query = `
        INSERT INTO faculty_course_mapping (year, faculty, course, status)
        VALUES (${academic_year}, ${faculty_id}, ${course_id}, '1')
    `;
    const error_message = "Error mapping faculty to course.";
    const success_message = "Successfully mapped faculty to course";

    post_query_database(query, res, error_message, success_message);
};

exports.update_faculty_mapping = (req, res) => {
    const { mapping_id, academic_year, faculty_id, course_id } = req.body;

    if (!mapping_id || !academic_year || !faculty_id || !course_id) {
        return res.status(400).json({
            error: "Mapping ID, academic year, faculty ID, and course ID are required.",
        });
    }

    const query = `
        UPDATE faculty_course_mapping
        SET year = ${academic_year}, faculty = ${faculty_id}, course = ${course_id}
        WHERE id = ${mapping_id}
    `;
    const error_message = "Error updating faculty mapping.";
    const success_message = "Successfully updated faculty mapping.";

    post_query_database(query, res, error_message, success_message);
};

exports.delete_faculty_mapping = (req, res) => {
    const mapping_id = req.body.mapping_id;
    if (!mapping_id) {
        return res.status(400).json({
            error: "Mapping ID is required.",
        });
    }

    const query = `
        UPDATE faculty_course_mapping
        SET status = '0'
        WHERE id = ${mapping_id}
    `;
    const error_message = "Error Deleting faculty mapping.";
    const success_message = "Successfully Deleted faculty mapping.";

    post_query_database(query, res, error_message, success_message);
};
*/




// The Codes given below are written b y using promisses and async/await





const { post_query_database } = require("../../../config/database_utils");

exports.get_mapped_faculty = async (req, res) => {
    let course = req.query.course;
    let academic_year = req.query.academic_year;
    if (academic_year && course) {
        query += ` AND ay.id = ? AND mc.id = ?`;
        const mappedFaculty = await get_query_database(query, [academic_year,course]);
        res.json(mappedFaculty);
    } else {
        const mappedFaculty = await get_query_database(query);
        res.json(mappedFaculty);
    }
    try {
        let query = `SELECT 
            fcm.id,
            ay.year, 
            CONCAT(mu.user_id, '-', mu.user_name) AS faculty_name, 
            CONCAT(mc.code, '-', mc.name) AS course_name
            FROM 
                faculty_course_mapping fcm
            INNER JOIN 
                academic_year ay ON fcm.year = ay.id
            INNER JOIN 
                master_user mu ON fcm.faculty = mu.id
            INNER JOIN 
                master_courses mc ON fcm.course = mc.id
            WHERE 
                fcm.status = '1'`;  
    } catch (error) {
        console.error("Error fetching mapped faculty:", error);
        res.status(500).json({ error: "Error fetching mapped faculty" });
    }
};

exports.post_faculty_mapping = async (req, res) => {
    const { academic_year, faculty_id, course_id } = req.body;
    if (!academic_year || !faculty_id || !course_id) {
        return res.status(400).json({
            error: "Academic year, faculty ID, and course ID are required.",
        });
    }
    try {
        const query = `
            INSERT INTO faculty_course_mapping (year, faculty, course, status)
            VALUES (?, ?, ?, '1')
        `;
            const success_message = await post_query_database(query, [academic_year,faculty_id,course_id], "Successfully mapped faculty to course");

        res.status(200).json({ message: success_message });
    } catch (error) {
        console.error("Error mapping faculty to course:", error);
        res.status(500).json({ error: "Error mapping faculty to course" });
    }
};

exports.update_faculty_mapping = async (req, res) => {
    const { mapping_id, academic_year, faculty_id, course_id } = req.body;
    if (!mapping_id || !academic_year || !faculty_id || !course_id) {
        return res.status(400).json({
            error: "Mapping ID, academic year, faculty ID, and course ID are required.",
        });
    }
    try {
        const query = `
            UPDATE faculty_course_mapping
            SET year = ?, faculty = ?, course = ?
            WHERE id = ?
        `;
        const success_message = await post_query_database(query, [academic_year],[faculty_id],[course_id],[mapping_id]);

        res.status(200).json({ success: success_message });
    } catch (error) {
        console.error("Error updating faculty mapping:", error);
        res.status(500).json({ error: "Error updating faculty mapping" });
    }
};

exports.delete_faculty_mapping = async (req, res) => {
    const mapping_id = req.body.mapping_id;
    if (!mapping_id) {
        return res.status(400).json({
            error: "Mapping ID is required.",
        });
    }
    try {
        const query = `
            UPDATE faculty_course_mapping
            SET status = '0'
            WHERE id = ?
        `;
        const success_message = await post_query_database(query, [mapping_id]);

        res.status(200).json({ success: success_message });
    } catch (error) {
        console.error("Error Deleting faculty mapping:", error);
        res.status(500).json({ error: "Error Deleting faculty mapping",});
    }
};

