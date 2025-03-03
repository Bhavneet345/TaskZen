const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, default: null, unique: true },
    password: { type: String, default: null },
    googleId: { type: String, default: null },
    githubId: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
