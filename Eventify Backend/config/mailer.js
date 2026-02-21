const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify connection on startup
transporter.verify((err) => {
  if (err) {
    console.error("Email transporter error:", err.message);
  } else {
    console.log("Email transporter is ready");
  }
});

module.exports = transporter;
