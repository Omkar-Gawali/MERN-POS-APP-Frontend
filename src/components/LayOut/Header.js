import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import { useAuth } from "../../context/authContext";

/* ── Google Font import (inject once) ── */
if (
  typeof document !== "undefined" &&
  !document.getElementById("header-font")
) {
  const link = document.createElement("link");
  link.id = "header-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap";
  document.head.appendChild(link);
}

/* ── Styles ── */
const S = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
    background: "rgba(10, 10, 20, 0.82)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    fontFamily: "'DM Sans', sans-serif",
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1.5rem",
    height: "62px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
  brand: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: "1.2rem",
    color: "#fff",
    textDecoration: "none",
    letterSpacing: "-0.5px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },
  brandDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6c63ff, #48cae4)",
    display: "inline-block",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: "rgba(255,255,255,0.6)",
    textDecoration: "none",
    fontSize: "0.88rem",
    fontWeight: 500,
    padding: "6px 12px",
    borderRadius: "8px",
    transition: "all 0.18s ease",
    display: "block",
  },
  navLinkActive: {
    color: "#fff",
    background: "rgba(255,255,255,0.08)",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },
  cartBtn: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "7px 14px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.85)",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 500,
    transition: "all 0.18s ease",
    position: "relative",
  },
  cartCount: {
    background: "linear-gradient(135deg, #6c63ff, #48cae4)",
    color: "#fff",
    fontSize: "0.68rem",
    fontWeight: 700,
    padding: "2px 6px",
    borderRadius: "20px",
    minWidth: "18px",
    textAlign: "center",
    lineHeight: "1.4",
  },
  authBtn: {
    padding: "7px 16px",
    borderRadius: "10px",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    transition: "all 0.18s ease",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  },
  loginBtn: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.8)",
  },
  registerBtn: {
    background: "linear-gradient(135deg, #6c63ff, #8b5cf6)",
    color: "#fff",
    boxShadow: "0 4px 14px rgba(108,99,255,0.35)",
  },

  /* User dropdown */
  userBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "5px 12px 5px 6px",
    borderRadius: "10px",
    background: "rgba(108,99,255,0.12)",
    border: "1px solid rgba(108,99,255,0.25)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 500,
    transition: "all 0.18s ease",
    position: "relative",
  },
  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6c63ff, #48cae4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#fff",
    flexShrink: 0,
    letterSpacing: "-0.5px",
  },
  chevron: (open) => ({
    fontSize: "0.65rem",
    opacity: 0.6,
    transition: "transform 0.2s ease",
    transform: open ? "rotate(180deg)" : "rotate(0deg)",
  }),
  dropdown: {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    minWidth: "200px",
    background: "rgba(16, 16, 30, 0.96)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    padding: "6px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    zIndex: 999,
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 12px",
    borderRadius: "9px",
    color: "rgba(255,255,255,0.75)",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 500,
    transition: "all 0.15s ease",
    cursor: "pointer",
    width: "100%",
    border: "none",
    background: "transparent",
    textAlign: "left",
  },
  dropdownDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.07)",
    margin: "5px 0",
  },
  dropdownIcon: {
    width: "26px",
    height: "26px",
    borderRadius: "7px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    flexShrink: 0,
  },

  /* Mobile toggler */
  toggler: {
    display: "none",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "7px 10px",
    cursor: "pointer",
    color: "rgba(255,255,255,0.8)",
    fontSize: "1rem",
  },

  /* Mobile menu */
  mobileMenu: (open) => ({
    display: open ? "flex" : "none",
    flexDirection: "column",
    gap: "4px",
    padding: "12px 1.5rem 16px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(10, 10, 20, 0.95)",
  }),
  mobileLink: {
    color: "rgba(255,255,255,0.7)",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: 500,
    padding: "10px 12px",
    borderRadius: "10px",
    display: "block",
    transition: "background 0.15s",
  },
};

/* ── Helpers ── */
const initials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const NavItem = ({ to, children, style = {} }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <Link
        to={to}
        style={{ ...S.navLink, ...(hovered ? S.navLinkActive : {}), ...style }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </Link>
    </li>
  );
};

/* ── Component ── */
const Header = () => {
  const navigate = useNavigate();
  const [cart] = useCart();
  const [auth, setAuth] = useAuth();
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
    setDropOpen(false);
    navigate("/login");
  };

  const dashPath = `/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`;
  const billsPath = `${dashPath}/bills`;

  const dropItems = [
    {
      icon: "🏠",
      bg: "rgba(108,99,255,0.18)",
      label: "Dashboard",
      to: dashPath,
    },
    {
      icon: "🧾",
      bg: "rgba(72,202,228,0.15)",
      label: "My Bills",
      to: billsPath,
    },
  ];

  return (
    <header>
      <nav style={S.nav}>
        <div style={S.inner}>
          {/* Brand */}
          <a href="/" style={S.brand}>
            <span style={S.brandDot} />
            POS Software
          </a>

          {/* Desktop nav links */}
          <ul style={{ ...S.navLinks, flex: 1, paddingLeft: "1.5rem" }}>
            <NavItem to="/">Home</NavItem>
            <NavItem to="/products">Products</NavItem>
          </ul>

          {/* Right side */}
          <div style={S.right}>
            {/* Cart */}
            <Link
              to="/cart"
              style={S.cartBtn}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
              }
            >
              🛒
              <span style={S.cartCount}>{cart?.length ?? 0}</span>
            </Link>

            {/* Auth area */}
            {!auth?.user ? (
              <>
                <Link
                  to="/login"
                  style={{ ...S.authBtn, ...S.loginBtn }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.12)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.07)")
                  }
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  style={{ ...S.authBtn, ...S.registerBtn }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Register
                </Link>
              </>
            ) : (
              /* User dropdown */
              <div ref={dropRef} style={{ position: "relative" }}>
                <button
                  style={S.userBtn}
                  onClick={() => setDropOpen((o) => !o)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(108,99,255,0.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(108,99,255,0.12)")
                  }
                >
                  <span style={S.avatar}>{initials(auth.user.name)}</span>
                  <span
                    style={{
                      maxWidth: "110px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {auth.user.name}
                  </span>
                  <span style={S.chevron(dropOpen)}>▾</span>
                </button>

                {dropOpen && (
                  <div style={S.dropdown}>
                    {/* User info header */}
                    <div
                      style={{
                        padding: "10px 12px 8px",
                        marginBottom: "4px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "#fff",
                        }}
                      >
                        {auth.user.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "rgba(255,255,255,0.4)",
                          marginTop: "2px",
                        }}
                      >
                        {auth.user.email}
                      </div>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "6px",
                          padding: "2px 8px",
                          borderRadius: "20px",
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          background:
                            auth.user.role === 1
                              ? "rgba(255,220,80,0.18)"
                              : "rgba(255,255,255,0.08)",
                          color:
                            auth.user.role === 1
                              ? "#ffd750"
                              : "rgba(255,255,255,0.6)",
                          border:
                            auth.user.role === 1
                              ? "1px solid rgba(255,215,80,0.3)"
                              : "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        {auth.user.role === 1 ? "⭐ Admin" : "👤 User"}
                      </span>
                    </div>

                    <div style={S.dropdownDivider} />

                    {dropItems.map(({ icon, bg, label, to }) => (
                      <Link
                        key={label}
                        to={to}
                        style={S.dropdownItem}
                        onClick={() => setDropOpen(false)}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(255,255,255,0.06)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <span style={{ ...S.dropdownIcon, background: bg }}>
                          {icon}
                        </span>
                        {label}
                      </Link>
                    ))}

                    <div style={S.dropdownDivider} />

                    <button
                      style={{
                        ...S.dropdownItem,
                        color: "rgba(255,100,100,0.85)",
                      }}
                      onClick={handleLogout}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,80,80,0.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span
                        style={{
                          ...S.dropdownIcon,
                          background: "rgba(255,80,80,0.12)",
                        }}
                      >
                        🚪
                      </span>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile toggler */}
            <button
              style={{
                ...S.toggler,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className="header-mobile-toggler"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div style={S.mobileMenu(mobileOpen)}>
          {[
            { to: "/", label: "🏠 Home" },
            { to: "/products", label: "📦 Products" },
            { to: "/cart", label: `🛒 Cart (${cart?.length ?? 0})` },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={S.mobileLink}
              onClick={() => setMobileOpen(false)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {label}
            </Link>
          ))}

          {!auth?.user ? (
            <>
              <Link
                to="/login"
                style={S.mobileLink}
                onClick={() => setMobileOpen(false)}
              >
                🔑 Log In
              </Link>
              <Link
                to="/register"
                style={{ ...S.mobileLink, color: "#a89dff" }}
                onClick={() => setMobileOpen(false)}
              >
                ✨ Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to={dashPath}
                style={S.mobileLink}
                onClick={() => setMobileOpen(false)}
              >
                🏠 Dashboard
              </Link>
              <Link
                to={billsPath}
                style={S.mobileLink}
                onClick={() => setMobileOpen(false)}
              >
                🧾 My Bills
              </Link>
              <button
                style={{
                  ...S.mobileLink,
                  color: "rgba(255,100,100,0.85)",
                  cursor: "pointer",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                }}
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
              >
                🚪 Log Out
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hide mobile toggler on desktop, show nav links on mobile */}
      <style>{`
        @media (min-width: 768px) {
          .header-mobile-toggler { display: none !important; }
        }
        @media (max-width: 767px) {
          .header-desktop-links { display: none !important; }
          .header-desktop-auth { display: none !important; }
          .header-desktop-cart { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
