const User = require("../models/User");
const { generateToken } = require("../middleware/auth");

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || "",
    });
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        loyaltyPoints: user.loyaltyPoints,
        favorites: user.favorites,
        role: user.role,
        joinedDate: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        loyaltyPoints: user.loyaltyPoints,
        favorites: user.favorites,
        role: user.role,
        joinedDate: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/admin/login
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Find or create the admin user
      let admin = await User.findOne({ role: "admin" });
      if (!admin) {
        admin = await User.create({
          name: "Admin",
          email: "admin@forgeandflow.com",
          password: process.env.ADMIN_PASSWORD,
          role: "admin",
        });
      }
      const token = generateToken(admin._id);
      return res.json({
        token,
        user: {
          _id: admin._id,
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    }
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      loyaltyPoints: user.loyaltyPoints,
      favorites: user.favorites,
      role: user.role,
      joinedDate: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    await user.save();
    res.json({
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      loyaltyPoints: user.loyaltyPoints,
      favorites: user.favorites,
      role: user.role,
      joinedDate: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
