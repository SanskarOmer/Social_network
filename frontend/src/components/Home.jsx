import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container text-center">
      <div className="card">
        <h2>Welcome to Social Network</h2>
        <p className="text-muted">Connect, share, and grow together!</p>
        <div style={{ marginTop: "15px" }}>
          <Link to="/signup" className="btn" style={{ marginRight: "10px" }}>
            Sign Up
          </Link>
          <Link to="/login" className="btn">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
