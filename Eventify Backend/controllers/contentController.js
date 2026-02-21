const Testimonial = require("../models/Testimonial");
const GalleryImage = require("../models/GalleryImage");
const Event = require("../models/Event");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Contact = require("../models/Contact");
const Settings = require("../models/Settings");

// GET /api/testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(
      testimonials.map((t) => ({ ...t.toObject(), id: t._id.toString() })),
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/gallery
exports.getGallery = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    res.json(images.map((i) => ({ ...i.toObject(), id: i._id.toString() })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/stats — public stats for hero section
exports.getStats = async (req, res) => {
  try {
    const [usersCount, events, testimonials] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Event.find({ status: "active" }),
      Testimonial.find(),
    ]);

    const totalEventsHosted = events.reduce(
      (sum, e) => sum + (e.booked || 0),
      0,
    );
    const categories = new Set(events.map((e) => e.type)).size;
    const avgRating =
      testimonials.length > 0
        ? (
            testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) /
            testimonials.length
          ).toFixed(1)
        : "5.0";

    res.json({
      communityMembers: usersCount,
      eventsHosted: events.length,
      categories,
      avgRating: `${avgRating}★`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/contact — submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const contact = await Contact.create({ name, email, subject, message });
    res
      .status(201)
      .json({
        message: "Message sent successfully",
        id: contact._id.toString(),
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/site-info — public site contact info
exports.getSiteInfo = async (req, res) => {
  try {
    const keys = [
      "siteAddress",
      "siteEmail",
      "sitePhone",
      "siteSocialInstagram",
      "siteSocialYoutube",
      "siteSocialTwitter",
    ];
    const settings = await Settings.find({ key: { $in: keys } });
    const map = {};
    settings.forEach((s) => (map[s.key] = s.value));

    res.json({
      address: map.siteAddress || "42 Wellness Way, Portland, OR 97201",
      email: map.siteEmail || "hello@forgeandflow.co",
      phone: map.sitePhone || "+1 (555) 234-5678",
      social: {
        instagram: map.siteSocialInstagram || "",
        youtube: map.siteSocialYoutube || "",
        twitter: map.siteSocialTwitter || "",
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
