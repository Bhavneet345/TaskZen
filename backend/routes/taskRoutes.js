const express = require("express");
const Task = require("../models/Task");
const authenticateUser = require("../middleware/authMiddleware"); // Ensure authentication middleware

const router = express.Router();

// ✅ Create a new task
router.post("/", authenticateUser, async (req, res) => {
    try {
        const { title, description, priority, status, deadline } = req.body;
        
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: "Unauthorized: No user found" });
        }

        const userId = req.user._id; // ✅ Fix: Assign `userId` properly

        if (!title || !priority || !status) {
            return res.status(400).json({ error: "Title, priority, and status are required" });
        }

        const newTask = new Task({
            title,
            description: description || "",
            priority: priority.toUpperCase(),
            status: status.toUpperCase(),
            deadline: deadline ? new Date(deadline) : null, // ✅ Convert `dueDate` properly
            userId, // ✅ Fix: Assign userId correctly
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask); // ✅ Ensure response contains task ID
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ error: "Error creating task" });
    }
});


// ✅ Fetch all tasks for logged-in user
router.get("/", authenticateUser, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Error fetching tasks" });
    }
});

// ✅ Update a task
router.put("/:id", authenticateUser, async (req, res) => {
    try {
        const { title, description, deadline, priority } = req.body;

        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { title, description, deadline, priority },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: "Error updating task" });
    }
});

// ✅ Delete a task
router.delete("/:id", authenticateUser, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!deletedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting task" });
    }
});

// ✅ Get a single task
router.get("/:id", authenticateUser, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: "Error fetching task" });
    }
});


// 🔹 Prioritize Tasks (Call AI service in Spring Boot)
router.get("/prioritize", authenticateUser, async (req, res) => {
    try {
        const response = await axios.get(`${process.env.SPRING_BOOT_SERVICE}/api/tasks/prioritize`);
        res.json(response.data);
    } catch (err) {
        console.error("AI Task Prioritization Error:", err);
        res.status(500).json({ error: "Error fetching AI-prioritized tasks" });
    }
});
module.exports = router;
