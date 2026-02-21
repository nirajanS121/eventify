const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "" },
    avatar: { type: String, default: "" },
    text: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    event: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
