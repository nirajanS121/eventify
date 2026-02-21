const PromoCode = require("../models/PromoCode");

// GET /api/promos
exports.getPromos = async (req, res) => {
  try {
    const promos = await PromoCode.find().sort({ createdAt: -1 });
    res.json(promos.map((p) => ({ ...p.toObject(), id: p._id.toString() })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/promos
exports.createPromo = async (req, res) => {
  try {
    const promo = await PromoCode.create(req.body);
    res.status(201).json({ ...promo.toObject(), id: promo._id.toString() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/promos/:id
exports.updatePromo = async (req, res) => {
  try {
    const promo = await PromoCode.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!promo)
      return res.status(404).json({ message: "Promo code not found" });
    res.json({ ...promo.toObject(), id: promo._id.toString() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/promos/:id
exports.deletePromo = async (req, res) => {
  try {
    const promo = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promo)
      return res.status(404).json({ message: "Promo code not found" });
    res.json({ message: "Promo code deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/promos/validate — validate a promo code for booking
exports.validatePromo = async (req, res) => {
  try {
    const { code, amount } = req.body;
    const promo = await PromoCode.findOne({ code: code.toUpperCase() });
    if (!promo)
      return res.status(404).json({ message: "Promo code not found" });
    if (!promo.isActive)
      return res.status(400).json({ message: "Promo code is inactive" });
    if (promo.currentUses >= promo.maxUses)
      return res
        .status(400)
        .json({ message: "Promo code usage limit reached" });
    if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) {
      return res.status(400).json({ message: "Promo code has expired" });
    }
    if (promo.minimumAmount && amount < promo.minimumAmount) {
      return res
        .status(400)
        .json({ message: `Minimum amount is $${promo.minimumAmount}` });
    }
    const discount = (amount * promo.discountPercent) / 100;
    res.json({
      valid: true,
      discountPercent: promo.discountPercent,
      discountAmount: Math.round(discount * 100) / 100,
      finalAmount: Math.round((amount - discount) * 100) / 100,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
