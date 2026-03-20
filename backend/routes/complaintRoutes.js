const router = require("express").Router();

const {
  createComplaint,
  getComplaints,
  updateComplaintStatus
} = require("../controllers/complaintController");

const auth = require("../middleware/authMiddleware");


// Resident creates complaint
router.post("/", auth, createComplaint);

// Get complaints
router.get("/", auth, getComplaints);

// Admin updates complaint status
router.put("/:id", auth, updateComplaintStatus);

module.exports = router;