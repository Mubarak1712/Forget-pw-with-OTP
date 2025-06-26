import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import ResetPassword from "./resetPassword"; // ✅ USE this below
import Navbar from "./Navbar";
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/reset" element={<ResetPassword />} /> {/* ✅ FIXED */}
      </Routes>
    </Router>
  );
}

export default App;
