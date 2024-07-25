const { get_query_database } = require("../../config/database_utils")

exports.get_graph_data = async(req, res) =>{
    const {student} = req.query;
    try {
        const query = `SELECT nptel, one_credit, internship 
        FROM students_course_exemption_status
        WHERE student = ?`
        const data = await get_query_database(query,[student])
        res.status(200).json(data)
    } catch (err) {
        console.error("Error fetching data for graph:",err)
        res.status(500).json({
            error: "Error fetching data for graph"
        })
    }
}