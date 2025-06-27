import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link here
import './App.css';

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendAvailable, setResendAvailable] = useState(false);

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setResendAvailable(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  const handleSendOTP = async () => {
    try {
      const sound = new Audio("/send.mp3");
      sound.play();

      const res = await fetch(`${process.env.REACT_APP_BACKEND}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.text();
      setMessage(data);
      if (res.ok) {
        setStep(2);
        setTimer(60);
        setResendAvailable(false);
      }
    } catch (err) {
      setMessage("Failed to send OTP.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.text();
      if (res.ok) {
        setIsSuccess(true);
        setMessage(data);
        const sound = new Audio("/success.mp3");
        sound.play();
      } else {
        setMessage(data);
      }
    } catch (err) {
      setMessage("Verification failed.");
    }
  };

  if (isSuccess) {
    return (
      <div className="page">
        <h2 className="success-text">🎉 Password Reset Successfully!</h2>
        <img src="/mail.png" className="celebrate-img" alt="Success" />
        <Link to="/">
          <button className="home-btn">Back to Home</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="main-title">Reset Your Password</h2>
      {step === 1 ? (
        <>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <button onClick={handleSendOTP}>Send OTP</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <br />
          <button onClick={handleVerifyOTP}>Verify & Reset</button>
          <p>⏳ Resend available in: {timer}s</p>
          {resendAvailable && (
            <button onClick={handleSendOTP}>🔁 Resend OTP</button>
          )}
        </>
      )}
      <p>{message}</p>

      <Link to="/">
        <button className="home-btn">Back to Home</button>
      </Link>
    </div>
  );
}

export default ResetPassword;
