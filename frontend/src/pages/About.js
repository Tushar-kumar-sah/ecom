// src/pages/About.js

import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaAward,
  FaTruck,
  FaUsers,
  FaShieldAlt,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="about-page">

      {/* HERO */}

      <section className="about-hero">
        <div className="overlay"></div>

        <div className="hero-content">
          <span>ABOUT UK TRADERS</span>

          <h1>
            Fashion Built For
            <br />
            Confidence
          </h1>

          <p>
            Premium streetwear and modern
            essentials designed for comfort,
            quality and bold everyday style.
          </p>

          <Link
            to="/shop"
            className="hero-btn"
          >
            Shop Collection
            <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* STORY */}

      <section className="story">
        <div className="story-left">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200"
            alt="about"
          />
        </div>

        <div className="story-right">
          <span>OUR STORY</span>

          <h2>
            Started With Passion,
            <br />
            Grown With Trust
          </h2>

          <p>
            UK Traders was created with one
            simple mission — deliver premium
            quality fashion at affordable prices.
            We focus on clean fits, luxury feel
            fabrics and modern designs.
          </p>

          <p>
            Every product is built to help you
            look sharp and feel confident.
          </p>
        </div>
      </section>

      {/* FEATURES */}

      <section className="features">

        <div className="feature-box">
          <FaAward />
          <h3>Premium Quality</h3>
          <p>
            Carefully selected fabrics and
            long-lasting comfort.
          </p>
        </div>

        <div className="feature-box">
          <FaTruck />
          <h3>Fast Delivery</h3>
          <p>
            Quick dispatch and trusted shipping
            across India.
          </p>
        </div>

        <div className="feature-box">
          <FaUsers />
          <h3>Happy Customers</h3>
          <p>
            Loved by customers who value style.
          </p>
        </div>

        <div className="feature-box">
          <FaShieldAlt />
          <h3>Secure Shopping</h3>
          <p>
            Safe payments and protected orders.
          </p>
        </div>

      </section>

      {/* CTA */}

      <section className="cta">
        <h2>
          Ready To Upgrade
          <br />
          Your Style?
        </h2>

        <Link
          to="/shop"
          className="hero-btn dark"
        >
          Explore Products
        </Link>
      </section>

      <style>{`

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
      }

      .about-page{
        font-family:Arial;
        background:#f8f8f8;
      }

      .about-hero{
        min-height:85vh;
        background:url("https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1800") center/cover;
        position:relative;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
      }

      .overlay{
        position:absolute;
        inset:0;
        background:rgba(0,0,0,.58);
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
        font-size:clamp(36px,7vw,72px);
        margin:18px 0;
        line-height:1.08;
      }

      .hero-content p{
        font-size:18px;
        line-height:1.8;
        margin-bottom:28px;
      }

      .hero-btn{
        display:inline-flex;
        gap:8px;
        align-items:center;
        text-decoration:none;
        padding:14px 24px;
        border-radius:40px;
        background:#fff;
        color:#111;
        font-weight:700;
      }

      .dark{
        background:#111;
        color:#fff;
      }

      .story{
        max-width:1400px;
        margin:auto;
        padding:70px 16px;
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:35px;
        align-items:center;
      }

      .story-left img{
        width:100%;
        border-radius:24px;
        object-fit:cover;
        height:520px;
      }

      .story-right span{
        letter-spacing:3px;
        font-size:13px;
      }

      .story-right h2{
        font-size:clamp(30px,5vw,54px);
        margin:18px 0;
      }

      .story-right p{
        color:#555;
        line-height:1.9;
        margin-bottom:18px;
      }

      .features{
        max-width:1400px;
        margin:auto;
        padding:0 16px 70px;
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:20px;
      }

      .feature-box{
        background:#fff;
        padding:28px;
        border-radius:22px;
        box-shadow:0 10px 24px rgba(0,0,0,.05);
      }

      .feature-box svg{
        font-size:30px;
        margin-bottom:16px;
      }

      .feature-box h3{
        margin-bottom:12px;
      }

      .feature-box p{
        color:#666;
        line-height:1.7;
      }

      .cta{
        background:#111;
        color:#fff;
        text-align:center;
        padding:80px 16px;
      }

      .cta h2{
        font-size:clamp(34px,6vw,62px);
        margin-bottom:24px;
      }

      @media(max-width:992px){

        .story{
          grid-template-columns:1fr;
        }

        .features{
          grid-template-columns:repeat(2,1fr);
        }

      }

      @media(max-width:700px){

        .features{
          grid-template-columns:1fr;
        }

        .story-left img{
          height:360px;
        }

        .hero-content p{
          font-size:16px;
        }

      }

      `}</style>
    </div>
  );
};

export default About;