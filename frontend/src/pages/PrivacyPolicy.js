// src/pages/PrivacyPolicy.js

import React from "react";
import {
  FaUserShield,
  FaLock,
  FaDatabase,
  FaCookieBite,
} from "react-icons/fa";

const PrivacyPolicy = () => {
  return (
    <div className="policy-page">

      {/* HERO */}

      <section className="hero">
        <div className="overlay"></div>

        <div className="hero-content">
          <span>UK TRADERS</span>

          <h1>
            Privacy Policy
          </h1>

          <p>
            Your privacy matters to us.
            We protect your personal data
            with transparency and care.
          </p>
        </div>
      </section>

      {/* CONTENT */}

      <section className="content">

        <div className="card">
          <FaUserShield />
          <h3>
            Information We Collect
          </h3>
          <p>
            We may collect name, email,
            phone number, shipping address
            and order details.
          </p>
        </div>

        <div className="card">
          <FaLock />
          <h3>
            Data Protection
          </h3>
          <p>
            Your information is stored using
            secure systems and protected from
            unauthorized access.
          </p>
        </div>

        <div className="card">
          <FaDatabase />
          <h3>
            How We Use Data
          </h3>
          <p>
            To process orders, improve service,
            send updates and provide support.
          </p>
        </div>

        <div className="card">
          <FaCookieBite />
          <h3>
            Cookies & Tracking
          </h3>
          <p>
            Cookies help improve browsing
            experience and remember preferences.
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
            We never sell your personal
            information to third parties.
          </li>

          <li>
            Payment details are handled through
            secure payment gateways.
          </li>

          <li>
            You may request correction or
            deletion of your data anytime.
          </li>

          <li>
            Continued use of the website means
            acceptance of this privacy policy.
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
        background:url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1800") center/cover;
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

export default PrivacyPolicy;
