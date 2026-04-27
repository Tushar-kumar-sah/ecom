// src/components/Sidebar.js
// PREMIUM RESPONSIVE SIDEBAR

import React from "react";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaTag,
  FaCog,
} from "react-icons/fa";

import {
  Link,
  useLocation,
} from "react-router-dom";

const Sidebar = ({
  open,
  setOpen,
}) => {
  const location =
    useLocation();

  const isMobile =
    window.innerWidth <= 768;

  const menu = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/",
    },
    {
      name: "Products",
      icon: <FaBoxOpen />,
      path: "/products",
    },
    {
      name: "Orders",
      icon: <FaShoppingCart />,
      path: "/orders",
    },
    {
      name: "Users",
      icon: <FaUsers />,
      path: "/users",
    },
    {
      name: "Coupons",
      icon: <FaTag />,
      path: "/coupons",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/settings",
    },
  ];

  return (
    <aside
      style={{
        ...sidebar,
        left:
          open ? "0" : "-270px",
      }}
    >
      {/* Top */}
      <div style={top}>
        <h2 style={logo}>
          UK Traders
        </h2>

        {isMobile && (
          <button
            style={
              closeBtn
            }
            onClick={() =>
              setOpen(false)
            }
          >
            ✕
          </button>
        )}
      </div>

      {/* Links */}
      <div>
        {menu.map(
          (
            item,
            index
          ) => {
            const active =
              location.pathname ===
              item.path;

            return (
              <Link
                key={index}
                to={
                  item.path
                }
                style={{
                  ...link,
                  ...(active
                    ? activeLink
                    : {}),
                }}
                onClick={() =>
                  isMobile &&
                  setOpen(
                    false
                  )
                }
              >
                {
                  item.icon
                }
                <span>
                  {
                    item.name
                  }
                </span>
              </Link>
            );
          }
        )}
      </div>
    </aside>
  );
};

const sidebar = {
  width: "260px",
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 100,
  background:
    "linear-gradient(180deg,#0f172a,#020617)",
  borderRight:
    "1px solid #1e293b",
  padding: "20px",
  transition: "0.3s",
  overflowY: "auto",
};

const top = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginBottom: "28px",
};

const logo = {
  color: "#fff",
  margin: 0,
  fontSize: "22px",
};

const closeBtn = {
  border: "none",
  background:
    "#ef4444",
  color: "#fff",
  width: "34px",
  height: "34px",
  borderRadius:
    "8px",
  cursor: "pointer",
};

const link = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding:
    "14px 16px",
  borderRadius:
    "12px",
  color: "#cbd5e1",
  textDecoration:
    "none",
  marginBottom:
    "12px",
  fontWeight: "600",
  transition: "0.3s",
  background:
    "rgba(255,255,255,0.03)",
};

const activeLink = {
  background:
    "linear-gradient(135deg,#2563eb,#1d4ed8)",
  color: "#fff",
};

export default Sidebar;