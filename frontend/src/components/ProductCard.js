// src/components/ProductCard.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaEye,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";

const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      cart = cart.map((item) =>
        item._id === product._id
          ? { ...item, qty: (item.qty || 1) + 1 }
          : item
      );
    } else {
      cart.push({
        ...product,
        qty: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  return (
    <div className="product-card">
      {/* IMAGE */}
      <div className="product-image-box">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />

        {/* TOP BADGE */}
        <span className="sale-badge">New</span>

        {/* ACTION ICONS */}
        <div className="product-actions">
          <button onClick={() => setLiked(!liked)}>
            {liked ? <FaHeart /> : <FaRegHeart />}
          </button>

          <Link to={`/product/${product._id}`}>
            <FaEye />
          </Link>

          <button onClick={addToCart}>
            <FaShoppingCart />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="product-info">
        <p className="product-category">
          {product.category || "Fashion"}
        </p>

        <h3 className="product-title">{product.name}</h3>

        <div className="rating">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <span>(4.9)</span>
        </div>

        <div className="price-row">
          <h4>₹{product.price}</h4>
          <span className="old-price">
            ₹{Math.round(product.price * 1.3)}
          </span>
        </div>

        <Link to={`/product/${product._id}`} className="view-btn">
          View Product
        </Link>
      </div>

      {/* CSS */}
      <style>{`

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        .product-card{
          width:100%;
          background:#fff;
          border-radius:18px;
          overflow:hidden;
          border:1px solid #eee;
          transition:all .3s ease;
          font-family:Arial,sans-serif;
          position:relative;
        }

        .product-card:hover{
          transform:translateY(-8px);
          box-shadow:0 18px 35px rgba(0,0,0,0.08);
        }

        .product-image-box{
          position:relative;
          width:100%;
          height:320px;
          overflow:hidden;
          background:#f8f8f8;
        }

        .product-image{
          width:100%;
          height:100%;
          object-fit:cover;
          transition:transform .4s ease;
        }

        .product-card:hover .product-image{
          transform:scale(1.08);
        }

        .sale-badge{
          position:absolute;
          top:14px;
          left:14px;
          background:#111;
          color:#fff;
          padding:7px 12px;
          border-radius:30px;
          font-size:12px;
          font-weight:700;
          z-index:2;
        }

        .product-actions{
          position:absolute;
          top:14px;
          right:14px;
          display:flex;
          flex-direction:column;
          gap:10px;
          opacity:0;
          transform:translateY(10px);
          transition:.3s ease;
        }

        .product-card:hover .product-actions{
          opacity:1;
          transform:translateY(0);
        }

        .product-actions button,
        .product-actions a{
          width:42px;
          height:42px;
          border:none;
          border-radius:50%;
          background:#fff;
          color:#111;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          text-decoration:none;
          box-shadow:0 5px 15px rgba(0,0,0,0.08);
          transition:.3s;
        }

        .product-actions button:hover,
        .product-actions a:hover{
          background:#111;
          color:#fff;
        }

        .product-info{
          padding:18px;
        }

        .product-category{
          color:#777;
          font-size:13px;
          margin-bottom:8px;
          text-transform:uppercase;
          letter-spacing:0.5px;
        }

        .product-title{
          font-size:19px;
          line-height:1.4;
          margin-bottom:10px;
          color:#111;
          min-height:52px;
        }

        .rating{
          display:flex;
          align-items:center;
          gap:4px;
          color:#f5a623;
          font-size:14px;
          margin-bottom:14px;
          flex-wrap:wrap;
        }

        .rating span{
          color:#666;
          margin-left:6px;
        }

        .price-row{
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:16px;
          flex-wrap:wrap;
        }

        .price-row h4{
          font-size:24px;
          color:#111;
        }

        .old-price{
          color:#888;
          text-decoration:line-through;
          font-size:15px;
        }

        .view-btn{
          width:100%;
          display:flex;
          align-items:center;
          justify-content:center;
          text-decoration:none;
          background:#111;
          color:#fff;
          padding:14px;
          border-radius:12px;
          font-weight:700;
          transition:.3s;
        }

        .view-btn:hover{
          background:#222;
        }

        @media(max-width:992px){
          .product-image-box{
            height:280px;
          }

          .product-title{
            font-size:18px;
          }
        }

        @media(max-width:768px){
          .product-card{
            border-radius:16px;
          }

          .product-image-box{
            height:240px;
          }

          .product-info{
            padding:15px;
          }

          .product-title{
            font-size:17px;
            min-height:auto;
          }

          .price-row h4{
            font-size:22px;
          }

          .product-actions{
            opacity:1;
            transform:none;
            flex-direction:row;
            top:auto;
            bottom:12px;
            right:12px;
          }

          .product-actions button,
          .product-actions a{
            width:38px;
            height:38px;
          }
        }

        @media(max-width:480px){
          .product-image-box{
            height:200px;
          }

          .sale-badge{
            font-size:11px;
            padding:6px 10px;
          }

          .product-title{
            font-size:16px;
          }

          .rating{
            font-size:13px;
          }

          .price-row h4{
            font-size:20px;
          }

          .view-btn{
            padding:12px;
            font-size:14px;
          }

          .product-actions button,
          .product-actions a{
            width:34px;
            height:34px;
            font-size:13px;
          }
        }

      `}</style>
    </div>
  );
};

export default ProductCard;