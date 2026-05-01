// src/pages/Checkout.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaTruck,
  FaMoneyBillWave,
  FaCreditCard,
  FaArrowLeft,
  FaShieldAlt,
  FaLock,
  FaSpinner,
} from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();
  const API = "http://localhost:5000/api";

  const [cart, setCart] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", visible: false, type: "success" });
  const [formErrors, setFormErrors] = useState({});
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "COD",
  });

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);
    setLoading(false);
    if (saved.length === 0) navigate("/cart");
  }, [navigate]);

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const showToast = (message, type = "success") => {
    setToast({ message, visible: true, type });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Full name is required";
    if (!form.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) errors.phone = "Enter a valid 10-digit phone number";
    if (!form.address.trim()) errors.address = "Address is required";
    if (!form.city.trim()) errors.city = "City is required";
    if (!form.pincode.trim()) errors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode)) errors.pincode = "Enter a valid 6-digit pincode";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email address";
    return errors;
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  // Place COD order directly
  const submitOrderToBackend = async (paymentDetails = null) => {
    try {
      setPlacing(true);
      const payload = {
        ...form,
        items: cart.map(item => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          size: item.size,
          image: item.image,
        })),
        totalAmount: total,
        paymentMethod: form.paymentMethod,
        paymentStatus: form.paymentMethod === "COD" ? "Pending" : "Paid",
        orderStatus: "Placed",
        ...(paymentDetails && { razorpayPaymentId: paymentDetails.razorpay_payment_id }),
        createdAt: new Date().toISOString(),
      };

      await axios.post(`${API}/orders`, payload);
      localStorage.removeItem("cart");
      showToast(form.paymentMethod === "COD" ? "Order placed successfully! 🎉" : "Payment successful! Order placed. 🎉", "success");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to place order. Please try again.", "error");
    } finally {
      setPlacing(false);
    }
  };

  // Razorpay flow
  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      showToast("Payment gateway is loading. Please try again.", "error");
      return;
    }

    try {
      setPlacing(true);
      // 1. Create Razorpay order on your backend
      const { data } = await axios.post(`${API}/create-razorpay-order`, {
        amount: total * 100, // amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      const options = {
        key: "rzp_test_SefAkhGS8FXsWS", // Your Razorpay Key ID
        amount: data.amount,
        currency: data.currency,
        name: "Your Store Name",
        description: `Order ${data.orderId}`,
        order_id: data.orderId,
        handler: async (response) => {
          // 2. Verify payment on backend
          try {
            const verifyRes = await axios.post(`${API}/verify-razorpay-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.data.success) {
              // 3. Place final order
              await submitOrderToBackend({ razorpay_payment_id: response.razorpay_payment_id });
            } else {
              showToast("Payment verification failed. Please contact support.", "error");
            }
          } catch (err) {
            console.error(err);
            showToast("Payment verification failed. Please try again.", "error");
          } finally {
            setPlacing(false);
          }
        },
        prefill: {
          name: form.name,
          email: form.email || "customer@example.com",
          contact: form.phone,
        },
        theme: {
          color: "#121826",
        },
        modal: {
          ondismiss: () => {
            setPlacing(false);
            showToast("Payment cancelled", "info");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      showToast("Failed to initialize payment. Please try again.", "error");
      setPlacing(false);
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Please fix the errors in the form", "error");
      return;
    }

    if (form.paymentMethod === "Online") {
      await handleRazorpayPayment();
    } else {
      await submitOrderToBackend();
    }
  };

  // Loading skeleton (same as before)
  if (loading) {
    return (
      <div className="checkout-page">
        <div className="skeleton-checkout">
          <div className="skeleton-left"></div>
          <div className="skeleton-right"></div>
        </div>
        <style>{`
          .skeleton-checkout { max-width: 1380px; margin: 0 auto; display: grid; grid-template-columns: 1.4fr 0.9fr; gap: 28px; }
          .skeleton-left, .skeleton-right { height: 600px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; border-radius: 32px; }
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
          @media (max-width: 992px) { .skeleton-checkout { grid-template-columns: 1fr; } }
        `}</style>
      </div>
    );
  }

  if (cart.length === 0 && !loading) return null;

  return (
    <div className="checkout-page">
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`toast-notification ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="checkout-wrap">
        <form className="left-box" onSubmit={placeOrder}>
          <div className="checkout-header">
            <button type="button" className="back-cart-btn" onClick={() => navigate("/cart")}>
              <FaArrowLeft /> Back to Cart
            </button>
            <h1>Secure Checkout</h1>
          </div>

          <div className="section-title">
            <FaMapMarkerAlt /> Shipping Details
          </div>

          <div className="grid-2">
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={form.name}
                onChange={handleChange}
                className={formErrors.name ? "error-input" : ""}
              />
              {formErrors.name && <span className="error-text">{formErrors.name}</span>}
            </div>
            <div className="input-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={form.phone}
                onChange={handleChange}
                className={formErrors.phone ? "error-input" : ""}
              />
              {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
            </div>
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address (optional)"
              value={form.email}
              onChange={handleChange}
              className={formErrors.email ? "error-input" : ""}
            />
            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
          </div>

          <div className="input-group">
            <textarea
              name="address"
              placeholder="Full Address *"
              rows="3"
              value={form.address}
              onChange={handleChange}
              className={formErrors.address ? "error-input" : ""}
            />
            {formErrors.address && <span className="error-text">{formErrors.address}</span>}
          </div>

          <div className="grid-2">
            <div className="input-group">
              <input
                type="text"
                name="city"
                placeholder="City *"
                value={form.city}
                onChange={handleChange}
                className={formErrors.city ? "error-input" : ""}
              />
              {formErrors.city && <span className="error-text">{formErrors.city}</span>}
            </div>
            <div className="input-group">
              <input
                type="text"
                name="pincode"
                placeholder="Pincode *"
                value={form.pincode}
                onChange={handleChange}
                className={formErrors.pincode ? "error-input" : ""}
              />
              {formErrors.pincode && <span className="error-text">{formErrors.pincode}</span>}
            </div>
          </div>

          <div className="section-title payment-top">
            <FaCreditCard /> Payment Method
          </div>

          <div className="payment-box">
            <label className={form.paymentMethod === "COD" ? "selected" : ""}>
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={form.paymentMethod === "COD"}
                onChange={handleChange}
              />
              <FaMoneyBillWave /> Cash on Delivery
              <span className="payment-badge">Pay when you receive</span>
            </label>

            <label className={form.paymentMethod === "Online" ? "selected" : ""}>
              <input
                type="radio"
                name="paymentMethod"
                value="Online"
                checked={form.paymentMethod === "Online"}
                onChange={handleChange}
              />
              <FaCreditCard /> Online Payment (Razorpay)
              <span className="payment-badge">Card/UPI/NetBanking</span>
            </label>
          </div>

          <button className="place-btn" type="submit" disabled={placing}>
            {placing ? (
              <>Processing <FaSpinner className="spin" /></>
            ) : (
              `Place Order • ₹${total.toLocaleString("en-IN")}`
            )}
          </button>
        </form>

        <div className="right-box">
          <h2>Order Summary</h2>

          <div className="items-list">
            {cart.map((item, idx) => (
              <div className="item-row" key={`${item._id}-${item.size}-${idx}`}>
                <div className="item-img-wrapper">
                  <img src={item.image || "/placeholder.png"} alt={item.name} />
                </div>
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Size {item.size} • Qty {item.qty}</p>
                  <span className="item-price-mobile">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                </div>
                <span className="item-price">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>

          <div className="summary-breakdown">
            <div className="line">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="line">
              <span><FaTruck /> Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}</span>
            </div>
            {shipping > 0 && subtotal < 1000 && (
              <div className="free-shipping-tip">
                Add ₹{(1000 - subtotal).toLocaleString("en-IN")} more for free shipping
              </div>
            )}
            <div className="line total">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="secure-box">
            <FaLock /> <span>100% Secure Checkout • SSL Encrypted</span>
          </div>
          <div className="guarantee-box">
            <FaShieldAlt /> Free 30-day returns & size exchange
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --primary-bg: #ffffff;
          --accent-black: #121826;
          --text-gray: #5a6874;
          --border-light: #eef2f6;
          --shadow-md: 0 12px 28px rgba(0,0,0,0.08);
          --error-red: #e53e3e;
        }

        .checkout-page {
          min-height: 100vh;
          padding: 40px 20px;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #f8f9fc 100%);
        }

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
        .toast-notification.error { border-left: 4px solid #ef4444; }
        .toast-notification.info { border-left: 4px solid #3b82f6; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .checkout-wrap {
          max-width: 1380px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.4fr 0.9fr;
          gap: 28px;
        }

        .left-box, .right-box {
          background: var(--primary-bg);
          border-radius: 32px;
          padding: 32px;
          box-shadow: var(--shadow-md);
        }

        .checkout-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .back-cart-btn {
          background: none;
          border: 1px solid var(--border-light);
          padding: 8px 18px;
          border-radius: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .back-cart-btn:hover {
          background: #f1f5f9;
        }
        .left-box h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--accent-black);
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--accent-black);
        }

        .payment-top {
          margin-top: 28px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .input-group {
          margin-bottom: 16px;
        }
        input, textarea {
          width: 100%;
          padding: 14px 18px;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          font-size: 0.95rem;
          transition: all 0.2s;
          font-family: inherit;
          background: #fefefe;
        }
        textarea {
          resize: vertical;
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: var(--accent-black);
          box-shadow: 0 0 0 3px rgba(18,24,38,0.05);
        }
        .error-input {
          border-color: var(--error-red) !important;
          background: #fff5f5;
        }
        .error-text {
          font-size: 0.7rem;
          color: var(--error-red);
          margin-top: 4px;
          display: block;
        }

        .payment-box {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .payment-box label {
          border: 1px solid var(--border-light);
          padding: 16px 20px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .payment-box label.selected {
          border-color: var(--accent-black);
          background: #fafcff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .payment-badge {
          margin-left: auto;
          font-size: 0.7rem;
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 40px;
          color: #334155;
        }

        .place-btn {
          width: 100%;
          margin-top: 28px;
          border: none;
          background: var(--accent-black);
          color: white;
          padding: 16px;
          border-radius: 48px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .place-btn:hover:not(:disabled) {
          background: #2b3548;
          transform: translateY(-2px);
        }
        .place-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .spin {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .right-box h2 {
          font-size: 1.5rem;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--border-light);
        }
        .items-list {
          max-height: 360px;
          overflow-y: auto;
          margin-bottom: 24px;
          padding-right: 6px;
        }
        .items-list::-webkit-scrollbar {
          width: 4px;
        }
        .item-row {
          display: grid;
          grid-template-columns: 70px 1fr auto;
          gap: 16px;
          align-items: center;
          margin-bottom: 20px;
        }
        .item-img-wrapper {
          width: 70px;
          height: 70px;
          background: #f8fafc;
          border-radius: 18px;
          overflow: hidden;
        }
        .item-row img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item-info h4 {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .item-info p {
          font-size: 0.75rem;
          color: var(--text-gray);
        }
        .item-price-mobile {
          display: none;
        }
        .item-price {
          font-weight: 700;
          color: var(--accent-black);
        }

        .summary-breakdown {
          margin: 20px 0;
        }
        .line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
          color: var(--text-gray);
          font-size: 0.95rem;
        }
        .free-shipping-tip {
          background: #e6fffa;
          padding: 8px 12px;
          border-radius: 60px;
          font-size: 0.7rem;
          text-align: center;
          margin: 10px 0 16px;
          color: #0f766e;
        }
        .line.total {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--accent-black);
          border-top: 1px solid var(--border-light);
          padding-top: 16px;
          margin-top: 8px;
        }
        .secure-box, .guarantee-box {
          margin-top: 20px;
          padding: 14px;
          border-radius: 24px;
          text-align: center;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .secure-box {
          background: #f0fdf4;
          color: #15803d;
        }
        .guarantee-box {
          background: #fff7ed;
          color: #b45309;
        }

        @media (max-width: 1024px) {
          .checkout-wrap { gap: 24px; }
          .left-box, .right-box { padding: 26px; }
        }
        @media (max-width: 992px) {
          .checkout-wrap { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .checkout-page { padding: 20px 12px; }
          .left-box, .right-box { padding: 20px; }
          .checkout-header h1 { font-size: 1.5rem; }
          .grid-2 { grid-template-columns: 1fr; gap: 0; }
          .item-row { grid-template-columns: 60px 1fr; gap: 12px; }
          .item-price { display: none; }
          .item-price-mobile { display: block; font-weight: 700; margin-top: 6px; }
          .payment-badge { display: none; }
        }
        @media (max-width: 480px) {
          .checkout-header { flex-direction: column; align-items: flex-start; }
          .back-cart-btn { margin-bottom: 6px; }
          .item-img-wrapper { width: 55px; height: 55px; }
        }
      `}</style>
    </div>
  );
};

export default Checkout;