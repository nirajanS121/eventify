const router = require("express").Router();
const {
  getTestimonials,
  getGallery,
  getStats,
  submitContact,
  getSiteInfo,
} = require("../controllers/contentController");

router.get("/testimonials", getTestimonials);
router.get("/gallery", getGallery);
router.get("/stats", getStats);
router.get("/site-info", getSiteInfo);
router.post("/contact", submitContact);

module.exports = router;
