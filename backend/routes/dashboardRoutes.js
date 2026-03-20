const express = require("express");
const router = express.Router();

// Temporary demo data (later connect DB)
router.get("/", async (req, res) => {
  res.json({
    totalUsers: 25,
    pendingComplaints: 4,
    monthlyPayments: 50000,
    visitorsToday: 12,
  });
});

module.exports = router;