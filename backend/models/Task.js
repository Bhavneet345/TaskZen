const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    deadline: { type: Date, default: null },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], required: true },
    // status:  { type: String, enum: ["TODO", "],  default: null }
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
