const Payment = require("../models/Payment");

// CREATE PAYMENT (Admin/Owner)
const createPayment = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (!["admin", "owner"].includes(req.user.role))
      return res.status(403).json({ message: "Not authorized" });

    const { userId, flatNumber, amount, month } = req.body;

    if (!userId || !flatNumber || !amount || !month)
      return res.status(400).json({ message: "All fields are required" });

    const payment = await Payment.create({
      user: userId,          // link payment to selected resident
      flatNumber: flatNumber.trim(),
      amount,
      month: month.trim(),
      status: "Pending"
    });

    res.status(201).json(payment);

  } catch (error) {
    console.error("Create payment error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET PAYMENTS
const getPayments = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    let payments = [];

    if (["admin", "owner"].includes(req.user.role)) {
      // Admin/Owner sees all payments
      payments = await Payment.find()
        .populate("user", "name email flatNumber")
        .sort({ createdAt: -1 });
    } else if (req.user.role === "resident") {
      // Resident sees only their payments
      payments = await Payment.find({ user: req.user._id })
        .populate("user", "name email flatNumber")
        .sort({ createdAt: -1 });
    }

    res.json(payments);
  } catch (error) {
    console.error("Fetch payments error:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PAYMENT STATUS (Admin/Owner)
const updatePaymentStatus = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (!["admin", "owner"].includes(req.user.role))
      return res.status(403).json({ message: "Not authorized" });

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = req.body.status || payment.status;
    const updatedPayment = await payment.save();

    res.json(updatedPayment);
  } catch (error) {
    console.error("Update payment error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPayment, getPayments, updatePaymentStatus };