require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());


// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ User model
const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  otp: String,
  password: String,
}));

// ✅ OTP Log model
const OtpLog = mongoose.model("OtpLog", new mongoose.Schema({
  email: String,
  requestedAt: {
    type: Date,
    default: Date.now
  }
}));

// ✅ Root test route
app.get('/', (req, res) => {
  res.send('✅ OTP Backend is Running');
});

// ✅ OTP usage count
app.get('/otp-usage-count', async (req, res) => {
  try {
    const count = await OtpLog.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting count' });
  }
});

// ✅ Send OTP
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

  transporter.sendMail(mailOptions, async (err, info) => {
    if (err) {
      console.error("❌ Email error:", err);
      return res.status(500).send("Failed to send OTP");
    }

    console.log("✅ OTP email sent:", info.response);

    await OtpLog.create({ email });
    res.send("OTP sent successfully");
  });
});

// ✅ Verify OTP
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

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
