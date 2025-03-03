require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

require("./config/passport"); // ✅ Ensure Passport is loaded before using it

const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());

// CORS Configuration
app.use(cors({
    origin: ["http://localhost:3000", "https://taskzen-5hp86cfac-bhavneet345s-projects.vercel.app"],
    credentials: true,
}));

// Session Middleware (should be before passport)
app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_secret_key",
        resave: false,
        saveUninitialized: false,
    })
);

// ✅ Initialize Passport AFTER session middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

// Database Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Default Route
app.get("/", (req, res) => {
    res.send("Smart Task Manager Backend is Running!");
});

// Start the Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
