const router = require("express").Router();
const cloudinaryUpload = require("../middleware/cloudinaryUpload");
const {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
} = require("../controllers/uploadController");
const { protect, adminOnly } = require("../middleware/auth");

router.post(
  "/",
  protect,
  adminOnly,
  cloudinaryUpload.single("image"),
  uploadImage,
);
router.post(
  "/multiple",
  protect,
  adminOnly,
  cloudinaryUpload.array("images", 5),
  uploadMultipleImages,
);
router.delete("/", protect, adminOnly, deleteImage);

module.exports = router;
