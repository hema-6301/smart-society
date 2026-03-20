const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    flatNumber: { type: String, required: true },
    purpose: { type: String, required: true },
    entryTime: { type: Date, default: Date.now },
    exitTime: { type: Date, default: null },
    status: { type: String, enum: ["Inside", "Exited"], default: "Inside" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Security/Admin who added
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);