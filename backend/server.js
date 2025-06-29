require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const OtpLog = require("./models/Otplog"); // ✅ Added: For tracking emails

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB (if not already connected)
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Home route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

// ✅ Temporary OTP memory store
const otpStore = {}; // { email: "123456" }

// ✅ Send OTP route
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("Email required");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  // ✅ Track the email
  await OtpLog.create({ email });

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

// ✅ Verify OTP and reset password
app.post("/verify-otp", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).send("All fields are required");
  }

  if (otpStore[email] !== otp) {
    return res.status(400).send("Invalid or expired OTP");
  }

  delete otpStore[email];

  // You can update the password in DB here if needed
  res.send("OTP verified and password reset successful");
});

// ✅ Optional: View list of used emails
app.get("/otp-logs", async (req, res) => {
  try {
    const logs = await OtpLog.find().sort({ requestedAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).send("Error fetching logs");
  }
});

// ✅ Start server
app.listen(5000, () => {
  console.log("✅ Backend running on port 5000");
});
