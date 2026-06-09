import React, { useState } from "react";
import LayOut from "../components/LayOut/LayOut";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";

/* ── Font inject ── */
if (typeof document !== "undefined" && !document.getElementById("dash-font")) {
  const link = document.createElement("link");
  link.id = "dash-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap";
  document.head.appendChild(link);
}

const initials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const S = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(160deg, #0a0a14 0%, #12102a 50%, #0d1a2e 100%)",
    fontFamily: "'DM Sans', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
  },

  /* Loading */
  loadCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "3rem 2rem",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  loadText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.95rem",
    fontWeight: 500,
    margin: 0,
  },

  /* Main card */
  card: {
    width: "100%",
    maxWidth: "560px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
  },

  /* Banner */
  banner: {
    background: "linear-gradient(135deg, #6c63ff 0%, #48cae4 100%)",
    padding: "2rem 2rem 3rem",
    position: "relative",
    overflow: "hidden",
  },
  bannerOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 75% 30%, rgba(255,255,255,0.13) 0%, transparent 55%)",
    pointerEvents: "none",
  },
  avatarRing: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.22)",
    border: "2px solid rgba(255,255,255,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#fff",
    marginBottom: "10px",
    letterSpacing: "-1px",
  },
  bannerName: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.35rem",
    fontWeight: 700,
    color: "#fff",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  bannerSub: {
    fontSize: "0.72rem",
    color: "rgba(255,255,255,0.68)",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    fontWeight: 500,
    marginTop: "3px",
  },
  roleBadge: (isAdmin) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: 600,
    marginTop: "10px",
    background: isAdmin ? "rgba(255,220,80,0.2)" : "rgba(255,255,255,0.15)",
    color: isAdmin ? "#ffd750" : "rgba(255,255,255,0.9)",
    border: isAdmin
      ? "1px solid rgba(255,215,80,0.3)"
      : "1px solid rgba(255,255,255,0.25)",
  }),

  /* Body */
  body: {
    padding: "0 1.75rem 1.75rem",
    marginTop: "-1.5rem",
    position: "relative",
  },

  /* Summary grid */
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.7rem",
    marginBottom: "0.75rem",
  },
  infoCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "0.9rem 1.1rem",
  },
  infoCardWide: {
    gridColumn: "span 2",
    background: "rgba(108,99,255,0.1)",
    border: "1px solid rgba(108,99,255,0.2)",
    borderRadius: "14px",
    padding: "0.9rem 1.1rem",
  },
  infoLabel: {
    fontSize: "0.66rem",
    color: "rgba(255,255,255,0.38)",
    textTransform: "uppercase",
    letterSpacing: "1.1px",
    fontWeight: 600,
    marginBottom: "4px",
  },
  infoValue: {
    fontSize: "0.88rem",
    color: "rgba(255,255,255,0.9)",
    fontWeight: 500,
    wordBreak: "break-all",
  },

  /* Toggle */
  toggleBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.8rem 1.1rem",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "13px",
    cursor: "pointer",
    color: "rgba(255,255,255,0.65)",
    fontSize: "0.85rem",
    fontWeight: 500,
    transition: "all 0.18s ease",
    marginBottom: "0.7rem",
  },
  chevron: (open) => ({
    transition: "transform 0.28s ease",
    transform: open ? "rotate(180deg)" : "rotate(0deg)",
    fontSize: "0.9rem",
  }),

  /* Details panel */
  detailsPanel: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px",
    overflow: "hidden",
    marginBottom: "0.7rem",
  },
  detailRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0.8rem 1.1rem",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  detailIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.88rem",
    flexShrink: 0,
  },
  detailKey: {
    fontSize: "0.68rem",
    color: "rgba(255,255,255,0.38)",
    marginBottom: "2px",
    fontWeight: 500,
  },
  detailVal: {
    fontSize: "0.84rem",
    color: "rgba(255,255,255,0.82)",
    wordBreak: "break-all",
  },

  /* Quick actions */
  actionsRow: { display: "flex", gap: "0.6rem" },
  actionBtn: {
    flex: 1,
    padding: "9px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.09)",
    color: "rgba(255,255,255,0.65)",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.15s",
  },
};

const UserDashboard = () => {
  const [auth] = useAuth();
  const { user } = auth || {};
  const [showDetails, setShowDetails] = useState(false);

  if (!user) {
    return (
      <LayOut>
        <div style={S.page}>
          <div style={S.loadCard}>
            <div
              style={{
                fontSize: "1.5rem",
                marginBottom: "0.75rem",
                opacity: 0.4,
              }}
            >
              ⏳
            </div>
            <p style={S.loadText}>Loading your profile…</p>
          </div>
        </div>
      </LayOut>
    );
  }

  const isAdmin = user.role === 1;

  const detailRows = [
    { icon: "🆔", bg: "rgba(108,99,255,0.18)", key: "User ID", val: user._id },
    {
      icon: "📍",
      bg: "rgba(72,202,228,0.14)",
      key: "Address",
      val: user.address || "Not provided",
    },
    {
      icon: "📅",
      bg: "rgba(72,228,128,0.14)",
      key: "Joined",
      val: new Date(user.createdAt).toLocaleString(),
    },
    {
      icon: "🔄",
      bg: "rgba(255,200,80,0.14)",
      key: "Last Updated",
      val: new Date(user.updatedAt).toLocaleString(),
      last: true,
    },
  ];

  return (
    <LayOut>
      <div style={S.page}>
        <div style={S.card}>
          {/* Banner */}
          <div className="py-3" style={S.banner}>
            <div style={S.bannerOverlay} />
            <div style={S.avatarRing}>{initials(user.name)}</div>
            <h2 style={S.bannerName}>{user.name}</h2>
            <p style={S.bannerSub}>{isAdmin ? "Administrator" : "Member"}</p>
            <span style={S.roleBadge(isAdmin)}>
              {isAdmin ? "⭐ Admin" : "👤 User"}
            </span>
          </div>

          {/* Body */}
          <div style={S.body}>
            {/* Summary grid */}
            <div className="mt-5" style={S.grid}>
              <div style={S.infoCardWide}>
                <div style={S.infoLabel}>✉️ Email</div>
                <div style={S.infoValue}>{user.email}</div>
              </div>
              <div style={S.infoCard}>
                <div style={S.infoLabel}>📱 Phone</div>
                <div style={S.infoValue}>{user.phone || "—"}</div>
              </div>
              <div style={S.infoCard}>
                <div style={S.infoLabel}>🛡 Role</div>
                <div style={S.infoValue}>{isAdmin ? "Admin" : "User"}</div>
              </div>
            </div>

            {/* Toggle */}
            <button
              style={S.toggleBtn}
              onClick={() => setShowDetails((s) => !s)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
              }
            >
              <span>Additional Details</span>
              <span style={S.chevron(showDetails)}>▾</span>
            </button>

            {/* Details */}
            {showDetails && (
              <div style={S.detailsPanel}>
                {detailRows.map(({ icon, bg, key, val, last }) => (
                  <div
                    key={key}
                    style={{
                      ...S.detailRow,
                      ...(last ? { borderBottom: "none" } : {}),
                    }}
                  >
                    <div style={{ ...S.detailIcon, background: bg }}>
                      {icon}
                    </div>
                    <div>
                      <div style={S.detailKey}>{key}</div>
                      <div style={S.detailVal}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick actions */}
            <div style={S.actionsRow}>
              <Link
                to={
                  isAdmin ? "/dashboard/admin/bills" : "/dashboard/user/bills"
                }
                style={S.actionBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(108,99,255,0.14)";
                  e.currentTarget.style.borderColor = "rgba(108,99,255,0.3)";
                  e.currentTarget.style.color = "rgba(200,195,255,0.9)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                }}
              >
                🧾 My Bills
              </Link>
              <Link
                to="/products"
                style={S.actionBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(72,202,228,0.1)";
                  e.currentTarget.style.borderColor = "rgba(72,202,228,0.25)";
                  e.currentTarget.style.color = "rgba(130,220,240,0.9)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                }}
              >
                📦 Products
              </Link>
              <Link
                to="/cart"
                style={S.actionBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(72,228,128,0.08)";
                  e.currentTarget.style.borderColor = "rgba(72,228,128,0.22)";
                  e.currentTarget.style.color = "rgba(130,230,160,0.9)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                }}
              >
                🛒 Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LayOut>
  );
};

export default UserDashboard;
