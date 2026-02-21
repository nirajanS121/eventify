const router = require("express").Router();
const {
  getPromos,
  createPromo,
  updatePromo,
  deletePromo,
  validatePromo,
} = require("../controllers/promoController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", protect, adminOnly, getPromos);
router.post("/", protect, adminOnly, createPromo);
router.post("/validate", validatePromo);
router.put("/:id", protect, adminOnly, updatePromo);
router.delete("/:id", protect, adminOnly, deletePromo);

module.exports = router;
