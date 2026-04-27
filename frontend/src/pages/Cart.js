// src/pages/Cart.js

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaArrowLeft, FaShoppingBag } from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  };

  const saveCart = (updated) => {
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
  };

  const increaseQty = (index) => {
    const updated = [...cart];
    updated[index].qty += 1;
    saveCart(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...cart];

    if (updated[index].qty > 1) {
      updated[index].qty -= 1;
      saveCart(updated);
    }
  };

  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    saveCart(updated);
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shipping = subtotal > 999 ? 0 : 99;

  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <div className="cart-wrap">

        <div className="cart-left">
          <div className="page-top">
            <h1>Your Cart</h1>

            <Link to="/shop" className="back-btn">
              <FaArrowLeft /> Continue Shopping
            </Link>
          </div>

          {cart.length === 0 ? (
            <div className="empty-box">
              <FaShoppingBag />
              <h2>Your cart is empty</h2>
              <Link to="/shop">Shop Now</Link>
            </div>
          ) : (
            <div className="cart-list">
              {cart.map((item, index) => (
                <div className="cart-card" key={index}>
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                  />

                  <div className="cart-info">
                    <h3>{item.name}</h3>
                    <p>Size: {item.size}</p>
                    <h4>₹{item.price}</h4>
                  </div>

                  <div className="qty-box">
                    <button
                      onClick={() => decreaseQty(index)}
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() => increaseQty(index)}
                    >
                      +
                    </button>
                  </div>

                  <div className="right-side">
                    <h3>₹{item.price * item.qty}</h3>

                    <button
                      className="delete-btn"
                      onClick={() => removeItem(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-right">
            <h2>Order Summary</h2>

            <div className="line">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="line">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? "Free" : `₹${shipping}`}
              </span>
            </div>

            <div className="line total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        )}

      </div>

      <style>{`

      .cart-page{
        min-height:100vh;
        background:#f8f8f8;
        padding:40px 16px;
        font-family:Arial;
      }

      .cart-wrap{
        max-width:1400px;
        margin:auto;
        display:grid;
        grid-template-columns:2fr 1fr;
        gap:25px;
      }

      .cart-left,
      .cart-right{
        background:#fff;
        border-radius:20px;
        padding:25px;
      }

      .page-top{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:15px;
        margin-bottom:25px;
        flex-wrap:wrap;
      }

      .page-top h1{
        font-size:36px;
      }

      .back-btn{
        text-decoration:none;
        background:#111;
        color:#fff;
        padding:12px 16px;
        border-radius:12px;
      }

      .cart-list{
        display:flex;
        flex-direction:column;
        gap:16px;
      }

      .cart-card{
        display:grid;
        grid-template-columns:100px 1fr auto auto;
        gap:16px;
        align-items:center;
        border:1px solid #eee;
        padding:15px;
        border-radius:16px;
      }

      .cart-card img{
        width:100px;
        height:100px;
        object-fit:cover;
        border-radius:14px;
        background:#f1f1f1;
      }

      .cart-info h3{
        font-size:18px;
        margin-bottom:6px;
      }

      .cart-info p{
        color:#666;
        margin-bottom:6px;
      }

      .cart-info h4{
        font-size:20px;
      }

      .qty-box{
        display:flex;
        align-items:center;
        gap:10px;
      }

      .qty-box button{
        width:36px;
        height:36px;
        border:none;
        background:#111;
        color:#fff;
        border-radius:10px;
        cursor:pointer;
      }

      .qty-box span{
        font-weight:700;
        min-width:18px;
        text-align:center;
      }

      .right-side{
        text-align:right;
      }

      .right-side h3{
        margin-bottom:10px;
      }

      .delete-btn{
        border:none;
        background:#ffeded;
        color:red;
        width:38px;
        height:38px;
        border-radius:10px;
        cursor:pointer;
      }

      .cart-right h2{
        margin-bottom:25px;
      }

      .line{
        display:flex;
        justify-content:space-between;
        margin-bottom:18px;
        color:#333;
      }

      .line.total{
        font-size:22px;
        font-weight:700;
        padding-top:15px;
        border-top:1px solid #eee;
      }

      .checkout-btn{
        width:100%;
        margin-top:20px;
        border:none;
        background:#111;
        color:#fff;
        padding:16px;
        border-radius:14px;
        cursor:pointer;
        font-weight:700;
        font-size:16px;
      }

      .empty-box{
        text-align:center;
        padding:60px 20px;
      }

      .empty-box svg{
        font-size:55px;
        color:#999;
        margin-bottom:15px;
      }

      .empty-box h2{
        margin-bottom:18px;
      }

      .empty-box a{
        text-decoration:none;
        background:#111;
        color:#fff;
        padding:12px 18px;
        border-radius:12px;
      }

      @media(max-width:992px){

        .cart-wrap{
          grid-template-columns:1fr;
        }

      }

      @media(max-width:768px){

        .page-top h1{
          font-size:28px;
        }

        .cart-card{
          grid-template-columns:80px 1fr;
          gap:14px;
        }

        .cart-card img{
          width:80px;
          height:80px;
        }

        .qty-box{
          grid-column:1 / -1;
          margin-top:5px;
        }

        .right-side{
          grid-column:1 / -1;
          text-align:left;
        }

      }

      @media(max-width:480px){

        .cart-left,
        .cart-right{
          padding:18px;
        }

        .page-top{
          align-items:flex-start;
        }

        .back-btn{
          width:100%;
          text-align:center;
        }

      }

      `}</style>
    </div>
  );
};

export default Cart;