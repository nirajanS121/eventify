const Waitlist = require("../models/Waitlist");

// POST /api/waitlist
exports.addToWaitlist = async (req, res) => {
  try {
    const { eventId, eventName, fullName, email, phone, address } = req.body;
    if (!eventId || !fullName || !email || !phone) {
      return res
        .status(400)
        .json({ message: "eventId, fullName, email and phone are required" });
    }
    const entry = await Waitlist.create({
      eventId,
      eventName,
      fullName,
      email,
      phone,
      address: address || "",
    });
    res.status(201).json({ ...entry.toObject(), id: entry._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/waitlist (admin)
exports.getWaitlist = async (req, res) => {
  try {
    const entries = await Waitlist.find().sort({ joinedAt: -1 });
    res.json(entries.map((e) => ({ ...e.toObject(), id: e._id.toString() })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
