// src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

//routes
const regulation_frame_routes = require("./routes/regulation_frame/regulation_frame");
const course_faculty_mapping_routes = require("./routes/course_faculty_mapping/course_faculty_mapping");
const course_excemption_routes = require("./routes/course_excemption/course_excemption")

//middleware logger config
const morgan_config = morgan(
    ":method :url :status :res[content-length] - :response-time ms"
);

const app = express();
const port = 5001;
// Enable CORS AND LOGGER MIDDLEWARE
app.use(cors());
app.use(morgan_config);
app.use(express.json())

app.use("/api/rf", regulation_frame_routes);
app.use("/api/cfm", course_faculty_mapping_routes);
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
app.use("/api/ce", course_excemption_routes)
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
