// src/pages/Login.js
// SIMPLE ADMIN LOGIN (NO JWT)
// USERNAME: admin
// PASSWORD: 123456

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import API from "../api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* INPUT CHANGE */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

    setError("");
  };

  /* LOGIN */
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");

      if (
        !formData.username.trim() ||
        !formData.password.trim()
      ) {
        return setError(
          "Please fill all fields"
        );
      }

      try {
        setLoading(true);

        const { data } =
          await API.post(
            "/admin/login",
            {
              username:
                formData.username.trim(),
              password:
                formData.password,
            }
          );

        if (!data.success) {
          return setError(
            "Login failed"
          );
        }

        /* SAVE SIMPLE ADMIN SESSION */
        localStorage.setItem(
          "isAdmin",
          "true"
        );

        localStorage.setItem(
          "adminInfo",
          JSON.stringify(
            data.user
          )
        );

        navigate(
          "/dashboard"
        );
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Invalid login"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div style={pageStyle}>
      <div style={boxStyle}>
        {/* TOP */}
        <div style={topStyle}>
          <div style={iconCircle}>
            <FaUserShield size={28} />
          </div>

          <h1 style={titleStyle}>
            Admin Login
          </h1>

          <p style={subTitle}>
            Sign in to manage
            your store
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div style={errorBox}>
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
        >
          {/* USERNAME */}
          <div style={inputWrap}>
            <FaUser
              style={
                inputIcon
              }
            />

            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={
                formData.username
              }
              onChange={
                handleChange
              }
              style={
                inputStyle
              }
            />
          </div>

          {/* PASSWORD */}
          <div style={inputWrap}>
            <FaLock
              style={
                inputIcon
              }
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Enter password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              style={
                inputStyle
              }
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              style={
                eyeBtn
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={
              loading
            }
            style={{
              ...loginBtn,
              opacity:
                loading
                  ? 0.7
                  : 1,
            }}
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>
        </form>

        {/* DEMO */}
        <div style={demoBox}>
          <p>
            Demo Credentials
          </p>

          <span>
            Username: admin
          </span>

          <span>
            Password: 123456
          </span>
        </div>
      </div>
    </div>
  );
};

/* STYLES */

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg,#020617,#0f172a,#111827)",
  display: "flex",
  justifyContent:
    "center",
  alignItems:
    "center",
  padding: "20px",
};

const boxStyle = {
  width: "100%",
  maxWidth: "420px",
  background:
    "rgba(17,24,39,.96)",
  border:
    "1px solid #1e293b",
  borderRadius:
    "22px",
  padding: "35px",
};

const topStyle = {
  textAlign: "center",
  marginBottom: "25px",
};

const iconCircle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  background:
    "rgba(37,99,235,.15)",
  color: "#3b82f6",
  display: "flex",
  justifyContent:
    "center",
  alignItems:
    "center",
  margin:
    "0 auto 18px",
};

const titleStyle = {
  color: "#fff",
  fontSize: "30px",
  fontWeight: "800",
  margin: 0,
};

const subTitle = {
  color: "#94a3b8",
  fontSize: "14px",
  marginTop: "8px",
};

const errorBox = {
  background:
    "rgba(239,68,68,.12)",
  color: "#ef4444",
  padding: "12px",
  borderRadius:
    "10px",
  marginBottom:
    "18px",
};

const inputWrap = {
  position: "relative",
  marginBottom: "18px",
};

const inputIcon = {
  position: "absolute",
  left: "14px",
  top: "50%",
  transform:
    "translateY(-50%)",
  color: "#64748b",
};

const inputStyle = {
  width: "100%",
  height: "52px",
  padding:
    "0 45px 0 42px",
  borderRadius:
    "12px",
  border:
    "1px solid #334155",
  background:
    "#0f172a",
  color: "#fff",
  outline: "none",
};

const eyeBtn = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform:
    "translateY(-50%)",
  background:
    "transparent",
  border: "none",
  color: "#94a3b8",
  cursor: "pointer",
};

const loginBtn = {
  width: "100%",
  height: "52px",
  border: "none",
  borderRadius:
    "12px",
  background:
    "linear-gradient(135deg,#2563eb,#1d4ed8)",
  color: "#fff",
  fontWeight: "700",
  fontSize: "16px",
  cursor: "pointer",
};

const demoBox = {
  marginTop: "24px",
  textAlign: "center",
  color: "#94a3b8",
  display: "flex",
  flexDirection:
    "column",
  gap: "4px",
  fontSize: "13px",
};

export default Login;
