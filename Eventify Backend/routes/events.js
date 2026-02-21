const router = require("express").Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  updateBookedCount,
} = require("../controllers/eventController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/", protect, adminOnly, createEvent);
router.put("/:id", protect, adminOnly, updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);
router.patch("/:id/booked", protect, adminOnly, updateBookedCount);

module.exports = router;
