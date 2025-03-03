const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const passport = require("passport")
const User = require("../models/User")
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router()

// ✅ Register a New User
router.post("/register", async (req, res) => {
    try {
        console.log("📢 Registration request received:", req.body);  // ✅ Log request data

        const { name, email, password } = req.body;

        // ✅ Ensure all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields (name, email, password) are required" });
        }

        // ✅ Check if email already exists
        let user = await User.findOne({ email });
        if (user) {
            console.error("❌ Registration failed: User already exists:", email);
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Ensure `username` is set correctly
        user = new User({
            name,
            email,
            password: hashedPassword,
            username: email.split("@")[0] // Generate username from email if missing
        });

        await user.save();

        // ✅ Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

        console.log("✅ User registered successfully:", user.email);

        res.status(201).json({
            token,
            user: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error("❌ Registration API Error:", err);
        res.status(500).json({ error: "Server error, please try again later" });
    }
});


// ✅ Login User with Email & Password
router.post("/login", async (req, res) => {
    try {
        console.log("📢 Login request received:", req.body)

        const { email, password } = req.body

        // ✅ Ensure request contains email & password
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" })
        }

        const user = await User.findOne({ email })

        // ✅ Check if user exists
        if (!user) {
            console.error("❌ User not found for email:", email)
            return res.status(400).json({ error: "Invalid email or password" })
        }

        // ✅ Check password match
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            console.error("❌ Password incorrect for user:", user.email)
            return res.status(400).json({ error: "Invalid email or password" })
        }

        // ✅ Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" })

        console.log("✅ Login successful for user:", user.email)

        res.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email }
        })
    } catch (err) {
        console.error("❌ Login API Error:", err)
        res.status(500).json({ error: "Server error, please try again later" })
    }
});

// ✅ Get Current User (Fix for Logout on Refresh)
router.get("/me", authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ user });
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Google OAuth Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), async (req, res) => {
    try {
        let user = await User.findOne({ googleId: req.user.googleId });

        if (!user) {
            user = new User({
                name: req.user.displayName,
                email: req.user.emails[0].value,
                googleId: req.user.googleId
            });
            await user.save();
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.redirect(`https://taskzen-13cvgn456-bhavneet345s-projects.vercel.app/oauth/callback?token=${token}`);
    } catch (err) {
        res.status(500).json({ error: "Google authentication failed" });
    }
});

// ✅ GitHub OAuth Login
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/" }), async (req, res) => {
    try {
        let user = await User.findOne({ githubId: req.user.githubId });

        if (!user) {
            user = new User({
                name: req.user.displayName || req.user.username,
                email: req.user.emails ? req.user.emails[0].value : null,
                githubId: req.user.githubId || `github_${req.user.id}`
            });
            await user.save();
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.redirect(`https://taskzen-13cvgn456-bhavneet345s-projects.vercel.app/oauth/callback?token=${token}`);
    } catch (err) {
        res.status(500).json({ error: "GitHub authentication failed" });
    }
});

module.exports = router;
