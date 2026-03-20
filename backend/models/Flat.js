const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema(
  {
    flat_number: { type: String, required: true, trim: true },
    owner_name: { type: String, required: true, trim: true },
    owner_email: { type: String, trim: true },
    owner_phone: { type: String, trim: true },
    block: { type: String, trim: true },
    floor: { type: String, trim: true },
    status: { type: String, enum: ["occupied", "vacant"], default: "occupied" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flat", flatSchema);