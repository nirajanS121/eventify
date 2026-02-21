const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("GalleryImage", galleryImageSchema);
