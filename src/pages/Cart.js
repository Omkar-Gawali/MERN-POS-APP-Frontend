import React, { useEffect, useState } from "react";
import LayOut from "../components/LayOut/LayOut";
import { useCart } from "../context/cartContext";
import axios from "axios";
import { useAuth } from "../context/authContext";

const API_URL = process.env.REACT_APP_API_URL;

/* ── Font inject ── */
if (typeof document !== "undefined" && !document.getElementById("cart-font")) {
  const link = document.createElement("link");
  link.id = "cart-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap";
  document.head.appendChild(link);
}

/* ── Styles ── */
const S = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(160deg, #0a0a14 0%, #12102a 50%, #0d1a2e 100%)",
    fontFamily: "'DM Sans', sans-serif",
    paddingBottom: "4rem",
  },

  inner: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "2.5rem 1.5rem",
  },

  /* ── Page title ── */
  pageTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.9rem",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.8px",
    margin: "0 0 2rem",
    display: "flex",
    alignItems: "center",
    gap: "12px",
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

  /* ── Layout: table + sidebar ── */
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: "1.5rem",
    alignItems: "start",
  },

  /* ── Cart table card ── */
  tableCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    overflow: "hidden",
  },
  tableHead: {
    display: "grid",
    gridTemplateColumns: "40px 1fr 72px 100px 80px 80px",
    gap: "8px",
    padding: "12px 20px",
    background: "rgba(255,255,255,0.04)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    fontSize: "0.72rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  tableRow: (hovered) => ({
    display: "grid",
    gridTemplateColumns: "40px 1fr 72px 100px 80px 80px",
    gap: "8px",
    padding: "14px 20px",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    background: hovered ? "rgba(255,255,255,0.03)" : "transparent",
    transition: "background 0.15s",
  }),
  srNo: {
    fontSize: "0.78rem",
    color: "rgba(255,255,255,0.3)",
    fontWeight: 600,
  },
  productInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },
  imgBox: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.95)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    padding: "4px",
  },
  img: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    display: "block",
    margin: "0 auto",
  },
  productName: {
    fontSize: "0.88rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.88)",
    lineHeight: 1.35,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  productSub: {
    fontSize: "0.72rem",
    color: "rgba(255,255,255,0.35)",
    marginTop: "2px",
  },

  /* ── Qty controls ── */
  qtyWrap: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  qtyBtn: (disabled) => ({
    width: "26px",
    height: "26px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: disabled ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.07)",
    color: disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.75)",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "1rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
    lineHeight: 1,
    padding: 0,
    flexShrink: 0,
  }),
  qtyValue: {
    fontSize: "0.88rem",
    fontWeight: 700,
    color: "#fff",
    minWidth: "20px",
    textAlign: "center",
  },

  /* row price */
  rowPrice: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "rgba(200,195,255,0.85)",
  },

  /* remove btn */
  removeBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "9px",
    border: "1px solid rgba(255,80,80,0.2)",
    background: "rgba(255,80,80,0.07)",
    color: "rgba(255,120,120,0.7)",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.15s",
    margin: "0 auto",
  },

  /* ── Order summary sidebar ── */
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    position: "sticky",
    top: "80px",
  },
  summaryCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "1.4rem",
  },
  summaryTitle: {
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    marginBottom: "1rem",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: "0.86rem",
    color: "rgba(255,255,255,0.55)",
  },
  summaryRowTotal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0 0",
    fontSize: "1rem",
    fontWeight: 700,
    color: "#fff",
  },
  summaryVal: {
    color: "rgba(200,195,255,0.85)",
    fontWeight: 600,
  },

  /* ── Invoice button ── */
  invoiceBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #6c63ff, #8b5cf6)",
    border: "none",
    color: "#fff",
    fontSize: "0.92rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "opacity 0.18s",
    boxShadow: "0 6px 20px rgba(108,99,255,0.35)",
    letterSpacing: "0.3px",
  },

  /* ── Modal overlay ── */
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9000,
    padding: "1rem",
  },
  modal: {
    background: "#141426",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "22px",
    width: "100%",
    maxWidth: "440px",
    padding: "2rem",
    boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  modalTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.4px",
    margin: 0,
  },
  closeBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.6)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    transition: "all 0.15s",
  },
  formGroup: { marginBottom: "0.85rem" },
  label: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "6px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px 13px",
    borderRadius: "11px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "0.88rem",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "10px 13px",
    borderRadius: "11px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "0.88rem",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  billSummary: {
    background: "rgba(108,99,255,0.08)",
    border: "1px solid rgba(108,99,255,0.2)",
    borderRadius: "13px",
    padding: "1rem",
    margin: "1rem 0",
  },
  billRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.84rem",
    color: "rgba(255,255,255,0.55)",
    padding: "4px 0",
  },
  billRowTotal: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.96rem",
    fontWeight: 700,
    color: "#fff",
    padding: "8px 0 0",
    marginTop: "4px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
  generateBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #6c63ff, #48cae4)",
    border: "none",
    color: "#fff",
    fontSize: "0.92rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "opacity 0.18s",
    boxShadow: "0 6px 20px rgba(108,99,255,0.3)",
    marginTop: "0.5rem",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.3px",
  },

  /* ── Empty state ── */
  empty: {
    textAlign: "center",
    padding: "6rem 2rem",
  },
  emptyIcon: {
    fontSize: "3rem",
    display: "block",
    opacity: 0.4,
    marginBottom: "1rem",
  },
  emptyTitle: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "1.1rem",
    fontWeight: 500,
    margin: 0,
  },
  emptyBtn: {
    marginTop: "1.5rem",
    padding: "10px 24px",
    borderRadius: "12px",
    background: "rgba(108,99,255,0.15)",
    border: "1px solid rgba(108,99,255,0.3)",
    color: "rgba(200,195,255,0.9)",
    fontSize: "0.88rem",
    fontWeight: 600,
    cursor: "pointer",
  },

  /* ── Toast ── */
  toast: (visible) => ({
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    background: "rgba(16,16,28,0.96)",
    border: "1px solid rgba(72,228,128,0.3)",
    borderRadius: "14px",
    padding: "12px 20px",
    color: "rgba(130,230,160,0.95)",
    fontSize: "0.88rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    pointerEvents: "none",
    zIndex: 9999,
  }),
};

/* ── Row component ── */
const CartRow = ({ item, index, onIncrement, onDecrement, onRemove }) => {
  const [hovered, setHovered] = useState(false);
  const [removeBtnHovered, setRemoveBtnHovered] = useState(false);

  return (
    <div
      style={S.tableRow(hovered)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Sr */}
      <span style={S.srNo}>{index + 1}</span>

      {/* Product info */}
      <div style={S.productInfo}>
        <div style={S.imgBox}>
          <img
            src={`${API_URL}/api/v1/product/get-product-photo/${item.cartItem._id}`}
            alt={item.cartItem.name}
            style={S.img}
            onError={(e) => (e.currentTarget.style.opacity = "0.2")}
          />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={S.productName}>{item.cartItem.name}</div>
          <div style={S.productSub}>₹{item.cartItem.price} each</div>
        </div>
      </div>

      {/* Image col (hidden — combined with name) */}
      <div />

      {/* Qty */}
      <div style={S.qtyWrap}>
        <button
          style={S.qtyBtn(false)}
          onClick={() => onIncrement(item)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
          }
        >
          +
        </button>
        <span style={S.qtyValue}>{item.quantity}</span>
        <button
          style={S.qtyBtn(item.quantity === 1)}
          onClick={() => onDecrement(item)}
          disabled={item.quantity === 1}
          onMouseEnter={(e) => {
            if (item.quantity > 1)
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          }}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
          }
        >
          −
        </button>
      </div>

      {/* Price */}
      <span style={S.rowPrice}>
        ₹{(item.cartItem.price * item.quantity).toLocaleString("en-IN")}
      </span>

      {/* Remove */}
      <button
        style={{
          ...S.removeBtn,
          ...(removeBtnHovered
            ? {
                background: "rgba(255,80,80,0.18)",
                borderColor: "rgba(255,80,80,0.4)",
                color: "rgba(255,120,120,0.95)",
              }
            : {}),
        }}
        onClick={() => onRemove(item._id)}
        onMouseEnter={() => setRemoveBtnHovered(true)}
        onMouseLeave={() => setRemoveBtnHovered(false)}
        title="Remove"
      >
        ✕
      </button>
    </div>
  );
};

/* ── Main ── */
const Cart = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ visible: false, msg: "" });

  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const tax = parseFloat(((total / 100) * 10).toFixed(2));
  const grandTotal = Number(total) + tax;

  /* Prefill from auth */
  useEffect(() => {
    setCustomerName(auth?.user?.name || "");
    setCustomerNumber(auth?.user?.phone || "");
  }, [auth]);

  /* Recalculate total */
  useEffect(() => {
    const t = cart.reduce((acc, p) => acc + p.cartItem.price * p.quantity, 0);
    setTotal(t);
  }, [cart]);

  const showToast = (msg) => {
    setToast({ visible: true, msg });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
  };

  /* Increment */
  const handleIncrement = (item) => {
    const updated = cart.map((c) =>
      c.cartItem._id === item.cartItem._id
        ? { ...c, quantity: c.quantity + 1 }
        : c,
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  /* Decrement */
  const handleDecrement = (item) => {
    if (item.quantity === 1) return;
    const updated = cart.map((c) =>
      c.cartItem._id === item.cartItem._id
        ? { ...c, quantity: c.quantity - 1 }
        : c,
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  /* Remove */
  const handleRemove = (pid) => {
    const updated = cart.filter((item) => item.cartItem._id !== pid);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    showToast("Item removed");
  };

  /* Generate bill */
  const handleGenerateBill = async () => {
    if (!customerName || !customerNumber || !paymentMode) {
      showToast("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/api/v1/bills/generate-bill`,
        {
          userId: auth?.user?._id,
          cartItems: cart,
          customerName,
          customerNumber,
          paymentMode,
          totalAmount: grandTotal,
          tax,
        },
      );
      if (data?.success) {
        setShowModal(false);
        setCart([]);
        localStorage.removeItem("cart");
        showToast("✓ Bill generated successfully!");
      }
    } catch (error) {
      console.log(error);
      showToast("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Empty cart ── */
  if (cart.length === 0) {
    return (
      <LayOut>
        <div style={S.page}>
          <div style={S.inner}>
            <h1 style={S.pageTitle}>Cart</h1>
            <div style={{ ...S.tableCard, ...S.empty }}>
              <span style={S.emptyIcon}>🛒</span>
              <p style={S.emptyTitle}>Your cart is empty</p>
              <button
                style={S.emptyBtn}
                onClick={() => (window.location.href = "/products")}
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <div style={S.page}>
        <style>{`
          @media (max-width: 860px) {
            .cart-layout { grid-template-columns: 1fr !important; }
            .cart-sidebar { position: static !important; }
          }
          .cart-table-row:last-child { border-bottom: none !important; }
          input::placeholder { color: rgba(255,255,255,0.25); }
          select option { background: #141426; color: #fff; }
        `}</style>

        <div style={S.inner}>
          <h1 style={S.pageTitle}>
            Cart
            <span style={S.countPill}>
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </span>
          </h1>

          <div style={S.layout} className="cart-layout">
            {/* ── Table ── */}
            <div style={S.tableCard}>
              {/* Head */}
              <div style={S.tableHead}>
                <span>#</span>
                <span style={{ gridColumn: "span 2" }}>Product</span>
                <span style={{ textAlign: "center" }}>Qty</span>
                <span style={{ textAlign: "right" }}>Price</span>
                <span style={{ textAlign: "center" }}>Remove</span>
              </div>

              {/* Rows */}
              {cart.map((item, i) => (
                <CartRow
                  key={item.cartItem._id}
                  item={item}
                  index={i}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* ── Sidebar ── */}
            <div style={S.sidebar} className="cart-sidebar">
              {/* Summary card */}
              <div style={S.summaryCard}>
                <div style={S.summaryTitle}>Order Summary</div>
                <div style={S.summaryRow}>
                  <span>Subtotal</span>
                  <span style={S.summaryVal}>
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
                <div style={S.summaryRow}>
                  <span>Tax (10%)</span>
                  <span style={S.summaryVal}>
                    ₹{tax.toLocaleString("en-IN")}
                  </span>
                </div>
                <div style={S.summaryRowTotal}>
                  <span>Grand Total</span>
                  <span style={{ color: "rgba(200,195,255,0.95)" }}>
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Invoice button */}
              <button
                style={S.invoiceBtn}
                onClick={() => setShowModal(true)}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                🧾 Generate Invoice
              </button>
            </div>
          </div>
        </div>

        {/* ── Modal ── */}
        {showModal && (
          <div
            style={S.overlay}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <div style={S.modal}>
              <div style={S.modalHeader}>
                <h2 style={S.modalTitle}>Generate Bill</h2>
                <button
                  style={S.closeBtn}
                  onClick={() => setShowModal(false)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.12)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.07)")
                  }
                >
                  ✕
                </button>
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Customer Name</label>
                <input
                  style={S.input}
                  type="text"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.1)")
                  }
                />
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Contact Number</label>
                <input
                  style={S.input}
                  type="text"
                  placeholder="Enter contact number"
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.1)")
                  }
                />
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Payment Method</label>
                <select
                  style={S.select}
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.1)")
                  }
                >
                  <option value="" disabled>
                    Select payment method
                  </option>
                  <option value="UPI">UPI</option>
                  <option value="Cash On Delivery">Cash On Delivery</option>
                </select>
              </div>

              {/* Bill breakdown */}
              <div style={S.billSummary}>
                <div style={S.billRow}>
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div style={S.billRow}>
                  <span>Tax (10%)</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>
                <div style={S.billRowTotal}>
                  <span>Grand Total</span>
                  <span style={{ color: "rgba(200,195,255,0.95)" }}>
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                style={{
                  ...S.generateBtn,
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
                onClick={handleGenerateBill}
                disabled={submitting}
                onMouseEnter={(e) => {
                  if (!submitting) e.currentTarget.style.opacity = "0.88";
                }}
                onMouseLeave={(e) => {
                  if (!submitting) e.currentTarget.style.opacity = "1";
                }}
              >
                {submitting ? "Generating…" : "✓ Confirm & Generate Bill"}
              </button>
            </div>
          </div>
        )}

        {/* ── Toast ── */}
        <div style={S.toast(toast.visible)}>{toast.msg}</div>
      </div>
    </LayOut>
  );
};

export default Cart;
