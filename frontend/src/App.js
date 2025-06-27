import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";            // ✅ use your Navbar component
import Home from "./Home";
import About from "./About";
import ResetPassword from "./ResetPassword"; // ✅ match your actual file name

function App() {
  return (
    <Router>
      <Navbar />                          {/* ✅ navbar shows on all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/reset" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
