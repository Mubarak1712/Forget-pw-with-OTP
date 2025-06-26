import React, { useState } from 'react';
import './App.css';
import { Howl } from 'howler';
import mailSound from './mail-sound.mp3';
import successSound from './success-sound.mp3';

function App() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [stage, setStage] = useState('email');
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const playSound = (src) => {
    const sound = new Howl({ src: [src] });
    sound.play();
  };

  const handleSendOTP = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.text();

      if (res.ok) {
        setMessage(`✅ ${data}`);
        playSound(mailSound);
        setStage('otp');
      } else {
        setMessage(`❌ ${data}`);
      }
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.text();

      if (res.ok) {
        setMessage(`✅ ${data}`);
        setIsSuccess(true);
        playSound(successSound);
      } else {
        setMessage(`❌ ${data}`);
      }
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.response?.data?.message || err.message}`);

    }
  };

  return (
    <div className="container">
      {isSuccess ? (
        <>
          <h1>🎉 Success!</h1>
          <p>Your password has been updated.</p>
        </>
      ) : stage === 'email' ? (
        <>
          <h1>🔐 OTP Verification</h1>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOTP}>Send OTP</button>
        </>
      ) : (
        <>
          <h1>🔑 Enter OTP & New Password</h1>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleVerifyOTP}>Verify & Reset</button>
        </>
      )}

      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
    </div>
  );
}

export default App;
