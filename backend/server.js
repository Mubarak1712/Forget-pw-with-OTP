require("dotenv").config(); // Load .env first

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Debug: Show loaded environment variables
console.log("Mongo URL:", process.env.MONGO_URL);
console.log("Email:", process.env.EMAIL);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Define User model
const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  otp: String,
  password: String,
}));

// ✅ Route to send OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).send("Email is required");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Generated OTP for ${email}: ${otp}`);

  await User.findOneAndUpdate({ email }, { otp }, { upsert: true });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "🔐 Your OTP Code",
    text: `Hello!\n\nYour OTP code is: ${otp}\n\nThanks.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("❌ Email error:", err);
      return res.status(500).send("Failed to send OTP");
    }
    console.log("✅ OTP email sent:", info.response);
    res.send("OTP sent successfully");
  });
});

// ✅ Route to verify OTP and reset password
app.post("/verify-otp", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword)
    return res.status(400).send("Email, OTP and New Password are required");

  const user = await User.findOne({ email });

  if (user?.otp === otp) {
    user.password = newPassword;
    user.otp = "";
    await user.save();
    res.send("Password updated successfully");
  } else {
    res.status(400).send("Invalid OTP");
  }
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  app.get('/', (req, res) => {
  res.send('✅ OTP Backend is Running');
});

});