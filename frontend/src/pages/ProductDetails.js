// src/pages/ProductDetails.js

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
  FaBolt,
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaCheckCircle,
} from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const API = "http://localhost:5000/api";

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [toast, setToast] = useState({ message: "", visible: false, type: "success" });

  // Fetch single product
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API}/products/${id}`);
      setProduct(res.data);
      setMainImage(res.data.image);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load product. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch all products for related items
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    fetchProduct();
    fetchProducts();
    window.scrollTo(0, 0);
  }, [fetchProduct, fetchProducts]);

  // Auto-hide toast after 2.5 seconds
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Show toast helper
  const showToast = (message, type = "success") => {
    setToast({ message, visible: true, type });
  };

  const addToCart = () => {
    if (!product) return;
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingIndex = cart.findIndex(
        (item) => item._id === product._id && item.size === size
      );

      if (existingIndex !== -1) {
        cart[existingIndex].qty += qty;
      } else {
        cart.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty,
          size,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      showToast(`✓ ${product.name} (${size}) added to cart`, "success");
    } catch (err) {
      showToast("Failed to add item. Please try again.", "error");
    }
  };

  const buyNow = () => {
    addToCart();
    setTimeout(() => navigate("/checkout"), 100);
  };

  // --- Helper: Star Rating Component ---
  const renderStars = (rating = 4.5, reviewCount = 128) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="rating-stars">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} />
        ))}
        {hasHalfStar && <FaStarHalfAlt />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} />
        ))}
        <span className="rating-count">({reviewCount} Reviews)</span>
      </div>
    );
  };

  // --- Related products (same category, exclude current) ---
  const relatedProducts = useMemo(() => {
    if (!product || !products.length) return [];
    return products
      .filter(item => item._id !== product._id && item.category === product.category)
      .slice(0, 4);
  }, [product, products]);

  // --- Product images gallery (handles multiple images if available) ---
  const productImages = useMemo(() => {
    if (!product) return [];
    // If API provides an array of images, use it; otherwise fallback to single image
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return [product.image];
  }, [product]);

  const showThumbnails = productImages.length > 1;

  // Loading Skeleton
  if (loading) {
    return (
      <div className="pd-page">
        <div className="pd-wrap skeleton-wrap">
          <div className="pd-left">
            <div className="skeleton-img"></div>
          </div>
          <div className="pd-right">
            <div className="skeleton-line title"></div>
            <div className="skeleton-line rating"></div>
            <div className="skeleton-line price"></div>
            <div className="skeleton-line desc"></div>
            <div className="skeleton-line size"></div>
            <div className="skeleton-line qty"></div>
            <div className="skeleton-line actions"></div>
          </div>
        </div>
        <style jsx>{`
          .skeleton-wrap { background: #fff; }
          .skeleton-img { width: 100%; height: 500px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; border-radius: 24px; }
          .skeleton-line { height: 20px; background: #e0e0e0; margin-bottom: 16px; border-radius: 12px; }
          .title { width: 70%; height: 36px; }
          .rating { width: 40%; }
          .price { width: 30%; height: 32px; }
          .desc { width: 100%; height: 80px; }
          .size { width: 50%; height: 52px; }
          .qty { width: 30%; height: 48px; }
          .actions { width: 100%; height: 56px; }
          @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-page error-container">
        <div className="error-card">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
          <Link to="/" className="home-link">← Back to Home</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-page">
        <div className="not-found-card">
          <h2>Product Not Found</h2>
          <p>The item you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="home-link">← Back to Shopping</Link>
        </div>
      </div>
    );
  }

  const productRating = product.rating || 4.5;
  const productReviewCount = product.reviewsCount || 128;

  return (
    <div className="pd-page">
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`toast-notification ${toast.type}`}>
          <FaCheckCircle className="toast-icon" />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="pd-wrap">
        {/* LEFT COLUMN - IMAGES */}
        <div className="pd-left">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <FaArrowLeft /> Back
          </button>

          <div className="main-img">
            <img
              src={mainImage || "/placeholder.png"}
              alt={product.name}
              onError={(e) => { e.target.src = "https://via.placeholder.com/600x600?text=No+Image"; }}
            />
          </div>

          {showThumbnails && (
            <div className="thumb-row">
              {productImages.map((img, i) => (
                <img
                  key={i}
                  src={img || "/placeholder.png"}
                  alt={`${product.name} view ${i + 1}`}
                  onClick={() => setMainImage(img)}
                  className={mainImage === img ? "thumb-active" : ""}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/90x90?text=Img"; }}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - DETAILS */}
        <div className="pd-right">
          <p className="category">{product.category || "Premium Collection"}</p>
          <h1>{product.name}</h1>

          <div className="rating-section">
            {renderStars(productRating, productReviewCount)}
          </div>

          <h2 className="price">₹{product.price.toLocaleString("en-IN")}</h2>

          <p className="desc">
            {product.description || "Experience exceptional quality and modern design. This piece combines comfort with durability, making it perfect for daily wear or special occasions."}
          </p>

          <div className="section">
            <h4>Select Size</h4>
            <div className="sizes">
              {["S", "M", "L", "XL"].map((item) => (
                <button
                  key={item}
                  className={size === item ? "active" : ""}
                  onClick={() => setSize(item)}
                  aria-label={`Size ${item}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="section">
            <h4>Quantity</h4>
            <div className="qty-box">
              <button onClick={() => qty > 1 && setQty(qty - 1)} aria-label="Decrease quantity">
                <FaMinus />
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="Increase quantity">
                <FaPlus />
              </button>
            </div>
          </div>

          <div className="action-row">
            <button className="cart-btn" onClick={addToCart}>
              <FaShoppingCart /> Add To Cart
            </button>
            <button className="buy-btn" onClick={buyNow}>
              <FaBolt /> Buy Now
            </button>
          </div>

          <div className="delivery-info">
            <p>✅ Free delivery on orders over ₹999</p>
            <p>🔄 30-day easy returns</p>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <div className="related-wrap">
          <h2>You May Also Like</h2>
          <div className="related-grid">
            {relatedProducts.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item._id}`}
                className="rel-card"
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="rel-img-wrapper">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <h4>{item.name}</h4>
                <p className="rel-price">₹{item.price.toLocaleString("en-IN")}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary-bg: #ffffff;
          --secondary-bg: #fafafc;
          --text-dark: #1a1e2b;
          --text-gray: #5a6874;
          --accent-black: #121826;
          --accent-gold: #f5b301;
          --border-light: #eef2f6;
          --shadow-sm: 0 8px 20px rgba(0,0,0,0.02), 0 2px 6px rgba(0,0,0,0.05);
          --shadow-md: 0 12px 28px rgba(0,0,0,0.08);
          --transition: all 0.2s ease;
        }

        body {
          background: var(--secondary-bg);
        }

        .pd-page {
          min-height: 100vh;
          padding: 40px 20px;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #f8f9fc 100%);
        }

        /* Toast */
        .toast-notification {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          background: #1f2937;
          color: white;
          padding: 12px 24px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
          z-index: 2000;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          animation: slideUp 0.3s ease;
          backdrop-filter: blur(8px);
          background: rgba(18,24,38,0.95);
        }
        .toast-notification.success { border-left: 4px solid #10b981; }
        .toast-notification.error { border-left: 4px solid #ef4444; }
        .toast-icon { font-size: 1.1rem; color: #10b981; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* Main container */
        .pd-wrap {
          max-width: 1380px;
          margin: 0 auto;
          background: var(--primary-bg);
          border-radius: 32px;
          padding: 32px 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          box-shadow: var(--shadow-md);
          transition: var(--transition);
        }

        /* Left column */
        .back-btn {
          border: none;
          background: var(--accent-black);
          color: white;
          padding: 10px 20px;
          border-radius: 40px;
          cursor: pointer;
          margin-bottom: 24px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          font-size: 0.9rem;
          transition: var(--transition);
        }
        .back-btn:hover { background: #2d3748; transform: translateX(-2px); }

        .main-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #f9fafb;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s;
        }
        .main-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        .main-img:hover img { transform: scale(1.02); }

        .thumb-row {
          display: flex;
          gap: 14px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        .thumb-row img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 16px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: var(--transition);
          background: #f3f4f6;
        }
        .thumb-row img:hover { border-color: #cbd5e1; transform: translateY(-2px); }
        .thumb-active { border-color: var(--accent-black) !important; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

        /* Right column */
        .category {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #6c7a8e;
          margin-bottom: 12px;
          font-weight: 600;
        }
        .pd-right h1 {
          font-size: 2.6rem;
          font-weight: 700;
          line-height: 1.2;
          color: var(--text-dark);
          margin-bottom: 16px;
        }
        .rating-section {
          margin-bottom: 16px;
        }
        .rating-stars {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }
        .rating-stars svg {
          color: var(--accent-gold);
          font-size: 1.1rem;
        }
        .rating-count {
          color: var(--text-gray);
          font-size: 0.85rem;
          margin-left: 8px;
          font-weight: 500;
        }
        .price {
          font-size: 2rem;
          font-weight: 800;
          color: var(--accent-black);
          margin-bottom: 20px;
        }
        .desc {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 28px;
          font-size: 0.95rem;
        }
        .section {
          margin-bottom: 28px;
        }
        .section h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1f2937;
        }
        .sizes {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .sizes button {
          width: 56px;
          height: 56px;
          border: 1px solid var(--border-light);
          background: #ffffff;
          border-radius: 18px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .sizes button.active {
          background: var(--accent-black);
          color: white;
          border-color: var(--accent-black);
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        .sizes button:hover:not(.active) {
          border-color: #9ca3af;
          background: #f9fafb;
        }
        .qty-box {
          display: flex;
          align-items: center;
          gap: 18px;
          background: #f3f4f6;
          width: fit-content;
          padding: 6px 12px;
          border-radius: 60px;
        }
        .qty-box button {
          width: 40px;
          height: 40px;
          border: none;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          transition: var(--transition);
        }
        .qty-box button:hover { background: #e5e7eb; transform: scale(0.96); }
        .qty-box span {
          min-width: 32px;
          text-align: center;
          font-size: 1.3rem;
          font-weight: 700;
        }
        .action-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 24px 0 20px;
        }
        .cart-btn, .buy-btn {
          border: none;
          padding: 16px 12px;
          border-radius: 48px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: 0.2s;
        }
        .cart-btn {
          background: var(--accent-black);
          color: white;
          border: 1px solid #2d3748;
        }
        .cart-btn:hover { background: #2b3548; transform: translateY(-2px); }
        .buy-btn {
          background: #ffcc00;
          color: #1a1e2b;
        }
        .buy-btn:hover { background: #e6b800; transform: translateY(-2px); }
        .delivery-info {
          margin-top: 16px;
          font-size: 0.8rem;
          color: #5c6b7e;
          display: flex;
          gap: 20px;
          border-top: 1px solid var(--border-light);
          padding-top: 18px;
        }

        /* Related */
        .related-wrap {
          max-width: 1380px;
          margin: 48px auto 0;
        }
        .related-wrap h2 {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 24px;
          letter-spacing: -0.3px;
        }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 28px;
        }
        .rel-card {
          background: white;
          border-radius: 24px;
          padding: 16px;
          text-decoration: none;
          color: #1f2937;
          transition: 0.25s ease;
          box-shadow: 0 6px 14px rgba(0,0,0,0.02);
          border: 1px solid #eff3f6;
        }
        .rel-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 30px -12px rgba(0,0,0,0.1);
          border-color: #e0e7ed;
        }
        .rel-img-wrapper {
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          border-radius: 20px;
          background: #f5f7fb;
        }
        .rel-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s;
        }
        .rel-card:hover img { transform: scale(1.04); }
        .rel-card h4 {
          margin-top: 16px;
          font-size: 1rem;
          font-weight: 600;
        }
        .rel-price {
          font-weight: 700;
          color: var(--accent-black);
          margin-top: 8px;
        }

        /* Error / not found */
        .error-container, .not-found-card {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }
        .error-card, .not-found-card {
          text-align: center;
          background: white;
          padding: 48px;
          border-radius: 40px;
          max-width: 500px;
          margin: 0 auto;
        }
        .retry-btn, .home-link {
          display: inline-block;
          margin-top: 24px;
          background: #1a1e2b;
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 40px;
          text-decoration: none;
          font-weight: 500;
        }
        .home-link { background: #e5e7eb; color: black; margin-left: 12px; }

        /* Responsive */
        @media (max-width: 1024px) {
          .pd-wrap { padding: 28px 28px; gap: 36px; }
          .pd-right h1 { font-size: 2rem; }
        }
        @media (max-width: 860px) {
          .pd-wrap { grid-template-columns: 1fr; gap: 28px; padding: 24px; }
          .main-img { aspect-ratio: 4 / 3; }
          .thumb-row img { width: 70px; height: 70px; }
          .action-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .pd-page { padding: 20px 12px; }
          .pd-wrap { padding: 20px; }
          .pd-right h1 { font-size: 1.8rem; }
          .price { font-size: 1.8rem; }
          .sizes button { width: 48px; height: 48px; }
          .delivery-info { flex-direction: column; gap: 6px; }
          .related-grid { gap: 16px; grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .related-grid { grid-template-columns: 1fr; }
          .thumb-row img { width: 60px; height: 60px; }
          .back-btn { font-size: 0.8rem; padding: 8px 14px; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;