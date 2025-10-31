import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const isLoggedIn = !!localStorage.getItem("access");

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">Social Network</Link>
      </div>

      <div className="nav-right">
        {isLoggedIn ? (
          <>
            <Link to="/feed" className="nav-link">Feed</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button className="nav-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
