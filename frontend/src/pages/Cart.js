// src/pages/Cart.js

import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaArrowLeft, FaShoppingBag, FaRupeeSign, FaTruck, FaGift, FaMinus, FaPlus } from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", visible: false, type: "success" });

  const loadCart = useCallback(() => {
    try {
      const data = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(data);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const saveCart = (updated) => {
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, visible: true, type });
  };

  const increaseQty = (index) => {
    const updated = [...cart];
    updated[index].qty += 1;
    saveCart(updated);
    showToast("Quantity updated", "success");
  };

  const decreaseQty = (index) => {
    const updated = [...cart];
    if (updated[index].qty > 1) {
      updated[index].qty -= 1;
      saveCart(updated);
      showToast("Quantity updated", "success");
    }
  };

  const removeItem = (index) => {
    const updated = [...cart];
    const removedItem = updated[index];
    updated.splice(index, 1);
    saveCart(updated);
    showToast(`${removedItem.name} removed from cart`, "info");
  };

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      saveCart([]);
      showToast("Cart cleared", "info");
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  // Loading skeleton
  if (loading) {
    return (
      <div className="cart-page">
        <div className="skeleton-cart">
          <div className="skeleton-header"></div>
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
          <div className="skeleton-sidebar"></div>
        </div>
        <style>{`
          .skeleton-cart { max-width: 1380px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr; gap: 28px; }
          .skeleton-header { height: 60px; background: #e0e0e0; border-radius: 20px; margin-bottom: 24px; }
          .skeleton-item { height: 140px; background: #e0e0e0; border-radius: 20px; margin-bottom: 16px; }
          .skeleton-sidebar { height: 300px; background: #e0e0e0; border-radius: 20px; }
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
          .skeleton-cart div { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; }
          @media (max-width: 768px) { .skeleton-cart { grid-template-columns: 1fr; } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`toast-notification ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="cart-wrap">
        <div className="cart-left">
          <div className="page-top">
            <h1>Your Cart ({cart.length} {cart.length === 1 ? "item" : "items"})</h1>
            <div className="top-actions">
              {cart.length > 0 && (
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear Cart
                </button>
              )}
              <Link to="/shop" className="back-btn">
                <FaArrowLeft /> Continue Shopping
              </Link>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="empty-box">
              <div className="empty-icon">
                <FaShoppingBag />
              </div>
              <h2>Your cart feels lonely</h2>
              <p>Add some stylish items to get started</p>
              <Link to="/shop" className="shop-now-btn">Explore Collection →</Link>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {cart.map((item, index) => (
                  <div className="cart-card" key={`${item._id}-${item.size}-${index}`}>
                    <div className="cart-img-wrapper">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/100x100?text=No+Img"; }}
                      />
                    </div>

                    <div className="cart-info">
                      <h3>{item.name}</h3>
                      <p className="size-badge">Size: {item.size}</p>
                      <div className="price-mobile">
                        <span className="item-price">₹{item.price.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="qty-controls">
                      <button onClick={() => decreaseQty(index)} aria-label="Decrease quantity">
                        <FaMinus />
                      </button>
                      <span className="qty-num">{item.qty}</span>
                      <button onClick={() => increaseQty(index)} aria-label="Increase quantity">
                        <FaPlus />
                      </button>
                    </div>

                    <div className="item-total">
                      <span className="total-price">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                      <button className="delete-btn" onClick={() => removeItem(index)} aria-label="Remove item">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile coupon hint */}
              <div className="coupon-hint">
                <FaGift /> Add promo code at checkout
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-right">
            <h2>Order Summary</h2>

            <div className="summary-details">
              <div className="line">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="line shipping-line">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}</span>
              </div>

              {shipping > 0 && subtotal < 1000 && (
                <div className="free-shipping-note">
                  <FaTruck /> Add ₹{(1000 - subtotal).toLocaleString("en-IN")} more to get free shipping
                </div>
              )}

              <div className="line total">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
              Proceed to Checkout →
            </button>

            <div className="secure-checkout">
              <p>🔒 Secure checkout • 30-day returns</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
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

        .cart-page {
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
          font-size: 0.9rem;
          z-index: 2000;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          animation: slideUp 0.3s ease;
          backdrop-filter: blur(8px);
          background: rgba(18,24,38,0.95);
        }
        .toast-notification.success { border-left: 4px solid #10b981; }
        .toast-notification.info { border-left: 4px solid #3b82f6; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .cart-wrap {
          max-width: 1380px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 28px;
        }

        .cart-left, .cart-right {
          background: var(--primary-bg);
          border-radius: 32px;
          padding: 28px 32px;
          box-shadow: var(--shadow-md);
          transition: var(--transition);
        }

        .page-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
          border-bottom: 2px solid var(--border-light);
          padding-bottom: 18px;
        }
        .page-top h1 {
          font-size: 1.9rem;
          font-weight: 700;
          color: var(--text-dark);
        }
        .top-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .clear-cart-btn {
          background: none;
          border: 1px solid #e2e8f0;
          color: #e53e3e;
          padding: 8px 18px;
          border-radius: 40px;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }
        .clear-cart-btn:hover {
          background: #fff5f5;
          border-color: #e53e3e;
        }
        .back-btn {
          text-decoration: none;
          background: var(--accent-black);
          color: white;
          padding: 8px 20px;
          border-radius: 40px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          transition: var(--transition);
        }
        .back-btn:hover {
          background: #2d3748;
          transform: translateX(-2px);
        }

        /* Cart list */
        .cart-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .cart-card {
          display: grid;
          grid-template-columns: 100px 1fr auto auto;
          gap: 20px;
          align-items: center;
          border: 1px solid var(--border-light);
          padding: 18px 20px;
          border-radius: 24px;
          transition: var(--transition);
          background: white;
        }
        .cart-card:hover {
          box-shadow: 0 6px 14px rgba(0,0,0,0.03);
          border-color: #e2e8f0;
        }
        .cart-img-wrapper {
          width: 100px;
          height: 100px;
          background: #f8fafc;
          border-radius: 20px;
          overflow: hidden;
        }
        .cart-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .cart-card:hover img { transform: scale(1.02); }
        .cart-info h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-dark);
        }
        .size-badge {
          background: #f1f5f9;
          display: inline-block;
          padding: 4px 12px;
          border-radius: 40px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #334155;
          margin-bottom: 8px;
        }
        .price-mobile {
          display: none;
        }
        .item-price {
          font-weight: 700;
          color: var(--accent-black);
        }
        .qty-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8fafc;
          padding: 6px 10px;
          border-radius: 60px;
        }
        .qty-controls button {
          width: 32px;
          height: 32px;
          border: none;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          transition: var(--transition);
        }
        .qty-controls button:hover { background: #eef2ff; transform: scale(0.96); }
        .qty-num {
          font-weight: 700;
          min-width: 28px;
          text-align: center;
          font-size: 1rem;
        }
        .item-total {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }
        .total-price {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--accent-black);
        }
        .delete-btn {
          border: none;
          background: #fff1f0;
          color: #e53e3e;
          width: 36px;
          height: 36px;
          border-radius: 12px;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .delete-btn:hover {
          background: #fee2e2;
          transform: scale(0.94);
        }
        .coupon-hint {
          margin-top: 24px;
          background: #fefce8;
          padding: 12px 20px;
          border-radius: 60px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #854d0e;
        }

        /* Order Summary */
        .cart-right h2 {
          font-size: 1.6rem;
          font-weight: 600;
          margin-bottom: 28px;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--border-light);
        }
        .summary-details {
          margin-bottom: 28px;
        }
        .line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 18px;
          color: var(--text-gray);
          font-size: 1rem;
        }
        .shipping-line {
          border-bottom: 1px dashed #e2e8f0;
          padding-bottom: 8px;
        }
        .free-shipping-note {
          background: #e6fffa;
          padding: 10px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #0f766e;
          margin: 12px 0 18px;
        }
        .line.total {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-dark);
          margin-top: 12px;
          padding-top: 14px;
          border-top: 2px solid var(--border-light);
        }
        .checkout-btn {
          width: 100%;
          background: var(--accent-black);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 48px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: var(--transition);
          margin-top: 8px;
        }
        .checkout-btn:hover {
          background: #2b3548;
          transform: translateY(-2px);
        }
        .secure-checkout {
          text-align: center;
          font-size: 0.75rem;
          color: #6c7a8e;
          margin-top: 20px;
        }

        /* Empty state */
        .empty-box {
          text-align: center;
          padding: 60px 20px;
        }
        .empty-icon svg {
          font-size: 80px;
          color: #cbd5e1;
          margin-bottom: 20px;
        }
        .empty-box h2 {
          font-size: 1.8rem;
          margin-bottom: 12px;
          color: var(--text-dark);
        }
        .empty-box p {
          color: var(--text-gray);
          margin-bottom: 28px;
        }
        .shop-now-btn {
          display: inline-block;
          text-decoration: none;
          background: var(--accent-black);
          color: white;
          padding: 12px 32px;
          border-radius: 40px;
          font-weight: 600;
          transition: var(--transition);
        }
        .shop-now-btn:hover {
          background: #2d3748;
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .cart-wrap { gap: 24px; }
          .cart-left, .cart-right { padding: 24px; }
        }
        @media (max-width: 860px) {
          .cart-wrap { grid-template-columns: 1fr; }
          .cart-card { grid-template-columns: 80px 1fr; gap: 16px; }
          .cart-img-wrapper { width: 80px; height: 80px; }
          .qty-controls { grid-column: 1 / -1; justify-self: start; margin-top: 8px; }
          .item-total { grid-column: 1 / -1; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; margin-top: 8px; }
          .price-mobile { display: block; }
          .cart-info .item-price { display: none; }
          .total-price { font-size: 1.1rem; }
          .page-top { flex-direction: column; align-items: stretch; }
          .top-actions { justify-content: space-between; }
        }
        @media (max-width: 640px) {
          .cart-page { padding: 20px 12px; }
          .cart-left, .cart-right { padding: 18px; }
          .page-top h1 { font-size: 1.6rem; }
          .cart-card { padding: 14px; }
          .empty-box h2 { font-size: 1.4rem; }
        }
        @media (max-width: 480px) {
          .cart-img-wrapper { width: 70px; height: 70px; }
          .cart-info h3 { font-size: 0.95rem; }
          .qty-controls button { width: 28px; height: 28px; }
          .delete-btn { width: 32px; height: 32px; }
        }
      `}</style>
    </div>
  );
};

export default Cart;