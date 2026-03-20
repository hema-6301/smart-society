const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ------------------ ROUTE IMPORTS ------------------
const authRoutes = require("./routes/authRoutes");   // ✅ ADD THIS
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const flatRoutes = require("./routes/flatRoutes");

// ------------------ ROUTES ------------------
app.use("/api/auth", authRoutes);  // ✅ ADD THIS
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/flats", flatRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("SSMS API is Running 🚀");
});

// ------------------ DATABASE CONNECTION ------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });