// src/pages/Home.js
// FULL FIXED: No Overlap + Responsive Banner + Proper Spacing + Clean UI

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaArrowRight,
  FaShoppingCart,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaStar,
} from "react-icons/fa";

const Home = () => {
  const API = "http://localhost:5000/api";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const banners = [
    {
      title: "Summer Collection",
      text: "Luxury Oversized Fits",
      img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1600",
    },
    {
      title: "Flat 50% OFF",
      text: "Weekend Special Sale",
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600",
    },
    {
      title: "New Arrivals",
      text: "Fresh Weekly Drops",
      img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1600",
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      const data = Array.isArray(res.data)
        ? res.data
        : [];

      setProducts(data.slice(0, 8));
    } catch (error) {
      console.log(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
      (p) => p._id === item._id
    );

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

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    alert("Added To Cart");
  };

  return (
    <div className="home-page">

      {/* HERO */}

      <section className="hero">
        <div className="hero-layer"></div>

        <div className="hero-content">
          <span>UK TRADERS</span>

          <h1>
            Premium Fashion
            <br />
            Starts Here
          </h1>

          <p>
            Streetwear, oversized tees and
            luxury essentials crafted for style.
          </p>

          <Link
            to="/shop"
            className="hero-btn"
          >
            Shop Now <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* FEATURES */}

      <section className="features">
        <div className="feature-box">
          <FaTruck />
          <h4>Fast Delivery</h4>
        </div>

        <div className="feature-box">
          <FaShieldAlt />
          <h4>Secure Payment</h4>
        </div>

        <div className="feature-box">
          <FaHeadset />
          <h4>24/7 Support</h4>
        </div>
      </section>

      {/* BANNERS */}

      <section className="banner-wrap">
        {banners.map((item, index) => (
          <div
            key={index}
            className="banner-card"
            style={{
              backgroundImage: `url(${item.img})`,
            }}
          >
            <div className="banner-overlay">
              <h3>{item.title}</h3>
              <p>{item.text}</p>

              <Link to="/shop">
                Explore
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* PRODUCTS */}

      <section className="products">
        <div className="head">
          <h2>Trending Products</h2>

          <Link to="/shop">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="loading">
            Loading...
          </div>
        ) : (
          <div className="product-grid">
            {products.map((item) => (
              <div
                className="product-card"
                key={item._id}
              >
                <Link
                  to={`/product/${item._id}`}
                  className="img-box"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </Link>

                <div className="card-body">
                  <small>
                    {item.category ||
                      "Fashion"}
                  </small>

                  <h3>{item.name}</h3>

                  <div className="rating">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>

                  <div className="price-row">
                    <h4>
                      ₹{item.price}
                    </h4>

                    <button
                      onClick={() =>
                        addToCart(item)
                      }
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

      {/* NEWSLETTER */}

      <section className="newsletter">
        <h2>
          Join Newsletter
        </h2>

        <p>
          Get exclusive deals and updates
        </p>

        <div className="news-box">
          <input
            type="email"
            placeholder="Enter Email"
          />

          <button>
            Subscribe
          </button>
        </div>
      </section>

      <style>{`

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
      }

      .home-page{
        background:#f8f8f8;
        font-family:Arial;
        overflow-x:hidden;
      }

      /* HERO */

      .hero{
        min-height:90vh;
        background:url("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800") center/cover;
        position:relative;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
      }

      .hero-layer{
        position:absolute;
        inset:0;
        background:rgba(0,0,0,.55);
      }

      .hero-content{
        position:relative;
        z-index:2;
        color:#fff;
        text-align:center;
        max-width:900px;
      }

      .hero-content span{
        letter-spacing:3px;
        font-size:13px;
      }

      .hero-content h1{
        font-size:clamp(34px,7vw,72px);
        margin:16px 0;
        line-height:1.1;
      }

      .hero-content p{
        font-size:18px;
        max-width:620px;
        margin:auto auto 28px;
        line-height:1.7;
      }

      .hero-btn{
        display:inline-flex;
        gap:8px;
        align-items:center;
        background:#fff;
        color:#111;
        text-decoration:none;
        padding:14px 26px;
        border-radius:40px;
        font-weight:700;
      }

      /* FEATURES */

      .features{
        max-width:1400px;
        margin:auto;
        padding:40px 16px;
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:18px;
      }

      .feature-box{
        background:#fff;
        border-radius:18px;
        padding:28px;
        text-align:center;
        box-shadow:0 8px 20px rgba(0,0,0,.05);
      }

      .feature-box svg{
        font-size:28px;
        margin-bottom:10px;
      }

      /* BANNERS */

      .banner-wrap{
        max-width:1400px;
        margin:auto;
        padding:0 16px 50px;
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:18px;
      }

      .banner-card{
        min-height:280px;
        border-radius:24px;
        background-size:cover;
        background-position:center;
        overflow:hidden;
      }

      .banner-overlay{
        width:100%;
        height:100%;
        padding:24px;
        background:linear-gradient(to top,rgba(0,0,0,.75),rgba(0,0,0,.2));
        display:flex;
        flex-direction:column;
        justify-content:flex-end;
        color:#fff;
      }

      .banner-overlay h3{
        font-size:30px;
        margin-bottom:8px;
      }

      .banner-overlay p{
        margin-bottom:12px;
      }

      .banner-overlay a{
        color:#fff;
        text-decoration:none;
        font-weight:700;
      }

      /* PRODUCTS */

      .products{
        max-width:1400px;
        margin:auto;
        padding:0 16px 60px;
      }

      .head{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        flex-wrap:wrap;
        margin-bottom:25px;
      }

      .head h2{
        font-size:clamp(28px,5vw,50px);
      }

      .head a{
        color:#111;
        text-decoration:none;
        font-weight:700;
      }

      .product-grid{
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:22px;
      }

      .product-card{
        background:#fff;
        border-radius:22px;
        overflow:hidden;
        box-shadow:0 10px 24px rgba(0,0,0,.06);
        display:flex;
        flex-direction:column;
      }

      .img-box{
        width:100%;
        height:280px;
        background:#f2f2f2;
      }

      .img-box img{
        width:100%;
        height:100%;
        object-fit:cover;
      }

      .card-body{
        padding:18px;
        display:flex;
        flex-direction:column;
        flex:1;
      }

      .card-body small{
        color:#777;
      }

      .card-body h3{
        font-size:18px;
        margin:10px 0;
        min-height:48px;
      }

      .rating{
        color:#f5b301;
        margin-bottom:14px;
      }

      .price-row{
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:14px;
      }

      .price-row h4{
        font-size:24px;
      }

      .price-row button{
        width:44px;
        height:44px;
        border:none;
        background:#111;
        color:#fff;
        border-radius:12px;
        cursor:pointer;
      }

      .view-btn{
        margin-top:auto;
        text-align:center;
        text-decoration:none;
        padding:12px;
        background:#f4f4f4;
        color:#111;
        border-radius:12px;
        font-weight:700;
      }

      /* NEWSLETTER */

      .newsletter{
        padding:0 16px 80px;
        text-align:center;
      }

      .newsletter h2{
        font-size:40px;
      }

      .newsletter p{
        margin:12px 0 24px;
      }

      .news-box{
        display:flex;
        gap:12px;
        justify-content:center;
        flex-wrap:wrap;
      }

      .news-box input{
        width:340px;
        max-width:100%;
        padding:14px;
        border:1px solid #ddd;
        border-radius:12px;
      }

      .news-box button{
        padding:14px 22px;
        border:none;
        background:#111;
        color:#fff;
        border-radius:12px;
        cursor:pointer;
      }

      /* RESPONSIVE */

      @media(max-width:1200px){

        .product-grid{
          grid-template-columns:repeat(3,1fr);
        }

      }

      @media(max-width:992px){

        .features,
        .banner-wrap{
          grid-template-columns:repeat(2,1fr);
        }

        .product-grid{
          grid-template-columns:repeat(2,1fr);
        }

      }

      @media(max-width:700px){

        .features,
        .banner-wrap,
        .product-grid{
          grid-template-columns:1fr;
        }

        .hero{
          min-height:80vh;
        }

        .img-box{
          height:240px;
        }

        .hero-content p{
          font-size:16px;
        }

        .newsletter h2{
          font-size:30px;
        }

      }

      `}</style>
    </div>
  );
};

export default Home;