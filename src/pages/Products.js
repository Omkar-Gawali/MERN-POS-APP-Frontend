import React, { useEffect, useState } from "react";
import LayOut from "../components/LayOut/LayOut";
import axios from "axios";
import { useCart } from "../context/cartContext";

const API_URL = process.env.REACT_APP_API_URL;

/* ── Google Font (inject once) ── */
if (
  typeof document !== "undefined" &&
  !document.getElementById("products-font")
) {
  const link = document.createElement("link");
  link.id = "products-font";
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

  /* ── Header bar ── */
  pageHeader: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2.5rem 2rem 1.5rem",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "1rem",
  },
  pageTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.9rem",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.8px",
    margin: 0,
  },
  countPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 14px",
    borderRadius: "20px",
    background: "rgba(108,99,255,0.15)",
    border: "1px solid rgba(108,99,255,0.3)",
    color: "rgba(200,195,255,0.9)",
    fontSize: "0.82rem",
    fontWeight: 600,
    letterSpacing: "0.3px",
    marginLeft: "12px",
    verticalAlign: "middle",
  },

  /* ── Search ── */
  searchWrap: {
    position: "relative",
    flexShrink: 0,
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "0.95rem",
    pointerEvents: "none",
    opacity: 0.4,
  },
  searchInput: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "9px 14px 9px 36px",
    color: "#fff",
    fontSize: "0.85rem",
    outline: "none",
    width: "220px",
    transition: "border-color 0.2s, background 0.2s",
  },

  /* ── Grid ── */
  grid: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: "1.25rem",
  },

  /* ── Product card ── */
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition:
      "transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease",
    cursor: "default",
  },
  cardHover: {
    transform: "translateY(-4px)",
    borderColor: "rgba(108,99,255,0.35)",
    boxShadow: "0 20px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(108,99,255,0.15)",
  },
  imgWrap: {
    background: "rgba(255,255,255,0.97)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "200px",
    overflow: "hidden",
    position: "relative",
    padding: "16px",
  },
  img: {
    maxWidth: "100%",
    maxHeight: "100%",
    width: "auto",
    height: "auto",
    objectFit: "contain",
    display: "block",
    margin: "0 auto",
    transition: "transform 0.35s ease",
  },
  imgHover: {
    transform: "scale(1.07)",
  },
  cardBody: {
    padding: "1rem 1.1rem 1.1rem",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
  },
  productName: {
    color: "rgba(255,255,255,0.9)",
    fontSize: "0.92rem",
    fontWeight: 600,
    lineHeight: 1.4,
    margin: 0,
  },
  price: {
    color: "rgba(200,195,255,0.7)",
    fontSize: "0.8rem",
    fontWeight: 500,
    margin: 0,
  },

  /* ── Add to cart button states ── */
  addBtn: {
    width: "100%",
    padding: "9px",
    borderRadius: "11px",
    border: "1px solid rgba(108,99,255,0.35)",
    background: "rgba(108,99,255,0.1)",
    color: "rgba(200,195,255,0.9)",
    fontSize: "0.84rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.18s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    marginTop: "auto",
    letterSpacing: "0.2px",
  },
  addBtnHover: {
    background:
      "linear-gradient(135deg, rgba(108,99,255,0.55), rgba(72,202,228,0.35))",
    borderColor: "rgba(108,99,255,0.6)",
    color: "#fff",
    boxShadow: "0 4px 16px rgba(108,99,255,0.3)",
  },
  inCartBtn: {
    background: "rgba(72,202,228,0.1)",
    border: "1px solid rgba(72,202,228,0.3)",
    color: "rgba(130,220,240,0.85)",
    cursor: "default",
  },
  addedBtn: {
    background: "rgba(72,228,128,0.1)",
    border: "1px solid rgba(72,228,128,0.3)",
    color: "rgba(130,230,160,0.9)",
  },

  /* ── Empty state ── */
  empty: {
    maxWidth: "1200px",
    margin: "5rem auto",
    textAlign: "center",
    padding: "0 2rem",
  },
  emptyIcon: {
    fontSize: "3.5rem",
    marginBottom: "1rem",
    display: "block",
    opacity: 0.5,
  },
  emptyTitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "1.1rem",
    fontWeight: 500,
    margin: 0,
  },

  /* ── Toast ── */
  toast: (visible) => ({
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    background: "rgba(16,16,28,0.95)",
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

  /* ── Loading skeleton ── */
  skeleton: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "20px",
    overflow: "hidden",
    height: "310px",
    position: "relative",
  },
  shimmer: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
    animation: "shimmer 1.6s infinite",
  },
};

/* ── Product Card ── */
const ProductCard = ({ product, isInCart, onAdd }) => {
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    if (isInCart) return;
    onAdd(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const btnStyle = isInCart
    ? { ...S.addBtn, ...S.inCartBtn }
    : justAdded
      ? { ...S.addBtn, ...S.addedBtn }
      : btnHovered
        ? { ...S.addBtn, ...S.addBtnHover }
        : S.addBtn;

  return (
    <div
      style={{ ...S.card, ...(hovered ? S.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={S.imgWrap}>
        <img
          src={`${API_URL}/api/v1/product/get-product-photo/${product._id}`}
          alt={product.name}
          style={{ ...S.img, ...(hovered ? S.imgHover : {}) }}
          onError={(e) => {
            e.currentTarget.style.opacity = "0.2";
          }}
        />
      </div>
      <div style={S.cardBody}>
        <p style={S.productName}>{product.name}</p>
        {product.price != null && (
          <p style={S.price}>₹{product.price.toLocaleString("en-IN")}</p>
        )}
        <button
          style={btnStyle}
          onClick={handleAdd}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          disabled={isInCart}
        >
          {isInCart ? (
            <>
              <span>✓</span> In Cart
            </>
          ) : justAdded ? (
            <>
              <span>✓</span> Added!
            </>
          ) : (
            <>
              <span>🛒</span> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/* ── Main Component ── */
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useCart();
  const [toast, setToast] = useState({ visible: false, name: "" });

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/product/get-all-products`,
      );
      if (data?.success) setProducts(data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const isInCart = (id) => cart.some((item) => item.cartItem._id === id);

  const handleAdd = (product) => {
    const updated = [...cart, { cartItem: product, quantity: 1 }];
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    setToast({ visible: true, name: product.name });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <LayOut>
      <div style={S.page}>
        {/* shimmer keyframe */}
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>

        {/* Page header */}
        <div style={S.pageHeader}>
          <h1 style={S.pageTitle}>
            Products
            {!loading && (
              <span style={S.countPill}>{filtered.length} items</span>
            )}
          </h1>
          <div style={S.searchWrap}>
            <span style={S.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={S.searchInput}
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

        {/* Grid */}
        {loading ? (
          <div style={S.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={S.skeleton}>
                <div style={S.shimmer} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={S.empty}>
            <span style={S.emptyIcon}>📦</span>
            <p style={S.emptyTitle}>
              {query ? `No results for "${query}"` : "No products found"}
            </p>
          </div>
        ) : (
          <div style={S.grid}>
            {filtered.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                isInCart={isInCart(p._id)}
                onAdd={handleAdd}
              />
            ))}
          </div>
        )}

        {/* Toast */}
        <div style={S.toast(toast.visible)}>
          ✓ <strong>{toast.name}</strong> added to cart
        </div>
      </div>
    </LayOut>
  );
};

export default Products;
