import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ for page navigation
import "./App.css";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate(); // ✅ initialize navigation

  useEffect(() => {
    if (otpSent && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [otpSent, timer]);

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.text();

      if (response.ok) {
        console.log("✅ OTP sent:", data);
        new Audio(process.env.PUBLIC_URL + "/send.mp3").play(); // ✅ play send sound
        setOtpSent(true);
        setTimer(60);
        alert("OTP sent successfully!");
      } else {
        console.error("❌ Error sending OTP:", data);
        alert("Failed to send OTP: " + data);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.text();

      if (response.ok) {
        console.log("✅ Password reset successful!");
        const successAudio = new Audio(process.env.PUBLIC_URL + "/success.mp3");
        successAudio.play().catch((err) => console.warn("🔇 Sound error:", err));
        alert("✅ Password reset successful!");
        
        // ✅ Redirect to success page with slight delay
        setTimeout(() => {
          navigate("/success");
        }, 2000);
      } else {
        console.error("❌ Error verifying OTP:", data);
        alert("Failed to verify OTP: " + data);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="page">
      <h1 className="reset-heading">Reset Your Password</h1>

      {!otpSent ? (
        <form onSubmit={sendOtp}>
          <input
            type="email"
            placeholder="Enter your email"
            className="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="reset-button">Send OTP</button>
        </form>
      ) : (
        <>
          {timer > 0 ? (
            <p style={{ color: "red", fontWeight: "bold" }}>
              ⏳ OTP expires in: {timer} seconds
            </p>
          ) : (
            <p style={{ color: "gray" }}>⛔ OTP expired. Please request again.</p>
          )}

          <form onSubmit={verifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              className="otp-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter New Password"
              className="password-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="reset-button">Verify & Reset Password</button>
          </form>
        </>
      )}
    </div>
  );
}

export default ResetPassword;
