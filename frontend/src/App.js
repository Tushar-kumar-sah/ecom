// src/App.js

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* COMPONENTS */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* MAIN PAGES */
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

/* EXTRA PAGES */
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import About from "./pages/About";

/* PAYMENT CALLBACK (optional) – in case Razorpay redirects */
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";

/* ==================================
PROTECTED ROUTE
================================== */

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

/* ==================================
MAIN LAYOUT (Navbar + Footer)
================================== */

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

/* ==================================
APP
================================== */

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC PAGES WITH LAYOUT */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/shop"
          element={
            <MainLayout>
              <Shop />
            </MainLayout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <MainLayout>
              <ProductDetails />
            </MainLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <MainLayout>
              <Cart />
            </MainLayout>
          }
        />

        {/* CHECKOUT – you may also protect it if login required */}
        <Route
          path="/checkout"
          element={
            <MainLayout>
              <Checkout />
            </MainLayout>
          }
        />

        {/* STATIC INFO PAGES */}
        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />
        <Route
          path="/shipping-policy"
          element={
            <MainLayout>
              <ShippingPolicy />
            </MainLayout>
          }
        />
        <Route
          path="/return-policy"
          element={
            <MainLayout>
              <ReturnPolicy />
            </MainLayout>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <MainLayout>
              <PrivacyPolicy />
            </MainLayout>
          }
        />
        <Route
          path="/terms"
          element={
            <MainLayout>
              <Terms />
            </MainLayout>
          }
        />
        <Route
          path="/help-center"
          element={
            <MainLayout>
              <HelpCenter />
            </MainLayout>
          }
        />

        {/* AUTH PAGES (NO NAVBAR/FOOTER – CLEAN LAYOUT) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED USER PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* OPTIONAL: RAZORPAY CALLBACK PAGES (if you want to handle redirects) */}
        <Route
          path="/payment-success"
          element={
            <MainLayout>
              <PaymentSuccess />
            </MainLayout>
          }
        />
        <Route
          path="/payment-failure"
          element={
            <MainLayout>
              <PaymentFailure />
            </MainLayout>
          }
        />

        {/* 404 – Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;