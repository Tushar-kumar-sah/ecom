// src/pages/ShippingPolicy.js

import React from "react";
import {
  FaTruck,
  FaClock,
  FaBoxOpen,
  FaMapMarkedAlt,
} from "react-icons/fa";

const ShippingPolicy = () => {
  return (
    <div className="policy-page">

      {/* HERO */}

      <section className="hero">
        <div className="overlay"></div>

        <div className="hero-content">
          <span>UK TRADERS</span>

          <h1>
            Shipping Policy
          </h1>

          <p>
            Fast, secure and reliable delivery
            for every order.
          </p>
        </div>
      </section>

      {/* CONTENT */}

      <section className="content">

        <div className="card">
          <FaTruck />
          <h3>
            Delivery Coverage
          </h3>
          <p>
            We currently ship across India
            using trusted courier partners.
          </p>
        </div>

        <div className="card">
          <FaClock />
          <h3>
            Processing Time
          </h3>
          <p>
            Orders are processed within
            1-2 business days after payment
            confirmation.
          </p>
        </div>

        <div className="card">
          <FaBoxOpen />
          <h3>
            Delivery Time
          </h3>
          <p>
            Metro cities: 2-5 days.
            Other areas: 4-8 days depending
            on location.
          </p>
        </div>

        <div className="card">
          <FaMapMarkedAlt />
          <h3>
            Tracking Orders
          </h3>
          <p>
            Once dispatched, tracking details
            will be shared by email or SMS.
          </p>
        </div>

      </section>

      {/* EXTRA */}

      <section className="notes">
        <h2>
          Important Notes
        </h2>

        <ul>
          <li>
            Delivery delays may happen during
            festivals or weather issues.
          </li>

          <li>
            Incorrect address details may
            delay shipment.
          </li>

          <li>
            Please ensure someone is
            available to receive the parcel.
          </li>

          <li>
            Shipping charges (if any) are
            shown during checkout.
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
        background:url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800") center/cover;
        position:relative;
        display:flex;
        justify-content:center;
        align-items:center;
        padding:20px;
      }

      .overlay{
        position:absolute;
        inset:0;
        background:rgba(0,0,0,.6);
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
        font-size:clamp(34px,7vw,70px);
        margin:16px 0;
      }

      .hero-content p{
        font-size:18px;
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
        margin-bottom:12px;
        font-size:24px;
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
        border-radius:24px;
        padding:30px;
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

export default ShippingPolicy;