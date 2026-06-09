import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "rgba(10, 10, 20, 0.85)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.5rem 1.5rem",
        }}
      >
        {/* ── Top row: brand + nav links ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "1.75rem",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6c63ff, #48cae4)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'Syne', 'Segoe UI', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#fff",
                  letterSpacing: "-0.4px",
                }}
              >
                POS Software
              </span>
            </div>
            <p
              style={{
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.35)",
                margin: 0,
                maxWidth: "220px",
                lineHeight: 1.6,
              }}
            >
              A modern Point of Sale system built for speed, simplicity, and
              reliability.
            </p>
          </div>

          {/* Nav links */}
          <div
            style={{
              display: "flex",
              gap: "2.5rem",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                heading: "Navigate",
                links: [
                  { label: "Home", to: "/" },
                  { label: "Products", to: "/products" },
                  { label: "Cart", to: "/cart" },
                ],
              },
              {
                heading: "Account",
                links: [
                  { label: "Login", to: "/login" },
                  { label: "Register", to: "/register" },
                ],
              },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <div
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "1.2px",
                    marginBottom: "10px",
                  }}
                >
                  {heading}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {links.map(({ label, to }) => (
                    <Link
                      key={label}
                      to={to}
                      style={{
                        fontSize: "0.82rem",
                        color: "rgba(255,255,255,0.45)",
                        textDecoration: "none",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "rgba(200,195,255,0.9)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.45)")
                      }
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.06)",
            marginBottom: "1.25rem",
          }}
        />

        {/* ── Bottom row: copyright + developer ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.25)",
              margin: 0,
            }}
          >
            © {year} POS Software. All rights reserved.
          </p>

          <p
            style={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.25)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            Crafted with
            <span style={{ color: "#e05c7a", fontSize: "0.8rem" }}>♥</span>
            by{" "}
            <span
              style={{
                color: "rgba(200,195,255,0.6)",
                fontWeight: 600,
              }}
            >
              Omkar Gawali
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
