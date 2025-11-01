import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/axiosConfig";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    try {
      // Use FormData so profile picture can be uploaded optionally
      const data = new FormData();
      data.append("email", email);
      data.append("username", username);
      data.append("password", password);
      if (fullName) data.append("full_name", fullName);
      if (dateOfBirth) data.append("date_of_birth", dateOfBirth);
      if (profilePicture) data.append("profile_picture", profilePicture);

      const res = await API.post("signup/", data);
      if (res.status === 201 || res.status === 200) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        alert("Signup responded with unexpected status: " + res.status);
      }
    } catch (err) {
      // Display server-side validation errors when possible
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: ["Signup failed. Try again."] });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) setProfilePicture(e.target.files[0]);
  };

  return (
    <div className="container">
      <div className="card">
        <h3>Signup</h3>
        <form onSubmit={handleSubmit}>
          {errors && (
            <div style={{ color: "red", marginBottom: 8 }}>
              {Object.entries(errors).map(([k, v]) => (
                <div key={k}>{k}: {Array.isArray(v) ? v.join(" ") : v}</div>
              ))}
            </div>
          )}
          <input
            type="text"
            placeholder="Full name (optional)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="date"
            placeholder="Date of birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
          />
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
