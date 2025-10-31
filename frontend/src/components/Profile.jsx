import React, { useEffect, useState } from "react";
import API from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", profile_picture: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("profile/");
        setProfile(res.data);
      } catch {
        alert("Please login first");
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFile = (e) =>
    setFormData({ ...formData, profile_picture: e.target.files[0] });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (formData.full_name) data.append("full_name", formData.full_name);
    if (formData.profile_picture) data.append("profile_picture", formData.profile_picture);

    try {
      const res = await API.patch("profile/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data);
      alert("Profile updated");
      setEditMode(false);
    } catch {
      alert("Update failed");
    }
  };

  if (!profile) return <p className="text-center">Loading...</p>;

  return (
    <div className="container">
      <div className="card text-center">
        <h3>My Profile</h3>
        {profile.profile_picture && (
          <img
            src={`http://127.0.0.1:8000${profile.profile_picture}`}
            alt="Profile"
            style={{ width: "100px", height: "100px", marginBottom: "10px" }}
          />
        )}
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Full Name:</strong> {profile.full_name || "N/A"}</p>

        <button className="btn" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel" : "Edit Profile"}
        </button>

        {editMode && (
          <form onSubmit={handleUpdate} style={{ marginTop: "15px" }}>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              onChange={handleChange}
            />
            <input
              type="file"
              name="profile_picture"
              onChange={handleFile}
            />
            <button className="btn" type="submit">Save</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
