import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f8f9fa",
        padding: "1rem 0",
        marginTop: "auto",
        borderTop: "1px solid #ddd",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h4 style={{ margin: "0.5rem 0", color: "#333" }}>
          Point of Sale System
        </h4>
        <p style={{ margin: "0.3rem 0", fontSize: "0.9rem", color: "#666" }}>
          © {new Date().getFullYear()} All rights reserved. | Developed by Omkar
          Gawali
        </p>
      </div>
    </footer>
  );
};

export default Footer;
