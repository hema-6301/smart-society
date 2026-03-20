const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");
const auth = require("../middleware/authMiddleware");

// GET VISITORS
router.get("/", auth, async (req, res) => {
  try {
    let visitors = [];

    // Admin & Security: see all visitors
    if (["admin", "security"].includes(req.user.role)) {
      visitors = await Visitor.find().sort({ createdAt: -1 });
    } 
    // Resident: see only visitors for their flat
    else if (req.user.role === "resident") {
      visitors = await Visitor.find({ flatNumber: req.user.flatNumber }).sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(visitors);
  } catch (error) {
    console.error("Fetch visitors error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ADD VISITOR (Admin/Security)
router.post("/", auth, async (req, res) => {
  try {
    if (!["admin", "security"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, flatNumber, purpose } = req.body;
    if (!name || !flatNumber || !purpose) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const visitor = await Visitor.create({ name, flatNumber, purpose });
    res.status(201).json(visitor);
  } catch (error) {
    console.error("Add visitor error:", error);
    res.status(500).json({ message: error.message });
  }
});

// CHECKOUT VISITOR (Admin/Security)
router.put("/:id/exit", auth, async (req, res) => {
  try {
    if (!["admin", "security"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    visitor.exitTime = new Date();
    await visitor.save();

    res.json(visitor);
  } catch (error) {
    console.error("Checkout visitor error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;