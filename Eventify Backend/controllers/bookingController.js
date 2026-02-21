const Booking = require("../models/Booking");
const Event = require("../models/Event");
const transporter = require("../config/mailer");
const { bookingConfirmationHTML } = require("../utils/emailTemplates");

// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const {
      eventId,
      eventName,
      fullName,
      email,
      phone,
      address,
      paidAmount,
      transactionId,
      paymentScreenshot,
    } = req.body;
    if (!eventId || !fullName || !email || !phone) {
      return res
        .status(400)
        .json({ message: "eventId, fullName, email and phone are required" });
    }
    const booking = await Booking.create({
      eventId,
      eventName,
      userId: req.user ? req.user._id : null,
      fullName,
      email,
      phone,
      address: address || "",
      paidAmount: paidAmount || 0,
      transactionId: transactionId || "",
      paymentScreenshot: paymentScreenshot || "",
      status: "pending",
      bookingDate: new Date().toISOString().split("T")[0],
    });
    // Send confirmation email (fire-and-forget)
    try {
      const event = await Event.findById(eventId);
      await transporter.sendMail({
        from: `"Eventify" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Booking Confirmation — ${eventName}`,
        html: bookingConfirmationHTML({
          fullName,
          eventName,
          bookingDate: new Date().toISOString().split("T")[0],
          paidAmount,
          transactionId,
          bookingId: booking._id.toString(),
          eventDate: event?.date || "TBA",
          startTime: event?.startTime || "",
          endTime: event?.endTime || "",
          location: event?.location || "",
          venue: event?.venue || "",
          instructor: event?.instructor || "",
          difficulty: event?.difficulty || "",
        }),
      });
    } catch (mailErr) {
      console.error("Failed to send confirmation email:", mailErr.message);
    }

    res.status(201).json({ ...booking.toObject(), id: booking._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings — admin gets all, user gets their own
exports.getBookings = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== "admin") {
      filter = { email: req.user.email };
    }
    const { status, search } = req.query;
    if (status && status !== "all") filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { eventName: { $regex: search, $options: "i" } },
      ];
    }
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    const mapped = bookings.map((b) => ({
      ...b.toObject(),
      id: b._id.toString(),
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/all — public endpoint for admin dashboard (used when admin is authenticated)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    const mapped = bookings.map((b) => ({
      ...b.toObject(),
      id: b._id.toString(),
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/bookings/:id/status (admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNotes, ticketId } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    if (adminNotes !== undefined) booking.adminNotes = adminNotes;
    if (ticketId) booking.ticketId = ticketId;
    await booking.save();

    // If approving, increment event booked count
    if (status === "approved") {
      await Event.findByIdAndUpdate(booking.eventId, { $inc: { booked: 1 } });
    }

    res.json({ ...booking.toObject(), id: booking._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/export (admin CSV)
exports.exportBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Event",
      "Amount",
      "Transaction ID",
      "Status",
      "Date",
    ];
    const rows = bookings.map((b) => [
      b._id.toString(),
      b.fullName,
      b.email,
      b.phone,
      b.eventName,
      b.paidAmount,
      b.transactionId || "-",
      b.status,
      b.bookingDate,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bookings-${Date.now()}.csv`,
    );
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
