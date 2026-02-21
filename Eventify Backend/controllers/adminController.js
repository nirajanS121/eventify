const Settings = require("../models/Settings");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const User = require("../models/User");

// GET /api/admin/settings
exports.getSettings = async (req, res) => {
  try {
    const qr = await Settings.findOne({ key: "qrCodeUrl" });
    const instructions = await Settings.findOne({ key: "paymentInstructions" });
    res.json({
      qrCodeUrl: qr?.value || "",
      paymentInstructions:
        instructions?.value ||
        "Scan the QR code below and pay the exact event amount. After payment, upload a screenshot of the confirmation below.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/settings
exports.updateSettings = async (req, res) => {
  try {
    const { qrCodeUrl, paymentInstructions } = req.body;
    if (qrCodeUrl !== undefined) {
      await Settings.findOneAndUpdate(
        { key: "qrCodeUrl" },
        { key: "qrCodeUrl", value: qrCodeUrl },
        { upsert: true },
      );
    }
    if (paymentInstructions !== undefined) {
      await Settings.findOneAndUpdate(
        { key: "paymentInstructions" },
        { key: "paymentInstructions", value: paymentInstructions },
        { upsert: true },
      );
    }
    const qr = await Settings.findOne({ key: "qrCodeUrl" });
    const inst = await Settings.findOne({ key: "paymentInstructions" });
    res.json({
      qrCodeUrl: qr?.value || "",
      paymentInstructions: inst?.value || "",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/dashboard — aggregate stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [events, bookings, usersCount] = await Promise.all([
      Event.find(),
      Booking.find(),
      User.countDocuments({ role: "user" }),
    ]);
    const totalEvents = events.length;
    const activeEvents = events.filter((e) => e.status === "active").length;
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending",
    ).length;
    const approvedBookings = bookings.filter(
      (b) => b.status === "approved",
    ).length;
    const rejectedBookings = bookings.filter(
      (b) => b.status === "rejected",
    ).length;
    const totalRevenue = bookings
      .filter((b) => b.status === "approved")
      .reduce((s, b) => s + (b.paidAmount || 0), 0);
    const uniqueEmails = new Set(bookings.map((b) => b.email));

    // Monthly revenue for chart
    const monthlyRevenue = {};
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    bookings
      .filter((b) => b.status === "approved")
      .forEach((b) => {
        const d = new Date(b.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        if (!monthlyRevenue[key])
          monthlyRevenue[key] = { month: label, revenue: 0 };
        monthlyRevenue[key].revenue += b.paidAmount || 0;
      });
    const revenueOverTime = Object.keys(monthlyRevenue)
      .sort()
      .map((k) => monthlyRevenue[k]);

    res.json({
      totalEvents,
      activeEvents,
      totalBookings,
      pendingBookings,
      approvedBookings,
      rejectedBookings,
      totalRevenue,
      uniqueCustomers: uniqueEmails.size,
      totalUsers: usersCount,
      revenueOverTime,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
