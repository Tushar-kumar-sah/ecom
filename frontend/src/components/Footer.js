// src/components/Footer.js

import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">

      <div className="footer-top">

        {/* BRAND */}

        <div className="footer-col brand">
          <h2>UK Traders</h2>

          <p>
            Premium streetwear, oversized tees,
            fashion essentials and modern style
            crafted for confidence.
          </p>

          <div className="socials">
            <a href="/">
              <FaFacebookF />
            </a>

            <a href="/">
              <FaInstagram />
            </a>

            <a href="/">
              <FaTwitter />
            </a>

            <a href="/">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}

        <div className="footer-col">
          <h3>Quick Links</h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/shop">
            Shop
          </Link>

          <Link to="/cart">
            Cart
          </Link>

          <Link to="/profile">
            Profile
          </Link>

          <Link to="/about">
            About Us
          </Link>
        </div>

        {/* SUPPORT */}

        <div className="footer-col">
          <h3>Support</h3>

          <Link to="/contact">
            Contact Us
          </Link>

          <Link to="/help-center">
            Help Center
          </Link>

          <Link to="/shipping-policy">
            Shipping Policy
          </Link>

          <Link to="/return-policy">
            Return Policy
          </Link>

          <Link to="/privacy-policy">
            Privacy Policy
          </Link>

          <Link to="/terms">
            Terms & Conditions
          </Link>
        </div>

        {/* CONTACT */}

        <div className="footer-col">
          <h3>Contact</h3>

          <p>
            <FaMapMarkerAlt />
            Kolkata, India
          </p>

          <p>
            <FaPhoneAlt />
            +91 98765 43210
          </p>

          <p>
            <FaEnvelope />
            support@uktraders.com
          </p>
        </div>

      </div>

      {/* BOTTOM */}

      <div className="footer-bottom">
        © {year} UK Traders.
        All Rights Reserved.
      </div>

      <style>{`

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
      }

      .footer{
        background:#111;
        color:#fff;
        margin-top:0;
      }

      .footer-top{
        max-width:1400px;
        margin:auto;
        padding:70px 16px 40px;
        display:grid;
        grid-template-columns:2fr 1fr 1fr 1.2fr;
        gap:30px;
      }

      .footer-col h2{
        font-size:34px;
        margin-bottom:16px;
      }

      .footer-col h3{
        font-size:22px;
        margin-bottom:18px;
      }

      .footer-col p{
        color:#bbb;
        line-height:1.9;
        margin-bottom:12px;
        display:flex;
        gap:10px;
        align-items:flex-start;
      }

      .footer-col a{
        display:block;
        color:#bbb;
        text-decoration:none;
        margin-bottom:12px;
        transition:.3s;
      }

      .footer-col a:hover{
        color:#fff;
        transform:translateX(4px);
      }

      .brand p{
        max-width:420px;
      }

      .socials{
        display:flex;
        gap:12px;
        margin-top:18px;
      }

      .socials a{
        width:42px;
        height:42px;
        border-radius:50%;
        background:#222;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#fff;
        margin:0;
      }

      .socials a:hover{
        background:#fff;
        color:#111;
        transform:none;
      }

      .footer-bottom{
        border-top:1px solid rgba(255,255,255,.08);
        text-align:center;
        padding:20px 16px;
        color:#aaa;
        font-size:14px;
      }

      @media(max-width:1100px){

        .footer-top{
          grid-template-columns:1fr 1fr;
        }

      }

      @media(max-width:700px){

        .footer-top{
          grid-template-columns:1fr;
          padding:55px 16px 30px;
        }

        .footer-col h2{
          font-size:30px;
        }

        .footer-col h3{
          font-size:20px;
        }

      }

      `}</style>
    </footer>
  );
};

export default Footer;