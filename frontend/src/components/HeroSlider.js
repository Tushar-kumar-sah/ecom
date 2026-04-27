// src/components/HeroSlider.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from "react-icons/fa";

const HeroSlider = () => {
  const slides = [
    {
      id: 1,
      title: "New Streetwear Collection",
      subtitle: "Premium fashion made for bold personalities.",
      button: "Shop Now",
      image:
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1600",
    },
    {
      id: 2,
      title: "Oversized Tees Are Here",
      subtitle: "Comfort meets modern style in every fit.",
      button: "Explore Tees",
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1600",
    },
    {
      id: 3,
      title: "Limited Edition Drops",
      subtitle: "Fresh arrivals with premium quality fabric.",
      button: "View Collection",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600",
    },
  ];

  const [current, setCurrent] = useState(0);

  // Auto Slide (Fixed Warning)
  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(autoSlide);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  return (
    <section className="hero-slider">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={index === current ? "slide active" : "slide"}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="overlay">
            <div className="hero-content">
              <span className="small-tag">TRENDING NOW</span>

              <h1>{slide.title}</h1>

              <p>{slide.subtitle}</p>

              <Link to="/shop" className="hero-btn">
                {slide.button} <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button className="nav-btn prev" onClick={prevSlide}>
        <FaChevronLeft />
      </button>

      <button className="nav-btn next" onClick={nextSlide}>
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={index === current ? "dot active-dot" : "dot"}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>

      {/* CSS */}
      <style>{`

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
      }

      .hero-slider{
        width:100%;
        height:90vh;
        position:relative;
        overflow:hidden;
        font-family:Arial,sans-serif;
      }

      .slide{
        position:absolute;
        width:100%;
        height:100%;
        top:0;
        left:0;
        opacity:0;
        transition:opacity .8s ease-in-out;
        background-size:cover;
        background-position:center;
      }

      .slide.active{
        opacity:1;
        z-index:1;
      }

      .overlay{
        width:100%;
        height:100%;
        background:linear-gradient(
          to right,
          rgba(0,0,0,.75),
          rgba(0,0,0,.35)
        );
        display:flex;
        align-items:center;
      }

      .hero-content{
        max-width:1400px;
        width:100%;
        margin:auto;
        padding:0 70px;
        color:#fff;
      }

      .small-tag{
        display:inline-block;
        margin-bottom:15px;
        padding:8px 14px;
        background:rgba(255,255,255,.12);
        border-radius:30px;
        font-size:13px;
        letter-spacing:1px;
      }

      .hero-content h1{
        font-size:64px;
        max-width:650px;
        line-height:1.1;
        margin-bottom:18px;
      }

      .hero-content p{
        font-size:20px;
        max-width:550px;
        line-height:1.7;
        margin-bottom:28px;
        opacity:.95;
      }

      .hero-btn{
        display:inline-flex;
        align-items:center;
        gap:10px;
        text-decoration:none;
        background:#fff;
        color:#111;
        padding:15px 26px;
        border-radius:50px;
        font-weight:700;
        transition:.3s;
      }

      .hero-btn:hover{
        transform:translateY(-3px);
      }

      .nav-btn{
        position:absolute;
        top:50%;
        transform:translateY(-50%);
        width:48px;
        height:48px;
        border:none;
        border-radius:50%;
        background:rgba(255,255,255,.18);
        color:#fff;
        font-size:18px;
        cursor:pointer;
        z-index:5;
      }

      .prev{
        left:18px;
      }

      .next{
        right:18px;
      }

      .nav-btn:hover{
        background:rgba(255,255,255,.28);
      }

      .dots{
        position:absolute;
        bottom:22px;
        left:50%;
        transform:translateX(-50%);
        display:flex;
        gap:10px;
        z-index:5;
      }

      .dot{
        width:12px;
        height:12px;
        border-radius:50%;
        background:rgba(255,255,255,.45);
        cursor:pointer;
      }

      .active-dot{
        background:#fff;
        width:28px;
        border-radius:20px;
      }

      @media(max-width:992px){

        .hero-slider{
          height:75vh;
        }

        .hero-content{
          padding:0 45px;
        }

        .hero-content h1{
          font-size:48px;
        }

        .hero-content p{
          font-size:18px;
        }

      }

      @media(max-width:768px){

        .hero-slider{
          height:70vh;
        }

        .hero-content{
          padding:0 20px;
          text-align:center;
        }

        .hero-content h1{
          font-size:34px;
        }

        .hero-content p{
          font-size:16px;
        }

        .hero-btn{
          padding:13px 22px;
          font-size:14px;
        }

        .nav-btn{
          width:40px;
          height:40px;
          font-size:14px;
        }

      }

      @media(max-width:480px){

        .hero-slider{
          height:62vh;
        }

        .hero-content h1{
          font-size:28px;
        }

        .hero-content p{
          font-size:14px;
        }

        .small-tag{
          font-size:11px;
          padding:7px 12px;
        }

        .nav-btn{
          display:none;
        }

      }

      `}</style>
    </section>
  );
};

export default HeroSlider;