const User = require("../models/User");
const Event = require("../models/Event");

// POST /api/favorites/:eventId — toggle
exports.toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const eventId = req.params.eventId;

    // Check event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const idx = user.favorites.indexOf(eventId);
    if (idx === -1) {
      user.favorites.push(eventId);
    } else {
      user.favorites.splice(idx, 1);
    }
    await user.save();
    res.json({ favorites: user.favorites.map((f) => f.toString()) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/favorites
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ favorites: user.favorites.map((f) => f.toString()) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
