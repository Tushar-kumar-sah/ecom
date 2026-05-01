// src/components/Footer.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaPaperPlane,
  FaArrowUp,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setNewsletterStatus("error");
      setTimeout(() => setNewsletterStatus(null), 3000);
      return;
    }

    setLoading(true);
    setNewsletterStatus(null);

    try {
      // Replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 800));
      setNewsletterStatus("success");
      setEmail("");
    } catch {
      setNewsletterStatus("error");
    } finally {
      setLoading(false);
      setTimeout(() => setNewsletterStatus(null), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        {/* BRAND COLUMN */}
        <div className="footer-col brand">
          <h2>UK Traders</h2>
          <p>
            Premium streetwear, oversized tees, fashion essentials and modern
            style crafted for confidence.
          </p>
          <div className="socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* QUICK LINKS - FIXED */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <div className="links-group">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/about">About Us</Link>
          </div>
        </div>

        {/* SUPPORT - FIXED */}
        <div className="footer-col">
          <h3>Support</h3>
          <div className="links-group">
            <Link to="/contact">Contact Us</Link>
            <Link to="/help-center">Help Center</Link>
            <Link to="/shipping-policy">Shipping Policy</Link>
            <Link to="/return-policy">Return Policy</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>

        {/* CONTACT & NEWSLETTER */}
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

          <div className="newsletter">
            <h3>Newsletter</h3>
            <p>Get the latest updates on new drops & offers</p>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                aria-label="Email for newsletter"
              />
              <button type="submit" disabled={loading}>
                {loading ? "..." : <FaPaperPlane />}
              </button>
            </form>
            {newsletterStatus === "success" && (
              <div className="newsletter-success">
                <FaCheckCircle /> Subscribed successfully!
              </div>
            )}
            {newsletterStatus === "error" && (
              <div className="newsletter-error">
                <FaExclamationTriangle /> Invalid email or server error.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <div className="bottom-content">
          <span>© {year} UK Traders. All Rights Reserved.</span>
          <button onClick={scrollToTop} className="back-to-top" aria-label="Back to top">
            <FaArrowUp /> Top
          </button>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .footer {
          background: #0a0a0a;
          color: #e5e5e5;
          margin-top: 0;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-top {
          max-width: 1400px;
          margin: 0 auto;
          padding: 70px 24px 40px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.3fr;
          gap: 40px;
        }

        .footer-col h2 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff, #a0a0a0);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          margin-bottom: 18px;
          letter-spacing: -0.5px;
        }

        .footer-col h3 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #ffffff;
          position: relative;
          display: inline-block;
        }

        .footer-col h3::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 40px;
          height: 2px;
          background: #ffffff;
          border-radius: 4px;
        }

        /* Links group - fixed alignment & hover */
        .links-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-col a {
          color: #b0b0b0;
          text-decoration: none;
          transition: color 0.2s ease;
          font-size: 0.95rem;
          display: inline-block;
          width: fit-content;
          cursor: pointer;
        }

        .footer-col a:hover {
          color: #ffffff;
          text-decoration: none;
        }

        /* Contact info */
        .footer-col p {
          color: #b0b0b0;
          line-height: 1.6;
          margin-bottom: 12px;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .footer-col p svg {
          flex-shrink: 0;
          color: #ffffff;
        }

        .brand p {
          max-width: 380px;
          line-height: 1.7;
        }

        .socials {
          display: flex;
          gap: 14px;
          margin-top: 24px;
        }

        .socials a {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #1e1e1e;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: 0.3s;
          font-size: 1.1rem;
        }

        .socials a:hover {
          background: #ffffff;
          color: #0a0a0a;
          transform: translateY(-3px);
        }

        /* Newsletter */
        .newsletter {
          margin-top: 28px;
        }

        .newsletter p {
          font-size: 0.85rem;
          margin-bottom: 16px;
          color: #aaa;
        }

        .newsletter-form {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .newsletter-form input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #2c2c2c;
          border-radius: 40px;
          background: #1a1a1a;
          color: white;
          font-size: 0.9rem;
          outline: none;
          transition: 0.2s;
        }

        .newsletter-form input:focus {
          border-color: #ffffff;
          background: #222;
        }

        .newsletter-form button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: #ffffff;
          color: #0a0a0a;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s;
          font-size: 1.1rem;
        }

        .newsletter-form button:hover:not(:disabled) {
          background: #e0e0e0;
          transform: scale(1.02);
        }

        .newsletter-form button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .newsletter-success,
        .newsletter-error {
          margin-top: 12px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 40px;
          animation: fadeSlide 0.3s ease;
        }

        .newsletter-success {
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
        }

        .newsletter-error {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }

        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Footer bottom */
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 20px 24px;
        }

        .bottom-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.85rem;
          color: #8a8a8a;
        }

        .back-to-top {
          background: #1e1e1e;
          border: none;
          color: #ffffff;
          padding: 8px 20px;
          border-radius: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          transition: 0.3s;
          font-family: inherit;
        }

        .back-to-top:hover {
          background: #ffffff;
          color: #0a0a0a;
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 48px 32px;
            padding: 60px 24px 40px;
          }
          .brand {
            grid-column: span 2;
          }
        }

        @media (max-width: 700px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 48px 20px 32px;
          }
          .brand {
            grid-column: auto;
          }
          .footer-col h2 {
            font-size: 28px;
          }
          .footer-col h3 {
            font-size: 18px;
          }
          .bottom-content {
            flex-direction: column;
            text-align: center;
          }
          .socials {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;