const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getFlats,
  createFlat,
  updateFlat,
  deleteFlat
} = require("../controllers/flatController");

// All routes require authentication
router.use(auth);

// Get all flats
router.get("/", getFlats);

// Create new flat
router.post("/", createFlat);

// Update flat by ID
router.put("/:id", updateFlat);

// Delete flat by ID
router.delete("/:id", deleteFlat);

module.exports = router;