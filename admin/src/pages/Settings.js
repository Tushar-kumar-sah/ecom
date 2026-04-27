// src/pages/Settings.js
// PREMIUM RESPONSIVE SETTINGS PAGE

import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api";

import {
  FaSave,
  FaStore,
  FaTruck,
  FaCog,
} from "react-icons/fa";

const Settings = () => {
  const [sidebarOpen,
    setSidebarOpen] =
    useState(
      window.innerWidth >
        768
    );

  const [loading,
    setLoading] =
    useState(true);

  const [saving,
    setSaving] =
    useState(false);

  const [message,
    setMessage] =
    useState("");

  const [form,
    setForm] =
    useState({
      storeName:
        "UK Traders",
      email: "",
      phone: "",
      currency:
        "INR",
      shipping:
        "0",
      tax: "0",
      cod: true,
      maintenance:
        false,
    });

  const isMobile =
    window.innerWidth <=
    768;

  /* =======================
     LOAD SETTINGS
  ======================= */

  const fetchSettings =
    async () => {
      try {
        const { data } =
          await API.get(
            "/settings"
          );

        if (data) {
          setForm({
            storeName:
              data.storeName ||
              "UK Traders",
            email:
              data.email ||
              "",
            phone:
              data.phone ||
              "",
            currency:
              data.currency ||
              "INR",
            shipping:
              data.shipping ||
              "0",
            tax:
              data.tax ||
              "0",
            cod:
              data.cod ??
              true,
            maintenance:
              data.maintenance ??
              false,
          });
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchSettings();

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

    return () =>
      window.removeEventListener(
        "resize",
        resize
      );
  }, []);

  /* =======================
     INPUT CHANGE
  ======================= */

  const handleChange =
    (e) => {
      const {
        name,
        value,
        type,
        checked,
      } = e.target;

      setForm({
        ...form,
        [name]:
          type ===
          "checkbox"
            ? checked
            : value,
      });
    };

  /* =======================
     SAVE
  ======================= */

  const saveSettings =
    async (e) => {
      e.preventDefault();

      try {
        setSaving(true);
        setMessage("");

        await API.post(
          "/settings",
          form
        );

        setMessage(
          "Settings saved successfully"
        );
      } catch {
        setMessage(
          "Failed to save settings"
        );
      } finally {
        setSaving(false);
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
          title="Settings"
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
                Settings
              </h1>

              <p
                style={
                  sub
                }
              >
                Manage
                your store
                preferences
              </p>
            </div>
          </div>

          {message && (
            <div
              style={
                infoBox
              }
            >
              {message}
            </div>
          )}

          {loading ? (
            <div
              style={
                loadingBox
              }
            >
              Loading
              settings...
            </div>
          ) : (
            <form
              onSubmit={
                saveSettings
              }
              style={
                grid
              }
            >
              {/* Store */}
              <div
                style={card}
              >
                <h2
                  style={
                    cardTitle
                  }
                >
                  <FaStore />
                  Store
                  Info
                </h2>

                <input
                  style={
                    input
                  }
                  name="storeName"
                  placeholder="Store Name"
                  value={
                    form.storeName
                  }
                  onChange={
                    handleChange
                  }
                />

                <input
                  style={
                    input
                  }
                  name="email"
                  placeholder="Support Email"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                />

                <input
                  style={
                    input
                  }
                  name="phone"
                  placeholder="Phone Number"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              {/* Shipping */}
              <div
                style={card}
              >
                <h2
                  style={
                    cardTitle
                  }
                >
                  <FaTruck />
                  Charges
                </h2>

                <input
                  style={
                    input
                  }
                  name="shipping"
                  placeholder="Shipping Charge"
                  value={
                    form.shipping
                  }
                  onChange={
                    handleChange
                  }
                />

                <input
                  style={
                    input
                  }
                  name="tax"
                  placeholder="Tax %"
                  value={
                    form.tax
                  }
                  onChange={
                    handleChange
                  }
                />

                <select
                  style={
                    input
                  }
                  name="currency"
                  value={
                    form.currency
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option>
                    INR
                  </option>
                  <option>
                    USD
                  </option>
                  <option>
                    EUR
                  </option>
                </select>
              </div>

              {/* Controls */}
              <div
                style={card}
              >
                <h2
                  style={
                    cardTitle
                  }
                >
                  <FaCog />
                  Controls
                </h2>

                <label
                  style={
                    checkRow
                  }
                >
                  <span>
                    Cash On
                    Delivery
                  </span>

                  <input
                    type="checkbox"
                    name="cod"
                    checked={
                      form.cod
                    }
                    onChange={
                      handleChange
                    }
                  />
                </label>

                <label
                  style={
                    checkRow
                  }
                >
                  <span>
                    Maintenance
                    Mode
                  </span>

                  <input
                    type="checkbox"
                    name="maintenance"
                    checked={
                      form.maintenance
                    }
                    onChange={
                      handleChange
                    }
                  />
                </label>
              </div>

              {/* Save */}
              <div
                style={
                  fullWidth
                }
              >
                <button
                  type="submit"
                  style={
                    saveBtn
                  }
                  disabled={
                    saving
                  }
                >
                  <FaSave />
                  {saving
                    ? "Saving..."
                    : "Save Settings"}
                </button>
              </div>
            </form>
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
  marginBottom:
    "20px",
};

const title = {
  color: "#fff",
  margin: 0,
};

const sub = {
  color:
    "#94a3b8",
};

const infoBox = {
  background:
    "#111827",
  color: "#38bdf8",
  padding:
    "14px",
  borderRadius:
    "12px",
  marginBottom:
    "18px",
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
  display:
    "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(280px,1fr))",
  gap: "18px",
};

const card = {
  background:
    "#111827",
  borderRadius:
    "18px",
  padding:
    "20px",
};

const cardTitle = {
  color: "#fff",
  display:
    "flex",
  gap: "10px",
  alignItems:
    "center",
  marginBottom:
    "16px",
};

const input = {
  width: "100%",
  height: "46px",
  marginTop:
    "12px",
  padding:
    "0 14px",
  border:
    "1px solid #1e293b",
  borderRadius:
    "10px",
  background:
    "#0f172a",
  color: "#fff",
};

const checkRow = {
  display:
    "flex",
  justifyContent:
    "space-between",
  alignItems:
    "center",
  color: "#fff",
  padding:
    "12px 0",
  borderBottom:
    "1px solid rgba(255,255,255,.05)",
};

const fullWidth = {
  gridColumn:
    "1 / -1",
};

const saveBtn = {
  border: "none",
  width: "100%",
  height: "48px",
  borderRadius:
    "12px",
  background:
    "#16a34a",
  color: "#fff",
  display:
    "flex",
  justifyContent:
    "center",
  alignItems:
    "center",
  gap: "10px",
  fontWeight:
    "700",
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

export default Settings;