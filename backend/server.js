require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Temporary in-memory OTP store (reset on server restart)
const otpStore = {};  // Structure: { email: "123456" }

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("Email required");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp; // ✅ Save OTP for verification

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("OTP sent successfully");
  } catch (error) {
    console.error("❌ Error sending mail:", error);
    res.status(500).send("Failed to send OTP");
  }
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).send("All fields are required");
  }

  // ✅ Match OTP
  if (otpStore[email] !== otp) {
    return res.status(400).send("Invalid or expired OTP");
  }

  // You can now update the password in DB here if needed (omitted for simplicity)

  // ✅ Clear the OTP after use
  delete otpStore[email];

  res.send("OTP verified and password reset successful");
});

app.listen(5000, () => {
  console.log("✅ Backend running on port 5000");
});
