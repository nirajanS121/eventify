const router = require("express").Router();
const {
  toggleFavorite,
  getFavorites,
} = require("../controllers/favoriteController");
const { protect } = require("../middleware/auth");

router.post("/:eventId", protect, toggleFavorite);
router.get("/", protect, getFavorites);

module.exports = router;
