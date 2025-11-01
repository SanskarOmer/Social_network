
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    // notify other components
    window.dispatchEvent(new Event('authChanged'));
    navigate("/login");
  };

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access"));

  useEffect(() => {
    const onAuthChange = () => setIsLoggedIn(!!localStorage.getItem("access"));
    // listen for cross-tab storage changes
    window.addEventListener('storage', onAuthChange);
    // listen for app-level auth change events
    window.addEventListener('authChanged', onAuthChange);
    return () => {
      window.removeEventListener('storage', onAuthChange);
      window.removeEventListener('authChanged', onAuthChange);
    };
  }, []);

  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">Social Network</Link>
      </div>

      <div className="nav-right">
        {isLoggedIn ? (
          // When logged in show a Feed link only on the profile page plus a red Logout button
          <>
            {location && location.pathname === "/profile" && (
              <Link to="/feed" className="nav-link">Feed</Link>
            )}
            <button
              className="nav-btn"
              onClick={handleLogout}
              style={{ backgroundColor: "#e74c3c", color: "white", border: "none", padding: "8px 12px", borderRadius: 4 }}
            >
              Logout
            </button>
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
