import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/axiosConfig";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("signup/", { email, username, password });
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      alert("Signup failed! Try again.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h3>Signup</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn" type="submit">Create Account</button>
        </form>
        <p className="text-center text-muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
