// src/components/BannerSlider.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaTag } from "react-icons/fa";

const BannerSlider = () => {
  const banners = [
    {
      id: 1,
      title: "Flat 50% OFF",
      subtitle: "On selected premium streetwear collections",
      code: "STYLE50",
      buttonText: "Shop Deals",
      bg: "linear-gradient(135deg, #111, #2d2d2d)",
    },
    {
      id: 2,
      title: "Buy 2 Get 1 Free",
      subtitle: "Upgrade your wardrobe with fresh oversized tees",
      code: "BUY2GET1",
      buttonText: "Explore Offer",
      bg: "linear-gradient(135deg, #1a1a1a, #4b2e2e)",
    },
    {
      id: 3,
      title: "Free Shipping",
      subtitle: "On all orders above ₹1999 across India",
      code: "FREESHIP",
      buttonText: "Start Shopping",
      bg: "linear-gradient(135deg, #0f172a, #1e293b)",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  return (
    <section className="banner-slider">
      <div
        className="banner-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div className="banner-slide" key={banner.id}>
            <div
              className="banner-card"
              style={{ background: banner.bg }}
            >
              <div className="banner-left">
                <div className="offer-tag">
                  <FaTag />
                  <span>Limited Offer</span>
                </div>

                <h2>{banner.title}</h2>
                <p>{banner.subtitle}</p>

                <div className="coupon-code">
                  Use Code: <strong>{banner.code}</strong>
                </div>

                <Link to="/shop" className="banner-btn">
                  {banner.buttonText}
                </Link>
              </div>

              <div className="banner-right">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
                <div className="discount-box">
                  <span>Save Big</span>
                  <h3>{banner.title}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="banner-nav prev" onClick={prevSlide}>
        <FaChevronLeft />
      </button>

      <button className="banner-nav next" onClick={nextSlide}>
        <FaChevronRight />
      </button>

      <div className="banner-dots">
        {banners.map((_, index) => (
          <span
            key={index}
            className={index === current ? "dot active-dot" : "dot"}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>

      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        .banner-slider{
          width:100%;
          overflow:hidden;
          position:relative;
          padding:30px 20px 50px;
          background:#fafafa;
          font-family:Arial,sans-serif;
        }

        .banner-track{
          display:flex;
          transition:transform .6s ease-in-out;
          width:100%;
        }

        .banner-slide{
          min-width:100%;
          padding:0 5px;
        }

        .banner-card{
          width:100%;
          min-height:300px;
          border-radius:24px;
          display:grid;
          grid-template-columns:1.2fr .8fr;
          align-items:center;
          overflow:hidden;
          position:relative;
          padding:40px;
          color:#fff;
        }

        .banner-left{
          z-index:2;
          max-width:600px;
        }

        .offer-tag{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:8px 14px;
          border-radius:30px;
          background:rgba(255,255,255,.12);
          margin-bottom:18px;
          font-size:14px;
        }

        .banner-left h2{
          font-size:46px;
          line-height:1.1;
          margin-bottom:14px;
        }

        .banner-left p{
          font-size:18px;
          line-height:1.6;
          opacity:.95;
          margin-bottom:18px;
        }

        .coupon-code{
          display:inline-block;
          padding:12px 18px;
          border:1px dashed rgba(255,255,255,.5);
          border-radius:12px;
          margin-bottom:22px;
          font-size:16px;
          background:rgba(255,255,255,.08);
        }

        .banner-btn{
          display:inline-block;
          text-decoration:none;
          background:#fff;
          color:#111;
          padding:14px 24px;
          border-radius:40px;
          font-weight:700;
          transition:.3s;
        }

        .banner-btn:hover{
          transform:translateY(-2px);
        }

        .banner-right{
          position:relative;
          height:100%;
          display:flex;
          justify-content:center;
          align-items:center;
        }

        .circle{
          position:absolute;
          border-radius:50%;
          background:rgba(255,255,255,.08);
        }

        .circle-1{
          width:220px;
          height:220px;
          top:20px;
          right:20px;
        }

        .circle-2{
          width:140px;
          height:140px;
          bottom:20px;
          left:30px;
        }

        .discount-box{
          position:relative;
          z-index:2;
          width:220px;
          height:220px;
          border-radius:50%;
          background:rgba(255,255,255,.12);
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          text-align:center;
          backdrop-filter:blur(5px);
          padding:20px;
        }

        .discount-box span{
          font-size:16px;
          opacity:.9;
          margin-bottom:8px;
        }

        .discount-box h3{
          font-size:28px;
          line-height:1.2;
        }

        .banner-nav{
          position:absolute;
          top:50%;
          transform:translateY(-50%);
          width:46px;
          height:46px;
          border:none;
          border-radius:50%;
          background:rgba(17,17,17,.75);
          color:#fff;
          cursor:pointer;
          z-index:5;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .banner-nav.prev{
          left:28px;
        }

        .banner-nav.next{
          right:28px;
        }

        .banner-dots{
          margin-top:18px;
          display:flex;
          justify-content:center;
          gap:10px;
        }

        .dot{
          width:11px;
          height:11px;
          border-radius:50%;
          background:#cfcfcf;
          cursor:pointer;
          transition:.3s;
        }

        .active-dot{
          width:28px;
          border-radius:20px;
          background:#111;
        }

        @media(max-width:992px){
          .banner-card{
            grid-template-columns:1fr;
            gap:30px;
            min-height:auto;
            padding:32px;
          }

          .banner-left h2{
            font-size:38px;
          }

          .banner-left p{
            font-size:16px;
          }

          .banner-right{
            min-height:220px;
          }

          .discount-box{
            width:180px;
            height:180px;
          }

          .discount-box h3{
            font-size:24px;
          }
        }

        @media(max-width:768px){
          .banner-slider{
            padding:20px 15px 40px;
          }

          .banner-card{
            padding:24px 20px;
            border-radius:18px;
          }

          .banner-left{
            text-align:center;
            max-width:100%;
          }

          .offer-tag{
            font-size:13px;
          }

          .banner-left h2{
            font-size:30px;
          }

          .banner-left p{
            font-size:15px;
          }

          .coupon-code{
            font-size:14px;
            padding:10px 14px;
          }

          .banner-btn{
            padding:12px 20px;
            font-size:14px;
          }

          .banner-right{
            min-height:180px;
          }

          .discount-box{
            width:150px;
            height:150px;
          }

          .discount-box span{
            font-size:14px;
          }

          .discount-box h3{
            font-size:20px;
          }

          .circle-1{
            width:160px;
            height:160px;
            top:10px;
            right:10px;
          }

          .circle-2{
            width:100px;
            height:100px;
            left:10px;
            bottom:10px;
          }

          .banner-nav{
            width:40px;
            height:40px;
          }

          .banner-nav.prev{
            left:12px;
          }

          .banner-nav.next{
            right:12px;
          }
        }

        @media(max-width:480px){
          .banner-card{
            padding:20px 16px;
          }

          .banner-left h2{
            font-size:24px;
          }

          .banner-left p{
            font-size:14px;
          }

          .offer-tag{
            padding:7px 12px;
            font-size:12px;
          }

          .coupon-code{
            width:100%;
            font-size:13px;
          }

          .banner-btn{
            width:100%;
            text-align:center;
          }

          .banner-right{
            min-height:150px;
          }

          .discount-box{
            width:130px;
            height:130px;
            padding:14px;
          }

          .discount-box h3{
            font-size:17px;
          }

          .banner-nav{
            display:none;
          }
        }
      `}</style>
    </section>
  );
};

export default BannerSlider;