// src/pages/Dashboard.js
// PREMIUM RESPONSIVE DASHBOARD
// MATCHES NEW SIDEBAR + NAVBAR

import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import API from "../api";

const Dashboard = () => {
  const [sidebarOpen,
    setSidebarOpen] =
    useState(
      window.innerWidth >
        768
    );

  const [loading,
    setLoading] =
    useState(true);

  const [error,
    setError] =
    useState("");

  const [stats,
    setStats] =
    useState({
      products: 0,
      users: 0,
      orders: 0,
      revenue: 0,
    });

  const [recentOrders,
    setRecentOrders] =
    useState([]);

  const isMobile =
    window.innerWidth <=
    768;

  /* =========================
     FETCH DATA
  ========================= */

  const fetchDashboard =
    async () => {
      try {
        setError("");

        const [
          statsRes,
          ordersRes,
        ] =
          await Promise.all(
            [
              API.get(
                "/admin/stats"
              ),
              API.get(
                "/admin/recent-orders"
              ),
            ]
          );

        setStats({
          products:
            statsRes.data
              .products ||
            0,
          users:
            statsRes.data
              .users ||
            0,
          orders:
            statsRes.data
              .orders ||
            0,
          revenue:
            statsRes.data
              .revenue ||
            0,
        });

        setRecentOrders(
          ordersRes.data ||
            []
        );
      } catch {
        setError(
          "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

  /* =========================
     LOAD
  ========================= */

  useEffect(() => {
    fetchDashboard();

    const interval =
      setInterval(
        fetchDashboard,
        5000
      );

    const resize =
      () => {
        if (
          window.innerWidth <=
          768
        ) {
          setSidebarOpen(
            false
          );
        } else {
          setSidebarOpen(
            true
          );
        }
      };

    window.addEventListener(
      "resize",
      resize
    );

    return () => {
      clearInterval(
        interval
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, []);

  return (
    <div style={page}>
      {/* Sidebar */}
      <Sidebar
        open={
          sidebarOpen
        }
        setOpen={
          setSidebarOpen
        }
      />

      {/* Overlay */}
      {sidebarOpen &&
        isMobile && (
          <div
            style={
              overlay
            }
            onClick={() =>
              setSidebarOpen(
                false
              )
            }
          />
        )}

      {/* Main */}
      <div
        style={{
          ...main,
          marginLeft:
            isMobile
              ? "0"
              : "260px",
        }}
      >
        <Navbar
          title="Dashboard"
          toggleSidebar={() =>
            setSidebarOpen(
              !sidebarOpen
            )
          }
        />

        <div
          style={
            container
          }
        >
          {/* Header */}
          <div
            style={header}
          >
            <div>
              <h1
                style={
                  title
                }
              >
                Welcome
                Back,
                Admin 👋
              </h1>

              <p
                style={
                  subtitle
                }
              >
                Monitor
                your store
                in real
                time
              </p>
            </div>

            <button
              style={
                refreshBtn
              }
              onClick={
                fetchDashboard
              }
            >
              Refresh
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              style={
                errorBox
              }
            >
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div
              style={
                loadingBox
              }
            >
              Loading
              Dashboard...
            </div>
          ) : (
            <>
              {/* Stats */}
              <div
                style={
                  grid
                }
              >
                <StatCard
                  title="Products"
                  value={
                    stats.products
                  }
                  type="products"
                />

                <StatCard
                  title="Users"
                  value={
                    stats.users
                  }
                  type="users"
                />

                <StatCard
                  title="Orders"
                  value={
                    stats.orders
                  }
                  type="orders"
                />

                <StatCard
                  title="Revenue"
                  value={`₹${stats.revenue}`}
                  type="revenue"
                />
              </div>

              {/* Bottom */}
              <div
                style={
                  bottomGrid
                }
              >
                {/* Recent Orders */}
                <div
                  style={card}
                >
                  <h2
                    style={
                      cardTitle
                    }
                  >
                    Recent
                    Orders
                  </h2>

                  {recentOrders
                    .length ===
                  0 ? (
                    <p
                      style={
                        text
                      }
                    >
                      No
                      recent
                      orders
                    </p>
                  ) : (
                    recentOrders.map(
                      (
                        item
                      ) => (
                        <div
                          key={
                            item._id
                          }
                          style={
                            orderRow
                          }
                        >
                          <span>
                            {item.name ||
                              "Customer"}
                          </span>

                          <strong>
                            ₹
                            {
                              item.totalPrice
                            }
                          </strong>
                        </div>
                      )
                    )
                  )}
                </div>

                {/* Summary */}
                <div
                  style={card}
                >
                  <h2
                    style={
                      cardTitle
                    }
                  >
                    Store
                    Summary
                  </h2>

                  <div
                    style={row}
                  >
                    <span>
                      Products
                    </span>
                    <strong>
                      {
                        stats.products
                      }
                    </strong>
                  </div>

                  <div
                    style={row}
                  >
                    <span>
                      Users
                    </span>
                    <strong>
                      {
                        stats.users
                      }
                    </strong>
                  </div>

                  <div
                    style={row}
                  >
                    <span>
                      Orders
                    </span>
                    <strong>
                      {
                        stats.orders
                      }
                    </strong>
                  </div>

                  <div
                    style={row}
                  >
                    <span>
                      Revenue
                    </span>
                    <strong>
                      ₹
                      {
                        stats.revenue
                      }
                    </strong>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================
   STYLES
========================= */

const page = {
  display: "flex",
  minHeight: "100vh",
  background:
    "#020617",
};

const main = {
  flex: 1,
  transition:
    "0.3s",
};

const container = {
  padding: "24px",
};

const header = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems:
    "center",
  flexWrap: "wrap",
  gap: "16px",
  marginBottom:
    "24px",
};

const title = {
  color: "#fff",
  margin: 0,
  fontSize:
    "clamp(26px,4vw,38px)",
};

const subtitle = {
  color: "#94a3b8",
  marginTop: "8px",
};

const refreshBtn = {
  border: "none",
  padding:
    "12px 18px",
  borderRadius:
    "10px",
  background:
    "linear-gradient(135deg,#2563eb,#1d4ed8)",
  color: "#fff",
  fontWeight:
    "700",
  cursor:
    "pointer",
};

const errorBox = {
  background:
    "rgba(239,68,68,.15)",
  color:
    "#ef4444",
  padding:
    "14px",
  borderRadius:
    "12px",
  marginBottom:
    "20px",
};

const loadingBox = {
  background:
    "#111827",
  color: "#fff",
  padding:
    "18px",
  borderRadius:
    "12px",
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(230px,1fr))",
  gap: "18px",
  marginBottom:
    "24px",
};

const bottomGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(340px,1fr))",
  gap: "18px",
};

const card = {
  background:
    "linear-gradient(145deg,#111827,#0f172a)",
  border:
    "1px solid #1e293b",
  borderRadius:
    "18px",
  padding:
    "22px",
};

const cardTitle = {
  color: "#fff",
  marginBottom:
    "18px",
};

const row = {
  display: "flex",
  justifyContent:
    "space-between",
  color:
    "#cbd5e1",
  padding:
    "10px 0",
  borderBottom:
    "1px solid rgba(255,255,255,.05)",
};

const orderRow = {
  display: "flex",
  justifyContent:
    "space-between",
  padding:
    "10px 0",
  color:
    "#cbd5e1",
  borderBottom:
    "1px solid rgba(255,255,255,.05)",
};

const text = {
  color:
    "#94a3b8",
};

const overlay = {
  position:
    "fixed",
  inset: 0,
  background:
    "rgba(0,0,0,.55)",
  zIndex: 99,
};

export default Dashboard;