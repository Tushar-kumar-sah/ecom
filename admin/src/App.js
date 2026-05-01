// src/App.js
// FULL UPDATED APP.JS
// PREMIUM ADMIN PANEL ROUTING

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* =========================
   PAGES
========================= */
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Coupons from "./pages/Coupons";
import Settings from "./pages/Settings";

/* =========================
   PROTECTED ROUTE
========================= */
const ProtectedRoute = ({
  children,
}) => {
  const adminInfo =
    localStorage.getItem(
      "adminInfo"
    );

  return adminInfo ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
    />
  );
};

/* =========================
   APP
========================= */
function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        {/* ORDERS */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* USERS */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* COUPONS */}
        <Route
          path="/coupons"
          element={
            <ProtectedRoute>
              <Coupons />
            </ProtectedRoute>
          }
        />

        {/* SETTINGS */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
