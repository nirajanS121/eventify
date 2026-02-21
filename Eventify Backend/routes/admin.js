const router = require("express").Router();
const {
  getSettings,
  updateSettings,
  getDashboardStats,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/settings", getSettings);
router.put("/settings", protect, adminOnly, updateSettings);
router.get("/dashboard", protect, adminOnly, getDashboardStats);

module.exports = router;
