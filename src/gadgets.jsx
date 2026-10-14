import React from "react";
import products from "./gadgets_electonic.json";

const Gadgets = () => {
  const data = products.products;

  return (
    <div style={styles.page}>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .gadget-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
        }

        .gadget-card {
          position: relative;
          background: white;
          border-radius: 20px;
          padding: 22px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          transition: 0.3s ease;
          overflow: hidden;
        }

        .gadget-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.16);
        }

        .gadget-icon {
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #dbeafe, #ede9fe);
          border-radius: 15px;
          font-size: 60px;
          margin-bottom: 20px;
        }

        .gadget-card h2 {
          font-size: 19px;
          color: #172554;
          margin: 14px 0 8px;
        }

        .gadget-brand {
          color: #64748b;
          font-size: 14px;
        }

        .gadget-category {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          background: #eef2ff;
          color: #4338ca;
          font-size: 12px;
          font-weight: bold;
        }

        .gadget-price {
          font-size: 24px;
          color: #059669;
          font-weight: bold;
          margin: 15px 0 8px;
        }

        .gadget-discount {
          position: absolute;
          top: 15px;
          left: 15px;
          padding: 7px 10px;
          background: #ef4444;
          color: white;
          font-size: 12px;
          font-weight: bold;
          border-radius: 8px;
        }

        .gadget-rating {
          color: #b45309;
          font-weight: bold;
          margin: 12px 0;
        }

        .gadget-stock {
          font-size: 13px;
          font-weight: bold;
        }

        .gadget-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          margin-top: 12px;
          background: #4f46e5;
          color: white;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }

        .gadget-btn:hover {
          background: #312e81;
        }

        .gadget-btn:disabled {
          background: #cbd5e1;
          color: #64748b;
          cursor: not-allowed;
        }

        @media (max-width: 1000px) {
          .gadget-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .gadget-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .gadget-card {
            padding: 14px;
          }

          .gadget-icon {
            height: 110px;
            font-size: 45px;
          }

          .gadget-card h2 {
            font-size: 16px;
          }

          .gadget-price {
            font-size: 20px;
          }
        }

        @media (max-width: 400px) {
          .gadget-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header style={styles.header}>
        <div style={styles.logo}>⚡ GadgetZone</div>
        <p style={styles.tagline}>
          Discover the latest technology
        </p>
        <h1 style={styles.heading}>
          Explore Our Gadgets
        </h1>
        <p style={styles.description}>
          Smart devices. Amazing prices. Better technology.
        </p>
      </header>

      <div style={styles.count}>
        Showing {data.length} products
      </div>

      <div className="gadget-grid">
        {data.map((gg) => {
          const finalPrice = Math.round(
            gg.price - (gg.price * gg.discount) / 100
          );

          return (
            <div className="gadget-card" key={gg.id}>
              <span className="gadget-discount">
                {gg.discount}% OFF
              </span>

              <div className="gadget-icon">
                {gg.category === "Electronics" ? "📱" :
                 gg.category === "Laptop" ? "💻" :
                 gg.category === "Headphones" ? "🎧" :
                 gg.category === "Accessories" ? "🖱️" :
                 gg.category === "Camera" ? "📷" :
                 gg.category === "Speakers" ? "🔊" :
                 gg.category === "Watches" ? "⌚" :
                 gg.category === "Shoes" ? "👟" :
                 gg.category === "Clothing" ? "👕" : "⚡"}
              </div>

              <span className="gadget-category">
                {gg.category}
              </span>

              <h2>{gg.name}</h2>
              <p className="gadget-brand">
                Brand: {gg.brand}
              </p>

              <p className="gadget-rating">
                ⭐ {gg.rating} / 5
              </p>

              <p style={{ color: "#64748b", fontSize: "14px" }}>
                Color: {gg.color}
              </p>

              <div className="gadget-price">
                ₹{finalPrice.toLocaleString("en-IN")}
              </div>

              <p style={{
                color: "#94a3b8",
                fontSize: "14px",
                margin: "0"
              }}>
                MRP: <del>₹{gg.price.toLocaleString("en-IN")}</del>
              </p>

              <p
                className="gadget-stock"
                style={{
                  color: gg.inStock ? "#059669" : "#dc2626"
                }}
              >
                {gg.inStock ? "✓ In Stock" : "✕ Out of Stock"}
              </p>

              <button
                className="gadget-btn"
                disabled={!gg.inStock}
                onClick={() => alert(`${gg.name} selected!`)}
              >
                {gg.inStock ? "View Gadget →" : "Currently Unavailable"}
              </button>
            </div>
          );
        })}
      </div>

      <footer style={styles.footer}>
        © 2026 GadgetZone | Technology for Everyone ⚡
      </footer>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px 5%",
    background: "linear-gradient(135deg, #eff6ff, #f5f3ff)",
    fontFamily: "Arial, sans-serif",
    color: "#172554"
  },
  header: {
    textAlign: "center",
    padding: "25px 10px 35px"
  },
  logo: {
    fontSize: "25px",
    fontWeight: "bold",
    color: "#4f46e5",
    marginBottom: "15px"
  },
  tagline: {
    color: "#64748b",
    fontSize: "14px"
  },
  heading: {
    fontSize: "clamp(30px, 5vw, 46px)",
    margin: "15px 0",
    fontWeight: "800",
    color: "#172554"
  },
  description: {
    color: "#64748b",
    fontSize: "16px"
  },
  count: {
    marginBottom: "20px",
    color: "#64748b",
    fontWeight: "bold"
  },
  footer: {
    textAlign: "center",
    padding: "40px 10px 10px",
    color: "#64748b",
    fontSize: "14px"
  }
};

export default Gadgets;
