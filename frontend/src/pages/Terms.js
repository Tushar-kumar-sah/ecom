// src/pages/Terms.js

import React from "react";
import {
  FaFileContract,
  FaShoppingBag,
  FaCreditCard,
  FaBan,
} from "react-icons/fa";

const Terms = () => {
  return (
    <div className="policy-page">

      {/* HERO */}

      <section className="hero">
        <div className="overlay"></div>

        <div className="hero-content">
          <span>UK TRADERS</span>

          <h1>
            Terms & Conditions
          </h1>

          <p>
            Please review the rules and conditions
            for using our website and services.
          </p>
        </div>
      </section>

      {/* CONTENT */}

      <section className="content">

        <div className="card">
          <FaFileContract />
          <h3>
            Acceptance of Terms
          </h3>
          <p>
            By using this website, you agree to
            follow our terms, policies and rules.
          </p>
        </div>

        <div className="card">
          <FaShoppingBag />
          <h3>
            Orders & Products
          </h3>
          <p>
            All orders are subject to product
            availability and confirmation.
          </p>
        </div>

        <div className="card">
          <FaCreditCard />
          <h3>
            Payments
          </h3>
          <p>
            Payments must be completed through
            approved secure payment methods.
          </p>
        </div>

        <div className="card">
          <FaBan />
          <h3>
            Misuse Restriction
          </h3>
          <p>
            Fraudulent use, abuse or harmful
            activity may result in account ban.
          </p>
        </div>

      </section>

      {/* NOTES */}

      <section className="notes">
        <h2>
          Important Notes
        </h2>

        <ul>
          <li>
            Prices, offers and stock can change
            anytime without prior notice.
          </li>

          <li>
            We may cancel suspicious or invalid
            orders when necessary.
          </li>

          <li>
            Users are responsible for accurate
            account and shipping details.
          </li>

          <li>
            Continued use of this website means
            acceptance of updated terms.
          </li>
        </ul>
      </section>

      <style>{`

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
      }

      .policy-page{
        font-family:Arial;
        background:#f8f8f8;
      }

      .hero{
        min-height:60vh;
        background:url("https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1800") center/cover;
        position:relative;
        display:flex;
        justify-content:center;
        align-items:center;
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
        text-align:center;
        color:#fff;
        max-width:900px;
      }

      .hero-content span{
        letter-spacing:3px;
        font-size:13px;
      }

      .hero-content h1{
        font-size:clamp(34px,7vw,68px);
        margin:16px 0;
      }

      .hero-content p{
        font-size:18px;
        line-height:1.8;
      }

      .content{
        max-width:1400px;
        margin:auto;
        padding:70px 16px;
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:22px;
      }

      .card{
        background:#fff;
        padding:28px;
        border-radius:24px;
        box-shadow:0 10px 24px rgba(0,0,0,.05);
      }

      .card svg{
        font-size:34px;
        margin-bottom:16px;
      }

      .card h3{
        font-size:24px;
        margin-bottom:12px;
      }

      .card p{
        color:#666;
        line-height:1.8;
      }

      .notes{
        max-width:1000px;
        margin:auto;
        padding:0 16px 80px;
      }

      .notes h2{
        font-size:42px;
        margin-bottom:20px;
      }

      .notes ul{
        background:#fff;
        padding:30px;
        border-radius:24px;
        box-shadow:0 10px 24px rgba(0,0,0,.05);
      }

      .notes li{
        margin-bottom:14px;
        line-height:1.8;
        color:#444;
      }

      @media(max-width:1100px){

        .content{
          grid-template-columns:repeat(2,1fr);
        }

      }

      @media(max-width:700px){

        .content{
          grid-template-columns:1fr;
          padding:50px 16px;
        }

        .notes h2{
          font-size:30px;
        }

        .hero-content p{
          font-size:16px;
        }

      }

      `}</style>
    </div>
  );
};

export default Terms;