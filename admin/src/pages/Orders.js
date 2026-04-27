// src/pages/Orders.js
// PREMIUM RESPONSIVE ORDERS PAGE

import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api";

import {
  FaSearch,
  FaTrash,
  FaSyncAlt,
  FaBoxOpen,
} from "react-icons/fa";

const Orders = () => {
  const [sidebarOpen,
    setSidebarOpen] =
    useState(
      window.innerWidth >
        768
    );

  const [orders,
    setOrders] =
    useState([]);

  const [filtered,
    setFiltered] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [error,
    setError] =
    useState("");

  const [search,
    setSearch] =
    useState("");

  const isMobile =
    window.innerWidth <=
    768;

  /* =======================
     FETCH
  ======================= */

  const fetchOrders =
    async () => {
      try {
        setLoading(true);

        const { data } =
          await API.get(
            "/orders"
          );

        setOrders(
          data || []
        );

        setFiltered(
          data || []
        );

        setError("");
      } catch {
        setError(
          "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchOrders();

    const interval =
      setInterval(
        fetchOrders,
        5000
      );

    const resize =
      () => {
        setSidebarOpen(
          window
            .innerWidth >
            768
        );
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

  /* =======================
     SEARCH
  ======================= */

  useEffect(() => {
    const q =
      search.toLowerCase();

    const result =
      orders.filter(
        (item) =>
          item.name
            ?.toLowerCase()
            .includes(
              q
            ) ||
          item.email
            ?.toLowerCase()
            .includes(
              q
            ) ||
          item.phone
            ?.toLowerCase()
            .includes(
              q
            ) ||
          item._id
            ?.toLowerCase()
            .includes(
              q
            )
      );

    setFiltered(
      result
    );
  }, [search, orders]);

  /* =======================
     DELETE
  ======================= */

  const deleteOrder =
    async (id) => {
      const ok =
        window.confirm(
          "Delete this order?"
        );

      if (!ok) return;

      try {
        await API.delete(
          `/orders/${id}`
        );

        fetchOrders();
      } catch {
        alert(
          "Delete failed"
        );
      }
    };

  /* =======================
     STATUS UPDATE
  ======================= */

  const updateStatus =
    async (
      id,
      status
    ) => {
      try {
        await API.put(
          `/orders/${id}`,
          {
            orderStatus:
              status,
          }
        );

        fetchOrders();
      } catch {
        alert(
          "Status update failed"
        );
      }
    };

  const badgeColor =
    (status) => {
      switch (
        status
      ) {
        case "Delivered":
          return "#16a34a";

        case "Shipped":
          return "#2563eb";

        case "Packed":
          return "#f59e0b";

        case "Cancelled":
          return "#dc2626";

        default:
          return "#64748b";
      }
    };

  return (
    <div style={page}>
      <Sidebar
        open={
          sidebarOpen
        }
        setOpen={
          setSidebarOpen
        }
      />

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
          title="Orders"
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
            style={top}
          >
            <div>
              <h1
                style={
                  title
                }
              >
                Orders
              </h1>

              <p
                style={
                  sub
                }
              >
                Manage
                customer
                orders
              </p>
            </div>

            <button
              style={
                refreshBtn
              }
              onClick={
                fetchOrders
              }
            >
              <FaSyncAlt />
              Refresh
            </button>
          </div>

          {/* Search */}
          <div
            style={
              searchWrap
            }
          >
            <FaSearch
              style={
                searchIcon
              }
            />

            <input
              style={
                searchInput
              }
              placeholder="Search orders..."
              value={
                search
              }
              onChange={(
                e
              ) =>
                setSearch(
                  e
                    .target
                    .value
                )
              }
            />
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
              orders...
            </div>
          ) : filtered.length ===
            0 ? (
            <div
              style={
                emptyBox
              }
            >
              <FaBoxOpen
                size={28}
              />

              <p>
                No
                Orders
                Found
              </p>
            </div>
          ) : (
            <div
              style={
                grid
              }
            >
              {filtered.map(
                (
                  order
                ) => (
                  <div
                    key={
                      order._id
                    }
                    style={
                      card
                    }
                  >
                    {/* Top */}
                    <div
                      style={
                        cardTop
                      }
                    >
                      <div>
                        <h3
                          style={
                            customer
                          }
                        >
                          {order.name ||
                            "Customer"}
                        </h3>

                        <p
                          style={
                            light
                          }
                        >
                          {
                            order.email
                          }
                        </p>

                        <p
                          style={
                            light
                          }
                        >
                          {
                            order.phone
                          }
                        </p>
                      </div>

                      <span
                        style={{
                          ...badge,
                          background:
                            badgeColor(
                              order.orderStatus
                            ),
                        }}
                      >
                        {order.orderStatus ||
                          "Pending"}
                      </span>
                    </div>

                    {/* Address */}
                    <div
                      style={
                        section
                      }
                    >
                      <strong>
                        Address:
                      </strong>{" "}
                      {
                        order.address
                      }
                      ,{" "}
                      {
                        order.city
                      }{" "}
                      -{" "}
                      {
                        order.pincode
                      }
                    </div>

                    {/* Items */}
                    <div
                      style={
                        section
                      }
                    >
                      <strong>
                        Items:
                      </strong>

                      {order.items?.map(
                        (
                          item,
                          i
                        ) => (
                          <div
                            key={
                              i
                            }
                            style={
                              row
                            }
                          >
                            <span>
                              {
                                item.name
                              }{" "}
                              ×{" "}
                              {
                                item.qty
                              }
                            </span>

                            <span>
                              ₹
                              {
                                item.price
                              }
                            </span>
                          </div>
                        )
                      )}
                    </div>

                    {/* Payment */}
                    <div
                      style={
                        section
                      }
                    >
                      <strong>
                        Payment:
                      </strong>{" "}
                      {
                        order.paymentMethod
                      }{" "}
                      (
                      {
                        order.paymentStatus
                      }
                      )
                    </div>

                    {/* Total */}
                    <div
                      style={
                        total
                      }
                    >
                      Total:
                      ₹
                      {
                        order.totalPrice
                      }
                    </div>

                    {/* Actions */}
                    <div
                      style={
                        actionRow
                      }
                    >
                      <select
                        style={
                          select
                        }
                        value={
                          order.orderStatus ||
                          "Pending"
                        }
                        onChange={(
                          e
                        ) =>
                          updateStatus(
                            order._id,
                            e
                              .target
                              .value
                          )
                        }
                      >
                        <option>
                          Pending
                        </option>
                        <option>
                          Packed
                        </option>
                        <option>
                          Shipped
                        </option>
                        <option>
                          Delivered
                        </option>
                        <option>
                          Cancelled
                        </option>
                      </select>

                      <button
                        style={
                          deleteBtn
                        }
                        onClick={() =>
                          deleteOrder(
                            order._id
                          )
                        }
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =======================
   STYLES
======================= */

const page = {
  display: "flex",
  minHeight: "100vh",
  background:
    "#020617",
};

const main = {
  flex: 1,
};

const container = {
  padding: "24px",
};

const top = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems:
    "center",
  gap: "15px",
  flexWrap: "wrap",
};

const title = {
  color: "#fff",
  margin: 0,
};

const sub = {
  color:
    "#94a3b8",
};

const refreshBtn = {
  border: "none",
  padding:
    "12px 18px",
  borderRadius:
    "10px",
  background:
    "#2563eb",
  color: "#fff",
  display: "flex",
  gap: "8px",
  cursor:
    "pointer",
};

const searchWrap = {
  marginTop:
    "20px",
  position:
    "relative",
};

const searchIcon = {
  position:
    "absolute",
  left: "14px",
  top: "15px",
  color:
    "#64748b",
};

const searchInput = {
  width: "100%",
  height: "48px",
  padding:
    "0 15px 0 42px",
  border:
    "1px solid #1e293b",
  borderRadius:
    "12px",
  background:
    "#111827",
  color: "#fff",
};

const errorBox = {
  marginTop:
    "15px",
  background:
    "rgba(239,68,68,.15)",
  color:
    "#ef4444",
  padding:
    "12px",
  borderRadius:
    "10px",
};

const loadingBox = {
  marginTop:
    "20px",
  background:
    "#111827",
  color: "#fff",
  padding:
    "18px",
  borderRadius:
    "12px",
};

const emptyBox = {
  marginTop:
    "20px",
  background:
    "#111827",
  color:
    "#94a3b8",
  padding:
    "40px",
  borderRadius:
    "18px",
  textAlign:
    "center",
};

const grid = {
  marginTop:
    "20px",
  display:
    "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(340px,1fr))",
  gap: "18px",
};

const card = {
  background:
    "#111827",
  borderRadius:
    "18px",
  padding:
    "18px",
};

const cardTop = {
  display: "flex",
  justifyContent:
    "space-between",
  gap: "12px",
  flexWrap:
    "wrap",
};

const customer = {
  color: "#fff",
};

const light = {
  color:
    "#94a3b8",
  margin:
    "4px 0",
};

const badge = {
  color: "#fff",
  padding:
    "8px 12px",
  borderRadius:
    "999px",
  fontSize:
    "13px",
};

const section = {
  marginTop:
    "14px",
  color:
    "#e2e8f0",
};

const row = {
  display: "flex",
  justifyContent:
    "space-between",
  marginTop:
    "8px",
};

const total = {
  marginTop:
    "16px",
  color: "#38bdf8",
  fontWeight:
    "700",
};

const actionRow = {
  display: "flex",
  gap: "10px",
  flexWrap:
    "wrap",
  marginTop:
    "18px",
};

const select = {
  flex: 1,
  minWidth:
    "150px",
  height: "44px",
  borderRadius:
    "10px",
  border: "none",
  background:
    "#1f2937",
  color: "#fff",
  padding:
    "0 10px",
};

const deleteBtn = {
  height: "44px",
  border: "none",
  padding:
    "0 16px",
  borderRadius:
    "10px",
  background:
    "#dc2626",
  color: "#fff",
  display: "flex",
  gap: "8px",
  alignItems:
    "center",
  cursor:
    "pointer",
};

const overlay = {
  position:
    "fixed",
  inset: 0,
  background:
    "rgba(0,0,0,.55)",
  zIndex: 99,
};

export default Orders;