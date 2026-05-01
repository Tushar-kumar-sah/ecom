// src/pages/Shop.js
// UPDATED: Responsive Banner + Professional UI + Refined Filters + Clean CSS

import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaStar,
  FaShoppingCart,
  FaSyncAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTag,
  FaFire,
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
  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerTimer = useRef(null);

  const banners = [
    {
      label: "New Season",
      title: "Summer\nEditorial",
      sub: "Oversized silhouettes & luxury fits curated for the bold.",
      cta: "Explore Now",
      img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1800&q=80",
      accent: "#e8c97e",
      align: "left",
    },
    {
      label: "Limited Time",
      title: "Flat 50%\nOFF",
      sub: "Weekend flash sale on premium streetwear. Don't miss it.",
      cta: "Shop the Sale",
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=80",
      accent: "#f28b6e",
      align: "center",
    },
    {
      label: "Just Dropped",
      title: "Fresh\nArrivals",
      sub: "New styles added every week. Stay ahead of the curve.",
      cta: "View Latest",
      img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1800&q=80",
      accent: "#8ecbe8",
      align: "left",
    },
  ];

  useEffect(() => {
    fetchProducts();
    startBannerTimer();
    return () => clearInterval(bannerTimer.current);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileFilter ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileFilter]);

  const startBannerTimer = () => {
    bannerTimer.current = setInterval(() => {
      setCurrentBanner((p) => (p + 1) % banners.length);
    }, 5000);
  };

  const changeBanner = (idx) => {
    clearInterval(bannerTimer.current);
    setCurrentBanner(idx);
    startBannerTimer();
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/products`);
      if (Array.isArray(res.data)) setProducts(res.data);
      else if (Array.isArray(res.data?.products)) setProducts(res.data.products);
      else setProducts([]);
    } catch (e) {
      console.log(e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exist = cart.find((p) => p._id === item._id);
    if (exist) exist.qty += 1;
    else cart.push({ _id: item._id, name: item.name, price: item.price, image: item.image, qty: 1, size: "M" });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to Cart");
  };

  const resetFilters = () => {
    setSearch(""); setCategory("All"); setSort("latest"); setPrice(5000);
  };

  const categories = useMemo(() => {
    const arr = ["All"];
    products.forEach((item) => {
      if (item.category && !arr.includes(item.category)) arr.push(item.category);
    });
    return arr;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let data = [...products];
    data = data.filter((item) => item.name?.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") data = data.filter((item) => item.category === category);
    data = data.filter((item) => Number(item.price) <= price);
    if (sort === "low") data.sort((a, b) => a.price - b.price);
    if (sort === "high") data.sort((a, b) => b.price - a.price);
    if (sort === "az") data.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") data.sort((a, b) => b.name.localeCompare(a.name));
    return data;
  }, [products, search, category, sort, price]);

  const active = banners[currentBanner];

  return (
    <div className="shop-page">

      {/* ── OVERLAY ── */}
      {mobileFilter && (
        <div className="overlay" onClick={() => setMobileFilter(false)} />
      )}

      {/* ── BANNER ── */}
      <section className="shop-banner">
        {banners.map((b, i) => (
          <div
            key={i}
            className={`banner-slide ${i === currentBanner ? "active" : ""}`}
            style={{ backgroundImage: `url(${b.img})` }}
          >
            <div className="banner-scrim" />
            <div className={`banner-content align-${b.align}`}>
              <span className="banner-label" style={{ background: b.accent, color: "#111" }}>
                {b.label}
              </span>
              <h1 className="banner-title">
                {b.title.split("\n").map((line, j) => (
                  <span key={j}>{line}<br /></span>
                ))}
              </h1>
              <p className="banner-sub">{b.sub}</p>
              <button className="banner-cta">{b.cta}</button>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <button className="b-arrow b-prev" onClick={() => changeBanner((currentBanner - 1 + banners.length) % banners.length)} aria-label="Prev">
          <FaChevronLeft />
        </button>
        <button className="b-arrow b-next" onClick={() => changeBanner((currentBanner + 1) % banners.length)} aria-label="Next">
          <FaChevronRight />
        </button>

        {/* Dots */}
        <div className="b-dots">
          {banners.map((_, i) => (
            <button
              key={i}
              className={`b-dot ${i === currentBanner ? "active" : ""}`}
              onClick={() => changeBanner(i)}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>

        {/* Progress */}
        <div className="b-progress">
          <div className="b-progress-fill" key={currentBanner} />
        </div>

        {/* Stats strip */}
        <div className="banner-stats">
          <div className="b-stat">
            <FaFire />
            <span>2,400+ Products</span>
          </div>
          <div className="b-stat-divider" />
          <div className="b-stat">
            <FaTag />
            <span>Free Shipping Over ₹999</span>
          </div>
          <div className="b-stat-divider" />
          <div className="b-stat">
            <FaStar />
            <span>4.9 Avg. Rating</span>
          </div>
        </div>
      </section>

      {/* ── TOOLBAR ── */}
      <div className="toolbar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch("")}>
              <FaTimes />
            </button>
          )}
        </div>

        <div className="toolbar-right">
          <button className="reset-btn-sm" onClick={resetFilters} title="Reset filters">
            <FaSyncAlt />
          </button>
          <button className="open-filter-btn" onClick={() => setMobileFilter(true)}>
            <FaFilter /> <span>Filters</span>
          </button>
        </div>
      </div>

      {/* ── LAYOUT ── */}
      <div className="shop-layout">

        {/* SIDEBAR */}
        <aside className={`sidebar ${mobileFilter ? "show" : ""}`}>
          <div className="sidebar-head">
            <h3>Filters</h3>
            <button className="sidebar-close" onClick={() => setMobileFilter(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="filter-block">
            <label className="filter-label">
              <span className="label-dot" />
              Category
            </label>
            <div className="cat-pills">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  className={`cat-pill ${category === cat ? "active" : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <label className="filter-label">
              <span className="label-dot" />
              Sort By
            </label>
            <select
              className="filter-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
              <option value="az">Name: A → Z</option>
              <option value="za">Name: Z → A</option>
            </select>
          </div>

          <div className="filter-block">
            <label className="filter-label">
              <span className="label-dot" />
              Max Price
              <span className="price-badge">₹{Number(price).toLocaleString("en-IN")}</span>
            </label>
            <div className="range-wrap">
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="range-input"
              />
              <div className="range-track">
                <div
                  className="range-fill"
                  style={{ width: `${((price - 100) / 4900) * 100}%` }}
                />
              </div>
            </div>
            <div className="range-labels">
              <span>₹100</span>
              <span>₹5,000</span>
            </div>
          </div>

          <button className="reset-all-btn" onClick={resetFilters}>
            <FaSyncAlt /> Reset All Filters
          </button>
        </aside>

        {/* MAIN */}
        <main className="products-area">
          <div className="results-bar">
            <p className="results-count">
              <strong>{filteredProducts.length}</strong> products found
            </p>
          </div>

          {loading ? (
            <div className="product-grid">
              {[...Array(8)].map((_, i) => (
                <div className="skeleton-card" key={i}>
                  <div className="skel-img" />
                  <div className="skel-body">
                    <div className="skel-line s" />
                    <div className="skel-line" />
                    <div className="skel-line m" />
                    <div className="skel-line s" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛍️</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term.</p>
              <button className="reset-all-btn sm" onClick={resetFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((item) => (
                <div className="product-card" key={item._id}>
                  <Link to={`/product/${item._id}`} className="img-box">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      loading="lazy"
                    />
                    <div className="img-hover">
                      <span>Quick View</span>
                    </div>
                  </Link>

                  <div className="card-body">
                    {item.category && (
                      <span className="card-cat">{item.category}</span>
                    )}
                    <h3>{item.name}</h3>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                      <span>(12)</span>
                    </div>
                    <p className="price">₹{Number(item.price).toLocaleString("en-IN")}</p>
                    <div className="btn-group">
                      <Link to={`/product/${item._id}`} className="view-btn">
                        View
                      </Link>
                      <button className="cart-btn" onClick={() => addToCart(item)} aria-label="Add to cart">
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
        *, *::before, *::after {
          margin: 0; padding: 0; box-sizing: border-box;
        }

        .shop-page {
          width: 100%;
          min-height: 100vh;
          background: #f5f5f3;
          font-family: 'Georgia', 'Times New Roman', serif;
          overflow-x: hidden;
          color: #111;
        }

        /* ── BANNER ── */
        .shop-banner {
          position: relative;
          width: 100%;
          height: clamp(320px, 55vw, 560px);
          overflow: hidden;
          background: #111;
        }

        .banner-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transform: scale(1.04);
          transition: opacity .65s ease, transform .65s ease;
        }

        .banner-slide.active {
          opacity: 1;
          transform: scale(1);
          z-index: 1;
        }

        .banner-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            rgba(0,0,0,.75) 0%,
            rgba(0,0,0,.4) 55%,
            rgba(0,0,0,.1) 100%
          );
        }

        .banner-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(24px, 5vw, 72px);
          color: #fff;
          max-width: 680px;
        }

        .banner-content.align-center {
          max-width: 100%;
          align-items: center;
          text-align: center;
          padding: clamp(24px, 5vw, 72px) clamp(24px, 10vw, 140px);
        }

        .banner-label {
          display: inline-block;
          padding: 5px 14px;
          border-radius: 30px;
          font-size: 10px;
          font-family: 'Arial', sans-serif;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 18px;
          width: fit-content;
        }

        .banner-title {
          font-size: clamp(32px, 6vw, 68px);
          font-weight: 400;
          line-height: 1.0;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }

        .banner-sub {
          font-family: 'Arial', sans-serif;
          font-size: clamp(13px, 1.6vw, 17px);
          opacity: .8;
          font-weight: 300;
          margin-bottom: 28px;
          max-width: 460px;
          line-height: 1.7;
        }

        .banner-content.align-center .banner-sub {
          text-align: center;
        }

        .banner-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          color: #111;
          border: none;
          padding: 13px 26px;
          border-radius: 40px;
          font-weight: 700;
          font-family: 'Arial', sans-serif;
          font-size: 13px;
          letter-spacing: .5px;
          cursor: pointer;
          width: fit-content;
          transition: background .22s, color .22s, transform .2s;
        }

        .banner-cta:hover {
          background: #111;
          color: #fff;
          transform: translateY(-2px);
        }

        /* Arrows */
        .b-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,.25);
          color: #fff;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          transition: background .2s, transform .2s;
        }

        .b-arrow:hover {
          background: rgba(255,255,255,.3);
          transform: translateY(-50%) scale(1.08);
        }

        .b-prev { left: 16px; }
        .b-next { right: 16px; }

        /* Dots */
        .b-dots {
          position: absolute;
          bottom: 52px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          gap: 7px;
        }

        .b-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,.4);
          cursor: pointer;
          padding: 0;
          transition: background .25s, width .25s, border-radius .25s;
        }

        .b-dot.active {
          background: #fff;
          width: 22px;
          border-radius: 4px;
        }

        /* Progress */
        .b-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(255,255,255,.12);
          z-index: 10;
        }

        .b-progress-fill {
          height: 100%;
          background: rgba(255,255,255,.7);
          animation: bFill 5s linear forwards;
        }

        @keyframes bFill { from { width: 0%; } to { width: 100%; } }

        /* Stats strip */
        .banner-stats {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 5;
          background: rgba(0,0,0,.5);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 12px 20px;
          border-top: 1px solid rgba(255,255,255,.08);
        }

        .b-stat {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,.85);
          font-family: 'Arial', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .5px;
          padding: 0 24px;
        }

        .b-stat svg {
          color: #f5b301;
          font-size: 13px;
        }

        .b-stat-divider {
          width: 1px;
          height: 18px;
          background: rgba(255,255,255,.2);
        }

        /* ── TOOLBAR ── */
        .toolbar {
          max-width: 1380px;
          margin: 0 auto;
          padding: 20px 20px 0;
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 240px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          border: 1.5px solid #e8e8e8;
          padding: 13px 16px;
          border-radius: 14px;
          transition: border-color .2s, box-shadow .2s;
        }

        .search-box:focus-within {
          border-color: #111;
          box-shadow: 0 0 0 3px rgba(17,17,17,.07);
        }

        .search-icon { color: #999; font-size: 14px; flex-shrink: 0; }

        .search-box input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 14px;
          font-family: 'Arial', sans-serif;
          background: transparent;
          color: #111;
        }

        .search-box input::placeholder { color: #bbb; }

        .clear-search {
          background: none;
          border: none;
          cursor: pointer;
          color: #bbb;
          font-size: 12px;
          padding: 2px;
          flex-shrink: 0;
          transition: color .2s;
        }

        .clear-search:hover { color: #111; }

        .toolbar-right {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .reset-btn-sm {
          width: 46px;
          height: 46px;
          background: #fff;
          border: 1.5px solid #e8e8e8;
          border-radius: 14px;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: background .2s, color .2s;
        }

        .reset-btn-sm:hover { background: #111; color: #fff; border-color: #111; }

        .open-filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #111;
          color: #fff;
          border: none;
          padding: 13px 20px;
          border-radius: 14px;
          font-weight: 700;
          font-family: 'Arial', sans-serif;
          font-size: 13px;
          cursor: pointer;
          transition: background .2s;
        }

        .open-filter-btn:hover { background: #333; }

        /* ── LAYOUT ── */
        .shop-layout {
          max-width: 1380px;
          margin: 0 auto;
          padding: 20px 20px 60px;
          display: grid;
          grid-template-columns: 270px 1fr;
          gap: 24px;
          align-items: start;
        }

        /* ── SIDEBAR ── */
        .sidebar {
          background: #fff;
          border-radius: 20px;
          padding: 24px;
          border: 1.5px solid #ebebeb;
          position: sticky;
          top: 20px;
        }

        .sidebar-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .sidebar-head h3 {
          font-size: 20px;
          font-weight: 400;
          letter-spacing: -0.3px;
        }

        .sidebar-close {
          display: none;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #666;
          width: 32px;
          height: 32px;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: background .2s;
        }

        .sidebar-close:hover { background: #f0f0f0; }

        .filter-block {
          margin-bottom: 26px;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Arial', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 12px;
        }

        .label-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #111;
          flex-shrink: 0;
        }

        /* Category pills */
        .cat-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .cat-pill {
          background: #f4f4f4;
          border: 1.5px solid transparent;
          color: #555;
          padding: 7px 14px;
          border-radius: 30px;
          font-family: 'Arial', sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background .2s, color .2s, border-color .2s;
        }

        .cat-pill:hover { background: #e8e8e8; color: #111; }

        .cat-pill.active {
          background: #111;
          color: #fff;
          border-color: #111;
        }

        /* Select */
        .filter-select {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e8e8e8;
          border-radius: 12px;
          font-family: 'Arial', sans-serif;
          font-size: 13px;
          background: #fafafa;
          color: #111;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
          transition: border-color .2s;
        }

        .filter-select:focus { border-color: #111; }

        /* Range slider */
        .range-wrap {
          position: relative;
          padding: 10px 0 4px;
        }

        .range-input {
          width: 100%;
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          background: transparent;
          position: relative;
          z-index: 2;
          cursor: pointer;
        }

        .range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #111;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,.2);
          transition: transform .15s;
        }

        .range-input::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .range-input::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #111;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,.2);
        }

        .range-track {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 4px;
          background: #e8e8e8;
          border-radius: 4px;
          transform: translateY(-50%);
          margin-top: 10px;
          z-index: 1;
        }

        .range-fill {
          height: 100%;
          background: #111;
          border-radius: 4px;
          transition: width .1s;
        }

        .range-labels {
          display: flex;
          justify-content: space-between;
          font-family: 'Arial', sans-serif;
          font-size: 11px;
          color: #aaa;
          margin-top: 6px;
        }

        .price-badge {
          margin-left: auto;
          background: #111;
          color: #fff;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 11px;
          letter-spacing: .5px;
        }

        /* Reset button */
        .reset-all-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #f4f4f4;
          color: #111;
          border: none;
          padding: 13px;
          border-radius: 12px;
          font-family: 'Arial', sans-serif;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: background .2s, color .2s;
        }

        .reset-all-btn:hover { background: #111; color: #fff; }
        .reset-all-btn.sm { width: auto; padding: 11px 22px; }

        /* ── PRODUCTS AREA ── */
        .products-area { min-width: 0; }

        .results-bar {
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .results-count {
          font-family: 'Arial', sans-serif;
          font-size: 13px;
          color: #888;
        }

        .results-count strong { color: #111; font-size: 15px; }

        /* Product grid */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 18px;
        }

        .product-card {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          border: 1.5px solid #ebebeb;
          display: flex;
          flex-direction: column;
          transition: transform .25s, box-shadow .25s;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,.09);
        }

        .img-box {
          display: block;
          width: 100%;
          height: 240px;
          overflow: hidden;
          background: #f0f0ee;
          position: relative;
        }

        .img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .4s ease;
        }

        .product-card:hover .img-box img { transform: scale(1.05); }

        .img-hover {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,.38);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity .3s;
        }

        .img-hover span {
          color: #fff;
          font-family: 'Arial', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          border: 1px solid rgba(255,255,255,.6);
          padding: 8px 18px;
          border-radius: 30px;
        }

        .product-card:hover .img-hover { opacity: 1; }

        .card-body {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-cat {
          font-family: 'Arial', sans-serif;
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 6px;
        }

        .card-body h3 {
          font-size: 15px;
          font-weight: 400;
          line-height: 1.4;
          min-height: 42px;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 2px;
          color: #f5b301;
          font-size: 11px;
          margin-bottom: 10px;
        }

        .rating span {
          color: #bbb;
          font-family: 'Arial', sans-serif;
          font-size: 11px;
          margin-left: 4px;
        }

        .price {
          font-size: 20px;
          font-weight: 700;
          font-family: 'Arial', sans-serif;
          letter-spacing: -0.5px;
          margin-bottom: 14px;
        }

        .btn-group {
          display: flex;
          gap: 9px;
          margin-top: auto;
        }

        .view-btn {
          flex: 1;
          text-align: center;
          text-decoration: none;
          background: #111;
          color: #fff;
          padding: 11px;
          border-radius: 11px;
          font-family: 'Arial', sans-serif;
          font-weight: 700;
          font-size: 13px;
          transition: background .2s;
        }

        .view-btn:hover { background: #333; }

        .cart-btn {
          width: 42px;
          height: 42px;
          background: #f4f4f4;
          border: none;
          border-radius: 11px;
          cursor: pointer;
          color: #111;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background .2s, color .2s, transform .15s;
        }

        .cart-btn:hover {
          background: #111;
          color: #fff;
          transform: scale(1.06);
        }

        /* Empty state */
        .empty-state {
          background: #fff;
          border-radius: 20px;
          padding: 60px 30px;
          text-align: center;
          border: 1.5px solid #ebebeb;
        }

        .empty-icon { font-size: 48px; margin-bottom: 16px; }

        .empty-state h3 {
          font-size: 22px;
          font-weight: 400;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: #888;
          font-family: 'Arial', sans-serif;
          font-size: 14px;
          margin-bottom: 22px;
        }

        /* Skeleton */
        .skeleton-card {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          border: 1.5px solid #ebebeb;
        }

        .skel-img {
          width: 100%;
          height: 240px;
          background: linear-gradient(90deg, #ececec 25%, #f5f5f5 50%, #ececec 75%);
          background-size: 200%;
          animation: shimmer 1.5s infinite;
        }

        .skel-body {
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .skel-line {
          height: 11px;
          background: linear-gradient(90deg, #ececec 25%, #f5f5f5 50%, #ececec 75%);
          background-size: 200%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
          width: 100%;
        }

        .skel-line.s { width: 38%; }
        .skel-line.m { width: 60%; }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── OVERLAY ── */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.5);
          z-index: 998;
          backdrop-filter: blur(2px);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1060px) {
          .shop-layout { grid-template-columns: 1fr; }

          .sidebar {
            position: fixed;
            top: 0;
            left: -110%;
            width: 320px;
            max-width: 90vw;
            height: 100vh;
            overflow-y: auto;
            z-index: 999;
            border-radius: 0 20px 20px 0;
            transition: left .3s ease;
          }

          .sidebar.show { left: 0; }
          .sidebar-close { display: flex; }
        }

        @media (max-width: 768px) {
          .toolbar { flex-direction: column; align-items: stretch; }
          .search-box { min-width: 100%; }
          .toolbar-right { width: 100%; }
          .open-filter-btn { flex: 1; justify-content: center; }

          .product-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }

          .img-box,
          .skel-img { height: 190px; }

          .card-body { padding: 12px 14px 14px; }

          .card-body h3 { font-size: 13px; min-height: 36px; }

          .price { font-size: 17px; }

          .banner-stats { display: none; }

          .b-arrow { width: 36px; height: 36px; font-size: 11px; }
          .b-prev { left: 10px; }
          .b-next { right: 10px; }
        }

        @media (max-width: 480px) {
          .shop-banner { height: clamp(260px, 75vw, 380px); }

          .banner-title { font-size: clamp(26px, 8vw, 42px); }

          .product-grid { gap: 11px; }

          .img-box,
          .skel-img { height: 160px; }

          .btn-group { flex-direction: column; }

          .cart-btn { width: 100%; height: 38px; border-radius: 10px; }

          .view-btn { padding: 9px; font-size: 12px; }
        }

        @media (max-width: 360px) {
          .product-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Shop;