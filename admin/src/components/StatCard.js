// src/components/StatCard.js

import React from "react";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaRupeeSign,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const iconMap = {
  products: <FaBoxOpen />,
  orders: <FaShoppingCart />,
  users: <FaUsers />,
  revenue: <FaRupeeSign />,
};

const StatCard = ({
  title = "Title",
  value = "0",
  type = "products",
  change = "+0%",
  positive = true,
}) => {
  return (
    <div style={cardStyle}>
      {/* Top Row */}
      <div style={topRow}>
        <div style={iconWrapper(type)}>
          <span style={iconStyle}>
            {iconMap[type]}
          </span>
        </div>

        <div
          style={{
            ...badgeStyle,
            background: positive
              ? "rgba(34,197,94,0.15)"
              : "rgba(239,68,68,0.15)",
            color: positive ? "#22c55e" : "#ef4444",
          }}
        >
          {positive ? (
            <FaArrowUp size={10} />
          ) : (
            <FaArrowDown size={10} />
          )}
          {change}
        </div>
      </div>

      {/* Middle */}
      <h4 style={titleStyle}>{title}</h4>

      <h2 style={valueStyle}>{value}</h2>

      {/* Bottom */}
      <p style={subText}>
        Compared to last month
      </p>
    </div>
  );
};

/* =========================
   STYLES
========================= */

const cardStyle = {
  background:
    "linear-gradient(145deg,#111827,#0f172a)",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "20px",
  width: "100%",
  minHeight: "170px",
  boxShadow:
    "0 10px 25px rgba(0,0,0,0.18)",
  transition: "0.3s ease",
  cursor: "pointer",
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "18px",
};

const iconWrapper = (type) => ({
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "20px",
  background:
    type === "products"
      ? "rgba(59,130,246,0.15)"
      : type === "orders"
      ? "rgba(168,85,247,0.15)"
      : type === "users"
      ? "rgba(34,197,94,0.15)"
      : "rgba(245,158,11,0.15)",
  color:
    type === "products"
      ? "#3b82f6"
      : type === "orders"
      ? "#a855f7"
      : type === "users"
      ? "#22c55e"
      : "#f59e0b",
});

const iconStyle = {
  display: "flex",
  alignItems: "center",
};

const badgeStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 10px",
  borderRadius: "30px",
  fontSize: "12px",
  fontWeight: "700",
};

const titleStyle = {
  color: "#94a3b8",
  fontSize: "15px",
  marginBottom: "10px",
  fontWeight: "500",
};

const valueStyle = {
  color: "#fff",
  fontSize: "30px",
  fontWeight: "800",
  margin: "0",
};

const subText = {
  marginTop: "10px",
  color: "#64748b",
  fontSize: "13px",
};

export default StatCard;