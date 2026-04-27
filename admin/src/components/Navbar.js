// src/components/Navbar.js
// PREMIUM RESPONSIVE NAVBAR

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

const Navbar = ({
  title = "Dashboard",
  toggleSidebar,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(
      "adminInfo"
    );
    navigate("/login");
  };

  return (
    <nav style={nav}>
      {/* Left */}
      <div style={left}>
        <button
          style={menuBtn}
          onClick={
            toggleSidebar
          }
        >
          <FaBars />
        </button>

        <h1 style={titleStyle}>
          {title}
        </h1>
      </div>

      {/* Right */}
      <div style={right}>
        <div style={profile}>
          <FaUserCircle
            size={28}
          />
          <span>Admin</span>
        </div>

        <button
          style={logoutBtn}
          onClick={
            handleLogout
          }
        >
          <FaSignOutAlt />
          <span>
            Logout
          </span>
        </button>
      </div>
    </nav>
  );
};

const nav = {
  width: "100%",
  minHeight: "70px",
  background:
    "rgba(15,23,42,0.95)",
  borderBottom:
    "1px solid #1e293b",
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  padding:
    "14px 22px",
  position: "sticky",
  top: 0,
  zIndex: 90,
  backdropFilter:
    "blur(10px)",
  flexWrap: "wrap",
  gap: "12px",
};

const left = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const menuBtn = {
  border: "none",
  background:
    "#1e293b",
  color: "#fff",
  width: "42px",
  height: "42px",
  borderRadius:
    "10px",
  cursor: "pointer",
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
};

const titleStyle = {
  color: "#fff",
  fontSize:
    "clamp(20px,3vw,28px)",
  margin: 0,
  fontWeight: "800",
};

const right = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap",
};

const profile = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#cbd5e1",
  fontWeight: "600",
};

const logoutBtn = {
  border: "none",
  background:
    "#ef4444",
  color: "#fff",
  padding:
    "10px 14px",
  borderRadius:
    "10px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  fontWeight: "700",
};

export default Navbar;