// src/pages/Register.js

import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const API = "http://localhost:5000/api";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-4

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear general error when user types
    if (error) setError("");

    // Update password strength when password field changes
    if (name === "password") {
      evaluatePasswordStrength(value);
    }
  };

  const evaluatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 10) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    setPasswordStrength(Math.min(strength, 4));
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "";
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 1: return "#ef4444";
      case 2: return "#f59e0b";
      case 3: return "#3b82f6";
      case 4: return "#10b981";
      default: return "#e5e7eb";
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!form.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!form.email.includes("@") || !form.email.includes(".")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (form.phone && !/^[\d\s+()-]{8,15}$/.test(form.phone.trim())) {
      setError("Please enter a valid phone number (8-15 digits)");
      return false;
    }
    if (!form.password) {
      setError("Password is required");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API}/users/register`,
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          password: form.password,
        },
        { timeout: 10000 }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/profile");
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response) {
        setError(err.response.data?.message || "Registration failed. Email might already exist.");
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <form className="auth-box" onSubmit={registerUser} noValidate>
          <div className="logo">
            <h1>Create Account</h1>
          </div>
          <p className="subtitle">Join our premium fashion store</p>

          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              autoComplete="name"
              required
            />
          </div>

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
            <FaPhone className="input-icon" />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number (optional)"
              value={form.phone}
              onChange={handleChange}
              disabled={loading}
              autoComplete="tel"
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
              autoComplete="new-password"
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

          {form.password && (
            <div className="password-strength">
              <div
                className="strength-bar"
                style={{
                  width: `${(passwordStrength / 4) * 100}%`,
                  backgroundColor: getStrengthColor(),
                }}
              />
              <span className="strength-text" style={{ color: getStrengthColor() }}>
                {getStrengthText()}
              </span>
            </div>
          )}

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              autoComplete="off"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {form.confirmPassword && form.password && (
            <div className="password-match">
              {form.password === form.confirmPassword ? (
                <span className="match-success">
                  <FaCheckCircle /> Passwords match
                </span>
              ) : (
                <span className="match-error">
                  <FaTimesCircle /> Passwords do not match
                </span>
              )}
            </div>
          )}

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Creating account...
              </>
            ) : (
              "Register"
            )}
          </button>

          <div className="login-prompt">
            <span>Already have an account? </span>
            <Link to="/login">Login</Link>
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
          max-width: 500px;
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

        .password-strength {
          margin-top: -10px;
          margin-bottom: 20px;
        }

        .strength-bar {
          height: 4px;
          border-radius: 4px;
          background: #e5e7eb;
          transition: width 0.2s, background-color 0.2s;
          margin-bottom: 6px;
        }

        .strength-text {
          font-size: 0.7rem;
          font-weight: 500;
        }

        .password-match {
          margin-top: -10px;
          margin-bottom: 20px;
          font-size: 0.75rem;
        }

        .match-success {
          color: #10b981;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .match-error {
          color: #ef4444;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .register-btn {
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
          margin-top: 8px;
        }

        .register-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .register-btn:disabled {
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

        .login-prompt {
          text-align: center;
          margin-top: 28px;
          font-size: 0.9rem;
          color: #4b5563;
        }

        .login-prompt a {
          color: #667eea;
          font-weight: 600;
          text-decoration: none;
        }

        .login-prompt a:hover {
          text-decoration: underline;
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

          .register-btn {
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

          .login-prompt {
            font-size: 0.85rem;
          }
        }

        /* Touch-friendly improvements */
        @media (hover: none) and (pointer: coarse) {
          .register-btn {
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

export default Register;