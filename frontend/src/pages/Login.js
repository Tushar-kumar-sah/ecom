// src/pages/Login.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaMobileAlt,
  FaKey,
  FaArrowLeft,
  FaClock,
} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const API = "http://localhost:5000/api";

  // Common state
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState("password"); // "password" or "otp"

  // Password login state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP login state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Timer for OTP resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Clear errors when switching method or typing
  useEffect(() => {
    setError("");
  }, [loginMethod, email, password, otpCode]);

  // ---------- Password Login ----------
  const validatePasswordForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API}/users/login`,
        { email, password },
        { timeout: 10000 }
      );

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

  // ---------- OTP Login ----------
  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError("Email is required to send OTP");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    setSendingOtp(true);
    setError("");

    try {
      await axios.post(`${API}/users/send-otp`, { email }, { timeout: 10000 });
      setOtpSent(true);
      setResendTimer(60); // Start 60s cooldown
      setError("");
    } catch (err) {
      console.error("Send OTP error:", err);
      if (err.response) {
        setError(err.response.data?.message || "Failed to send OTP. Try again.");
      } else {
        setError("Network error. Please check your connection.");
      }
      setOtpSent(false);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError("OTP code is required");
      return;
    }
    if (!/^\d{6}$/.test(otpCode)) {
      setError("OTP must be a 6-digit number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API}/users/verify-otp`,
        { email, otp: otpCode },
        { timeout: 10000 }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/profile");
    } catch (err) {
      console.error("OTP verification error:", err);
      if (err.response) {
        setError(err.response.data?.message || "Invalid or expired OTP");
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      handleSendOtp();
    }
  };

  // Switch login method
  const switchToPassword = () => {
    setLoginMethod("password");
    setOtpSent(false);
    setOtpCode("");
    setResendTimer(0);
    setError("");
  };

  const switchToOtp = () => {
    setLoginMethod("otp");
    setPassword("");
    setError("");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <form
          className="auth-box"
          onSubmit={
            loginMethod === "password" ? handlePasswordLogin : handleVerifyOtp
          }
          noValidate
        >
          <div className="logo">
            <h1>Welcome Back</h1>
          </div>
          <p className="subtitle">
            {loginMethod === "password"
              ? "Sign in with your password"
              : otpSent
              ? "Enter the 6-digit code sent to your email"
              : "Sign in with one-time password"}
          </p>

          {/* Method Switcher */}
          <div className="method-switcher">
            <button
              type="button"
              className={`method-btn ${loginMethod === "password" ? "active" : ""}`}
              onClick={switchToPassword}
              disabled={loading || sendingOtp}
            >
              <FaLock /> Password
            </button>
            <button
              type="button"
              className={`method-btn ${loginMethod === "otp" ? "active" : ""}`}
              onClick={switchToOtp}
              disabled={loading || sendingOtp}
            >
              <FaMobileAlt /> OTP Login
            </button>
          </div>

          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          {/* Email Field (common) */}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || sendingOtp || (loginMethod === "otp" && otpSent)}
              autoComplete="email"
              required
            />
          </div>

          {/* Password Login Fields */}
          {loginMethod === "password" && (
            <>
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </>
          )}

          {/* OTP Login Fields */}
          {loginMethod === "otp" && (
            <>
              {!otpSent ? (
                // Step 1: Send OTP button
                <button
                  type="button"
                  className="send-otp-btn"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || !email.trim()}
                >
                  {sendingOtp ? (
                    <>
                      <FaSpinner className="spinner" /> Sending OTP...
                    </>
                  ) : (
                    "Send OTP Code"
                  )}
                </button>
              ) : (
                // Step 2: OTP input + verify
                <>
                  <div className="input-group">
                    <FaKey className="input-icon" />
                    <input
                      name="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      disabled={loading}
                      maxLength={6}
                      autoComplete="one-time-code"
                      required
                    />
                  </div>

                  <div className="otp-actions">
                    <button
                      type="button"
                      className="resend-otp-btn"
                      onClick={handleResendOtp}
                      disabled={resendTimer > 0 || loading}
                    >
                      {resendTimer > 0 ? (
                        <>
                          <FaClock /> Resend in {resendTimer}s
                        </>
                      ) : (
                        "Resend Code"
                      )}
                    </button>
                  </div>

                  <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? (
                      <>
                        <FaSpinner className="spinner" /> Verifying...
                      </>
                    ) : (
                      "Verify & Login"
                    )}
                  </button>
                </>
              )}
            </>
          )}

          <div className="signup-prompt">
            <span>New customer? </span>
            <Link to="/register">Create an account</Link>
          </div>

          <div className="demo-hint">
            {loginMethod === "password" ? (
              <p>Demo: user@example.com / password123</p>
            ) : (
              <p>OTP will be sent to your registered email</p>
            )}
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
          margin-bottom: 24px;
          font-size: 0.95rem;
        }

        /* Method Switcher */
        .method-switcher {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          background: #f1f3f5;
          padding: 4px;
          border-radius: 48px;
        }

        .method-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 0;
          border: none;
          background: transparent;
          border-radius: 40px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          color: #495057;
        }

        .method-btn.active {
          background: white;
          color: #667eea;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .method-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        .login-btn,
        .send-otp-btn {
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

        .send-otp-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          margin-top: 8px;
        }

        .login-btn:hover:not(:disabled),
        .send-otp-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .login-btn:disabled,
        .send-otp-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .otp-actions {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 24px;
        }

        .resend-otp-btn {
          background: none;
          border: none;
          color: #667eea;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          transition: background 0.2s;
        }

        .resend-otp-btn:disabled {
          color: #9ca3af;
          cursor: not-allowed;
        }

        .resend-otp-btn:hover:not(:disabled) {
          background: #f0f2ff;
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

        /* Responsive */
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
          }

          .input-group input {
            padding: 12px 16px 12px 40px;
            font-size: 0.9rem;
          }

          .login-btn,
          .send-otp-btn {
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

          .method-btn {
            font-size: 0.75rem;
            gap: 4px;
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .login-btn,
          .send-otp-btn {
            padding: 14px;
          }
          .input-group input {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;