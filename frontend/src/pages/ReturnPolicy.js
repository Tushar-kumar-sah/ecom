// src/pages/ReturnPolicy.js

import React from "react";
import {
  FaUndoAlt,
  FaBoxOpen,
  FaCheckCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

const ReturnPolicy = () => {
  return (
    <div className="policy-page">

      {/* HERO */}

      <section className="hero">
        <div className="overlay"></div>

        <div className="hero-content">
          <span>UK TRADERS</span>

          <h1>
            Return & Refund Policy
          </h1>

          <p>
            Easy returns and smooth refunds
            for a stress-free shopping experience.
          </p>
        </div>
      </section>

      {/* CARDS */}

      <section className="content">

        <div className="card">
          <FaUndoAlt />
          <h3>
            7 Day Return Window
          </h3>
          <p>
            You can request a return within
            7 days of receiving your order.
          </p>
        </div>

        <div className="card">
          <FaBoxOpen />
          <h3>
            Product Condition
          </h3>
          <p>
            Items must be unused, unwashed,
            and returned with original tags.
          </p>
        </div>

        <div className="card">
          <FaCheckCircle />
          <h3>
            Return Approval
          </h3>
          <p>
            Once verified, our team approves
            the return request quickly.
          </p>
        </div>

        <div className="card">
          <FaMoneyBillWave />
          <h3>
            Refund Timeline
          </h3>
          <p>
            Refunds are processed within
            5-7 business days after approval.
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
            Sale items may not be eligible
            for return unless damaged.
          </li>

          <li>
            Shipping fees are non-refundable
            unless item is defective.
          </li>

          <li>
            Incorrect size orders can be
            exchanged based on stock.
          </li>

          <li>
            Contact support for any damaged
            or wrong product received.
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
        background:url("https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1800") center/cover;
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
        font-size:clamp(34px,7vw,68px);
        margin:16px 0;
      }

      .hero-content p{
        font-size:18px;
        line-height:1.7;
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

export default ReturnPolicy;