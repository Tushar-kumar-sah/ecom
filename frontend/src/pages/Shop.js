// src/pages/Shop.js

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaStar,
  FaShoppingCart,
  FaSyncAlt,
} from "react-icons/fa";

const Shop = () => {
  const API = "http://localhost:5000/api";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("latest");
  const [price, setPrice] = useState(5000);

  const [mobileFilter, setMobileFilter] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileFilter ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/products`);

      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else if (Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exist = cart.find((p) => p._id === item._id);

    if (exist) {
      exist.qty += 1;
    } else {
      cart.push({
        _id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        qty: 1,
        size: "M",
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to Cart");
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("latest");
    setPrice(5000);
  };

  const categories = useMemo(() => {
    const arr = ["All"];

    products.forEach((item) => {
      if (item.category && !arr.includes(item.category)) {
        arr.push(item.category);
      }
    });

    return arr;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let data = [...products];

    data = data.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (category !== "All") {
      data = data.filter((item) => item.category === category);
    }

    data = data.filter((item) => Number(item.price) <= price);

    if (sort === "low") data.sort((a, b) => a.price - b.price);
    if (sort === "high") data.sort((a, b) => b.price - a.price);
    if (sort === "az") data.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") data.sort((a, b) => b.name.localeCompare(a.name));

    return data;
  }, [products, search, category, sort, price]);

  return (
    <div className="shop-page">
      {mobileFilter && (
        <div
          className="overlay"
          onClick={() => setMobileFilter(false)}
        ></div>
      )}

      <section className="shop-hero">
        <div className="hero-inner">
          <h1>Shop Collection</h1>
          <p>Premium fashion designed for every lifestyle.</p>
        </div>
      </section>

      <div className="toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-actions">
          <button
            className="reset-mobile"
            onClick={resetFilters}
          >
            <FaSyncAlt />
          </button>

          <button
            className="filter-btn"
            onClick={() => setMobileFilter(true)}
          >
            <FaFilter /> Filters
          </button>
        </div>
      </div>

      <div className="shop-layout">
        <aside className={`sidebar ${mobileFilter ? "show" : ""}`}>
          <div className="sidebar-top">
            <h3>Filters</h3>

            <button
              className="close-btn"
              onClick={() => setMobileFilter(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat, i) => (
                <option key={i}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="low">Price Low to High</option>
              <option value="high">Price High to Low</option>
              <option value="az">A - Z</option>
              <option value="za">Z - A</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Max Price: ₹{price}</label>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <button
            className="reset-btn"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </aside>

        <main className="products-area">
          <div className="top-result">
            <p>{filteredProducts.length} Products Found</p>
          </div>

          {loading ? (
            <div className="status-box">Loading Products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="status-box">No products found.</div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((item) => (
                <div className="product-card" key={item._id}>
                  <Link to={`/product/${item._id}`} className="img-box">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                    />
                  </Link>

                  <div className="card-body">
                    <h3>{item.name}</h3>

                    <div className="rating">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>

                    <p className="price">₹{item.price}</p>

                    <div className="btn-group">
                      <Link
                        to={`/product/${item._id}`}
                        className="view-btn"
                      >
                        View
                      </Link>

                      <button
                        className="cart-btn"
                        onClick={() => addToCart(item)}
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <style>{`

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
      }

      .shop-page{
        width:100%;
        min-height:100vh;
        background:#f7f7f7;
        font-family:Arial, sans-serif;
        overflow-x:hidden;
      }

      .shop-hero{
        background:linear-gradient(135deg,#111,#2a2a2a,#000);
        color:#fff;
        padding:60px 16px;
      }

      .hero-inner{
        max-width:1400px;
        margin:auto;
        text-align:center;
      }

      .hero-inner h1{
        font-size:clamp(28px,6vw,52px);
        margin-bottom:10px;
      }

      .hero-inner p{
        font-size:clamp(14px,2vw,18px);
        opacity:.9;
      }

      .toolbar{
        max-width:1400px;
        margin:auto;
        padding:18px 16px;
        display:flex;
        gap:14px;
        justify-content:space-between;
        align-items:center;
        flex-wrap:wrap;
      }

      .search-box{
        flex:1;
        min-width:260px;
        display:flex;
        align-items:center;
        gap:10px;
        background:#fff;
        border:1px solid #ddd;
        padding:14px;
        border-radius:12px;
      }

      .search-box input{
        border:none;
        outline:none;
        width:100%;
        font-size:15px;
        background:transparent;
      }

      .toolbar-actions{
        display:flex;
        gap:10px;
      }

      .filter-btn,
      .reset-mobile{
        border:none;
        cursor:pointer;
        border-radius:12px;
        padding:13px 16px;
        font-weight:600;
      }

      .filter-btn{
        background:#111;
        color:#fff;
      }

      .reset-mobile{
        background:#fff;
        border:1px solid #ddd;
      }

      .shop-layout{
        max-width:1400px;
        margin:auto;
        padding:0 16px 30px;
        display:grid;
        grid-template-columns:280px 1fr;
        gap:22px;
      }

      .sidebar{
        background:#fff;
        border-radius:16px;
        padding:20px;
        border:1px solid #ececec;
        height:fit-content;
        position:sticky;
        top:15px;
      }

      .sidebar-top{
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:20px;
      }

      .sidebar-top h3{
        font-size:22px;
      }

      .close-btn{
        display:none;
        border:none;
        background:none;
        font-size:20px;
        cursor:pointer;
      }

      .filter-group{
        margin-bottom:22px;
      }

      .filter-group label{
        display:block;
        margin-bottom:8px;
        font-weight:600;
        font-size:14px;
      }

      .filter-group select,
      .filter-group input{
        width:100%;
      }

      .filter-group select{
        padding:12px;
        border:1px solid #ddd;
        border-radius:10px;
        background:#fff;
      }

      .reset-btn{
        width:100%;
        border:none;
        background:#111;
        color:#fff;
        padding:13px;
        border-radius:12px;
        cursor:pointer;
      }

      .products-area{
        min-width:0;
      }

      .top-result{
        margin-bottom:16px;
        font-weight:700;
        color:#222;
      }

      .status-box{
        background:#fff;
        border-radius:16px;
        padding:40px 20px;
        text-align:center;
        border:1px solid #eee;
      }

      .product-grid{
        display:grid;
        grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
        gap:18px;
      }

      .product-card{
        background:#fff;
        border-radius:16px;
        overflow:hidden;
        border:1px solid #eee;
        transition:.25s ease;
      }

      .product-card:hover{
        transform:translateY(-6px);
        box-shadow:0 12px 28px rgba(0,0,0,.08);
      }

      .img-box{
        display:block;
        width:100%;
        height:250px;
        overflow:hidden;
        background:#f0f0f0;
      }

      .img-box img{
        width:100%;
        height:100%;
        object-fit:cover;
      }

      .card-body{
        padding:15px;
      }

      .card-body h3{
        font-size:16px;
        line-height:1.4;
        min-height:45px;
        margin-bottom:10px;
        color:#111;
      }

      .rating{
        display:flex;
        gap:2px;
        color:#f5b301;
        margin-bottom:10px;
        font-size:14px;
      }

      .price{
        font-size:22px;
        font-weight:700;
        margin-bottom:14px;
      }

      .btn-group{
        display:flex;
        gap:10px;
      }

      .view-btn,
      .cart-btn{
        border:none;
        text-decoration:none;
        text-align:center;
        padding:11px;
        border-radius:12px;
        cursor:pointer;
        font-weight:600;
      }

      .view-btn{
        flex:1;
        background:#111;
        color:#fff;
      }

      .cart-btn{
        width:48px;
        background:#f3f3f3;
      }

      .overlay{
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.45);
        z-index:998;
      }

      @media (max-width: 992px){

        .shop-layout{
          grid-template-columns:1fr;
        }

        .sidebar{
          position:fixed;
          top:0;
          left:-100%;
          width:320px;
          max-width:88%;
          height:100vh;
          overflow-y:auto;
          z-index:999;
          border-radius:0;
          transition:.3s ease;
        }

        .sidebar.show{
          left:0;
        }

        .close-btn{
          display:block;
        }

      }

      @media (max-width: 768px){

        .toolbar{
          flex-direction:column;
          align-items:stretch;
        }

        .search-box{
          min-width:100%;
        }

        .toolbar-actions{
          width:100%;
        }

        .filter-btn,
        .reset-mobile{
          flex:1;
          justify-content:center;
        }

        .product-grid{
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:14px;
        }

        .img-box{
          height:180px;
        }

        .price{
          font-size:18px;
        }

        .btn-group{
          flex-direction:column;
        }

        .cart-btn{
          width:100%;
        }

      }

      @media (max-width: 480px){

        .shop-hero{
          padding:42px 14px;
        }

        .product-grid{
          grid-template-columns:1fr 1fr;
          gap:12px;
        }

        .img-box{
          height:150px;
        }

        .card-body{
          padding:12px;
        }

        .card-body h3{
          font-size:14px;
          min-height:40px;
        }

        .view-btn,
        .cart-btn{
          padding:10px;
          font-size:13px;
        }

      }

      `}</style>
    </div>
  );
};

export default Shop;