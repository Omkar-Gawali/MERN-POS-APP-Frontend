import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import LayOut from "../components/LayOut/LayOut";
import axios from "axios";
import logo from "../images/logo.png";

const API_URL = process.env.REACT_APP_API_URL;

/* ── Font inject ── */
if (
  typeof document !== "undefined" &&
  !document.getElementById("admin-bills-font")
) {
  const link = document.createElement("link");
  link.id = "admin-bills-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap";
  document.head.appendChild(link);
}

/* ══════════════════════════════════════
   STYLES
══════════════════════════════════════ */
const S = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(160deg, #0a0a14 0%, #12102a 50%, #0d1a2e 100%)",
    fontFamily: "'DM Sans', sans-serif",
    paddingBottom: "4rem",
  },
  inner: { maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 1.5rem" },

  /* ── Page title ── */
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "2rem",
  },
  pageTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.9rem",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.8px",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  adminBadge: {
    padding: "4px 13px",
    borderRadius: "20px",
    background: "rgba(255,220,80,0.15)",
    border: "1px solid rgba(255,215,80,0.3)",
    color: "#ffd750",
    fontSize: "0.78rem",
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
  },
  countPill: {
    padding: "4px 13px",
    borderRadius: "20px",
    background: "rgba(108,99,255,0.15)",
    border: "1px solid rgba(108,99,255,0.3)",
    color: "rgba(200,195,255,0.9)",
    fontSize: "0.78rem",
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
  },

  /* ── Stats strip ── */
  statsStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  statCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "1.1rem 1.3rem",
  },
  statLabel: {
    fontSize: "0.7rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "6px",
  },
  statValue: {
    fontSize: "1.35rem",
    fontWeight: 700,
    color: "#fff",
    fontFamily: "'Syne', sans-serif",
    letterSpacing: "-0.5px",
  },
  statSub: {
    fontSize: "0.72rem",
    color: "rgba(255,255,255,0.3)",
    marginTop: "2px",
  },

  /* ── Search ── */
  searchWrap: { position: "relative", width: "240px" },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "0.9rem",
    pointerEvents: "none",
    opacity: 0.38,
  },
  searchInput: {
    width: "100%",
    padding: "9px 14px 9px 36px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "0.84rem",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
  },

  /* ── Table card ── */
  tableCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    overflow: "hidden",
  },
  tableHead: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr 1fr 0.85fr 0.75fr 0.85fr 0.85fr 56px",
    gap: "8px",
    padding: "12px 20px",
    background: "rgba(255,255,255,0.04)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    fontSize: "0.68rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  tableRow: (h) => ({
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr 1fr 0.85fr 0.75fr 0.85fr 0.85fr 56px",
    gap: "8px",
    padding: "14px 20px",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    background: h ? "rgba(255,255,255,0.025)" : "transparent",
    transition: "background 0.15s",
  }),
  orderId: {
    fontSize: "0.71rem",
    color: "rgba(200,195,255,0.6)",
    fontFamily: "monospace",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  cellText: {
    fontSize: "0.84rem",
    color: "rgba(255,255,255,0.78)",
    fontWeight: 500,
  },
  cellMuted: { fontSize: "0.82rem", color: "rgba(255,255,255,0.42)" },
  cellAmount: {
    fontSize: "0.87rem",
    fontWeight: 600,
    color: "rgba(200,195,255,0.85)",
  },
  cellTotal: { fontSize: "0.9rem", fontWeight: 700, color: "#a89dff" },
  datePill: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "20px",
    background: "rgba(72,202,228,0.1)",
    border: "1px solid rgba(72,202,228,0.2)",
    color: "rgba(130,220,240,0.8)",
    fontSize: "0.7rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  viewBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "9px",
    border: "1px solid rgba(108,99,255,0.3)",
    background: "rgba(108,99,255,0.1)",
    color: "rgba(200,195,255,0.8)",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.15s",
    margin: "0 auto",
  },

  /* ── Empty ── */
  empty: { textAlign: "center", padding: "6rem 2rem" },
  emptyIcon: {
    fontSize: "3rem",
    display: "block",
    opacity: 0.35,
    marginBottom: "1rem",
  },
  emptyTitle: {
    color: "rgba(255,255,255,0.38)",
    fontSize: "1.05rem",
    fontWeight: 500,
  },

  /* ── Modal ── */
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9000,
    padding: "1rem",
  },
  modalWrap: {
    background: "#0f0f1e",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "22px",
    width: "100%",
    maxWidth: "660px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.4rem 1.6rem 1rem",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    position: "sticky",
    top: 0,
    background: "#0f0f1e",
    zIndex: 1,
    borderRadius: "22px 22px 0 0",
  },
  modalTitleWrap: { display: "flex", flexDirection: "column", gap: "2px" },
  modalTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.3px",
    margin: 0,
  },
  modalSub: {
    fontSize: "0.72rem",
    color: "rgba(255,255,255,0.35)",
    fontFamily: "monospace",
  },
  closeBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.55)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
    transition: "all 0.15s",
    flexShrink: 0,
  },
  modalBody: { padding: "1.4rem 1.6rem" },

  /* ── Invoice (printable, white) ── */
  invoice: {
    background: "#fff",
    borderRadius: "14px",
    padding: "1.5rem",
    color: "#1a1a2e",
    fontFamily: "'DM Sans', sans-serif",
  },
  invoiceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.25rem",
    paddingBottom: "1rem",
    borderBottom: "2px solid #e8e8f0",
  },
  invoiceLogo: { height: "44px", objectFit: "contain" },
  invoiceTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#1a1a2e",
    letterSpacing: "-0.5px",
  },
  invoiceMeta: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginBottom: "1.25rem",
    padding: "1rem",
    background: "#f7f7fb",
    borderRadius: "10px",
  },
  metaLabel: {
    fontSize: "0.68rem",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "2px",
    fontWeight: 600,
  },
  metaValue: { fontSize: "0.88rem", color: "#1a1a2e", fontWeight: 500 },
  invoiceTableHead: {
    display: "grid",
    gridTemplateColumns: "32px 1fr 60px 80px 80px",
    gap: "8px",
    padding: "8px 10px",
    background: "#1a1a2e",
    borderRadius: "8px 8px 0 0",
    fontSize: "0.68rem",
    fontWeight: 700,
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  invoiceTableRow: (i) => ({
    display: "grid",
    gridTemplateColumns: "32px 1fr 60px 80px 80px",
    gap: "8px",
    padding: "9px 10px",
    background: i % 2 === 0 ? "#f7f7fb" : "#fff",
    fontSize: "0.84rem",
    color: "#333",
    borderBottom: "1px solid #eee",
    alignItems: "center",
  }),
  invoiceTotals: {
    marginTop: "1rem",
    padding: "1rem",
    background: "#f7f7fb",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85rem",
    color: "#555",
    padding: "4px 0",
  },
  totalRowFinal: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1rem",
    fontWeight: 700,
    color: "#1a1a2e",
    padding: "8px 0 0",
    marginTop: "4px",
    borderTop: "2px solid #ddd",
  },
  invoiceFooter: {
    marginTop: "1.2rem",
    padding: "0.9rem 1rem",
    background: "#f0f0f8",
    borderRadius: "8px",
    fontSize: "0.78rem",
    color: "#666",
    lineHeight: 1.55,
  },
  printBtn: {
    width: "100%",
    marginTop: "1rem",
    padding: "12px",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #6c63ff, #48cae4)",
    border: "none",
    color: "#fff",
    fontSize: "0.92rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "opacity 0.18s",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
};

/* ══════════════════════ BILL ROW ══════════════════════ */
const BillRow = ({ bill, onView }) => {
  const [hovered, setHovered] = useState(false);
  const subtotal = (Number(bill.totalAmount) - Number(bill.tax)).toFixed(2);

  return (
    <div
      style={S.tableRow(hovered)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={S.orderId} title={bill._id}>
        {bill._id}
      </span>
      <span style={S.cellText}>{bill.customerName}</span>
      <span style={S.cellMuted}>{bill.customerNumber}</span>
      <span style={S.cellAmount}>
        ₹{Number(subtotal).toLocaleString("en-IN")}
      </span>
      <span style={S.cellMuted}>₹{Number(bill.tax).toFixed(2)}</span>
      <span style={S.cellTotal}>₹{Number(bill.totalAmount).toFixed(2)}</span>
      <span style={S.datePill}>
        {new Date(bill.date).toLocaleDateString("en-IN")}
      </span>
      <button
        style={S.viewBtn}
        onClick={() => onView(bill)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(108,99,255,0.25)";
          e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(108,99,255,0.1)";
          e.currentTarget.style.borderColor = "rgba(108,99,255,0.3)";
          e.currentTarget.style.color = "rgba(200,195,255,0.8)";
        }}
        title="View Invoice"
      >
        👁
      </button>
    </div>
  );
};

/* ══════════════════════ MAIN ══════════════════════ */
const AdminBillsPage = () => {
  const componentRef = useRef();

  const [bills, setBills] = useState([]);
  const [query, setQuery] = useState("");

  /* Modal state */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [tax, setTax] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [date, setDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  /* Fetch all bills */
  useEffect(() => {
    const getAllBills = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/auth/get-all-bills`,
        );
        if (data?.success) setBills(data.bills);
      } catch (e) {
        console.log(e);
      }
    };
    getAllBills();
  }, []);

  /* Fetch user data when userId changes */
  useEffect(() => {
    if (!userId) return;
    const getUserData = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/auth/get-user/${userId}`,
        );
        if (data?.success) setUserData(data.user);
      } catch (e) {
        console.log(e);
      }
    };
    getUserData();
  }, [userId]);

  /* Fetch single bill when orderId changes */
  useEffect(() => {
    if (!orderId) return;
    const getSingleBill = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/bills/get-single-bill/${orderId}`,
        );
        if (data?.success) {
          const b = data.bill;
          setCartItems(b.cartItems);
          setTax(b.tax);
          setTotalAmount(b.totalAmount);
          setCustomerName(b.customerName);
          setCustomerNumber(b.customerNumber);
          setDate(new Date(b.date).toLocaleDateString("en-IN"));
          setPaymentMode(b.paymentMode || "");
        }
      } catch (e) {
        console.log(e);
      }
    };
    getSingleBill();
  }, [orderId]);

  const handleView = (bill) => {
    setOrderId(bill._id);
    setUserId(bill.userId);
    setIsModalOpen(true);
  };

  const handlePrint = useReactToPrint({ content: () => componentRef.current });

  /* Stats */
  const totalRevenue = bills.reduce((acc, b) => acc + Number(b.totalAmount), 0);
  const totalTax = bills.reduce((acc, b) => acc + Number(b.tax), 0);

  /* Filtered */
  const filtered = bills.filter(
    (b) =>
      b.customerName?.toLowerCase().includes(query.toLowerCase()) ||
      b._id?.toLowerCase().includes(query.toLowerCase()) ||
      b.customerNumber?.includes(query),
  );

  const subtotal = (Number(totalAmount) - Number(tax)).toFixed(2);

  return (
    <LayOut>
      <div style={S.page}>
        <div style={S.inner}>
          {/* ── Title row ── */}
          <div style={S.titleRow}>
            <h1 style={S.pageTitle}>
              All Bills
              <span style={S.adminBadge}>⭐ Admin</span>
              {bills.length > 0 && (
                <span style={S.countPill}>{filtered.length} bills</span>
              )}
            </h1>
            {/* Search */}
            <div style={S.searchWrap}>
              <span style={S.searchIcon}>🔍</span>
              <input
                style={S.searchInput}
                type="text"
                placeholder="Search by name or ID…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
              />
            </div>
          </div>

          {/* ── Stats strip ── */}
          {bills.length > 0 && (
            <div style={S.statsStrip}>
              <div style={S.statCard}>
                <div style={S.statLabel}>Total Bills</div>
                <div style={S.statValue}>{bills.length}</div>
                <div style={S.statSub}>All time</div>
              </div>
              <div
                style={{
                  ...S.statCard,
                  background: "rgba(108,99,255,0.08)",
                  border: "1px solid rgba(108,99,255,0.2)",
                }}
              >
                <div style={S.statLabel}>Total Revenue</div>
                <div style={{ ...S.statValue, color: "#a89dff" }}>
                  ₹
                  {totalRevenue.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div style={S.statSub}>incl. tax</div>
              </div>
              <div
                style={{
                  ...S.statCard,
                  background: "rgba(72,202,228,0.07)",
                  border: "1px solid rgba(72,202,228,0.18)",
                }}
              >
                <div style={S.statLabel}>Total Tax Collected</div>
                <div style={{ ...S.statValue, color: "rgba(130,220,240,0.9)" }}>
                  ₹
                  {totalTax.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div style={S.statSub}>10% GST</div>
              </div>
            </div>
          )}

          {/* ── Table ── */}
          {bills.length === 0 ? (
            <div style={{ ...S.tableCard, ...S.empty }}>
              <span style={S.emptyIcon}>🧾</span>
              <p style={S.emptyTitle}>No bills found</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ ...S.tableCard, ...S.empty }}>
              <span style={S.emptyIcon}>🔍</span>
              <p style={S.emptyTitle}>No results for "{query}"</p>
            </div>
          ) : (
            <div style={S.tableCard}>
              <div style={S.tableHead}>
                <span>Order ID</span>
                <span>Customer</span>
                <span>Contact</span>
                <span>Subtotal</span>
                <span>Tax</span>
                <span>Grand Total</span>
                <span>Date</span>
                <span style={{ textAlign: "center" }}>View</span>
              </div>
              {filtered.map((b) => (
                <BillRow key={b._id} bill={b} onView={handleView} />
              ))}
            </div>
          )}
        </div>

        {/* ── Invoice Modal ── */}
        {isModalOpen && (
          <div
            style={S.overlay}
            onClick={(e) =>
              e.target === e.currentTarget && setIsModalOpen(false)
            }
          >
            <div style={S.modalWrap}>
              {/* Header */}
              <div style={S.modalHeader}>
                <div style={S.modalTitleWrap}>
                  <h2 style={S.modalTitle}>Invoice</h2>
                  <span style={S.modalSub}>#{orderId}</span>
                </div>
                <button
                  style={S.closeBtn}
                  onClick={() => setIsModalOpen(false)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.12)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.06)")
                  }
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div style={S.modalBody}>
                {/* Printable invoice */}
                <div ref={componentRef} style={S.invoice}>
                  {/* Invoice header */}
                  <div style={S.invoiceHeader}>
                    <img src={logo} alt="Logo" style={S.invoiceLogo} />
                    <div>
                      <div style={S.invoiceTitle}>INVOICE</div>
                      {paymentMode && (
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#888",
                            marginTop: "2px",
                          }}
                        >
                          Payment: {paymentMode}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Billed to / Invoice details */}
                  <div style={S.invoiceMeta}>
                    <div>
                      <div style={S.metaLabel}>Billed To</div>
                      <div
                        style={{
                          ...S.metaValue,
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        {customerName}
                      </div>
                      <div
                        style={{
                          ...S.metaValue,
                          color: "#555",
                          marginTop: "4px",
                        }}
                      >
                        📞 {customerNumber}
                      </div>
                      {userData?.address && (
                        <div style={{ ...S.metaValue, color: "#555" }}>
                          📍 {userData.address}
                        </div>
                      )}
                      {userData?.email && (
                        <div style={{ ...S.metaValue, color: "#555" }}>
                          ✉️ {userData.email}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={S.metaLabel}>Invoice Number</div>
                      <div
                        style={{
                          ...S.metaValue,
                          fontFamily: "monospace",
                          fontSize: "0.72rem",
                          wordBreak: "break-all",
                        }}
                      >
                        {orderId}
                      </div>
                      <div style={{ ...S.metaLabel, marginTop: "10px" }}>
                        Date
                      </div>
                      <div style={S.metaValue}>{date}</div>
                    </div>
                  </div>

                  {/* Items */}
                  <div style={S.invoiceTableHead}>
                    <span>#</span>
                    <span>Product</span>
                    <span style={{ textAlign: "center" }}>Qty</span>
                    <span style={{ textAlign: "right" }}>Unit Price</span>
                    <span style={{ textAlign: "right" }}>Total</span>
                  </div>
                  {cartItems.map((c, i) => (
                    <div key={i} style={S.invoiceTableRow(i)}>
                      <span
                        style={{
                          color: "#999",
                          fontWeight: 600,
                          fontSize: "0.78rem",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span style={{ fontWeight: 500 }}>{c.cartItem.name}</span>
                      <span style={{ textAlign: "center", color: "#555" }}>
                        {c.quantity}
                      </span>
                      <span style={{ textAlign: "right", color: "#555" }}>
                        ₹{c.cartItem.price.toLocaleString("en-IN")}
                      </span>
                      <span
                        style={{
                          textAlign: "right",
                          fontWeight: 600,
                          color: "#1a1a2e",
                        }}
                      >
                        ₹
                        {(c.cartItem.price * c.quantity).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>
                  ))}

                  {/* Totals */}
                  <div style={S.invoiceTotals}>
                    <div style={S.totalRow}>
                      <span>Subtotal</span>
                      <span>₹{Number(subtotal).toLocaleString("en-IN")}</span>
                    </div>
                    <div style={S.totalRow}>
                      <span>GST (10%)</span>
                      <span>₹{Number(tax).toFixed(2)}</span>
                    </div>
                    <div style={S.totalRowFinal}>
                      <span>Grand Total</span>
                      <span>₹{Number(totalAmount).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Footer note */}
                  <div style={S.invoiceFooter}>
                    <strong>Thank you for your order!</strong> 10% GST is
                    applied on your total bill amount. Please note that the
                    amount is non-refundable. For any assistance please reach
                    out to us at <strong>help@omkart.com</strong>
                  </div>
                </div>

                {/* Print button */}
                <button
                  style={S.printBtn}
                  onClick={handlePrint}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.87")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  🖨️ Print Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayOut>
  );
};

export default AdminBillsPage;
