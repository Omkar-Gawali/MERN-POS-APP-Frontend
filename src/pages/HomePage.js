import React, { useState } from "react";
import LayOut from "../components/LayOut/LayOut";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom"; // Assuming react-router-dom is used

const HomePage = () => {
  const [auth] = useAuth();
  const { user } = auth || {};
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  // If user is not logged in, show interactive prompt
  if (!user) {
    return (
      <LayOut>
        <div
          className="container"
          style={{
            maxWidth: "600px",
            margin: "4rem auto",
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#333", marginBottom: "1rem" }}>
            👋 Welcome to the Dashboard!
          </h2>
          <p
            style={{ color: "#555", fontSize: "1.1rem", marginBottom: "2rem" }}
          >
            You are not logged in. Please log in or register to access your
            dashboard and features.
          </p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#0056b3")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#007bff")
              }
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#1e7e34")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#28a745")
              }
            >
              Register
            </button>
          </div>
        </div>
      </LayOut>
    );
  }

  // Logged-in user dashboard
  return (
    <LayOut>
      <div
        className="container"
        style={{
          maxWidth: "650px",
          margin: "2rem auto",
          padding: "2rem",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          borderRadius: "12px",
          backgroundColor: "#fdfdfd",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#333" }}>
          👋 Welcome, {user.name}!
        </h2>

        {/* Summary Section */}
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            borderRadius: "10px",
            backgroundColor: "#f0f4f8",
          }}
        >
          <h4 style={{ marginBottom: "1rem", color: "#444" }}>🔍 Summary</h4>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
            <li>
              <strong>Email:</strong> {user.email}
            </li>
            <li>
              <strong>Phone:</strong> {user.phone || "N/A"}
            </li>
            <li>
              <strong>Role:</strong> {user.role === 1 ? "Admin" : "User "}
            </li>
          </ul>
        </div>

        {/* Toggle Button */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              padding: "0.6rem 1.2rem",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "0.95rem",
              transition: "background-color 0.3s",
            }}
          >
            {showDetails ? "⬆️ Hide Details" : "⬇️ Show More Details"}
          </button>
        </div>

        {/* Details Section */}
        {showDetails && (
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              borderRadius: "10px",
              backgroundColor: "#fff9f0",
              border: "1px solid #ffe0b3",
            }}
          >
            <h4 style={{ marginBottom: "1rem", color: "#444" }}>
              📄 Additional Details
            </h4>
            <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
              <li>
                <strong>User ID:</strong> {user._id}
              </li>
              <li>
                <strong>Address:</strong> {user.address || "Not Provided"}
              </li>
              <li>
                <strong>Created At:</strong>{" "}
                {new Date(user.createdAt).toLocaleString()}
              </li>
              <li>
                <strong>Updated At:</strong>{" "}
                {new Date(user.updatedAt).toLocaleString()}
              </li>
            </ul>
          </div>
        )}
      </div>
    </LayOut>
  );
};

export default HomePage;
