const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    eventName: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, default: "" },
    paidAmount: { type: Number, required: true },
    transactionId: { type: String, default: "" },
    paymentScreenshot: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    bookingDate: { type: String, required: true },
    adminNotes: { type: String, default: "" },
    ticketId: { type: String, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
