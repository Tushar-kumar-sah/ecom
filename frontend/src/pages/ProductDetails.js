// src/pages/ProductDetails.js

import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaBolt,
  FaArrowLeft,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const API = "http://localhost:5000/api";

  const [product, setProduct] =
    useState(null);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [size, setSize] =
    useState("M");

  const [qty, setQty] =
    useState(1);

  const [mainImage, setMainImage] =
    useState("");

  /* ===============================
  FETCH PRODUCT
  ============================== */

  const fetchProduct =
    useCallback(async () => {
      try {
        setLoading(true);

        const res =
          await axios.get(
            `${API}/products/${id}`
          );

        setProduct(res.data);

        setMainImage(
          res.data.image
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, [id]);

  /* ===============================
  FETCH RELATED
  ============================== */

  const fetchProducts =
    useCallback(async () => {
      try {
        const res =
          await axios.get(
            `${API}/products`
          );

        setProducts(
          Array.isArray(
            res.data
          )
            ? res.data
            : []
        );
      } catch (error) {
        console.log(error);
      }
    }, []);

  useEffect(() => {
    fetchProduct();
    fetchProducts();
  }, [
    fetchProduct,
    fetchProducts,
  ]);

  /* ===============================
  ADD TO CART
  ============================== */

  const addToCart = () => {
    const cart =
      JSON.parse(
        localStorage.getItem(
          "cart"
        )
      ) || [];

    const existing =
      cart.find(
        (item) =>
          item._id ===
            product._id &&
          item.size === size
      );

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image:
          product.image,
        qty,
        size,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    alert(
      "Added To Cart"
    );
  };

  const buyNow = () => {
    addToCart();
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="pd-page">
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-page">
        Product Not Found
      </div>
    );
  }

  const related =
    products
      .filter(
        (item) =>
          item._id !==
          product._id
      )
      .slice(0, 4);

  return (
    <div className="pd-page">
      <div className="pd-wrap">

        {/* LEFT */}

        <div className="pd-left">

          <button
            className="back-btn"
            onClick={() =>
              navigate(-1)
            }
          >
            <FaArrowLeft />
            Back
          </button>

          <div className="main-img">
            <img
              src={
                mainImage ||
                "/placeholder.png"
              }
              alt={
                product.name
              }
            />
          </div>

          <div className="thumb-row">
            {[
              product.image,
              product.image,
              product.image,
            ].map(
              (
                img,
                i
              ) => (
                <img
                  key={i}
                  src={
                    img ||
                    "/placeholder.png"
                  }
                  alt=""
                  onClick={() =>
                    setMainImage(
                      img
                    )
                  }
                />
              )
            )}
          </div>
        </div>

        {/* RIGHT */}

        <div className="pd-right">
          <p className="category">
            {product.category ||
              "Fashion"}
          </p>

          <h1>
            {product.name}
          </h1>

          <div className="rating">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <span>
              (128 Reviews)
            </span>
          </div>

          <h2 className="price">
            ₹
            {
              product.price
            }
          </h2>

          <p className="desc">
            {product.description ||
              "Premium quality product built for comfort and style."}
          </p>

          <div className="section">
            <h4>
              Select Size
            </h4>

            <div className="sizes">
              {[
                "S",
                "M",
                "L",
                "XL",
              ].map(
                (
                  item
                ) => (
                  <button
                    key={
                      item
                    }
                    className={
                      size ===
                      item
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSize(
                        item
                      )
                    }
                  >
                    {
                      item
                    }
                  </button>
                )
              )}
            </div>
          </div>

          <div className="section">
            <h4>
              Quantity
            </h4>

            <div className="qty-box">
              <button
                onClick={() =>
                  qty >
                    1 &&
                  setQty(
                    qty -
                      1
                  )
                }
              >
                <FaMinus />
              </button>

              <span>
                {qty}
              </span>

              <button
                onClick={() =>
                  setQty(
                    qty +
                      1
                  )
                }
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <div className="action-row">
            <button
              className="cart-btn"
              onClick={
                addToCart
              }
            >
              <FaShoppingCart />
              Add To Cart
            </button>

            <button
              className="buy-btn"
              onClick={
                buyNow
              }
            >
              <FaBolt />
              Buy Now
            </button>
          </div>
        </div>

      </div>

      {/* RELATED */}

      <div className="related-wrap">
        <h2>
          Related Products
        </h2>

        <div className="related-grid">
          {related.map(
            (
              item
            ) => (
              <Link
                key={
                  item._id
                }
                to={`/product/${item._id}`}
                className="rel-card"
              >
                <img
                  src={
                    item.image
                  }
                  alt=""
                />

                <h4>
                  {
                    item.name
                  }
                </h4>

                <p>
                  ₹
                  {
                    item.price
                  }
                </p>
              </Link>
            )
          )}
        </div>
      </div>

      <style>{`

      .pd-page{
        min-height:100vh;
        background:#f8f8f8;
        padding:40px 16px;
        font-family:Arial;
      }

      .pd-wrap{
        max-width:1400px;
        margin:auto;
        background:#fff;
        border-radius:24px;
        padding:30px;
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:35px;
      }

      .back-btn{
        border:none;
        background:#111;
        color:#fff;
        padding:12px 16px;
        border-radius:12px;
        cursor:pointer;
        margin-bottom:18px;
        display:flex;
        gap:8px;
        align-items:center;
      }

      .main-img{
        height:520px;
        background:#f2f2f2;
        border-radius:18px;
        overflow:hidden;
      }

      .main-img img{
        width:100%;
        height:100%;
        object-fit:cover;
      }

      .thumb-row{
        display:flex;
        gap:10px;
        margin-top:14px;
      }

      .thumb-row img{
        width:90px;
        height:90px;
        object-fit:cover;
        border-radius:12px;
        cursor:pointer;
        border:1px solid #eee;
      }

      .category{
        color:#777;
        margin-bottom:8px;
      }

      .pd-right h1{
        font-size:40px;
        margin-bottom:15px;
      }

      .rating{
        display:flex;
        gap:4px;
        color:#f5b301;
        margin-bottom:16px;
        align-items:center;
      }

      .rating span{
        color:#666;
        margin-left:8px;
      }

      .price{
        font-size:36px;
        margin-bottom:16px;
      }

      .desc{
        color:#555;
        line-height:1.7;
        margin-bottom:25px;
      }

      .section{
        margin-bottom:22px;
      }

      .sizes{
        display:flex;
        gap:10px;
        flex-wrap:wrap;
      }

      .sizes button{
        width:52px;
        height:52px;
        border:none;
        background:#eee;
        border-radius:12px;
        cursor:pointer;
        font-weight:700;
      }

      .sizes button.active{
        background:#111;
        color:#fff;
      }

      .qty-box{
        display:flex;
        gap:12px;
        align-items:center;
      }

      .qty-box button{
        width:42px;
        height:42px;
        border:none;
        background:#111;
        color:#fff;
        border-radius:10px;
        cursor:pointer;
      }

      .qty-box span{
        min-width:30px;
        text-align:center;
        font-size:20px;
        font-weight:700;
      }

      .action-row{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:14px;
        margin-top:18px;
      }

      .cart-btn,.buy-btn{
        border:none;
        padding:16px;
        border-radius:14px;
        font-weight:700;
        cursor:pointer;
        display:flex;
        gap:8px;
        align-items:center;
        justify-content:center;
      }

      .cart-btn{
        background:#111;
        color:#fff;
      }

      .buy-btn{
        background:#ffcc00;
      }

      .related-wrap{
        max-width:1400px;
        margin:30px auto 0;
      }

      .related-wrap h2{
        margin-bottom:18px;
      }

      .related-grid{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
        gap:18px;
      }

      .rel-card{
        background:#fff;
        border-radius:18px;
        padding:14px;
        text-decoration:none;
        color:#111;
      }

      .rel-card img{
        width:100%;
        height:220px;
        object-fit:cover;
        border-radius:14px;
        margin-bottom:10px;
      }

      .rel-card h4{
        margin-bottom:8px;
      }

      @media(max-width:992px){
        .pd-wrap{
          grid-template-columns:1fr;
        }

        .main-img{
          height:420px;
        }
      }

      @media(max-width:768px){
        .pd-right h1{
          font-size:30px;
        }

        .price{
          font-size:28px;
        }

        .action-row{
          grid-template-columns:1fr;
        }

        .main-img{
          height:320px;
        }
      }

      @media(max-width:480px){
        .pd-wrap{
          padding:18px;
        }

        .main-img{
          height:250px;
        }

        .thumb-row img{
          width:70px;
          height:70px;
        }
      }

      `}</style>
    </div>
  );
};

export default ProductDetails;