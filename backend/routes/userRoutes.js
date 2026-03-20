const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/authMiddleware"); // Added auth middleware

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.json({
      message: "User registered successfully",
      user
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN USER
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET ALL USERS
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});


// ================== NEW ROUTE FOR PAYMENTS DROPDOWN ==================
router.get("/residents", auth, async (req, res) => {
  try {
    // Only admin or owner can fetch residents
    if (!["admin", "owner"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const residents = await User.find({ role: "resident" }).select("name flatNumber");
    res.json(residents);

  } catch (error) {
    console.error("Fetch residents error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;