// src/App.js
// UPDATED APP.JS
// LOGIN REMOVED TEMPORARILY
// DIRECT ADMIN ACCESS

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
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Coupons from "./pages/Coupons";
import Settings from "./pages/Settings";

/* =========================
   APP
========================= */
function App() {
  return (
    <Router>
      <Routes>
        {/* DASHBOARD */}
        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={<Products />}
        />

        {/* ORDERS */}
        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* USERS */}
        <Route
          path="/users"
          element={<Users />}
        />

        {/* COUPONS */}
        <Route
          path="/coupons"
          element={<Coupons />}
        />

        {/* SETTINGS */}
        <Route
          path="/settings"
          element={<Settings />}
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
