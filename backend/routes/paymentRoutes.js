const express = require("express");
const router = express.Router();

const { createPayment, getPayments, updatePaymentStatus } = require("../controllers/paymentController");
const auth = require("../middleware/authMiddleware");

// CREATE PAYMENT
router.post("/", auth, createPayment);

// GET PAYMENTS
router.get("/", auth, getPayments);

// UPDATE PAYMENT STATUS
router.put("/:id", auth, updatePaymentStatus);

module.exports = router;