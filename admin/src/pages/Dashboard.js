// src/pages/Dashboard.js

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import API from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaBars,
  FaSyncAlt,
  FaChartLine,
  FaShoppingBag,
  FaUsers,
  FaBoxOpen,
  FaDollarSign,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartLoading, setChartLoading] = useState(true);

  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar auto close on mobile, auto open on desktop
  useEffect(() => {
    if (isMobile || isTablet) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile, isTablet]);

  // Fetch Stats & Recent Orders
  const fetchDashboard = useCallback(async () => {
    try {
      setError("");
      const [statsRes, ordersRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/recent-orders"),
      ]);

      setStats({
        products: statsRes.data.products || 0,
        users: statsRes.data.users || 0,
        orders: statsRes.data.orders || 0,
        revenue: statsRes.data.revenue || 0,
      });

      setRecentOrders(Array.isArray(ordersRes.data.orders) ? ordersRes.data.orders : []);
    } catch (err) {
      console.error("Dashboard Stats Error:", err);
      setError("Failed to load dashboard data");
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Chart Data (last 7 days)
  const fetchChartData = useCallback(async () => {
    try {
      setChartLoading(true);
      const res = await API.get("/admin/chart-data");
      setChartData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Chart data error:", err);
      // Fallback mock data
      const mock = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        mock.push({
          date,
          revenue: Math.floor(Math.random() * 5000) + 1000,
          orders: Math.floor(Math.random() * 30) + 5,
        });
      }
      setChartData(mock);
    } finally {
      setChartLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchChartData();

    const interval = setInterval(() => {
      fetchDashboard();
      fetchChartData();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchDashboard, fetchChartData]);

  const handleRefresh = () => {
    fetchDashboard();
    fetchChartData();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Admin Navbar Component
  const AdminNavbar = () => (
    <nav style={navbarStyles.navbar}>
      <div style={navbarStyles.navContainer}>
        <div style={navbarStyles.leftSection}>
          <button
            style={navbarStyles.menuButton}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
          <h1 style={navbarStyles.title}>Admin Dashboard</h1>
        </div>
        <div style={navbarStyles.rightSection}>
          <button style={navbarStyles.refreshBtn} onClick={handleRefresh}>
            <FaSyncAlt /> <span>Refresh</span>
          </button>
          <div style={navbarStyles.userMenu}>
            <FaUserCircle style={navbarStyles.userIcon} />
            <button style={navbarStyles.logoutBtn} onClick={handleLogout}>
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div style={pageStyles.page}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      {sidebarOpen && (isMobile || isTablet) && (
        <div style={pageStyles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <div
        style={{
          ...pageStyles.main,
          marginLeft: sidebarOpen && !isMobile && !isTablet ? "260px" : "0",
        }}
      >
        <AdminNavbar />

        <div style={pageStyles.container}>
          <div style={pageStyles.welcomeRow}>
            <div>
              <h1 style={pageStyles.title}>Welcome Back, Admin 👋</h1>
              <p style={pageStyles.subtitle}>Monitor your store in real time</p>
            </div>
          </div>

          {error && <div style={pageStyles.errorBox}>{error}</div>}

          {loading ? (
            <div style={pageStyles.loadingBox}>Loading dashboard...</div>
          ) : (
            <>
              <div style={pageStyles.grid}>
                <StatCard title="Products" value={stats.products} icon={<FaBoxOpen />} />
                <StatCard title="Users" value={stats.users} icon={<FaUsers />} />
                <StatCard title="Orders" value={stats.orders} icon={<FaShoppingBag />} />
                <StatCard title="Revenue" value={formatCurrency(stats.revenue)} icon={<FaDollarSign />} />
              </div>

              <div style={pageStyles.chartCard}>
                <div style={pageStyles.chartHeader}>
                  <h3 style={pageStyles.chartTitle}>
                    <FaChartLine /> Live Sales Overview (Last 7 Days)
                  </h3>
                  {chartLoading && <div style={pageStyles.chartLoader}>Updating...</div>}
                </div>
                <div style={pageStyles.chartWrapper}>
                  <ResponsiveContainer width="100%" height={isMobile ? 240 : 320}>
                    <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={isMobile ? 10 : 12} />
                      <YAxis yAxisId="left" stroke="#94a3b8" fontSize={isMobile ? 10 : 12} tickFormatter={(v) => `₹${v}`} width={isMobile ? 40 : 60} />
                      <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={isMobile ? 10 : 12} width={isMobile ? 30 : 40} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                        formatter={(value, name) => {
                          if (name === "revenue") return [`₹${value}`, "Revenue"];
                          return [value, "Orders"];
                        }}
                      />
                      <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: isMobile ? 10 : 12 }} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: isMobile ? 2 : 3 }}
                        activeDot={{ r: isMobile ? 4 : 6 }}
                        name="Revenue (₹)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: isMobile ? 2 : 3 }}
                        name="Orders"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={pageStyles.bottomGrid}>
                <div style={pageStyles.card}>
                  <h2 style={pageStyles.cardTitle}>🕒 Recent Orders</h2>
                  {recentOrders.length === 0 ? (
                    <p style={pageStyles.text}>No recent orders</p>
                  ) : (
                    <div style={pageStyles.ordersList}>
                      {recentOrders.slice(0, 5).map((order) => (
                        <div key={order._id} style={pageStyles.orderRow}>
                          <div>
                            <span style={pageStyles.orderId}>
                              #{order.orderNumber || order._id.slice(-6)}
                            </span>
                            <span style={pageStyles.orderCustomer}>
                              {order.user?.name || "Guest"}
                            </span>
                          </div>
                          <strong style={pageStyles.orderAmount}>
                            {formatCurrency(order.totalPrice)}
                          </strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={pageStyles.card}>
                  <h2 style={pageStyles.cardTitle}>📊 Store Summary</h2>
                  <div style={pageStyles.summaryItem}>
                    <span>Total Products</span>
                    <strong>{stats.products}</strong>
                  </div>
                  <div style={pageStyles.summaryItem}>
                    <span>Total Users</span>
                    <strong>{stats.users}</strong>
                  </div>
                  <div style={pageStyles.summaryItem}>
                    <span>Total Orders</span>
                    <strong>{stats.orders}</strong>
                  </div>
                  <div style={pageStyles.summaryItem}>
                    <span>Total Revenue</span>
                    <strong>{formatCurrency(stats.revenue)}</strong>
                  </div>
                  <div style={pageStyles.summaryItem}>
                    <span>Avg. Order Value</span>
                    <strong>
                      {formatCurrency(stats.orders ? stats.revenue / stats.orders : 0)}
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
   RESPONSIVE STYLES (All Devices)
========================= */

const pageStyles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#020617",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  main: {
    flex: 1,
    transition: "margin-left 0.3s ease-in-out",
    width: "100%",
    overflowX: "hidden",
  },
  container: {
    padding: "clamp(16px, 4vw, 32px)",
    maxWidth: "1600px",
    margin: "0 auto",
  },
  welcomeRow: {
    marginBottom: "clamp(20px, 5vw, 32px)",
  },
  title: {
    color: "#fff",
    fontSize: "clamp(1.4rem, 6vw, 2.2rem)",
    margin: 0,
    lineHeight: 1.2,
  },
  subtitle: {
    color: "#94a3b8",
    marginTop: "8px",
    fontSize: "clamp(0.85rem, 3vw, 1rem)",
  },
  errorBox: {
    background: "rgba(239,68,68,0.15)",
    color: "#f87171",
    padding: "12px 16px",
    borderRadius: "12px",
    marginBottom: "20px",
    borderLeft: "3px solid #ef4444",
    fontSize: "0.9rem",
  },
  loadingBox: {
    background: "#111827",
    color: "#fff",
    padding: "20px",
    borderRadius: "16px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "clamp(16px, 3vw, 24px)",
    marginBottom: "clamp(24px, 5vw, 32px)",
  },
  chartCard: {
    background: "#0f172a",
    borderRadius: "clamp(16px, 4vw, 24px)",
    padding: "clamp(16px, 3vw, 24px)",
    marginBottom: "clamp(24px, 5vw, 32px)",
    border: "1px solid #1e293b",
  },
  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "20px",
  },
  chartTitle: {
    color: "#fff",
    fontSize: "clamp(1rem, 4vw, 1.25rem)",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: 0,
  },
  chartLoader: {
    fontSize: "0.75rem",
    color: "#94a3b8",
    background: "#1e293b",
    padding: "4px 12px",
    borderRadius: "20px",
  },
  chartWrapper: {
    width: "100%",
    height: "auto",
    minHeight: "240px",
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "clamp(20px, 4vw, 28px)",
  },
  card: {
    background: "#0f172a",
    borderRadius: "clamp(16px, 4vw, 20px)",
    padding: "clamp(16px, 3vw, 24px)",
    border: "1px solid #1e293b",
  },
  cardTitle: {
    color: "#fff",
    fontSize: "clamp(1.1rem, 4vw, 1.3rem)",
    marginBottom: "clamp(16px, 3vw, 20px)",
    fontWeight: "600",
  },
  ordersList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  orderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #1e293b",
    flexWrap: "wrap",
    gap: "8px",
  },
  orderId: {
    color: "#94a3b8",
    fontSize: "0.75rem",
    display: "block",
  },
  orderCustomer: {
    color: "#cbd5e1",
    fontSize: "0.85rem",
    marginLeft: "8px",
  },
  orderAmount: {
    color: "#fff",
    fontSize: "0.95rem",
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #1e293b",
    color: "#cbd5e1",
    fontSize: "0.9rem",
    flexWrap: "wrap",
    gap: "8px",
  },
  text: {
    color: "#94a3b8",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    zIndex: 99,
    backdropFilter: "blur(2px)",
  },
};

const navbarStyles = {
  navbar: {
    background: "#0f172a",
    borderBottom: "1px solid #1e293b",
    padding: "10px 20px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    maxWidth: "1600px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  menuButton: {
    background: "#1e293b",
    border: "none",
    color: "#fff",
    fontSize: "clamp(1rem, 4vw, 1.2rem)",
    width: "clamp(36px, 8vw, 44px)",
    height: "clamp(36px, 8vw, 44px)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "0.2s",
  },
  title: {
    color: "#fff",
    fontSize: "clamp(1rem, 5vw, 1.4rem)",
    fontWeight: "600",
    margin: 0,
    whiteSpace: "nowrap",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  refreshBtn: {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    border: "none",
    padding: "6px 12px",
    borderRadius: "40px",
    color: "#fff",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.8rem",
    whiteSpace: "nowrap",
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#1e293b",
    padding: "4px 10px 4px 6px",
    borderRadius: "40px",
  },
  userIcon: {
    fontSize: "clamp(1.2rem, 5vw, 1.6rem)",
    color: "#94a3b8",
  },
  logoutBtn: {
    background: "transparent",
    border: "none",
    color: "#f87171",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: "500",
    padding: "4px 8px",
    borderRadius: "30px",
    transition: "0.2s",
  },
};

// Inject global responsive CSS for chart and other elements
const globalResponsiveCSS = `
  @media (max-width: 768px) {
    .recharts-wrapper {
      font-size: 10px;
    }
    .recharts-legend-item-text {
      font-size: 10px;
    }
  }
  @media (max-width: 480px) {
    .recharts-xAxis .recharts-cartesian-axis-tick-value {
      font-size: 8px;
    }
    .recharts-yAxis .recharts-cartesian-axis-tick-value {
      font-size: 8px;
    }
  }
`;

if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.textContent = globalResponsiveCSS;
  document.head.appendChild(styleTag);
}

export default Dashboard;