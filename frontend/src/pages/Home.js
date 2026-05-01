// src/pages/Home.js
// UPDATED: Sliding Banner + Professional UI + Responsive + CSS Fixes

import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaArrowRight,
  FaShoppingCart,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const Home = () => {
  const API = "http://localhost:5000/api";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayRef = useRef(null);

  const banners = [
    {
      title: "Summer Collection",
      subtitle: "Luxury Oversized Fits",
      cta: "Shop Collection",
      tag: "New Season",
      img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1800&q=80",
      accent: "#e8c97e",
    },
    {
      title: "Weekend Sale",
      subtitle: "Flat 50% OFF on Select Styles",
      cta: "Grab the Deal",
      tag: "Limited Time",
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=80",
      accent: "#f28b6e",
    },
    {
      title: "New Arrivals",
      subtitle: "Fresh Weekly Drops Just Landed",
      cta: "Explore Now",
      tag: "Just In",
      img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1800&q=80",
      accent: "#8ecbe8",
    },
  ];

  useEffect(() => {
    fetchProducts();
    startAutoPlay();
    return () => clearInterval(autoPlayRef.current);
  }, []);

  const startAutoPlay = () => {
    autoPlayRef.current = setInterval(() => {
      goToNext();
    }, 5000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayRef.current);
    startAutoPlay();
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % banners.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    resetAutoPlay();
    setTimeout(() => setIsAnimating(false), 600);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      const data = Array.isArray(res.data) ? res.data : [];
      setProducts(data.slice(0, 8));
    } catch (error) {
      console.log(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((p) => p._id === item._id);
    if (existing) {
      existing.qty += 1;
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
    alert("Added To Cart");
  };

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-layer" />
        <div className="hero-content">
          <span className="hero-badge">UK TRADERS</span>
          <h1>
            Premium Fashion
            <br />
            Starts Here
          </h1>
          <p>
            Streetwear, oversized tees and luxury essentials
            crafted for the bold.
          </p>
          <Link to="/shop" className="hero-btn">
            Shop Now <FaArrowRight />
          </Link>
        </div>
        <div className="hero-scroll-hint">
          <span />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-wrap">
        <div className="features">
          <div className="feature-box">
            <div className="feature-icon">
              <FaTruck />
            </div>
            <div>
              <h4>Fast Delivery</h4>
              <p>Ships within 24–48 hrs</p>
            </div>
          </div>
          <div className="feature-box">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>
            <div>
              <h4>Secure Payment</h4>
              <p>100% encrypted checkout</p>
            </div>
          </div>
          <div className="feature-box">
            <div className="feature-icon">
              <FaHeadset />
            </div>
            <div>
              <h4>24/7 Support</h4>
              <p>We're always here for you</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BANNER SLIDER ── */}
      <section className="slider-section">
        <div className="slider">
          {banners.map((item, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${item.img})` }}
            >
              <div className="slide-overlay" />
              <div className="slide-content">
                <span
                  className="slide-tag"
                  style={{ background: item.accent, color: "#111" }}
                >
                  {item.tag}
                </span>
                <h2>{item.title}</h2>
                <p>{item.subtitle}</p>
                <Link to="/shop" className="slide-btn">
                  {item.cta} <FaArrowRight />
                </Link>
              </div>
            </div>
          ))}

          {/* Arrows */}
          <button
            className="slider-arrow prev"
            onClick={() => { goToPrev(); resetAutoPlay(); }}
            aria-label="Previous"
          >
            <FaChevronLeft />
          </button>
          <button
            className="slider-arrow next"
            onClick={() => { goToNext(); resetAutoPlay(); }}
            aria-label="Next"
          >
            <FaChevronRight />
          </button>

          {/* Dots */}
          <div className="slider-dots">
            {banners.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="slider-progress">
            <div
              className="slider-progress-fill"
              key={currentSlide}
            />
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="products-section">
        <div className="section-head">
          <div>
            <span className="section-label">Curated For You</span>
            <h2>Trending Products</h2>
          </div>
          <Link to="/shop" className="view-all-btn">
            View All <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => (
              <div className="skeleton-card" key={i}>
                <div className="skeleton-img" />
                <div className="skeleton-body">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line medium" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {products.map((item) => (
              <div className="product-card" key={item._id}>
                <Link to={`/product/${item._id}`} className="img-box">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div className="img-overlay">
                    <span>Quick View</span>
                  </div>
                </Link>
                <div className="card-body">
                  <small className="category-tag">
                    {item.category || "Fashion"}
                  </small>
                  <h3>{item.name}</h3>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                    <span>(24)</span>
                  </div>
                  <div className="price-row">
                    <h4>₹{item.price?.toLocaleString("en-IN")}</h4>
                    <button
                      className="cart-btn"
                      onClick={() => addToCart(item)}
                      aria-label="Add to cart"
                    >
                      <FaShoppingCart />
                    </button>
                  </div>
                  <Link
                    to={`/product/${item._id}`}
                    className="view-btn"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="newsletter">
        <div className="newsletter-inner">
          <div className="nl-text">
            <span className="section-label light">Stay Updated</span>
            <h2>Join the Inner Circle</h2>
            <p>Get exclusive drops, early access, and member-only deals.</p>
          </div>
          <div className="nl-form">
            <div className="news-box">
              <input type="email" placeholder="Enter your email address" />
              <button>Subscribe</button>
            </div>
            <p className="nl-note">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      <style>{`
        /* ── RESET ── */
        *, *::before, *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* ── BASE ── */
        .home-page {
          background: #f6f6f4;
          font-family: 'Georgia', 'Times New Roman', serif;
          overflow-x: hidden;
          color: #111;
        }

        /* ── HERO ── */
        .hero {
          min-height: 92vh;
          background: url("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&q=80")
            center / cover no-repeat;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 24px;
          text-align: center;
        }

        .hero-layer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(0,0,0,.65) 0%,
            rgba(0,0,0,.35) 60%,
            rgba(0,0,0,.55) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          color: #fff;
          max-width: 860px;
        }

        .hero-badge {
          display: inline-block;
          letter-spacing: 5px;
          font-size: 11px;
          font-family: 'Arial', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          background: rgba(255,255,255,.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,.3);
          padding: 6px 18px;
          border-radius: 40px;
          margin-bottom: 22px;
        }

        .hero-content h1 {
          font-size: clamp(38px, 7vw, 80px);
          line-height: 1.05;
          margin-bottom: 20px;
          font-weight: 400;
          letter-spacing: -1px;
        }

        .hero-content p {
          font-size: clamp(15px, 2vw, 19px);
          max-width: 560px;
          margin: 0 auto 34px;
          line-height: 1.75;
          opacity: .88;
          font-family: 'Arial', sans-serif;
          font-weight: 300;
        }

        .hero-btn {
          display: inline-flex;
          gap: 10px;
          align-items: center;
          background: #fff;
          color: #111;
          text-decoration: none;
          padding: 15px 30px;
          border-radius: 50px;
          font-weight: 700;
          font-family: 'Arial', sans-serif;
          font-size: 14px;
          letter-spacing: 1px;
          transition: background .25s, color .25s, transform .2s;
        }

        .hero-btn:hover {
          background: #111;
          color: #fff;
          transform: translateY(-2px);
        }

        .hero-scroll-hint {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }

        .hero-scroll-hint span {
          display: block;
          width: 1px;
          height: 50px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,.6));
          margin: 0 auto;
          animation: scrollHint 2s ease-in-out infinite;
        }

        @keyframes scrollHint {
          0%, 100% { opacity: 0; transform: scaleY(0); transform-origin: top; }
          50% { opacity: 1; transform: scaleY(1); transform-origin: top; }
        }

        /* ── FEATURES ── */
        .features-wrap {
          background: #fff;
          border-bottom: 1px solid #ebebeb;
        }

        .features {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        .feature-box {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 28px 32px;
          border-right: 1px solid #ebebeb;
        }

        .feature-box:last-child {
          border-right: none;
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: #111;
          color: #fff;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .feature-box h4 {
          font-size: 15px;
          font-family: 'Arial', sans-serif;
          font-weight: 700;
          margin-bottom: 3px;
        }

        .feature-box p {
          font-size: 12px;
          color: #888;
          font-family: 'Arial', sans-serif;
        }

        /* ── SLIDER ── */
        .slider-section {
          padding: 48px 20px;
          max-width: 1320px;
          margin: 0 auto;
        }

        .slider {
          position: relative;
          width: 100%;
          border-radius: 28px;
          overflow: hidden;
          height: clamp(300px, 55vw, 560px);
          background: #111;
          box-shadow: 0 24px 64px rgba(0,0,0,.15);
        }

        .slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity .6s ease, transform .6s ease;
          transform: scale(1.04);
        }

        .slide.active {
          opacity: 1;
          transform: scale(1);
          z-index: 1;
        }

        .slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            100deg,
            rgba(0,0,0,.75) 0%,
            rgba(0,0,0,.35) 55%,
            rgba(0,0,0,.1) 100%
          );
        }

        .slide-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(24px, 5vw, 64px);
          color: #fff;
          max-width: 600px;
        }

        .slide-tag {
          display: inline-block;
          padding: 5px 14px;
          border-radius: 30px;
          font-size: 11px;
          font-family: 'Arial', sans-serif;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 18px;
          width: fit-content;
        }

        .slide-content h2 {
          font-size: clamp(28px, 5vw, 58px);
          font-weight: 400;
          line-height: 1.08;
          margin-bottom: 14px;
          letter-spacing: -0.5px;
        }

        .slide-content p {
          font-size: clamp(14px, 1.8vw, 18px);
          opacity: .85;
          font-family: 'Arial', sans-serif;
          font-weight: 300;
          margin-bottom: 28px;
        }

        .slide-btn {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          background: #fff;
          color: #111;
          text-decoration: none;
          padding: 13px 24px;
          border-radius: 40px;
          font-weight: 700;
          font-family: 'Arial', sans-serif;
          font-size: 13px;
          letter-spacing: .5px;
          width: fit-content;
          transition: background .22s, color .22s, transform .2s;
        }

        .slide-btn:hover {
          background: #111;
          color: #fff;
          transform: translateY(-2px);
        }

        /* Slider Arrows */
        .slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 46px;
          height: 46px;
          border: none;
          background: rgba(255,255,255,.18);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,.3);
          color: #fff;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: background .2s, transform .2s;
        }

        .slider-arrow:hover {
          background: rgba(255,255,255,.35);
          transform: translateY(-50%) scale(1.08);
        }

        .slider-arrow.prev { left: 18px; }
        .slider-arrow.next { right: 18px; }

        /* Dots */
        .slider-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          gap: 8px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,.45);
          cursor: pointer;
          padding: 0;
          transition: background .25s, width .25s;
        }

        .dot.active {
          background: #fff;
          width: 24px;
          border-radius: 4px;
        }

        /* Progress bar */
        .slider-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(255,255,255,.15);
          z-index: 10;
        }

        .slider-progress-fill {
          height: 100%;
          background: #fff;
          animation: progressFill 5s linear forwards;
        }

        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }

        /* ── PRODUCTS ── */
        .products-section {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 20px 64px;
        }

        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .section-label {
          display: block;
          font-size: 11px;
          font-family: 'Arial', sans-serif;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 6px;
        }

        .section-label.light {
          color: rgba(255,255,255,.65);
        }

        .section-head h2 {
          font-size: clamp(28px, 4vw, 46px);
          font-weight: 400;
          letter-spacing: -0.5px;
        }

        .view-all-btn {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          color: #111;
          text-decoration: none;
          font-weight: 700;
          font-family: 'Arial', sans-serif;
          font-size: 13px;
          letter-spacing: .5px;
          border-bottom: 2px solid #111;
          padding-bottom: 2px;
          transition: opacity .2s;
        }

        .view-all-btn:hover { opacity: .6; }

        /* Product Grid */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }

        .product-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow .25s, transform .25s;
          box-shadow: 0 2px 12px rgba(0,0,0,.05);
        }

        .product-card:hover {
          box-shadow: 0 16px 40px rgba(0,0,0,.1);
          transform: translateY(-4px);
        }

        .img-box {
          width: 100%;
          height: 260px;
          overflow: hidden;
          display: block;
          background: #f0f0ee;
          position: relative;
        }

        .img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .4s ease;
        }

        .product-card:hover .img-box img {
          transform: scale(1.05);
        }

        .img-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity .3s;
        }

        .img-overlay span {
          color: #fff;
          font-family: 'Arial', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          border: 1px solid rgba(255,255,255,.7);
          padding: 8px 18px;
          border-radius: 30px;
        }

        .product-card:hover .img-overlay {
          opacity: 1;
        }

        .card-body {
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .category-tag {
          font-size: 11px;
          font-family: 'Arial', sans-serif;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #999;
        }

        .card-body h3 {
          font-size: 16px;
          margin: 8px 0 10px;
          font-weight: 400;
          line-height: 1.4;
          min-height: 44px;
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
          font-size: 12px;
          margin-bottom: 14px;
        }

        .rating span {
          color: #999;
          font-family: 'Arial', sans-serif;
          font-size: 11px;
          margin-left: 4px;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .price-row h4 {
          font-size: 22px;
          font-weight: 700;
          font-family: 'Arial', sans-serif;
          letter-spacing: -0.5px;
        }

        .cart-btn {
          width: 42px;
          height: 42px;
          border: none;
          background: #111;
          color: #fff;
          border-radius: 12px;
          cursor: pointer;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .2s, transform .15s;
          flex-shrink: 0;
        }

        .cart-btn:hover {
          background: #333;
          transform: scale(1.08);
        }

        .view-btn {
          margin-top: auto;
          display: block;
          text-align: center;
          text-decoration: none;
          padding: 11px;
          background: #f4f4f4;
          color: #111;
          border-radius: 10px;
          font-weight: 700;
          font-family: 'Arial', sans-serif;
          font-size: 13px;
          letter-spacing: .5px;
          transition: background .2s, color .2s;
        }

        .view-btn:hover {
          background: #111;
          color: #fff;
        }

        /* Skeleton Loader */
        .loading-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }

        .skeleton-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
        }

        .skeleton-img {
          width: 100%;
          height: 260px;
          background: linear-gradient(90deg, #ececec 25%, #f5f5f5 50%, #ececec 75%);
          background-size: 200%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-body {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .skeleton-line {
          height: 12px;
          background: linear-gradient(90deg, #ececec 25%, #f5f5f5 50%, #ececec 75%);
          background-size: 200%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
          width: 100%;
        }

        .skeleton-line.short { width: 40%; }
        .skeleton-line.medium { width: 65%; }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── NEWSLETTER ── */
        .newsletter {
          background: #111;
          color: #fff;
          padding: 0 20px;
        }

        .newsletter-inner {
          max-width: 1320px;
          margin: 0 auto;
          padding: 72px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
          flex-wrap: wrap;
        }

        .nl-text {
          flex: 1;
          min-width: 260px;
        }

        .nl-text h2 {
          font-size: clamp(26px, 4vw, 44px);
          font-weight: 400;
          letter-spacing: -0.5px;
          margin-bottom: 10px;
        }

        .nl-text p {
          font-family: 'Arial', sans-serif;
          font-size: 15px;
          color: rgba(255,255,255,.65);
          font-weight: 300;
        }

        .nl-form {
          flex: 1;
          min-width: 280px;
          max-width: 480px;
        }

        .news-box {
          display: flex;
          gap: 10px;
        }

        .news-box input {
          flex: 1;
          padding: 14px 18px;
          border: 1px solid rgba(255,255,255,.2);
          background: rgba(255,255,255,.08);
          color: #fff;
          border-radius: 12px;
          font-family: 'Arial', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color .2s;
        }

        .news-box input::placeholder { color: rgba(255,255,255,.4); }

        .news-box input:focus {
          border-color: rgba(255,255,255,.5);
        }

        .news-box button {
          padding: 14px 22px;
          border: none;
          background: #fff;
          color: #111;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
          font-family: 'Arial', sans-serif;
          font-size: 14px;
          white-space: nowrap;
          transition: background .2s, transform .15s;
          flex-shrink: 0;
        }

        .news-box button:hover {
          background: #e0e0e0;
          transform: translateY(-1px);
        }

        .nl-note {
          font-family: 'Arial', sans-serif;
          font-size: 11px;
          color: rgba(255,255,255,.35);
          margin-top: 10px;
          letter-spacing: .5px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .product-grid,
          .loading-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 900px) {
          .features {
            grid-template-columns: 1fr;
          }

          .feature-box {
            border-right: none;
            border-bottom: 1px solid #ebebeb;
          }

          .feature-box:last-child { border-bottom: none; }

          .product-grid,
          .loading-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .slider {
            border-radius: 20px;
          }
        }

        @media (max-width: 640px) {
          .slider-section { padding: 28px 14px; }

          .slider {
            height: clamp(260px, 70vw, 380px);
            border-radius: 16px;
          }

          .slider-arrow {
            width: 36px;
            height: 36px;
            font-size: 12px;
          }

          .slider-arrow.prev { left: 10px; }
          .slider-arrow.next { right: 10px; }

          .product-grid,
          .loading-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }

          .img-box {
            height: 180px;
          }

          .skeleton-img {
            height: 180px;
          }

          .card-body { padding: 12px 14px 14px; }

          .card-body h3 {
            font-size: 14px;
            min-height: 38px;
          }

          .price-row h4 { font-size: 18px; }

          .newsletter-inner {
            flex-direction: column;
            align-items: flex-start;
            padding: 48px 0;
          }

          .nl-form {
            width: 100%;
            max-width: 100%;
          }

          .news-box {
            flex-direction: column;
          }

          .news-box button {
            width: 100%;
          }

          .hero {
            min-height: 80vh;
          }
        }

        @media (max-width: 420px) {
          .product-grid,
          .loading-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;