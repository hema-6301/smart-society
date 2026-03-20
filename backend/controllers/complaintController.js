const Complaint = require("../models/Complaint");

// Resident creates complaint
const createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const complaint = await Complaint.create({
      user: req.user._id, // <-- fixed here
      title: title.trim(),
      description: description.trim(),
      status: "Pending",
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error("Create complaint error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get complaints
const getComplaints = async (req, res) => {
  try {
    let complaints = [];

    if (["admin", "owner"].includes(req.user.role)) {
      complaints = await Complaint.find()
        .populate("user", "name flatNumber email")
        .sort({ createdAt: -1 });
    } else if (req.user.role === "resident") {
      complaints = await Complaint.find({ user: req.user._id }) // <-- fixed here
        .sort({ createdAt: -1 });
    }

    res.json(complaints);
  } catch (error) {
    console.error("Get complaints error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Admin updates complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    if (!["admin", "owner"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = req.body.status || complaint.status;
    const updated = await complaint.save();

    res.json(updated);
  } catch (error) {
    console.error("Update complaint error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
};