import React, { useState } from "react";
import LayOut from "../components/LayOut/LayOut";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

/* ── Font inject ── */
if (typeof document !== "undefined" && !document.getElementById("auth-font")) {
  const link = document.createElement("link");
  link.id = "auth-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap";
  document.head.appendChild(link);
}

const S = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(160deg, #0a0a14 0%, #12102a 50%, #0d1a2e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    padding: "2rem 1rem",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "2.5rem 2rem",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
  },
  iconRing: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6c63ff, #48cae4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4rem",
    margin: "0 auto 1.25rem",
    boxShadow: "0 8px 24px rgba(108,99,255,0.4)",
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#fff",
    textAlign: "center",
    letterSpacing: "-0.5px",
    margin: "0 0 0.4rem",
  },
  subtitle: {
    fontSize: "0.84rem",
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    marginBottom: "1.75rem",
  },
  formGroup: { marginBottom: "0.9rem" },
  label: {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.38)",
    textTransform: "uppercase",
    letterSpacing: "0.9px",
    marginBottom: "6px",
  },
  inputWrap: { position: "relative" },
  inputIcon: {
    position: "absolute",
    left: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "0.95rem",
    pointerEvents: "none",
    opacity: 0.4,
  },
  input: {
    width: "100%",
    padding: "10px 13px 10px 38px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "0.88rem",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px 13px 10px 38px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "0.88rem",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "80px",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #6c63ff, #8b5cf6)",
    border: "none",
    color: "#fff",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "opacity 0.18s, transform 0.15s",
    boxShadow: "0 6px 20px rgba(108,99,255,0.35)",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.3px",
    marginTop: "0.5rem",
  },
  divider: {
    textAlign: "center",
    margin: "1.25rem 0 1rem",
    color: "rgba(255,255,255,0.25)",
    fontSize: "0.78rem",
    position: "relative",
  },
  loginLink: {
    display: "block",
    textAlign: "center",
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.45)",
  },
  loginLinkA: {
    color: "rgba(200,195,255,0.9)",
    fontWeight: 600,
    textDecoration: "none",
    marginLeft: "4px",
  },
  successBanner: {
    background: "rgba(72,228,128,0.1)",
    border: "1px solid rgba(72,228,128,0.25)",
    borderRadius: "12px",
    padding: "10px 14px",
    color: "rgba(130,230,160,0.9)",
    fontSize: "0.84rem",
    fontWeight: 600,
    textAlign: "center",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  errorBanner: {
    background: "rgba(255,80,80,0.08)",
    border: "1px solid rgba(255,80,80,0.2)",
    borderRadius: "12px",
    padding: "10px 14px",
    color: "rgba(255,140,140,0.9)",
    fontSize: "0.84rem",
    fontWeight: 600,
    textAlign: "center",
    marginBottom: "1rem",
  },
};

const focusStyle = (e) => {
  e.currentTarget.style.borderColor = "rgba(108,99,255,0.55)";
  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
};
const blurStyle = (e) => {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
};

const Field = ({ label, icon, children }) => (
  <div style={S.formGroup}>
    <label style={S.label}>{label}</label>
    <div style={S.inputWrap}>
      <span style={S.inputIcon}>{icon}</span>
      {children}
    </div>
  </div>
);

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const { data } = await axios.post(`${API_URL}/api/v1/auth/register`, {
        name,
        email,
        password,
        phone,
        address,
      });
      if (data?.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setAddress("");
      } else {
        setError(data?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayOut>
      <div style={S.page}>
        <style>{`
          input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.22); }
          input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #1a1a2e inset !important; -webkit-text-fill-color: #fff !important; }
        `}</style>

        <div style={S.card}>
          <div style={S.iconRing}>✨</div>
          <h1 style={S.title}>Create Account</h1>
          <p style={S.subtitle}>Join us — it only takes a minute</p>

          {success && (
            <div style={S.successBanner}>
              ✓ Account created successfully!{" "}
              <Link
                to="/login"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                Log in
              </Link>
            </div>
          )}
          {error && <div style={S.errorBanner}>⚠ {error}</div>}

          <form onSubmit={handleRegister}>
            <Field label="Full Name" icon="👤">
              <input
                style={S.input}
                type="text"
                placeholder="Arjun Rao"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>

            <Field label="Email Address" icon="✉️">
              <input
                style={S.input}
                type="email"
                placeholder="arjun@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>

            <Field label="Password" icon="🔒">
              <input
                style={{ ...S.input, paddingRight: "40px" }}
                type={showPass ? "text" : "password"}
                placeholder="Min. 8 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.85rem",
                  padding: 0,
                }}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </Field>

            <Field label="Phone Number" icon="📱">
              <input
                style={S.input}
                type="text"
                placeholder="+91 98765 43210"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>

            <Field label="Address" icon="📍">
              <textarea
                style={S.textarea}
                placeholder="Your full address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>

            <button
              type="submit"
              style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.opacity = "0.88";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.opacity = "1";
              }}
            >
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <div style={S.divider}>─── or ───</div>
          <span style={S.loginLink}>
            Already have an account?
            <Link to="/login" style={S.loginLinkA}>
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </LayOut>
  );
};

export default RegisterPage;
