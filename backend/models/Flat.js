const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema(
  {
    flat_number: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    owner_name: {
      type: String,
      trim: true,
      default: null
    },

    owner_email: {
      type: String,
      trim: true,
      default: null
    },

    owner_phone: {
      type: String,
      trim: true,
      default: null
    },

    block: {
      type: String,
      trim: true
    },

    floor: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ["occupied", "vacant"],
      default: "vacant"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flat", flatSchema);
