// src/pages/Login.js

import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const API = "http://localhost:5000/api";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!form.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!form.email.includes("@") || !form.email.includes(".")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!form.password) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const loginUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API}/users/login`, form, {
        timeout: 10000,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/profile");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        setError(err.response.data?.message || "Invalid email or password");
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <form className="auth-box" onSubmit={loginUser} noValidate>
          <div className="logo">
            <h1>Welcome Back</h1>
          </div>
          <p className="subtitle">Sign in to continue to your account</p>

          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="forgot-row">
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          <div className="signup-prompt">
            <span>New customer? </span>
            <Link to="/register">Create an account</Link>
          </div>

          <div className="demo-hint">
            <p>Demo: user@example.com / password123</p>
          </div>
        </form>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        }

        .auth-container {
          width: 100%;
          max-width: 480px;
          animation: fadeInUp 0.5s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-box {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          padding: 40px 36px;
          border-radius: 32px;
          box-shadow: 0 25px 45px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease;
        }

        .logo h1 {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-align: center;
          margin-bottom: 8px;
        }

        .subtitle {
          text-align: center;
          color: #6c757d;
          margin-bottom: 32px;
          font-size: 0.95rem;
        }

        .error-message {
          background: #fee2e2;
          border-left: 4px solid #dc2626;
          color: #b91c1c;
          padding: 12px 16px;
          border-radius: 14px;
          margin-bottom: 20px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: shake 0.3s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .input-group {
          position: relative;
          margin-bottom: 20px;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 1rem;
          pointer-events: none;
        }

        .input-group input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          border: 1.5px solid #e5e7eb;
          border-radius: 20px;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s;
          background: #fff;
          font-family: inherit;
        }

        .input-group input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .input-group input:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 1rem;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .password-toggle:hover {
          color: #4b5563;
        }

        .password-toggle:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .forgot-row {
          text-align: right;
          margin-bottom: 24px;
        }

        .forgot-link {
          font-size: 0.85rem;
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .forgot-link:hover {
          color: #5a67d8;
          text-decoration: underline;
        }

        .login-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          color: white;
          padding: 14px;
          border-radius: 40px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .signup-prompt {
          text-align: center;
          margin-top: 28px;
          font-size: 0.9rem;
          color: #4b5563;
        }

        .signup-prompt a {
          color: #667eea;
          font-weight: 600;
          text-decoration: none;
        }

        .signup-prompt a:hover {
          text-decoration: underline;
        }

        .demo-hint {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
          text-align: center;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .demo-hint p {
          font-family: monospace;
          background: #f8f9fa;
          display: inline-block;
          padding: 4px 12px;
          border-radius: 40px;
        }

        /* ========== RESPONSIVE ========== */
        @media (max-width: 640px) {
          .auth-container {
            max-width: 100%;
          }

          .auth-box {
            padding: 32px 24px;
            border-radius: 28px;
          }

          .logo h1 {
            font-size: 1.8rem;
          }

          .subtitle {
            font-size: 0.85rem;
            margin-bottom: 24px;
          }

          .input-group input {
            padding: 12px 16px 12px 40px;
            font-size: 0.9rem;
          }

          .login-btn {
            padding: 12px;
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .auth-page {
            padding: 16px;
          }

          .auth-box {
            padding: 28px 20px;
          }

          .logo h1 {
            font-size: 1.6rem;
          }

          .forgot-link {
            font-size: 0.8rem;
          }

          .signup-prompt {
            font-size: 0.85rem;
          }
        }

        /* Touch-friendly improvements */
        @media (hover: none) and (pointer: coarse) {
          .login-btn {
            padding: 14px;
          }
          
          .input-group input {
            font-size: 16px; /* Prevent zoom on mobile */
          }
        }
      `}</style>
    </div>
  );
};

export default Login;