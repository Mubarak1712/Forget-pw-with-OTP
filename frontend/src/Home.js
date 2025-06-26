import React from "react";
import "./App.css";

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Reset Your Password Easily</h1>
      <p className="home-subtitle">A quick and secure way to regain access to your account.</p>
      <img src="/mail.png" alt="Reset Illustration" className="home-img" />
      <a href="/reset">
        <button className="home-btn">Start Reset</button>
      </a>
    </div>
  );
}

export default Home;
