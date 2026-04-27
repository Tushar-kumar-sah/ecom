// src/pages/Coupons.js
// PREMIUM RESPONSIVE COUPONS PAGE

import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api";

import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaTag,
  FaCopy,
} from "react-icons/fa";

const Coupons = () => {
  const [sidebarOpen,
    setSidebarOpen] =
    useState(
      window.innerWidth >
        768
    );

  const [coupons,
    setCoupons] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [error,
    setError] =
    useState("");

  const [showForm,
    setShowForm] =
    useState(false);

  const [editingId,
    setEditingId] =
    useState(null);

  const [form,
    setForm] =
    useState({
      code: "",
      type: "percent",
      value: "",
      minAmount: "",
      expiry: "",
      active: true,
    });

  const isMobile =
    window.innerWidth <=
    768;

  /* ========================
     FETCH
  ======================== */

  const fetchCoupons =
    async () => {
      try {
        setLoading(true);

        const { data } =
          await API.get(
            "/coupons"
          );

        setCoupons(
          data || []
        );

        setError("");
      } catch {
        setError(
          "Failed to load coupons"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchCoupons();

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

  /* ========================
     FORM
  ======================== */

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
            : name ===
              "code"
            ? value.toUpperCase()
            : value,
      });
    };

  const resetForm =
    () => {
      setForm({
        code: "",
        type: "percent",
        value: "",
        minAmount: "",
        expiry: "",
        active: true,
      });

      setEditingId(
        null
      );

      setShowForm(
        false
      );
    };

  const submitForm =
    async (e) => {
      e.preventDefault();

      try {
        if (
          editingId
        ) {
          await API.put(
            `/coupons/${editingId}`,
            form
          );
        } else {
          await API.post(
            "/coupons",
            form
          );
        }

        resetForm();
        fetchCoupons();
      } catch {
        alert(
          "Save failed"
        );
      }
    };

  const editCoupon =
    (item) => {
      setForm({
        code:
          item.code ||
          "",
        type:
          item.type ||
          "percent",
        value:
          item.value ||
          "",
        minAmount:
          item.minAmount ||
          "",
        expiry:
          item.expiry
            ?.slice(
              0,
              10
            ) || "",
        active:
          item.active ??
          true,
      });

      setEditingId(
        item._id
      );

      setShowForm(
        true
      );
    };

  const deleteCoupon =
    async (id) => {
      const ok =
        window.confirm(
          "Delete coupon?"
        );

      if (!ok) return;

      try {
        await API.delete(
          `/coupons/${id}`
        );

        fetchCoupons();
      } catch {
        alert(
          "Delete failed"
        );
      }
    };

  const copyCode =
    (code) => {
      navigator.clipboard.writeText(
        code
      );

      alert(
        "Coupon copied"
      );
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
          title="Coupons"
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
                Coupons
              </h1>

              <p
                style={
                  sub
                }
              >
                Create
                discount
                offers
              </p>
            </div>

            <button
              style={
                addBtn
              }
              onClick={() =>
                setShowForm(
                  true
                )
              }
            >
              <FaPlus />
              Add
              Coupon
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
              coupons...
            </div>
          ) : (
            <div
              style={
                grid
              }
            >
              {coupons.map(
                (
                  item
                ) => (
                  <div
                    key={
                      item._id
                    }
                    style={
                      card
                    }
                  >
                    <div
                      style={
                        cardTop
                      }
                    >
                      <div
                        style={
                          codeBox
                        }
                      >
                        <FaTag />
                        {
                          item.code
                        }
                      </div>

                      <span
                        style={{
                          ...status,
                          background:
                            item.active
                              ? "#16a34a"
                              : "#dc2626",
                        }}
                      >
                        {item.active
                          ? "Active"
                          : "Off"}
                      </span>
                    </div>

                    <p
                      style={
                        text
                      }
                    >
                      Discount:
                      {" "}
                      <strong>
                        {
                          item.value
                        }
                        {item.type ===
                        "percent"
                          ? "%"
                          : "₹"}
                      </strong>
                    </p>

                    <p
                      style={
                        text
                      }
                    >
                      Min
                      Order:
                      ₹
                      {
                        item.minAmount
                      }
                    </p>

                    <p
                      style={
                        text
                      }
                    >
                      Expiry:
                      {" "}
                      {item.expiry
                        ? new Date(
                            item.expiry
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>

                    <div
                      style={
                        actions
                      }
                    >
                      <button
                        style={
                          copyBtn
                        }
                        onClick={() =>
                          copyCode(
                            item.code
                          )
                        }
                      >
                        <FaCopy />
                      </button>

                      <button
                        style={
                          editBtn
                        }
                        onClick={() =>
                          editCoupon(
                            item
                          )
                        }
                      >
                        <FaEdit />
                      </button>

                      <button
                        style={
                          deleteBtn
                        }
                        onClick={() =>
                          deleteCoupon(
                            item._id
                          )
                        }
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Modal */}
          {showForm && (
            <div
              style={
                modalWrap
              }
            >
              <form
                style={
                  modal
                }
                onSubmit={
                  submitForm
                }
              >
                <h2
                  style={{
                    color:
                      "#fff",
                  }}
                >
                  {editingId
                    ? "Edit Coupon"
                    : "Add Coupon"}
                </h2>

                <input
                  name="code"
                  placeholder="Coupon Code"
                  value={
                    form.code
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    input
                  }
                  required
                />

                <select
                  name="type"
                  value={
                    form.type
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    input
                  }
                >
                  <option value="percent">
                    Percentage
                  </option>

                  <option value="flat">
                    Flat ₹
                  </option>
                </select>

                <input
                  name="value"
                  placeholder="Discount Value"
                  value={
                    form.value
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    input
                  }
                  required
                />

                <input
                  name="minAmount"
                  placeholder="Minimum Order"
                  value={
                    form.minAmount
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    input
                  }
                />

                <input
                  type="date"
                  name="expiry"
                  value={
                    form.expiry
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    input
                  }
                />

                <label
                  style={
                    checkWrap
                  }
                >
                  <input
                    type="checkbox"
                    name="active"
                    checked={
                      form.active
                    }
                    onChange={
                      handleChange
                    }
                  />
                  Active
                </label>

                <div
                  style={
                    modalBtns
                  }
                >
                  <button
                    type="button"
                    style={
                      cancelBtn
                    }
                    onClick={
                      resetForm
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    style={
                      saveBtn
                    }
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ========================
   STYLES
======================== */

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
  flexWrap:
    "wrap",
};

const title = {
  color: "#fff",
  margin: 0,
};

const sub = {
  color:
    "#94a3b8",
};

const addBtn = {
  border: "none",
  padding:
    "12px 18px",
  borderRadius:
    "10px",
  background:
    "#2563eb",
  color: "#fff",
  display:
    "flex",
  gap: "8px",
  cursor:
    "pointer",
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
  display:
    "flex",
  justifyContent:
    "space-between",
  gap: "12px",
  flexWrap:
    "wrap",
};

const codeBox = {
  color: "#fff",
  display:
    "flex",
  gap: "8px",
  alignItems:
    "center",
  fontWeight:
    "700",
};

const status = {
  color: "#fff",
  padding:
    "6px 10px",
  borderRadius:
    "999px",
  fontSize:
    "12px",
};

const text = {
  color:
    "#cbd5e1",
  marginTop:
    "12px",
};

const actions = {
  display:
    "flex",
  gap: "10px",
  marginTop:
    "18px",
};

const copyBtn = {
  flex: 1,
  height: "42px",
  border: "none",
  borderRadius:
    "10px",
  background:
    "#334155",
  color: "#fff",
  cursor:
    "pointer",
};

const editBtn = {
  flex: 1,
  height: "42px",
  border: "none",
  borderRadius:
    "10px",
  background:
    "#2563eb",
  color: "#fff",
  cursor:
    "pointer",
};

const deleteBtn = {
  flex: 1,
  height: "42px",
  border: "none",
  borderRadius:
    "10px",
  background:
    "#dc2626",
  color: "#fff",
  cursor:
    "pointer",
};

const modalWrap = {
  position:
    "fixed",
  inset: 0,
  background:
    "rgba(0,0,0,.65)",
  display:
    "flex",
  justifyContent:
    "center",
  alignItems:
    "center",
  padding:
    "15px",
  zIndex: 999,
};

const modal = {
  width: "100%",
  maxWidth:
    "520px",
  background:
    "#0f172a",
  border:
    "1px solid #1e293b",
  borderRadius:
    "18px",
  padding:
    "24px",
};

const input = {
  width: "100%",
  height: "46px",
  marginTop:
    "12px",
  padding:
    "0 14px",
  borderRadius:
    "10px",
  border:
    "1px solid #1e293b",
  background:
    "#111827",
  color: "#fff",
};

const checkWrap = {
  color: "#fff",
  marginTop:
    "14px",
  display:
    "flex",
  gap: "10px",
};

const modalBtns = {
  display:
    "flex",
  gap: "12px",
  marginTop:
    "18px",
};

const cancelBtn = {
  flex: 1,
  height: "44px",
  border: "none",
  borderRadius:
    "10px",
  background:
    "#334155",
  color: "#fff",
};

const saveBtn = {
  flex: 1,
  height: "44px",
  border: "none",
  borderRadius:
    "10px",
  background:
    "#16a34a",
  color: "#fff",
};

const overlay = {
  position:
    "fixed",
  inset: 0,
  background:
    "rgba(0,0,0,.55)",
  zIndex: 99,
};

export default Coupons;