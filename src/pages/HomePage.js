import React, { useState } from "react";
import LayOut from "../components/LayOut/LayOut";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

/* ─── Inline styles as JS objects for reuse ─── */
const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },

  /* ── Guest card ── */
  guestCard: {
    width: "100%",
    maxWidth: "480px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "3rem 2.5rem",
    textAlign: "center",
    backdropFilter: "blur(20px)",
    boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
  },
  guestIconRing: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6c63ff, #48cae4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    margin: "0 auto 1.5rem",
    boxShadow: "0 8px 32px rgba(108,99,255,0.4)",
  },
  guestTitle: {
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: "0.75rem",
    letterSpacing: "-0.5px",
  },
  guestSub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "1rem",
    lineHeight: 1.6,
    marginBottom: "2rem",
  },
  btnRow: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "center",
  },
  btnPrimary: {
    flex: 1,
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(135deg, #6c63ff, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 600,
    letterSpacing: "0.3px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 16px rgba(108,99,255,0.3)",
  },
  btnSecondary: {
    flex: 1,
    padding: "0.75rem 1.5rem",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 600,
    letterSpacing: "0.3px",
    transition: "all 0.2s ease",
  },

  /* ── Dashboard card ── */
  dashCard: {
    width: "100%",
    maxWidth: "640px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "28px",
    overflow: "hidden",
    backdropFilter: "blur(20px)",
    boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
  },

  /* header banner */
  banner: {
    background: "linear-gradient(135deg, #6c63ff 0%, #48cae4 100%)",
    padding: "2rem 2rem 3.5rem",
    position: "relative",
    overflow: "hidden",
  },
  bannerOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.12) 0%, transparent 60%)",
    pointerEvents: "none",
  },
  avatarRing: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    border: "2px solid rgba(255,255,255,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#fff",
    marginBottom: "0.75rem",
    letterSpacing: "-1px",
  },
  bannerName: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#fff",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  bannerRole: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)",
    marginTop: "0.3rem",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    fontWeight: 500,
  },
  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: 600,
    marginTop: "0.75rem",
    letterSpacing: "0.5px",
  },
  adminBadge: {
    background: "rgba(255,220,80,0.2)",
    color: "#ffd750",
    border: "1px solid rgba(255,215,80,0.3)",
  },
  userBadge: {
    background: "rgba(255,255,255,0.15)",
    color: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(255,255,255,0.25)",
  },

  /* body */
  body: {
    padding: "0 2rem 2rem",
    marginTop: "-1.5rem",
    position: "relative",
  },

  /* info cards grid */
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  infoCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "1rem 1.25rem",
    transition: "background 0.2s",
  },
  infoLabel: {
    fontSize: "0.72rem",
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    fontWeight: 600,
    marginBottom: "0.4rem",
  },
  infoValue: {
    fontSize: "0.95rem",
    color: "rgba(255,255,255,0.92)",
    fontWeight: 500,
    wordBreak: "break-all",
  },

  /* wide card (email spans full width) */
  infoCardWide: {
    gridColumn: "span 2",
    background: "rgba(108,99,255,0.1)",
    border: "1px solid rgba(108,99,255,0.2)",
    borderRadius: "16px",
    padding: "1rem 1.25rem",
  },

  /* details toggle */
  toggleBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.85rem 1.25rem",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    cursor: "pointer",
    color: "rgba(255,255,255,0.75)",
    fontSize: "0.9rem",
    fontWeight: 500,
    transition: "all 0.2s ease",
    marginBottom: "0.75rem",
  },
  chevron: (open) => ({
    display: "inline-block",
    transition: "transform 0.3s ease",
    transform: open ? "rotate(180deg)" : "rotate(0deg)",
    fontSize: "1.1rem",
  }),

  /* expandable details */
  detailsPanel: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    overflow: "hidden",
  },
  detailRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.85rem 1.25rem",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  detailIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.95rem",
    flexShrink: 0,
  },
  detailKey: {
    fontSize: "0.78rem",
    color: "rgba(255,255,255,0.4)",
    marginBottom: "2px",
    fontWeight: 500,
    letterSpacing: "0.3px",
  },
  detailVal: {
    fontSize: "0.88rem",
    color: "rgba(255,255,255,0.85)",
    wordBreak: "break-all",
  },
};

/* ─── Helper: initials from name ─── */
const initials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/* ─── Component ─── */
const HomePage = () => {
  const [auth] = useAuth();
  const { user } = auth || {};
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  /* ── Guest view ── */
  if (!user) {
    return (
      <LayOut>
        <div style={styles.page}>
          <div style={styles.guestCard}>
            <div style={styles.guestIconRing}>🔐</div>
            <h2 style={styles.guestTitle}>Welcome Back</h2>
            <p style={styles.guestSub}>
              Sign in to access your personal dashboard, manage your account,
              and explore all features.
            </p>
            <div style={styles.btnRow}>
              <button
                style={styles.btnPrimary}
                onClick={() => navigate("/login")}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Log In
              </button>
              <button
                style={styles.btnSecondary}
                onClick={() => navigate("/register")}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
                }
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </LayOut>
    );
  }

  const isAdmin = user.role === 1;

  /* ── Dashboard view ── */
  return (
    <LayOut>
      <div style={styles.page}>
        <div style={styles.dashCard}>
          {/* Banner */}
          <div className="py-3" style={styles.banner}>
            <div style={styles.bannerOverlay} />
            <div style={styles.avatarRing}>{initials(user.name)}</div>
            <h2 style={styles.bannerName}>{user.name}</h2>
            <p style={styles.bannerRole}>
              {isAdmin ? "Administrator" : "Member"}
            </p>
            <span
              style={{
                ...styles.roleBadge,
                ...(isAdmin ? styles.adminBadge : styles.userBadge),
              }}
            >
              {isAdmin ? "⭐ Admin" : "👤 User"}
            </span>
          </div>

          {/* Body */}
          <div className="mt-1" style={styles.body}>
            {/* Summary grid */}
            <div c style={styles.grid}>
              {/* Email — full width */}
              <div
                className="mt-3"
                style={{ ...styles.infoCard, ...styles.infoCardWide }}
              >
                <div style={styles.infoLabel}>📧 Email</div>
                <div style={styles.infoValue}>{user.email}</div>
              </div>

              {/* Phone */}
              <div style={styles.infoCard}>
                <div style={styles.infoLabel}>📱 Phone</div>
                <div style={styles.infoValue}>{user.phone || "—"}</div>
              </div>

              {/* Role */}
              <div style={styles.infoCard}>
                <div style={styles.infoLabel}>🛡 Role</div>
                <div style={styles.infoValue}>{isAdmin ? "Admin" : "User"}</div>
              </div>
            </div>

            {/* Toggle button */}
            <button
              style={styles.toggleBtn}
              onClick={() => setShowDetails(!showDetails)}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
              }
            >
              <span>Additional Details</span>
              <span style={styles.chevron(showDetails)}>▾</span>
            </button>

            {/* Details panel */}
            {showDetails && (
              <div style={styles.detailsPanel}>
                {[
                  {
                    icon: "🆔",
                    bg: "rgba(108,99,255,0.15)",
                    label: "User ID",
                    value: user._id,
                  },
                  {
                    icon: "📍",
                    bg: "rgba(72,202,228,0.12)",
                    label: "Address",
                    value: user.address || "Not Provided",
                  },
                  {
                    icon: "📅",
                    bg: "rgba(72,228,128,0.12)",
                    label: "Joined",
                    value: new Date(user.createdAt).toLocaleString(),
                  },
                  {
                    icon: "🔄",
                    bg: "rgba(255,200,80,0.12)",
                    label: "Last Updated",
                    value: new Date(user.updatedAt).toLocaleString(),
                    last: true,
                  },
                ].map(({ icon, bg, label, value, last }) => (
                  <div
                    key={label}
                    style={{
                      ...styles.detailRow,
                      ...(last ? { borderBottom: "none" } : {}),
                    }}
                  >
                    <div style={{ ...styles.detailIcon, background: bg }}>
                      {icon}
                    </div>
                    <div>
                      <div style={styles.detailKey}>{label}</div>
                      <div style={styles.detailVal}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </LayOut>
  );
};

export default HomePage;
