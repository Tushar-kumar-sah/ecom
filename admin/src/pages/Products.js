// src/pages/Products.js
// FINAL FIXED PRODUCTS PAGE
// SMALL BEAUTIFUL PRODUCT CARDS
// FULLY RESPONSIVE

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

const Products = () => {
  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth > 768
  );

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    stock: "",
    description: "",
  });

  const isMobile = window.innerWidth <= 768;

  /* =======================
     FETCH PRODUCTS
  ======================= */

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data } =
        await API.get("/products");

      setProducts(data || []);
      setFiltered(data || []);
    } catch {
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    const resize = () => {
      setSidebarOpen(
        window.innerWidth > 768
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
     SEARCH
  ======================= */

  useEffect(() => {
    const q =
      search.toLowerCase();

    const result =
      products.filter(
        (item) =>
          item.name
            ?.toLowerCase()
            .includes(q) ||
          item.category
            ?.toLowerCase()
            .includes(q)
      );

    setFiltered(result);
  }, [search, products]);

  /* =======================
     FORM
  ======================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      image: "",
      category: "",
      stock: "",
      description: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(
          `/products/${editingId}`,
          form
        );
      } else {
        await API.post(
          "/products",
          form
        );
      }

      resetForm();
      fetchProducts();
    } catch {
      alert("Save failed");
    }
  };

  const editProduct = (item) => {
    setForm({
      name: item.name || "",
      price:
        item.price || "",
      image:
        item.image || "",
      category:
        item.category || "",
      stock:
        item.stock || "",
      description:
        item.description ||
        "",
    });

    setEditingId(item._id);
    setShowForm(true);
  };

  const deleteProduct = async (id) => {
    const ok =
      window.confirm(
        "Delete product?"
      );

    if (!ok) return;

    try {
      await API.delete(
        `/products/${id}`
      );

      fetchProducts();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div style={page}>
      <Sidebar
        open={sidebarOpen}
        setOpen={
          setSidebarOpen
        }
      />

      {sidebarOpen &&
        isMobile && (
          <div
            style={overlay}
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
        <Navbar title="Products" />

        <div style={container}>
          {/* Header */}
          <div style={top}>
            <div>
              <h1 style={title}>
                Products
              </h1>

              <p style={sub}>
                Manage store
                inventory
              </p>
            </div>

            <button
              style={addBtn}
              onClick={() =>
                setShowForm(true)
              }
            >
              <FaPlus />
              Add Product
            </button>
          </div>

          {/* Search */}
          <div style={searchWrap}>
            <FaSearch
              style={searchIcon}
            />

            <input
              style={searchInput}
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />
          </div>

          {/* Products */}
          {loading ? (
            <div style={loadingBox}>
              Loading...
            </div>
          ) : (
            <div style={grid}>
              {filtered.map(
                (item) => (
                  <div
                    key={item._id}
                    style={card}
                  >
                    <img
                      src={
                        item.image ||
                        "https://via.placeholder.com/300"
                      }
                      alt=""
                      style={image}
                    />

                    <h3 style={name}>
                      {item.name}
                    </h3>

                    <p style={price}>
                      ₹{item.price}
                    </p>

                    <p style={meta}>
                      {
                        item.category
                      }
                    </p>

                    <p style={stock}>
                      Stock:{" "}
                      {item.stock}
                    </p>

                    <div
                      style={
                        actions
                      }
                    >
                      <button
                        style={
                          editBtn
                        }
                        onClick={() =>
                          editProduct(
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
                          deleteProduct(
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
                style={modal}
                onSubmit={
                  submitForm
                }
              >
                <div
                  style={
                    modalTop
                  }
                >
                  <h2
                    style={
                      modalTitle
                    }
                  >
                    {editingId
                      ? "Edit Product"
                      : "Add Product"}
                  </h2>

                  <button
                    type="button"
                    style={
                      closeBtn
                    }
                    onClick={
                      resetForm
                    }
                  >
                    <FaTimes />
                  </button>
                </div>

                {[
                  "name",
                  "price",
                  "image",
                  "category",
                  "stock",
                ].map(
                  (
                    field
                  ) => (
                    <input
                      key={
                        field
                      }
                      name={
                        field
                      }
                      placeholder={
                        field
                      }
                      value={
                        form[
                          field
                        ]
                      }
                      onChange={
                        handleChange
                      }
                      style={
                        input
                      }
                    />
                  )
                )}

                <textarea
                  name="description"
                  placeholder="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  style={
                    textarea
                  }
                />

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

/* =======================
STYLES
======================= */

const page = {
  display: "flex",
  minHeight: "100vh",
  background: "#020617",
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
  alignItems: "center",
  flexWrap: "wrap",
  gap: "14px",
};

const title = {
  color: "#fff",
  margin: 0,
};

const sub = {
  color: "#94a3b8",
};

const addBtn = {
  border: "none",
  background: "#2563eb",
  color: "#fff",
  padding: "12px 18px",
  borderRadius: "10px",
  display: "flex",
  gap: "8px",
  cursor: "pointer",
};

const searchWrap = {
  marginTop: "18px",
  position: "relative",
};

const searchIcon = {
  position: "absolute",
  left: "14px",
  top: "15px",
  color: "#64748b",
};

const searchInput = {
  width: "100%",
  height: "48px",
  padding:
    "0 15px 0 42px",
  border:
    "1px solid #1e293b",
  borderRadius: "12px",
  background: "#111827",
  color: "#fff",
};

const loadingBox = {
  marginTop: "20px",
  background: "#111827",
  color: "#fff",
  padding: "18px",
  borderRadius: "12px",
};

const grid = {
  marginTop: "20px",
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fill,minmax(280px,280px))",
  gap: "18px",
  justifyContent:
    "start",
};

const card = {
  width: "280px",
  background:
    "linear-gradient(145deg,#111827,#0f172a)",
  border:
    "1px solid #1e293b",
  borderRadius: "16px",
  padding: "12px",
};

const image = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  borderRadius: "12px",
};

const name = {
  color: "#fff",
  marginTop: "10px",
  fontSize: "17px",
  fontWeight: "700",
};

const price = {
  color: "#38bdf8",
  marginTop: "6px",
  fontWeight: "700",
};

const meta = {
  color: "#cbd5e1",
  marginTop: "4px",
};

const stock = {
  color: "#94a3b8",
  marginTop: "4px",
};

const actions = {
  display: "flex",
  gap: "8px",
  marginTop: "12px",
};

const editBtn = {
  flex: 1,
  height: "38px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "#fff",
};

const deleteBtn = {
  flex: 1,
  height: "38px",
  border: "none",
  borderRadius: "8px",
  background: "#dc2626",
  color: "#fff",
};

const modalWrap = {
  position: "fixed",
  inset: 0,
  background:
    "rgba(0,0,0,.65)",
  display: "flex",
  justifyContent:
    "center",
  alignItems: "center",
  padding: "15px",
};

const modal = {
  width: "100%",
  maxWidth: "520px",
  background: "#0f172a",
  borderRadius: "18px",
  padding: "24px",
};

const modalTop = {
  display: "flex",
  justifyContent:
    "space-between",
};

const modalTitle = {
  color: "#fff",
};

const closeBtn = {
  border: "none",
  background: "#1e293b",
  color: "#fff",
  width: "36px",
  height: "36px",
};

const input = {
  width: "100%",
  height: "46px",
  marginTop: "12px",
  padding: "0 14px",
};

const textarea = {
  width: "100%",
  height: "110px",
  marginTop: "12px",
  padding: "14px",
};

const modalBtns = {
  display: "flex",
  gap: "10px",
  marginTop: "18px",
};

const cancelBtn = {
  flex: 1,
  height: "44px",
};

const saveBtn = {
  flex: 1,
  height: "44px",
  background: "#16a34a",
  color: "#fff",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background:
    "rgba(0,0,0,.55)",
};

export default Products;