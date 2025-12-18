import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/axiosConfig";

const PostFeed = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch logged-in user profile
  const fetchUserProfile = async () => {
    try {
      const res = await API.get("profile/");
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await API.get("posts/");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchPosts();
  }, []);

  // 🔹 Create post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!description.trim() && !image) return alert("Write something or add an image!");

    setLoading(true);
    const formData = new FormData();
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await API.post("posts/", formData, {
        // Let the browser/axios set the Content-Type boundary automatically
      });
      setDescription("");
      setImage(null);
      fetchPosts(); // refresh feed instantly
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Like / Unlike
  const handleLike = async (id) => {
    try {
      await API.post(`posts/${id}/like/`);
      fetchPosts();
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // 🔹 Delete post
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`posts/${id}/`);
      fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };

  // Helper to ensure absolute URL for images
  const buildUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    // ensure there's a leading slash
    const p = path.startsWith("/") ? path : `/${path}`;
    return `http://127.0.0.1:8000${p}`;
  };

  return (
    <div className="feed-layout">
      {/* Left Profile Section */}
      <div className="card profile-card">
        {user ? (
          <>
            <img
              src={user.profile_picture ? buildUrl(user.profile_picture) : "/default-avatar.png"}
              alt="Profile"
            />
            <h3>{user.full_name}</h3>
            <p className="profile-info">{user.email}</p>
            {user.date_of_birth && (
              <p className="profile-info">
                DOB – {new Date(user.date_of_birth).toLocaleDateString()}
              </p>
            )}
            <p className="share-profile">
              <Link to="/profile" style={{ textDecoration: "none", color: "#007bff" }}>Edit Profile</Link>
            </p>
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>

      {/* Right Feed Section */}
      <div>
        {/* Create Post */}
        <div className="card post-creator">
  <h3>Add Post</h3>
  <form onSubmit={handleCreatePost}>
    <textarea
      placeholder="What's on your mind?"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows="3"
    />
    {image && (
      <img
        src={URL.createObjectURL(image)}
        alt="Preview"
        style={{
          width: "100%",
          borderRadius: "10px",
          marginBottom: "8px",
        }}
      />
    )}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>

      <div>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setImage(file);
            }
            e.target.value = "";
          }}
        />
        <button
          type="button"
          className="add-image-btn"
          onClick={() => document.getElementById("fileInput").click()}
        >
          📷 Add Image
        </button>
      </div>
    </div>
  </form>
</div>


        {/* Posts Feed */}
        {posts.length === 0 ? (
          <p className="text-center text-muted">No posts yet</p>
        ) : (
          posts
            .slice()
            .reverse()
            .map((post) => (
              <div key={post.id} className="card post">
                <div>
                  <strong>
                    Posted on –{" "}
                    {new Date(post.created_at).toLocaleDateString()}
                  </strong>
                </div>
                <p style={{ marginTop: "8px" }}>{post.description}</p>
                {post.image && (
                  <img
                    src={buildUrl(post.image)}
                    alt="Post"
                    style={{ borderRadius: "10px", marginTop: "8px" }}
                  />
                )}
                <div className="post-actions">
                  <button onClick={() => handleLike(post.id)}>
                    👍 Like {post.likes_count}
                  </button>
                  {/* Show delete button only for posts by the logged-in user */}
                  {user && post.user_id && user.id && post.user_id === user.id && (
                    <button style={{ marginLeft: 8 }} onClick={() => handleDelete(post.id)}>
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default PostFeed;
