// src/components/Navbar.js

import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaUser,
  FaSearch,
} from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
      setCartCount(totalQty);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search:", search);
  };

  return (
    <>
      <header className={scrolled ? "navbar scrolled" : "navbar"}>
        <div className="nav-container">
          {/* LOGO */}
          <Link to="/" className="logo">
            UK Traders
          </Link>

          {/* DESKTOP MENU */}
          <nav className="nav-links">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/cart">Cart</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/login">Login</NavLink>
          </nav>

          {/* DESKTOP RIGHT */}
          <div className="nav-right">
            <form className="search-box" onSubmit={handleSearchSubmit}>
              <FaSearch />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <Link to="/cart" className="icon-btn cart-icon">
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            <Link to="/profile" className="icon-btn">
              <FaUser />
            </Link>

            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={menuOpen ? "mobile-overlay show" : "mobile-overlay"}
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* MOBILE SIDEBAR */}
      <aside className={menuOpen ? "mobile-menu open" : "mobile-menu"}>
        <div className="mobile-top">
          <h2>Menu</h2>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>

        <form className="mobile-search" onSubmit={handleSearchSubmit}>
          <FaSearch />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div className="mobile-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/login">Login</NavLink>
        </div>
      </aside>

      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        .navbar{
          width:100%;
          position:sticky;
          top:0;
          left:0;
          z-index:1000;
          background:#ffffff;
          border-bottom:1px solid rgba(0,0,0,0.06);
          transition:all 0.3s ease;
          font-family:Arial,sans-serif;
        }

        .navbar.scrolled{
          box-shadow:0 8px 24px rgba(0,0,0,0.08);
        }

        .nav-container{
          max-width:1400px;
          margin:auto;
          padding:14px 20px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
        }

        .logo{
          font-size:28px;
          font-weight:800;
          color:#111;
          text-decoration:none;
          white-space:nowrap;
        }

        .nav-links{
          display:flex;
          align-items:center;
          gap:24px;
        }

        .nav-links a{
          text-decoration:none;
          color:#333;
          font-size:15px;
          font-weight:600;
          position:relative;
          transition:0.3s;
        }

        .nav-links a:hover{
          color:#111;
        }

        .nav-links a.active{
          color:#111;
        }

        .nav-links a.active::after{
          content:"";
          position:absolute;
          left:0;
          bottom:-6px;
          width:100%;
          height:2px;
          background:#111;
          border-radius:10px;
        }

        .nav-right{
          display:flex;
          align-items:center;
          gap:12px;
        }

        .search-box{
          display:flex;
          align-items:center;
          gap:10px;
          background:#f5f5f5;
          padding:12px 14px;
          border-radius:12px;
          min-width:260px;
        }

        .search-box input{
          border:none;
          outline:none;
          background:transparent;
          width:100%;
          font-size:14px;
        }

        .icon-btn{
          width:44px;
          height:44px;
          border-radius:12px;
          background:#f5f5f5;
          color:#111;
          text-decoration:none;
          display:flex;
          align-items:center;
          justify-content:center;
          position:relative;
          transition:0.3s;
        }

        .icon-btn:hover{
          background:#111;
          color:#fff;
        }

        .cart-badge{
          position:absolute;
          top:-4px;
          right:-4px;
          min-width:20px;
          height:20px;
          border-radius:50%;
          background:#e53935;
          color:#fff;
          font-size:11px;
          font-weight:700;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:0 5px;
        }

        .menu-toggle{
          display:none;
          width:44px;
          height:44px;
          border:none;
          border-radius:12px;
          background:#111;
          color:#fff;
          cursor:pointer;
          font-size:18px;
        }

        .mobile-overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.45);
          opacity:0;
          visibility:hidden;
          transition:0.3s;
          z-index:1100;
        }

        .mobile-overlay.show{
          opacity:1;
          visibility:visible;
        }

        .mobile-menu{
          position:fixed;
          top:0;
          right:-100%;
          width:320px;
          max-width:85%;
          height:100vh;
          background:#fff;
          z-index:1200;
          padding:20px;
          transition:0.3s ease;
          box-shadow:-10px 0 30px rgba(0,0,0,0.12);
          display:flex;
          flex-direction:column;
          gap:20px;
          font-family:Arial,sans-serif;
        }

        .mobile-menu.open{
          right:0;
        }

        .mobile-top{
          display:flex;
          align-items:center;
          justify-content:space-between;
        }

        .mobile-top h2{
          font-size:24px;
          color:#111;
        }

        .mobile-top button{
          width:42px;
          height:42px;
          border:none;
          border-radius:12px;
          background:#111;
          color:#fff;
          cursor:pointer;
          font-size:16px;
        }

        .mobile-search{
          display:flex;
          align-items:center;
          gap:10px;
          background:#f5f5f5;
          padding:12px 14px;
          border-radius:12px;
        }

        .mobile-search input{
          border:none;
          outline:none;
          background:transparent;
          width:100%;
          font-size:14px;
        }

        .mobile-links{
          display:flex;
          flex-direction:column;
          gap:12px;
        }

        .mobile-links a{
          text-decoration:none;
          color:#222;
          font-size:16px;
          font-weight:600;
          padding:14px 16px;
          border-radius:12px;
          background:#f7f7f7;
          transition:0.3s;
        }

        .mobile-links a.active{
          background:#111;
          color:#fff;
        }

        .mobile-links a:hover{
          background:#111;
          color:#fff;
        }

        @media(max-width:1100px){
          .search-box{
            min-width:210px;
          }

          .nav-links{
            gap:18px;
          }
        }

        @media(max-width:992px){
          .nav-links{
            display:none;
          }

          .search-box{
            display:none;
          }

          .menu-toggle{
            display:flex;
            align-items:center;
            justify-content:center;
          }
        }

        @media(max-width:768px){
          .nav-container{
            padding:12px 15px;
            gap:12px;
          }

          .logo{
            font-size:24px;
          }

          .icon-btn{
            width:40px;
            height:40px;
            border-radius:10px;
          }

          .menu-toggle{
            width:40px;
            height:40px;
            border-radius:10px;
          }

          .mobile-menu{
            width:290px;
            padding:16px;
          }

          .mobile-top h2{
            font-size:22px;
          }
        }

        @media(max-width:480px){
          .logo{
            font-size:20px;
          }

          .nav-right{
            gap:8px;
          }

          .icon-btn{
            width:38px;
            height:38px;
          }

          .menu-toggle{
            width:38px;
            height:38px;
            font-size:16px;
          }

          .cart-badge{
            min-width:18px;
            height:18px;
            font-size:10px;
          }

          .mobile-menu{
            width:270px;
          }

          .mobile-links a{
            font-size:15px;
            padding:12px 14px;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;