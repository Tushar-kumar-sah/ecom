import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const API = "http://localhost:5000/api";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/users/login`, form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful");
      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={loginUser}>
        <h1>Login</h1>
        <p>Welcome back to your account</p>

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        <span>
          New customer? <Link to="/register">Create account</Link>
        </span>
      </form>

      <style>{authCSS}</style>
    </div>
  );
};

const authCSS = `
.auth-page{
  min-height:100vh;
  background:#f7f7f7;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  font-family:Arial;
}

.auth-box{
  width:100%;
  max-width:430px;
  background:#fff;
  padding:35px;
  border-radius:22px;
  box-shadow:0 15px 35px rgba(0,0,0,.08);
}

.auth-box h1{
  text-align:center;
  margin-bottom:8px;
}

.auth-box p{
  text-align:center;
  color:#666;
  margin-bottom:25px;
}

.auth-box input{
  width:100%;
  padding:14px;
  margin-bottom:14px;
  border:1px solid #ddd;
  border-radius:12px;
  outline:none;
}

.auth-box input:focus{
  border-color:#111;
}

.auth-box button{
  width:100%;
  border:none;
  background:#111;
  color:#fff;
  padding:15px;
  border-radius:14px;
  font-weight:700;
  cursor:pointer;
  margin-top:8px;
}

.auth-box span{
  display:block;
  text-align:center;
  margin-top:18px;
}

.auth-box a{
  color:#111;
  font-weight:700;
}
`;

export default Login;