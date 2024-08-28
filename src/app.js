// src/app.js
const express = require("express");
const cookieParser = require('cookie-parser');//
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const authRoutes = require('./routes/auth/authRoutes');//
const userRoutes = require('./routes/auth/userRoutes');//

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
const port = 5000;
// Enable CORS AND LOGGER MIDDLEWARE
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));//
app.use(cookieParser());//
app.use(morgan_config);
app.use(express.json())


app.use('/', authRoutes);//
app.use('/', userRoutes);//

app.post('/logout', (req, res) => {//
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  });//

app.use("/api/rf", regulation_frame_routes);
app.use("/api/cfm", course_faculty_mapping_routes);
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
app.use("/api/ce",course_excemption_routes)
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
