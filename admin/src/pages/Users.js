// src/pages/Users.js
// PREMIUM RESPONSIVE USERS PAGE

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
  FaUsers,
  FaSyncAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Users = () => {
  const [sidebarOpen,
    setSidebarOpen] =
    useState(
      window.innerWidth >
        768
    );

  const [users,
    setUsers] =
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
     FETCH USERS
  ======================= */

  const fetchUsers =
    async () => {
      try {
        setLoading(true);

        const { data } =
          await API.get(
            "/users"
          );

        setUsers(
          data || []
        );

        setFiltered(
          data || []
        );

        setError("");
      } catch {
        setError(
          "Failed to load users"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchUsers();

    const interval =
      setInterval(
        fetchUsers,
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
      users.filter(
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
            )
      );

    setFiltered(
      result
    );
  }, [search, users]);

  /* =======================
     DELETE USER
  ======================= */

  const deleteUser =
    async (id) => {
      const ok =
        window.confirm(
          "Delete this user?"
        );

      if (!ok) return;

      try {
        await API.delete(
          `/users/${id}`
        );

        fetchUsers();
      } catch {
        alert(
          "Delete failed"
        );
      }
    };

  /* =======================
     HELPERS
  ======================= */

  const getInitial =
    (name) =>
      name
        ? name
            .charAt(0)
            .toUpperCase()
        : "U";

  const formatDate =
    (date) =>
      date
        ? new Date(
            date
          ).toLocaleDateString()
        : "N/A";

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
          title="Users"
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
                Users
              </h1>

              <p
                style={
                  sub
                }
              >
                Manage
                registered
                customers
              </p>
            </div>

            <button
              style={
                refreshBtn
              }
              onClick={
                fetchUsers
              }
            >
              <FaSyncAlt />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div
            style={
              statsCard
            }
          >
            <FaUsers
              size={20}
            />
            <span>
              Total Users:
              <strong>
                {" "}
                {
                  users.length
                }
              </strong>
            </span>
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
              placeholder="Search users..."
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
              users...
            </div>
          ) : filtered.length ===
            0 ? (
            <div
              style={
                emptyBox
              }
            >
              No Users
              Found
            </div>
          ) : (
            <div
              style={
                grid
              }
            >
              {filtered.map(
                (
                  user
                ) => (
                  <div
                    key={
                      user._id
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
                      <div
                        style={
                          avatar
                        }
                      >
                        {getInitial(
                          user.name
                        )}
                      </div>

                      <button
                        style={
                          deleteBtn
                        }
                        onClick={() =>
                          deleteUser(
                            user._id
                          )
                        }
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Name */}
                    <h3
                      style={
                        userName
                      }
                    >
                      {user.name ||
                        "User"}
                    </h3>

                    {/* Email */}
                    <p
                      style={
                        info
                      }
                    >
                      <FaEnvelope />
                      {
                        user.email
                      }
                    </p>

                    {/* Phone */}
                    <p
                      style={
                        info
                      }
                    >
                      <FaPhone />
                      {user.phone ||
                        "N/A"}
                    </p>

                    {/* Date */}
                    <p
                      style={
                        joined
                      }
                    >
                      Joined:
                      {" "}
                      {formatDate(
                        user.createdAt
                      )}
                    </p>
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

const statsCard = {
  marginTop:
    "20px",
  background:
    "#111827",
  color: "#fff",
  padding:
    "14px 18px",
  borderRadius:
    "12px",
  display: "flex",
  alignItems:
    "center",
  gap: "10px",
};

const searchWrap = {
  marginTop:
    "18px",
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
    "30px",
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
    "repeat(auto-fit,minmax(260px,1fr))",
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
  alignItems:
    "center",
};

const avatar = {
  width: "52px",
  height: "52px",
  borderRadius:
    "50%",
  background:
    "#2563eb",
  color: "#fff",
  display:
    "flex",
  alignItems:
    "center",
  justifyContent:
    "center",
  fontWeight:
    "700",
  fontSize:
    "20px",
};

const deleteBtn = {
  border: "none",
  width: "40px",
  height: "40px",
  borderRadius:
    "10px",
  background:
    "#dc2626",
  color: "#fff",
  cursor:
    "pointer",
};

const userName = {
  color: "#fff",
  marginTop:
    "14px",
};

const info = {
  color:
    "#cbd5e1",
  display:
    "flex",
  gap: "8px",
  alignItems:
    "center",
  marginTop:
    "10px",
  wordBreak:
    "break-word",
};

const joined = {
  color:
    "#94a3b8",
  marginTop:
    "14px",
};

const overlay = {
  position:
    "fixed",
  inset: 0,
  background:
    "rgba(0,0,0,.55)",
  zIndex: 99,
};

export default Users;