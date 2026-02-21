const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["ICE_BATH", "FITNESS", "YOGA", "RUN_CLUB", "BOXING", "SOCIAL"],
    },
    location: { type: String, required: true },
    venue: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    capacity: { type: Number, required: true },
    booked: { type: Number, default: 0 },
    bookingDeadline: { type: String },
    description: { type: String, required: true },
    images: [{ type: String }],
    instructor: { type: String, default: "" },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "All Levels",
    },
    equipment: [{ type: String }],
    safetyNotes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "draft", "cancelled", "completed"],
      default: "active",
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
