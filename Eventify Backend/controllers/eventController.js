const Event = require("../models/Event");

// GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const { type, difficulty, search, featured, status } = req.query;
    const filter = {};
    if (type && type !== "all") filter.type = type;
    if (difficulty && difficulty !== "all") filter.difficulty = difficulty;
    if (featured === "true") filter.featured = true;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { instructor: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const events = await Event.find(filter).sort({ date: 1 });
    // Map _id to id for frontend compatibility
    const mapped = events.map((e) => ({
      ...e.toObject(),
      id: e._id.toString(),
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/events/:id
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ ...event.toObject(), id: event._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/events (admin)
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ ...event.toObject(), id: event._id.toString() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/events/:id (admin)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ ...event.toObject(), id: event._id.toString() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/events/:id (admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/events/:id/booked (admin — increment/decrement booked count)
exports.updateBookedCount = async (req, res) => {
  try {
    const { increment } = req.body; // +1 or -1
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    event.booked = Math.max(0, event.booked + (increment || 0));
    await event.save();
    res.json({ ...event.toObject(), id: event._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
