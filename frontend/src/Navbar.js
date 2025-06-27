import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // ✅ Optional: add your styles

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/reset">reset</Link>
    </nav>
  );
}

export default Navbar;
