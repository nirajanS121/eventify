const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountPercent: { type: Number, required: true, min: 1, max: 100 },
    maxUses: { type: Number, required: true, default: 100 },
    currentUses: { type: Number, default: 0 },
    minimumAmount: { type: Number, default: 0 },
    expiryDate: { type: String, default: "" },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PromoCode", promoCodeSchema);
