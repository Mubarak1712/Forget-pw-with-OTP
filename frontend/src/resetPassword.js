import React, { useState } from "react";
import "./App.css";

function ResetPassword() {
  const [email, setEmail] = useState("");

  const sendOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("OTP sent:", data);
        alert("OTP sent successfully!");
      } else {
        console.error("Error sending OTP:", data);
        alert("Failed to send OTP: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="page">
      <h1 className="reset-heading">Reset Your Password</h1>
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
    </div>
  );
}

export default ResetPassword;
