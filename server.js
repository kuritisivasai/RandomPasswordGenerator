const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Database Connection
require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});