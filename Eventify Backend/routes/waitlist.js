const router = require("express").Router();
const {
  addToWaitlist,
  getWaitlist,
} = require("../controllers/waitlistController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/", addToWaitlist);
router.get("/", protect, adminOnly, getWaitlist);

module.exports = router;
