// src/pages/Profile.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaArrowLeft,
  FaEdit,
  FaSave,
} from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const API = "http://localhost:5000/api";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [user, setUser] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const savedUser =
      JSON.parse(localStorage.getItem("user")) || null;

    if (savedUser) {
      setUser(savedUser);
      fetchOrders(savedUser.email);
    }
  }, []);

  const fetchOrders = async (email) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/orders`
      );

      const allOrders = Array.isArray(res.data)
        ? res.data
        : [];

      const myOrders = allOrders.filter(
        (item) =>
          item.email?.toLowerCase() ===
          email?.toLowerCase()
      );

      setOrders(myOrders);
    } catch (error) {
      console.log(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      await axios.put(
        `${API}/users/${user._id}`,
        user
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      setEditMode(false);

      alert("Profile Updated");
    } catch (error) {
      console.log(error);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const statusIcon = (status) => {
    if (status === "Delivered")
      return <FaCheckCircle className="green" />;

    if (status === "Shipped")
      return <FaTruck className="blue" />;

    return <FaClock className="orange" />;
  };

  return (
    <div className="profile-page">
      <div className="profile-wrap">

        <div className="left-box">
          <div className="avatar">
            <FaUser />
          </div>

          {editMode ? (
            <input
              className="edit-input"
              value={user.name}
              onChange={(e) =>
                setUser({
                  ...user,
                  name: e.target.value,
                })
              }
            />
          ) : (
            <h2>{user.name}</h2>
          )}

          <div className="info-row">
            <FaEnvelope />

            {editMode ? (
              <input
                className="edit-input"
                value={user.email}
                onChange={(e) =>
                  setUser({
                    ...user,
                    email: e.target.value,
                  })
                }
              />
            ) : (
              <span>{user.email}</span>
            )}
          </div>

          <div className="info-row">
            <FaPhone />

            {editMode ? (
              <input
                className="edit-input"
                value={user.phone}
                onChange={(e) =>
                  setUser({
                    ...user,
                    phone: e.target.value,
                  })
                }
              />
            ) : (
              <span>
                {user.phone || "Not Added"}
              </span>
            )}
          </div>

          <div className="info-row">
            <FaMapMarkerAlt />

            {editMode ? (
              <textarea
                className="edit-input"
                rows="3"
                value={user.address}
                onChange={(e) =>
                  setUser({
                    ...user,
                    address:
                      e.target.value,
                  })
                }
              />
            ) : (
              <span>{user.address}</span>
            )}
          </div>

          {editMode ? (
            <button
              className="edit-btn"
              onClick={saveProfile}
              disabled={saving}
            >
              <FaSave />{" "}
              {saving
                ? "Saving..."
                : "Save Profile"}
            </button>
          ) : (
            <button
              className="edit-btn"
              onClick={() =>
                setEditMode(true)
              }
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        <div className="right-box">

          <div className="top-head">
            <div className="head-left">
              <button
                className="back-btn"
                onClick={() =>
                  navigate(-1)
                }
              >
                <FaArrowLeft /> Back
              </button>

              <h1>My Orders</h1>
            </div>

            <span>
              {orders.length} Orders
            </span>
          </div>

          {loading ? (
            <div className="status-box">
              Loading Orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="status-box">
              No Orders Found
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(
                (order, index) => (
                  <div
                    className="order-card"
                    key={
                      order._id ||
                      index
                    }
                  >
                    <div className="order-top">
                      <div>
                        <h3>
                          Order #
                          {order.orderNumber ||
                            order._id?.slice(
                              -6
                            )}
                        </h3>

                        <p>
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="status-tag">
                        {statusIcon(
                          order.orderStatus
                        )}

                        <span>
                          {order.orderStatus ||
                            "Placed"}
                        </span>
                      </div>
                    </div>

                    <div className="mini-items">
                      {order.items?.map(
                        (
                          item,
                          i
                        ) => (
                          <div
                            className="mini-row"
                            key={i}
                          >
                            <img
                              src={
                                item.image ||
                                "/placeholder.png"
                              }
                              alt=""
                            />

                            <div>
                              <h4>
                                {
                                  item.name
                                }
                              </h4>

                              <p>
                                {
                                  item.size
                                }{" "}
                                ×{" "}
                                {
                                  item.qty
                                }
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <div className="order-bottom">
                      <div>
                        <FaBoxOpen />
                        <span>
                          {order.items
                            ?.length ||
                            0}{" "}
                          Items
                        </span>
                      </div>

                      <h2>
                        ₹
                        {
                          order.totalPrice
                        }
                      </h2>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

      </div>

      <style>{`

      .profile-page{
        min-height:100vh;
        background:#f8f8f8;
        padding:40px 16px;
        font-family:Arial;
      }

      .profile-wrap{
        max-width:1400px;
        margin:auto;
        display:grid;
        grid-template-columns:340px 1fr;
        gap:24px;
      }

      .left-box,.right-box{
        background:#fff;
        border-radius:22px;
        padding:28px;
      }

      .avatar{
        width:90px;
        height:90px;
        border-radius:50%;
        background:#111;
        color:#fff;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:34px;
        margin-bottom:18px;
      }

      .left-box h2{
        margin-bottom:18px;
      }

      .info-row{
        display:flex;
        gap:12px;
        margin-bottom:14px;
        align-items:flex-start;
      }

      .edit-input{
        width:100%;
        padding:12px;
        border:1px solid #ddd;
        border-radius:10px;
      }

      .edit-btn,.back-btn{
        border:none;
        background:#111;
        color:#fff;
        padding:12px 14px;
        border-radius:12px;
        cursor:pointer;
        font-weight:700;
        display:flex;
        align-items:center;
        gap:8px;
      }

      .edit-btn{
        width:100%;
        justify-content:center;
        margin-top:12px;
      }

      .top-head{
        display:flex;
        justify-content:space-between;
        gap:12px;
        flex-wrap:wrap;
        margin-bottom:24px;
      }

      .head-left{
        display:flex;
        gap:12px;
        flex-wrap:wrap;
        align-items:center;
      }

      .orders-list{
        display:flex;
        flex-direction:column;
        gap:18px;
      }

      .order-card{
        border:1px solid #eee;
        border-radius:18px;
        padding:20px;
      }

      .order-top{
        display:flex;
        justify-content:space-between;
        gap:12px;
        flex-wrap:wrap;
        margin-bottom:14px;
      }

      .status-tag{
        background:#f7f7f7;
        padding:10px 14px;
        border-radius:12px;
        display:flex;
        gap:8px;
        align-items:center;
      }

      .mini-row{
        display:grid;
        grid-template-columns:60px 1fr;
        gap:12px;
        margin-bottom:12px;
      }

      .mini-row img{
        width:60px;
        height:60px;
        object-fit:cover;
        border-radius:10px;
      }

      .order-bottom{
        border-top:1px solid #eee;
        padding-top:14px;
        margin-top:14px;
        display:flex;
        justify-content:space-between;
        flex-wrap:wrap;
      }

      .status-box{
        background:#fff;
        border:1px solid #eee;
        padding:40px;
        border-radius:18px;
        text-align:center;
      }

      .green{color:green;}
      .blue{color:#0077ff;}
      .orange{color:#ff8800;}

      @media(max-width:992px){
        .profile-wrap{
          grid-template-columns:1fr;
        }
      }

      @media(max-width:480px){
        .left-box,.right-box{
          padding:18px;
        }

        .head-left{
          width:100%;
          flex-direction:column;
          align-items:stretch;
        }

        .back-btn{
          justify-content:center;
        }
      }

      `}</style>
    </div>
  );
};

export default Profile;