// POST /api/upload
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/upload/multiple
exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image files provided" });
    }
    const images = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));
    res.json({ images });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/upload
exports.deleteImage = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    const cloudinary = require("../config/cloudinary");

    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/<cloud>/image/upload/v123/eventify/filename.ext
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) {
      return res.status(400).json({ message: "Invalid Cloudinary URL" });
    }
    // Everything after upload/vXXX/ is the public_id (without extension)
    const afterUpload = parts.slice(uploadIndex + 1);
    // Skip the version segment (starts with 'v' followed by digits)
    const withoutVersion = afterUpload.filter((p) => !/^v\d+$/.test(p));
    const publicIdWithExt = withoutVersion.join("/");
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok" || result.result === "not found") {
      return res.json({ message: "Image deleted", public_id: publicId });
    }
    res
      .status(500)
      .json({ message: "Failed to delete image from Cloudinary", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
