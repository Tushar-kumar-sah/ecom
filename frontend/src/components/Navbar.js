// src/components/Navbar.js

import React, { useEffect, useState, useCallback } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // Update cart count from localStorage
  const updateCartCount = useCallback(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    setCartCount(totalQty);
  }, []);

  // Check user login state
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
      setIsLoggedIn(true);
      setUserName(user.name || user.email?.split("@")[0] || "User");
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate("/");
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMenuOpen(false);
    }
  };

  // Listen for cart changes and auth changes
  useEffect(() => {
    updateCartCount();
    checkAuth();

    // Listen for storage events (cart or user changes from other tabs)
    const handleStorageChange = () => {
      updateCartCount();
      checkAuth();
    };
    window.addEventListener("storage", handleStorageChange);

    // Listen for custom cart update event (for same-tab updates)
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Listen for login/logout events
    const handleAuthChange = () => checkAuth();
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [updateCartCount, checkAuth]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
            {isLoggedIn ? (
              <>
                <NavLink to="/profile">Profile</NavLink>
                <button onClick={handleLogout} className="desktop-logout">
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login">Login</NavLink>
            )}
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
                aria-label="Search"
              />
            </form>

            <Link to="/cart" className="icon-btn cart-icon">
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {isLoggedIn ? (
              <Link to="/profile" className="icon-btn user-btn" title={userName}>
                <FaUserCircle />
              </Link>
            ) : (
              <Link to="/login" className="icon-btn">
                <FaUser />
              </Link>
            )}

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
        aria-hidden="true"
      />

      {/* MOBILE SIDEBAR */}
      <aside className={menuOpen ? "mobile-menu open" : "mobile-menu"}>
        <div className="mobile-top">
          <h2>Menu</h2>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>

        {isLoggedIn && (
          <div className="mobile-user-info">
            <FaUserCircle />
            <span>Hello, {userName}</span>
          </div>
        )}

        <form className="mobile-search" onSubmit={handleSearchSubmit}>
          <FaSearch />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search"
          />
        </form>

        <div className="mobile-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/profile">Profile</NavLink>
              <button onClick={handleLogout} className="mobile-logout">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </div>
      </aside>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .navbar {
          width: 100%;
          position: sticky;
          top: 0;
          left: 0;
          z-index: 1000;
          background: #ffffff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        }

        .navbar.scrolled {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .nav-container {
          max-width: 1400px;
          margin: auto;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .logo {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-decoration: none;
          white-space: nowrap;
          letter-spacing: -0.5px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav-links a,
        .desktop-logout {
          text-decoration: none;
          color: #334155;
          font-size: 15px;
          font-weight: 600;
          position: relative;
          transition: 0.3s;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .nav-links a:hover,
        .desktop-logout:hover {
          color: #0f172a;
        }

        .nav-links a.active {
          color: #0f172a;
        }

        .nav-links a.active::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 100%;
          height: 2px;
          background: #0f172a;
          border-radius: 10px;
        }

        .desktop-logout {
          color: #ef4444;
        }

        .desktop-logout:hover {
          color: #dc2626;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          padding: 10px 16px;
          border-radius: 40px;
          min-width: 260px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }

        .search-box:focus-within {
          border-color: #0f172a;
          background: white;
          box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.05);
        }

        .search-box input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: 14px;
        }

        .icon-btn {
          width: 44px;
          height: 44px;
          border-radius: 40px;
          background: #f8fafc;
          color: #1e293b;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: 0.3s;
          border: 1px solid #e2e8f0;
        }

        .icon-btn:hover {
          background: #0f172a;
          color: white;
          border-color: #0f172a;
        }

        .user-btn {
          font-size: 1.3rem;
        }

        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 20px;
          height: 20px;
          border-radius: 30px;
          background: #ef4444;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .menu-toggle {
          display: none;
          width: 44px;
          height: 44px;
          border: none;
          border-radius: 40px;
          background: #0f172a;
          color: #fff;
          cursor: pointer;
          font-size: 18px;
          align-items: center;
          justify-content: center;
        }

        /* Mobile Overlay & Menu */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: 0.3s;
          z-index: 1100;
          backdrop-filter: blur(2px);
        }

        .mobile-overlay.show {
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 320px;
          max-width: 85%;
          height: 100vh;
          background: #ffffff;
          z-index: 1200;
          padding: 24px 20px;
          transition: 0.3s ease;
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          gap: 24px;
          font-family: inherit;
        }

        .mobile-menu.open {
          right: 0;
        }

        .mobile-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mobile-top h2 {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
        }

        .mobile-top button {
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 30px;
          background: #0f172a;
          color: #fff;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #f8fafc;
          border-radius: 40px;
          font-weight: 500;
          color: #0f172a;
        }

        .mobile-user-info svg {
          font-size: 1.6rem;
        }

        .mobile-search {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8fafc;
          padding: 12px 16px;
          border-radius: 40px;
          border: 1px solid #e2e8f0;
        }

        .mobile-search input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: 14px;
        }

        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mobile-links a,
        .mobile-logout {
          text-decoration: none;
          color: #1e293b;
          font-size: 16px;
          font-weight: 600;
          padding: 14px 18px;
          border-radius: 40px;
          background: #f8fafc;
          transition: 0.3s;
          border: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: inherit;
        }

        .mobile-links a.active {
          background: #0f172a;
          color: #fff;
        }

        .mobile-links a:hover,
        .mobile-logout:hover {
          background: #0f172a;
          color: #fff;
        }

        .mobile-logout {
          color: #ef4444;
        }

        .mobile-logout:hover {
          background: #ef4444;
          color: white;
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .search-box {
            min-width: 200px;
          }
          .nav-links {
            gap: 20px;
          }
        }

        @media (max-width: 992px) {
          .nav-links {
            display: none;
          }
          .search-box {
            display: none;
          }
          .menu-toggle {
            display: flex;
          }
        }

        @media (max-width: 768px) {
          .nav-container {
            padding: 10px 16px;
          }
          .logo {
            font-size: 24px;
          }
          .icon-btn {
            width: 40px;
            height: 40px;
          }
          .menu-toggle {
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .logo {
            font-size: 20px;
          }
          .nav-right {
            gap: 8px;
          }
          .icon-btn {
            width: 38px;
            height: 38px;
          }
          .menu-toggle {
            width: 38px;
            height: 38px;
            font-size: 16px;
          }
          .cart-badge {
            min-width: 18px;
            height: 18px;
            font-size: 10px;
            top: -2px;
            right: -2px;
          }
          .mobile-menu {
            width: 280px;
            padding: 20px 16px;
          }
          .mobile-links a,
          .mobile-logout {
            padding: 12px 16px;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;