// src/pages/Profile.js

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTimes,
  FaSignOutAlt,
  FaSpinner,
  FaShoppingBag,
  FaExclamationTriangle,
} from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const API = "http://localhost:5000/api";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  // Store original user data for cancel functionality
  const [originalUser, setOriginalUser] = useState(null);

  const [user, setUser] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user")) || null;

    if (!savedUser) {
      navigate("/login");
      return;
    }

    setUser(savedUser);
    setOriginalUser(savedUser);
    fetchOrders(savedUser.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchOrders = async (email) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API}/orders`, {
        timeout: 10000,
      });

      const allOrders = Array.isArray(res.data) ? res.data : [];

      const myOrders = allOrders.filter(
        (item) => item.email?.toLowerCase() === email?.toLowerCase()
      );

      // Sort orders by date (newest first)
      myOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrders(myOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load your orders. Please try again later.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    // Basic validation
    if (!user.name.trim()) {
      alert("Name is required");
      return;
    }
    if (!user.email.trim() || !user.email.includes("@")) {
      alert("Valid email is required");
      return;
    }

    try {
      setSaving(true);
      setUpdateMessage("");

      await axios.put(`${API}/users/${user._id}`, user, {
        timeout: 10000,
      });

      localStorage.setItem("user", JSON.stringify(user));

      // Refresh orders with updated email (in case email changed)
      await fetchOrders(user.email);

      setEditMode(false);
      setUpdateMessage("Profile updated successfully!");
      setTimeout(() => setUpdateMessage(""), 3000);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    // Revert to original user data
    if (originalUser) {
      setUser(originalUser);
    }
    setEditMode(false);
    setError("");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const statusIcon = (status) => {
    if (status === "Delivered")
      return <FaCheckCircle className="status-icon delivered" />;
    if (status === "Shipped")
      return <FaTruck className="status-icon shipped" />;
    return <FaClock className="status-icon pending" />;
  };

  const getStatusText = (status) => {
    if (!status) return "Placed";
    return status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date unavailable";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-wrap">
        {/* Left Panel - User Info */}
        <div className="left-box">
          <div className="avatar">
            <FaUser />
          </div>

          {editMode ? (
            <input
              className="edit-input"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Full Name"
              disabled={saving}
            />
          ) : (
            <h2>{user.name}</h2>
          )}

          <div className="info-row">
            <FaEnvelope className="info-icon" />
            {editMode ? (
              <input
                className="edit-input"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Email"
                type="email"
                disabled={saving}
              />
            ) : (
              <span>{user.email}</span>
            )}
          </div>

          <div className="info-row">
            <FaPhone className="info-icon" />
            {editMode ? (
              <input
                className="edit-input"
                value={user.phone || ""}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                placeholder="Phone Number"
                disabled={saving}
              />
            ) : (
              <span>{user.phone || "Not Added"}</span>
            )}
          </div>

          <div className="info-row address-row">
            <FaMapMarkerAlt className="info-icon" />
            {editMode ? (
              <textarea
                className="edit-input address-textarea"
                rows="3"
                value={user.address || ""}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                placeholder="Your full address"
                disabled={saving}
              />
            ) : (
              <span className="address-text">
                {user.address || "No address added"}
              </span>
            )}
          </div>

          {editMode ? (
            <div className="edit-actions">
              <button
                className="edit-btn save-btn"
                onClick={saveProfile}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <FaSpinner className="spinner" /> Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Profile
                  </>
                )}
              </button>
              <button
                className="edit-btn cancel-btn"
                onClick={cancelEdit}
                disabled={saving}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          ) : (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              <FaEdit /> Edit Profile
            </button>
          )}

          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Right Panel - Orders */}
        <div className="right-box">
          <div className="top-head">
            <div className="head-left">
              <button className="back-btn" onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back
              </button>
              <h1>My Orders</h1>
            </div>
            <span className="order-count">
              <FaShoppingBag /> {orders.length} Orders
            </span>
          </div>

          {updateMessage && <div className="success-message">{updateMessage}</div>}

          {loading ? (
            <div className="status-box loading-state">
              <FaSpinner className="spinner" />
              <p>Loading your orders...</p>
            </div>
          ) : error ? (
            <div className="status-box error-state">
              <FaExclamationTriangle />
              <p>{error}</p>
              <button onClick={() => fetchOrders(user.email)} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="status-box empty-state">
              <FaShoppingBag />
              <p>No orders found</p>
              <button onClick={() => navigate("/shop")} className="shop-now-btn">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order, index) => (
                <div className="order-card" key={order._id || index}>
                  <div className="order-top">
                    <div>
                      <h3>Order #{order.orderNumber || order._id?.slice(-8)}</h3>
                      <p className="order-date">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="status-tag">
                      {statusIcon(order.orderStatus)}
                      <span>{getStatusText(order.orderStatus)}</span>
                    </div>
                  </div>

                  <div className="mini-items">
                    {(order.items || []).map((item, i) => (
                      <div className="mini-row" key={i}>
                        <img
                          src={item.image || "/api/placeholder/60/60"}
                          alt={item.name || "Product"}
                          onError={(e) => {
                            e.target.src = "/api/placeholder/60/60";
                          }}
                        />
                        <div className="item-details">
                          <h4>{item.name || "Product"}</h4>
                          <p>
                            {item.size && `${item.size} • `}Qty: {item.qty || 1}
                          </p>
                          {item.price && <span>₹{item.price}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-bottom">
                    <div className="items-count">
                      <FaBoxOpen />
                      <span>{order.items?.length || 0} Items</span>
                    </div>
                    <h2 className="total-price">₹{order.totalPrice?.toFixed(2) || "0.00"}</h2>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .profile-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
          padding: 40px 24px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .profile-wrap {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 28px;
        }

        /* Left & Right Boxes */
        .left-box,
        .right-box {
          background: #ffffff;
          border-radius: 28px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .left-box {
          padding: 32px 28px;
          position: sticky;
          top: 20px;
          height: fit-content;
        }

        .right-box {
          padding: 28px 32px;
        }

        /* Avatar */
        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2c3e50, #1a1a2e);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 42px;
          margin-bottom: 24px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .left-box h2 {
          font-size: 1.8rem;
          margin-bottom: 28px;
          color: #1a1a2e;
          word-break: break-word;
        }

        /* Info Rows */
        .info-row {
          display: flex;
          gap: 14px;
          margin-bottom: 20px;
          align-items: flex-start;
        }

        .info-icon {
          flex-shrink: 0;
          margin-top: 4px;
          color: #4a5568;
          font-size: 1.2rem;
        }

        .info-row span {
          color: #2d3748;
          line-height: 1.5;
          word-break: break-word;
          flex: 1;
        }

        .address-text {
          white-space: pre-wrap;
        }

        /* Edit Inputs */
        .edit-input {
          width: 100%;
          padding: 12px 14px;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          font-size: 0.95rem;
          transition: all 0.2s;
          background: #fafbfc;
          font-family: inherit;
        }

        .edit-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
          background: white;
        }

        .edit-input:disabled {
          background: #f1f5f9;
          cursor: not-allowed;
        }

        .address-textarea {
          resize: vertical;
          min-height: 80px;
        }

        /* Button Styles */
        .edit-btn,
        .logout-btn,
        .back-btn,
        .retry-btn,
        .shop-now-btn {
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 0.95rem;
        }

        .edit-btn {
          background: #1e293b;
          color: white;
          padding: 12px 16px;
          border-radius: 14px;
          width: 100%;
          margin-top: 16px;
        }

        .edit-btn:hover:not(:disabled) {
          background: #0f172a;
          transform: translateY(-2px);
        }

        .edit-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .save-btn {
          background: #10b981;
          margin-top: 0;
        }

        .save-btn:hover:not(:disabled) {
          background: #059669;
        }

        .cancel-btn {
          background: #ef4444;
          margin-top: 0;
        }

        .cancel-btn:hover:not(:disabled) {
          background: #dc2626;
        }

        .logout-btn {
          background: transparent;
          color: #64748b;
          border: 1.5px solid #e2e8f0;
          padding: 10px 16px;
          border-radius: 14px;
          width: 100%;
          margin-top: 20px;
        }

        .logout-btn:hover {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }

        .back-btn {
          background: #f1f5f9;
          color: #334155;
          padding: 10px 18px;
          border-radius: 40px;
        }

        .back-btn:hover {
          background: #e2e8f0;
        }

        .retry-btn,
        .shop-now-btn {
          background: #4f46e5;
          color: white;
          padding: 10px 24px;
          border-radius: 40px;
          margin-top: 16px;
        }

        .retry-btn:hover,
        .shop-now-btn:hover {
          background: #4338ca;
        }

        /* Top Head */
        .top-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f1f5f9;
        }

        .head-left {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }

        .head-left h1 {
          font-size: 1.8rem;
          color: #0f172a;
        }

        .order-count {
          background: #f1f5f9;
          padding: 8px 16px;
          border-radius: 40px;
          font-weight: 600;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Success Message */
        .success-message {
          background: #d1fae5;
          color: #065f46;
          padding: 12px 16px;
          border-radius: 14px;
          margin-bottom: 20px;
          font-weight: 500;
          text-align: center;
        }

        /* Status Boxes */
        .status-box {
          background: #f8fafc;
          border-radius: 24px;
          padding: 60px 24px;
          text-align: center;
          color: #475569;
        }

        .loading-state,
        .error-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .spinner {
          animation: spin 1s linear infinite;
          font-size: 2rem;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Orders List */
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-height: 70vh;
          overflow-y: auto;
          padding-right: 8px;
        }

        .orders-list::-webkit-scrollbar {
          width: 6px;
        }

        .orders-list::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .orders-list::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        /* Order Card */
        .order-card {
          border: 1px solid #eef2ff;
          border-radius: 24px;
          padding: 20px;
          background: white;
          transition: all 0.2s;
        }

        .order-card:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .order-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .order-top h3 {
          font-size: 1.1rem;
          color: #1e293b;
        }

        .order-date {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 6px;
        }

        .status-tag {
          background: #f8fafc;
          padding: 8px 16px;
          border-radius: 40px;
          display: flex;
          gap: 8px;
          align-items: center;
          font-weight: 500;
          font-size: 0.85rem;
        }

        .status-icon {
          font-size: 1rem;
        }

        .status-icon.delivered {
          color: #10b981;
        }
        .status-icon.shipped {
          color: #3b82f6;
        }
        .status-icon.pending {
          color: #f59e0b;
        }

        /* Mini Items */
        .mini-items {
          margin-bottom: 16px;
        }

        .mini-row {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 14px;
          margin-bottom: 16px;
          align-items: center;
        }

        .mini-row img {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 14px;
          background: #f1f5f9;
        }

        .item-details h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .item-details p {
          font-size: 0.8rem;
          color: #475569;
        }

        .item-details span {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
          display: inline-block;
          margin-top: 4px;
        }

        /* Order Footer */
        .order-bottom {
          border-top: 1px solid #eef2ff;
          padding-top: 16px;
          margin-top: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .items-count {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          font-size: 0.9rem;
        }

        .total-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
        }

        /* ========== RESPONSIVE BREAKPOINTS ========== */
        @media (max-width: 1024px) {
          .profile-wrap {
            grid-template-columns: 320px 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 900px) {
          .profile-page {
            padding: 24px 16px;
          }

          .profile-wrap {
            grid-template-columns: 1fr;
          }

          .left-box {
            position: static;
            text-align: center;
          }

          .avatar {
            margin-left: auto;
            margin-right: auto;
          }

          .info-row {
            text-align: left;
          }

          .order-count {
            margin-left: auto;
          }
        }

        @media (max-width: 640px) {
          .right-box {
            padding: 20px;
          }

          .left-box {
            padding: 24px 20px;
          }

          .head-left {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }

          .back-btn {
            justify-content: center;
          }

          .top-head {
            flex-direction: column;
            align-items: stretch;
          }

          .order-count {
            align-self: flex-start;
          }

          .mini-row {
            grid-template-columns: 56px 1fr;
            gap: 12px;
          }

          .mini-row img {
            width: 56px;
            height: 56px;
          }

          .order-card {
            padding: 16px;
          }

          .total-price {
            font-size: 1.3rem;
          }

          .edit-actions {
            flex-direction: column;
          }

          .status-tag {
            padding: 6px 12px;
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .profile-page {
            padding: 16px 12px;
          }

          .head-left h1 {
            font-size: 1.4rem;
          }

          .avatar {
            width: 80px;
            height: 80px;
            font-size: 34px;
          }

          .left-box h2 {
            font-size: 1.4rem;
          }

          .order-bottom {
            flex-direction: column;
            align-items: flex-start;
          }

          .orders-list {
            max-height: 60vh;
          }
        }

        /* Touch-friendly improvements */
        @media (hover: none) and (pointer: coarse) {
          .edit-btn,
          .logout-btn,
          .back-btn,
          .order-card {
            cursor: default;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;