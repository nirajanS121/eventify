const router = require("express").Router();
const {
  createBooking,
  getBookings,
  getAllBookings,
  updateBookingStatus,
  exportBookings,
} = require("../controllers/bookingController");
const { protect, adminOnly, optionalAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post(
  "/",
  optionalAuth,
  upload.single("paymentScreenshot"),
  createBooking,
);
router.get("/", protect, getBookings);
router.get("/all", protect, adminOnly, getAllBookings);
router.get("/export", protect, adminOnly, exportBookings);
router.put("/:id/status", protect, adminOnly, updateBookingStatus);

module.exports = router;
