const Visitor = require("../models/Visitor");

// CREATE VISITOR ENTRY
const createVisitor = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    // Only security can add
    if (req.user.role !== "security") {
      return res.status(403).json({ message: "Only security can add visitors" });
    }

    const { name, flatNumber, purpose } = req.body;

    if (!name || !flatNumber || !purpose) {
      return res.status(400).json({ message: "Name, Flat Number, and Purpose are required" });
    }

    const visitor = await Visitor.create({
      name,
      flatNumber,
      purpose,
      createdBy: req.user._id
    });

    res.status(201).json(visitor);
  } catch (error) {
    console.error("Create visitor error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET VISITORS
const getVisitors = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    let visitors = [];

    if (req.user.role === "admin" || req.user.role === "security") {
      visitors = await Visitor.find().sort({ entryTime: -1 });
    } else if (req.user.role === "resident") {
      visitors = await Visitor.find({ flatNumber: req.user.flatNumber }).sort({ entryTime: -1 });
    }

    res.json(visitors);
  } catch (error) {
    console.error("Fetch visitors error:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE EXIT TIME
const updateExit = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    // Only security can mark exit
    if (req.user.role !== "security") {
      return res.status(403).json({ message: "Only security can update visitor exit" });
    }

    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    visitor.exitTime = new Date();
    visitor.status = "Exited";

    const updatedVisitor = await visitor.save();
    res.json(updatedVisitor);
  } catch (error) {
    console.error("Update exit error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVisitor,
  getVisitors,
  updateExit
};