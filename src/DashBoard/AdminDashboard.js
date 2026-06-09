import React, { useEffect, useState } from "react";
import LayOut from "../components/LayOut/LayOut";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

/* ── Font inject ── */
if (typeof document !== "undefined" && !document.getElementById("admin-font")) {
  const link = document.createElement("link");
  link.id = "admin-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap";
  document.head.appendChild(link);
}

const CATEGORIES = [
  "Beverages",
  "Health & Personal Care",
  "Books & Stationery",
  "Fashion & Clothing",
  "Sports & Fitness",
  "Electronics & Accessories",
  "Home & Kitchen Appliances",
  "Beauty & Cosmetics",
  "Toys, Kids & Baby Products",
  "Groceries & Essentials",
];

/* ══════════════════════ STYLES ══════════════════════ */
const S = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(160deg, #0a0a14 0%, #12102a 50%, #0d1a2e 100%)",
    fontFamily: "'DM Sans', sans-serif",
    paddingBottom: "4rem",
  },
  inner: { maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 1.5rem" },

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
  adminBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    background: "rgba(255,220,80,0.15)",
    border: "1px solid rgba(255,215,80,0.3)",
    color: "#ffd750",
    fontSize: "0.75rem",
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "360px 1fr",
    gap: "1.5rem",
    alignItems: "start",
  },

  /* ── Cards ── */
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "1.1rem 1.4rem",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1rem",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.3px",
    margin: 0,
  },
  cardBody: { padding: "1.4rem" },

  /* ── Form elements ── */
  formGroup: { marginBottom: "0.85rem" },
  label: {
    display: "block",
    fontSize: "0.7rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    letterSpacing: "0.9px",
    marginBottom: "6px",
  },
  inputWrap: { position: "relative" },
  inputIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "0.9rem",
    pointerEvents: "none",
    opacity: 0.35,
  },
  input: {
    width: "100%",
    padding: "10px 12px 10px 36px",
    borderRadius: "11px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "0.86rem",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "10px 12px 10px 36px",
    borderRadius: "11px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "0.86rem",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },

  /* File upload */
  fileZone: {
    border: "1px dashed rgba(108,99,255,0.35)",
    borderRadius: "11px",
    padding: "1.2rem",
    textAlign: "center",
    cursor: "pointer",
    background: "rgba(108,99,255,0.05)",
    transition: "all 0.2s",
    position: "relative",
  },
  fileInput: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    cursor: "pointer",
    width: "100%",
    height: "100%",
  },
  fileLabel: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.4)",
    pointerEvents: "none",
  },
  previewImg: {
    width: "100%",
    maxHeight: "140px",
    objectFit: "contain",
    borderRadius: "9px",
    background: "rgba(255,255,255,0.95)",
    padding: "8px",
    marginTop: "8px",
  },

  /* Buttons */
  btnPrimary: {
    width: "100%",
    padding: "10px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #6c63ff, #8b5cf6)",
    border: "none",
    color: "#fff",
    fontSize: "0.88rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "opacity 0.18s",
    boxShadow: "0 6px 18px rgba(108,99,255,0.3)",
    fontFamily: "'DM Sans', sans-serif",
    marginTop: "0.25rem",
  },
  btnDanger: {
    padding: "6px 12px",
    borderRadius: "9px",
    background: "rgba(255,80,80,0.1)",
    border: "1px solid rgba(255,80,80,0.25)",
    color: "rgba(255,130,130,0.9)",
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "'DM Sans', sans-serif",
  },
  btnEdit: {
    padding: "6px 12px",
    borderRadius: "9px",
    background: "rgba(108,99,255,0.12)",
    border: "1px solid rgba(108,99,255,0.3)",
    color: "rgba(200,195,255,0.9)",
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "'DM Sans', sans-serif",
  },

  /* ── Table ── */
  tableHead: {
    display: "grid",
    gridTemplateColumns: "36px 1fr 70px 80px 130px",
    gap: "8px",
    padding: "10px 16px",
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
    gridTemplateColumns: "36px 1fr 70px 80px 130px",
    gap: "8px",
    padding: "12px 16px",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    background: h ? "rgba(255,255,255,0.025)" : "transparent",
    transition: "background 0.15s",
  }),
  srNo: {
    fontSize: "0.74rem",
    color: "rgba(255,255,255,0.28)",
    fontWeight: 600,
  },
  prodName: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.88)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  imgThumb: {
    width: "44px",
    height: "44px",
    objectFit: "contain",
    borderRadius: "9px",
    background: "rgba(255,255,255,0.95)",
    padding: "4px",
  },
  priceCell: {
    fontSize: "0.88rem",
    fontWeight: 600,
    color: "rgba(200,195,255,0.85)",
  },
  actionCell: { display: "flex", gap: "6px", alignItems: "center" },

  /* ── Empty ── */
  empty: { textAlign: "center", padding: "4rem 2rem" },
  emptyIcon: {
    fontSize: "2.5rem",
    display: "block",
    opacity: 0.3,
    marginBottom: "0.75rem",
  },
  emptyText: {
    color: "rgba(255,255,255,0.35)",
    fontSize: "0.95rem",
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
  modal: {
    background: "#141426",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "22px",
    width: "100%",
    maxWidth: "420px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.2rem 1.5rem 1rem",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    position: "sticky",
    top: 0,
    background: "#141426",
    zIndex: 1,
    borderRadius: "22px 22px 0 0",
  },
  modalTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.3px",
    margin: 0,
  },
  closeBtn: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.5)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.85rem",
  },
  modalBody: { padding: "1.4rem 1.5rem" },

  /* ── Toast ── */
  toast: (v, type) => ({
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    background: "rgba(16,16,28,0.96)",
    border: `1px solid ${type === "error" ? "rgba(255,80,80,0.3)" : "rgba(72,228,128,0.3)"}`,
    borderRadius: "14px",
    padding: "12px 20px",
    color:
      type === "error" ? "rgba(255,140,140,0.95)" : "rgba(130,230,160,0.95)",
    fontSize: "0.88rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    opacity: v ? 1 : 0,
    transform: v ? "translateY(0)" : "translateY(12px)",
    pointerEvents: "none",
    zIndex: 9999,
  }),

  /* ── Confirm dialog ── */
  confirmOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9100,
  },
  confirmBox: {
    background: "#141426",
    border: "1px solid rgba(255,80,80,0.2)",
    borderRadius: "18px",
    padding: "1.75rem",
    maxWidth: "340px",
    width: "100%",
    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
    textAlign: "center",
  },
};

/* ── Helpers ── */
const focusInput = (e) => {
  e.currentTarget.style.borderColor = "rgba(108,99,255,0.55)";
  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
};
const blurInput = (e) => {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
};

/* ── Form field component ── */
const Field = ({ label, icon, children }) => (
  <div style={S.formGroup}>
    <label style={S.label}>{label}</label>
    <div style={S.inputWrap}>
      {icon && <span style={S.inputIcon}>{icon}</span>}
      {children}
    </div>
  </div>
);

/* ── Table Row component ── */
const ProductRow = ({ product, index, onEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={S.tableRow(hovered)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={S.srNo}>{index + 1}</span>
      <span style={S.prodName}>{product.name}</span>
      <img
        src={`${API_URL}/api/v1/product/get-product-photo/${product._id}`}
        alt={product.name}
        style={S.imgThumb}
        onError={(e) => (e.currentTarget.style.opacity = "0.2")}
      />
      <span style={S.priceCell}>₹{product.price.toLocaleString("en-IN")}</span>
      <div style={S.actionCell}>
        <button
          style={S.btnEdit}
          onClick={() => onEdit(product)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(108,99,255,0.22)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(108,99,255,0.12)")
          }
        >
          ✏️ Edit
        </button>
        <button
          style={S.btnDanger}
          onClick={() => onDelete(product._id)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,80,80,0.2)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,80,80,0.1)")
          }
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════ MAIN ══════════════════════ */
const AdminDashboard = () => {
  const [products, setProducts] = useState([]);

  /* Add form */
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  /* Edit modal */
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPhoto, setEditPhoto] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  /* Confirm delete dialog */
  const [confirmId, setConfirmId] = useState(null);

  /* Toast */
  const [toast, setToast] = useState({
    visible: false,
    msg: "",
    type: "success",
  });

  const showToast = (msg, type = "success") => {
    setToast({ visible: true, msg, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2400);
  };

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/product/get-all-products`,
      );
      if (data?.success) setProducts(data.products);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  /* Add */
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("price", price);
      fd.append("category", category);
      if (photo) fd.append("photo", photo);
      const { data } = await axios.post(
        `${API_URL}/api/v1/product/add-product`,
        fd,
      );
      if (data?.success) {
        showToast("✓ Product added successfully!");
        setName("");
        setPrice("");
        setCategory("");
        setPhoto(null);
        getAllProducts();
      }
    } catch (e) {
      showToast("Failed to add product", "error");
    } finally {
      setAddLoading(false);
    }
  };

  /* Open edit */
  const openEdit = async (product) => {
    setEditId(product._id);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditCategory(product.category);
    setEditPhoto(null);
    setEditOpen(true);
  };

  /* Update */
  const handleUpdate = async () => {
    setEditLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", editName);
      fd.append("price", editPrice);
      fd.append("category", editCategory);
      if (editPhoto instanceof File) fd.append("photo", editPhoto);
      const { data } = await axios.put(
        `${API_URL}/api/v1/product/update-product/${editId}`,
        fd,
      );
      if (data?.success) {
        showToast("✓ Product updated!");
        setEditOpen(false);
        getAllProducts();
      }
    } catch (e) {
      showToast("Failed to update product", "error");
    } finally {
      setEditLoading(false);
    }
  };

  /* Delete */
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/api/v1/product/delete-product/${confirmId}`,
      );
      if (data?.success) {
        showToast("✓ Product deleted");
        getAllProducts();
      }
    } catch (e) {
      showToast("Failed to delete product", "error");
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <LayOut>
      <div style={S.page}>
        <style>{`
          input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.22);}
          select option{background:#141426;color:#fff;}
          @media(max-width:860px){.admin-layout{grid-template-columns:1fr!important;}}
        `}</style>

        <div style={S.inner}>
          <h1 style={S.pageTitle}>
            Admin Dashboard
            <span style={S.adminBadge}>⭐ Admin</span>
          </h1>

          <div style={S.layout} className="admin-layout">
            {/* ── Add Product Form ── */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <h2 style={S.cardTitle}>➕ Add New Product</h2>
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.3)",
                    fontWeight: 600,
                  }}
                >
                  {products.length} products
                </span>
              </div>
              <div style={S.cardBody}>
                <form onSubmit={handleAddProduct}>
                  <Field label="Product Name" icon="📦">
                    <input
                      style={S.input}
                      type="text"
                      placeholder="Enter product name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={focusInput}
                      onBlur={blurInput}
                      required
                    />
                  </Field>

                  <Field label="Price (₹)" icon="💰">
                    <input
                      style={S.input}
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      onFocus={focusInput}
                      onBlur={blurInput}
                      required
                      min="0"
                      step="0.01"
                    />
                  </Field>

                  <Field label="Category" icon="🏷️">
                    <select
                      style={S.select}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      onFocus={focusInput}
                      onBlur={blurInput}
                      required
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div style={S.formGroup}>
                    <label style={S.label}>Product Photo</label>
                    <div style={S.fileZone}>
                      <input
                        type="file"
                        accept="image/*"
                        style={S.fileInput}
                        onChange={(e) => setPhoto(e.target.files[0])}
                      />
                      {photo ? (
                        <img
                          src={URL.createObjectURL(photo)}
                          alt="preview"
                          style={S.previewImg}
                        />
                      ) : (
                        <>
                          <div
                            style={{
                              fontSize: "1.5rem",
                              opacity: 0.4,
                              marginBottom: "4px",
                            }}
                          >
                            🖼️
                          </div>
                          <span style={S.fileLabel}>
                            Click or drag to upload image
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{ ...S.btnPrimary, opacity: addLoading ? 0.7 : 1 }}
                    disabled={addLoading}
                    onMouseEnter={(e) => {
                      if (!addLoading) e.currentTarget.style.opacity = "0.87";
                    }}
                    onMouseLeave={(e) => {
                      if (!addLoading) e.currentTarget.style.opacity = "1";
                    }}
                  >
                    {addLoading ? "Adding…" : "Add Product"}
                  </button>
                </form>
              </div>
            </div>

            {/* ── Products Table ── */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <h2 style={S.cardTitle}>📋 All Products</h2>
              </div>

              {products.length === 0 ? (
                <div style={S.empty}>
                  <span style={S.emptyIcon}>📦</span>
                  <p style={S.emptyText}>No products found</p>
                </div>
              ) : (
                <>
                  <div style={S.tableHead}>
                    <span>#</span>
                    <span>Name</span>
                    <span>Image</span>
                    <span>Price</span>
                    <span style={{ textAlign: "center" }}>Actions</span>
                  </div>
                  {products.map((p, i) => (
                    <ProductRow
                      key={p._id}
                      product={p}
                      index={i}
                      onEdit={openEdit}
                      onDelete={(id) => setConfirmId(id)}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Edit Modal ── */}
        {editOpen && (
          <div
            style={S.overlay}
            onClick={(e) => e.target === e.currentTarget && setEditOpen(false)}
          >
            <div style={S.modal}>
              <div style={S.modalHeader}>
                <h2 style={S.modalTitle}>✏️ Edit Product</h2>
                <button
                  style={S.closeBtn}
                  onClick={() => setEditOpen(false)}
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
              <div style={S.modalBody}>
                <Field label="Product Name" icon="📦">
                  <input
                    style={S.input}
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onFocus={focusInput}
                    onBlur={blurInput}
                    required
                  />
                </Field>
                <Field label="Price (₹)" icon="💰">
                  <input
                    style={S.input}
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    onFocus={focusInput}
                    onBlur={blurInput}
                    required
                    min="0"
                    step="0.01"
                  />
                </Field>
                <Field label="Category" icon="🏷️">
                  <select
                    style={S.select}
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    onFocus={focusInput}
                    onBlur={blurInput}
                    required
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <div style={S.formGroup}>
                  <label style={S.label}>Product Photo</label>
                  <div style={S.fileZone}>
                    <input
                      type="file"
                      accept="image/*"
                      style={S.fileInput}
                      onChange={(e) => setEditPhoto(e.target.files[0])}
                    />
                    {editPhoto ? (
                      <img
                        src={URL.createObjectURL(editPhoto)}
                        alt="new"
                        style={S.previewImg}
                      />
                    ) : (
                      <img
                        src={`${API_URL}/api/v1/product/get-product-photo/${editId}`}
                        alt="current"
                        style={S.previewImg}
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    )}
                  </div>
                </div>

                <button
                  style={{
                    ...S.btnPrimary,
                    background: "linear-gradient(135deg,#48cae4,#6c63ff)",
                    opacity: editLoading ? 0.7 : 1,
                  }}
                  onClick={handleUpdate}
                  disabled={editLoading}
                  onMouseEnter={(e) => {
                    if (!editLoading) e.currentTarget.style.opacity = "0.87";
                  }}
                  onMouseLeave={(e) => {
                    if (!editLoading) e.currentTarget.style.opacity = "1";
                  }}
                >
                  {editLoading ? "Saving…" : "✓ Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Delete Confirm Dialog ── */}
        {confirmId && (
          <div style={S.confirmOverlay}>
            <div style={S.confirmBox}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
                🗑️
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontFamily: "'Syne',sans-serif",
                  fontSize: "1.05rem",
                  marginBottom: "0.5rem",
                }}
              >
                Delete Product?
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "0.82rem",
                  marginBottom: "1.5rem",
                  lineHeight: 1.5,
                }}
              >
                This action cannot be undone. The product will be permanently
                removed.
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "11px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                  onClick={() => setConfirmId(null)}
                >
                  Cancel
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "11px",
                    background: "rgba(255,60,60,0.18)",
                    border: "1px solid rgba(255,60,60,0.35)",
                    color: "rgba(255,140,140,0.95)",
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  }}
                  onClick={handleDelete}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,60,60,0.28)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(255,60,60,0.18)")
                  }
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Toast ── */}
        <div style={S.toast(toast.visible, toast.type)}>{toast.msg}</div>
      </div>
    </LayOut>
  );
};

export default AdminDashboard;
