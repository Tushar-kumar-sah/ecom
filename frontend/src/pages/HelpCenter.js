// src/pages/HelpCenter.js

import React, { useState } from "react";
import {
  FaSearch,
  FaShippingFast,
  FaUndoAlt,
  FaUserShield,
  FaHeadset,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const HelpCenter = () => {
  const [open, setOpen] =
    useState(null);

  const faqs = [
    {
      icon: <FaShippingFast />,
      q: "How long does delivery take?",
      a: "Metro cities usually take 2-5 business days. Other locations may take 4-8 business days.",
    },
    {
      icon: <FaUndoAlt />,
      q: "Can I return a product?",
      a: "Yes, eligible items can be returned within 7 days if unused and in original condition.",
    },
    {
      icon: <FaUserShield />,
      q: "Is payment secure?",
      a: "Yes, all payments are processed through secure and trusted payment gateways.",
    },
    {
      icon: <FaHeadset />,
      q: "How do I contact support?",
      a: "You can use the Contact page or email support@uktraders.com for assistance.",
    },
  ];

  return (
    <div className="help-page">

      {/* HERO */}

      <section className="hero">
        <div className="overlay"></div>

        <div className="hero-content">
          <span>SUPPORT CENTER</span>

          <h1>
            How Can We
            <br />
            Help You?
          </h1>

          <p>
            Find answers, support and quick
            solutions for your orders.
          </p>

          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search help topics..."
            />
          </div>
        </div>
      </section>

      {/* QUICK SUPPORT */}

      <section className="quick-grid">

        <div className="quick-card">
          <FaShippingFast />
          <h3>Track Order</h3>
          <p>
            Get shipping updates and delivery status.
          </p>
        </div>

        <div className="quick-card">
          <FaUndoAlt />
          <h3>Returns</h3>
          <p>
            Easy returns and refund assistance.
          </p>
        </div>

        <div className="quick-card">
          <FaUserShield />
          <h3>Payments</h3>
          <p>
            Safe payments and billing help.
          </p>
        </div>

        <div className="quick-card">
          <FaHeadset />
          <h3>Support</h3>
          <p>
            Reach our customer support team.
          </p>
        </div>

      </section>

      {/* FAQ */}

      <section className="faq-wrap">
        <h2>
          Frequently Asked Questions
        </h2>

        {faqs.map((item, index) => (
          <div
            className="faq-card"
            key={index}
          >
            <button
              className="faq-btn"
              onClick={() =>
                setOpen(
                  open === index
                    ? null
                    : index
                )
              }
            >
              <div className="left">
                {item.icon}
                <span>
                  {item.q}
                </span>
              </div>

              {open === index ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </button>

            {open === index && (
              <div className="faq-answer">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* CTA */}

      <section className="cta">
        <h2>
          Still Need Help?
        </h2>

        <p>
          Our support team is ready to assist you.
        </p>

        <a href="/contact">
          Contact Us
        </a>
      </section>

      <style>{`

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
      }

      .help-page{
        font-family:Arial;
        background:#f8f8f8;
      }

      /* HERO */

      .hero{
        min-height:72vh;
        background:url("https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1800") center/cover;
        position:relative;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
      }

      .overlay{
        position:absolute;
        inset:0;
        background:rgba(0,0,0,.62);
      }

      .hero-content{
        position:relative;
        z-index:2;
        color:#fff;
        text-align:center;
        max-width:900px;
        width:100%;
      }

      .hero-content span{
        letter-spacing:3px;
        font-size:13px;
      }

      .hero-content h1{
        font-size:clamp(34px,7vw,72px);
        margin:18px 0;
        line-height:1.08;
      }

      .hero-content p{
        font-size:18px;
        margin-bottom:28px;
      }

      .search-box{
        max-width:620px;
        margin:auto;
        background:#fff;
        border-radius:16px;
        padding:0 18px;
        height:58px;
        display:flex;
        align-items:center;
        gap:12px;
      }

      .search-box svg{
        color:#777;
      }

      .search-box input{
        border:none;
        outline:none;
        width:100%;
        font-size:16px;
      }

      /* QUICK */

      .quick-grid{
        max-width:1400px;
        margin:auto;
        padding:70px 16px 20px;
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:20px;
      }

      .quick-card{
        background:#fff;
        border-radius:22px;
        padding:28px;
        box-shadow:0 10px 24px rgba(0,0,0,.05);
      }

      .quick-card svg{
        font-size:28px;
        margin-bottom:14px;
      }

      .quick-card h3{
        margin-bottom:10px;
      }

      .quick-card p{
        color:#666;
        line-height:1.8;
      }

      /* FAQ */

      .faq-wrap{
        max-width:1000px;
        margin:auto;
        padding:50px 16px 80px;
      }

      .faq-wrap h2{
        font-size:42px;
        margin-bottom:24px;
        text-align:center;
      }

      .faq-card{
        background:#fff;
        border-radius:18px;
        margin-bottom:14px;
        overflow:hidden;
        box-shadow:0 8px 20px rgba(0,0,0,.04);
      }

      .faq-btn{
        width:100%;
        border:none;
        background:#fff;
        padding:20px;
        cursor:pointer;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        text-align:left;
      }

      .left{
        display:flex;
        gap:14px;
        align-items:center;
      }

      .left span{
        font-weight:700;
      }

      .faq-answer{
        padding:0 20px 20px;
        color:#666;
        line-height:1.8;
      }

      /* CTA */

      .cta{
        background:#111;
        color:#fff;
        text-align:center;
        padding:70px 16px;
      }

      .cta h2{
        font-size:44px;
        margin-bottom:10px;
      }

      .cta p{
        color:#ddd;
        margin-bottom:22px;
      }

      .cta a{
        text-decoration:none;
        background:#fff;
        color:#111;
        padding:14px 24px;
        border-radius:40px;
        font-weight:700;
        display:inline-block;
      }

      /* RESPONSIVE */

      @media(max-width:1100px){

        .quick-grid{
          grid-template-columns:repeat(2,1fr);
        }

      }

      @media(max-width:700px){

        .quick-grid{
          grid-template-columns:1fr;
          padding-top:50px;
        }

        .faq-wrap h2,
        .cta h2{
          font-size:30px;
        }

        .hero-content p{
          font-size:16px;
        }

        .search-box{
          height:52px;
        }

      }

      `}</style>
    </div>
  );
};

export default HelpCenter;