import React, { useEffect, useState } from "react";
import API from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", profile_picture: null });
  const [previewUrl, setPreviewUrl] = useState(null);
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

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_picture: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (formData.full_name) data.append("full_name", formData.full_name);
    if (formData.profile_picture) data.append("profile_picture", formData.profile_picture);

    try {
      // Let axios set Content-Type so the boundary is added correctly
      const res = await API.patch("profile/", data);
      setProfile(res.data);
      alert("Profile updated");
      setEditMode(false);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Update failed");
    }
  };

  if (!profile) return <p className="text-center">Loading...</p>;

  const currentImage = profile.profile_picture
    ? (profile.profile_picture.startsWith("http") ? profile.profile_picture : `http://127.0.0.1:8000${profile.profile_picture.startsWith("/") ? "" : "/"}${profile.profile_picture}`)
    : null;

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="rounded-circle img-thumbnail" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                  ) : currentImage ? (
                    <img src={currentImage} alt="Profile" className="rounded-circle img-thumbnail" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                  ) : (
                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 100, height: 100 }}>
                      <strong>{(profile.full_name || profile.username || 'U').charAt(0)}</strong>
                    </div>
                  )}
                </div>
                <div className="flex-grow-1">
                  <h5 className="card-title mb-1">{profile.full_name || profile.username}</h5>
                  <p className="text-muted mb-0">{profile.email}</p>
                </div>
                <div>
                  <button className="btn btn-outline-secondary" onClick={() => { setEditMode(!editMode); if (!editMode) setFormData({ full_name: profile.full_name || '', profile_picture: null }); else { setFormData({ full_name: '', profile_picture: null }); setPreviewUrl(null); } }}>
                    {editMode ? 'Cancel' : 'Edit'}
                  </button>
                </div>
              </div>

              {editMode ? (
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label">Full name</label>
                    <input type="text" name="full_name" className="form-control" value={formData.full_name} onChange={handleChange} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Profile picture</label>
                    <input type="file" accept="image/*" className="form-control" onChange={handleFile} />
                  </div>

                  <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-3">
                    <button className="btn btn-primary mb-2 mb-sm-0" type="submit">Save changes</button>
                    <button type="button" className="btn btn-secondary ms-sm-2" onClick={() => { setEditMode(false); setPreviewUrl(null); setFormData({ full_name: '', profile_picture: null }); }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="mt-3">
                  <p><strong>Full name:</strong> {profile.full_name || 'N/A'}</p>
                  <p><strong>Username:</strong> {profile.username}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
