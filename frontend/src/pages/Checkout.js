// src/pages/Checkout.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaTruck,
  FaMoneyBillWave,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();
  const API = "http://localhost:5000/api";

  const [cart, setCart] = useState([]);
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "COD",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);

    if (saved.length === 0) {
      navigate("/cart");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const placeOrder = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.pincode
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setPlacing(true);

      const payload = {
        ...form,
        items: cart,
        totalPrice: total,
        paymentStatus:
          form.paymentMethod === "COD" ? "Pending" : "Paid",
        orderStatus: "Placed",
      };

      await axios.post(`${API}/orders`, payload);

      localStorage.removeItem("cart");

      alert("Order Placed Successfully");
      navigate("/profile");
    } catch (error) {
      console.log(error);
      alert("Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-wrap">

        <form className="left-box" onSubmit={placeOrder}>
          <h1>Checkout</h1>

          <div className="section-title">
            <FaMapMarkerAlt /> Shipping Details
          </div>

          <div className="grid-2">
            <input
              type="text"
              name="name"
              placeholder="Full Name *"
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number *"
              onChange={handleChange}
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Full Address *"
            rows="4"
            onChange={handleChange}
          ></textarea>

          <div className="grid-2">
            <input
              type="text"
              name="city"
              placeholder="City *"
              onChange={handleChange}
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode *"
              onChange={handleChange}
            />
          </div>

          <div className="section-title payment-top">
            <FaCreditCard /> Payment Method
          </div>

          <div className="payment-box">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={form.paymentMethod === "COD"}
                onChange={handleChange}
              />
              <FaMoneyBillWave /> Cash on Delivery
            </label>

            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Online"
                checked={form.paymentMethod === "Online"}
                onChange={handleChange}
              />
              <FaCreditCard /> Online Payment
            </label>
          </div>

          <button
            className="place-btn"
            type="submit"
            disabled={placing}
          >
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="right-box">
          <h2>Order Summary</h2>

          <div className="items-list">
            {cart.map((item, i) => (
              <div className="item-row" key={i}>
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                />

                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>
                    {item.size} × {item.qty}
                  </p>
                </div>

                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="line">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="line">
            <span>
              <FaTruck /> Shipping
            </span>
            <span>
              {shipping === 0 ? "Free" : `₹${shipping}`}
            </span>
          </div>

          <div className="line total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <div className="secure-box">
            <FaCheckCircle /> Secure Checkout
          </div>
        </div>

      </div>

      <style>{`

      .checkout-page{
        min-height:100vh;
        background:#f7f7f7;
        padding:40px 16px;
        font-family:Arial;
      }

      .checkout-wrap{
        max-width:1400px;
        margin:auto;
        display:grid;
        grid-template-columns:1.4fr .9fr;
        gap:24px;
      }

      .left-box,
      .right-box{
        background:#fff;
        border-radius:22px;
        padding:28px;
      }

      .left-box h1{
        font-size:38px;
        margin-bottom:25px;
      }

      .section-title{
        font-size:18px;
        font-weight:700;
        margin-bottom:15px;
        display:flex;
        align-items:center;
        gap:10px;
      }

      .payment-top{
        margin-top:20px;
      }

      .grid-2{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:14px;
      }

      input,
      textarea{
        width:100%;
        margin-bottom:14px;
        padding:14px;
        border:1px solid #ddd;
        border-radius:12px;
        font-size:15px;
        outline:none;
      }

      textarea{
        resize:none;
      }

      input:focus,
      textarea:focus{
        border-color:#111;
      }

      .payment-box{
        display:flex;
        flex-direction:column;
        gap:12px;
      }

      .payment-box label{
        border:1px solid #eee;
        padding:15px;
        border-radius:14px;
        display:flex;
        align-items:center;
        gap:10px;
        cursor:pointer;
      }

      .place-btn{
        width:100%;
        margin-top:24px;
        border:none;
        background:#111;
        color:#fff;
        padding:16px;
        border-radius:14px;
        font-size:16px;
        font-weight:700;
        cursor:pointer;
      }

      .place-btn:disabled{
        opacity:.7;
        cursor:not-allowed;
      }

      .right-box h2{
        margin-bottom:20px;
      }

      .items-list{
        max-height:340px;
        overflow:auto;
        margin-bottom:18px;
      }

      .item-row{
        display:grid;
        grid-template-columns:65px 1fr auto;
        gap:12px;
        align-items:center;
        margin-bottom:14px;
      }

      .item-row img{
        width:65px;
        height:65px;
        object-fit:cover;
        border-radius:12px;
        background:#f1f1f1;
      }

      .item-info h4{
        font-size:15px;
        margin-bottom:4px;
      }

      .item-info p{
        color:#666;
        font-size:13px;
      }

      .line{
        display:flex;
        justify-content:space-between;
        margin-bottom:16px;
        color:#333;
      }

      .line.total{
        border-top:1px solid #eee;
        padding-top:15px;
        font-size:22px;
        font-weight:700;
      }

      .secure-box{
        margin-top:20px;
        background:#f4fff4;
        color:green;
        padding:14px;
        border-radius:12px;
        text-align:center;
        font-weight:700;
      }

      @media(max-width:992px){

        .checkout-wrap{
          grid-template-columns:1fr;
        }

      }

      @media(max-width:768px){

        .left-box h1{
          font-size:30px;
        }

        .grid-2{
          grid-template-columns:1fr;
        }

      }

      @media(max-width:480px){

        .left-box,
        .right-box{
          padding:18px;
        }

        .item-row{
          grid-template-columns:55px 1fr auto;
        }

        .item-row img{
          width:55px;
          height:55px;
        }

      }

      `}</style>
    </div>
  );
};

export default Checkout;