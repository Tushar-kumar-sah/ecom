import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`${API}/users/register`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Account created successfully");
      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={registerUser}>
        <h1>Create Account</h1>
        <p>Join our premium fashion store</p>

        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>

        <span>
          Already have an account? <Link to="/login">Login</Link>
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

export default Register;