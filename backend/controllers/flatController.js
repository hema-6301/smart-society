const Flat = require("../models/Flat");

// GET ALL FLATS
const getFlats = async (req, res) => {
  try {
    const flats = await Flat.find().sort({ flat_number: 1 });
    res.json(flats);
  } catch (err) {
    console.error("Fetch flats error:", err);
    res.status(500).json({ message: err.message });
  }
};

// CREATE FLAT
const createFlat = async (req, res) => {
  try {
    const flat = await Flat.create(req.body);
    res.status(201).json(flat);
  } catch (err) {
    console.error("Create flat error:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE FLAT
const updateFlat = async (req, res) => {
  try {
    const flat = await Flat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flat) return res.status(404).json({ message: "Flat not found" });
    res.json(flat);
  } catch (err) {
    console.error("Update flat error:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE FLAT
const deleteFlat = async (req, res) => {
  try {
    const flat = await Flat.findByIdAndDelete(req.params.id);
    if (!flat) return res.status(404).json({ message: "Flat not found" });
    res.json({ message: "Flat deleted successfully" });
  } catch (err) {
    console.error("Delete flat error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getFlats,
  createFlat,
  updateFlat,
  deleteFlat
};