// src/pages/Contact.js

import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      "Message sent successfully!"
    );

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">

      {/* HERO */}

      <section className="contact-hero">
        <div className="overlay"></div>

        <div className="hero-content">
          <span>CONTACT US</span>

          <h1>
            We'd Love To
            <br />
            Hear From You
          </h1>

          <p>
            Questions, support or business
            inquiries? Our team is here to help.
          </p>
        </div>
      </section>

      {/* MAIN */}

      <section className="contact-wrap">

        {/* LEFT */}

        <div className="info-box">

          <h2>
            Get In Touch
          </h2>

          <p>
            Reach out anytime and we’ll
            respond as soon as possible.
          </p>

          <div className="item">
            <FaMapMarkerAlt />
            <span>
              Ghatal, West Bengal, India
            </span>
          </div>

          <div className="item">
            <FaPhoneAlt />
            <span>
              +91 98765 43210
            </span>
          </div>

          <div className="item">
            <FaEnvelope />
            <span>
              support@uktraders.com
            </span>
          </div>

          <div className="item">
            <FaClock />
            <span>
              Mon - Sat : 10AM - 8PM
            </span>
          </div>

        </div>

        {/* RIGHT */}

        <form
          className="form-box"
          onSubmit={handleSubmit}
        >
          <h2>
            Send Message
          </h2>

          <div className="grid-2">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={
                handleChange
              }
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={
                handleChange
              }
              required
            />
          </div>

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={
              handleChange
            }
            required
          />

          <textarea
            rows="6"
            name="message"
            placeholder="Write your message..."
            value={form.message}
            onChange={
              handleChange
            }
            required
          ></textarea>

          <button type="submit">
            <FaPaperPlane />
            Send Message
          </button>
        </form>

      </section>

      {/* MAP */}

      <section className="map-box">
        <iframe
          title="map"
          src="https://maps.google.com/maps?q=Ghatal&t=&z=13&ie=UTF8&iwloc=&output=embed"
          loading="lazy"
        ></iframe>
      </section>

      <style>{`

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
      }

      .contact-page{
        font-family:Arial;
        background:#f8f8f8;
      }

      .contact-hero{
        min-height:70vh;
        background:url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1800") center/cover;
        position:relative;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
      }

      .overlay{
        position:absolute;
        inset:0;
        background:rgba(0,0,0,.6);
      }

      .hero-content{
        position:relative;
        z-index:2;
        text-align:center;
        color:#fff;
        max-width:900px;
      }

      .hero-content span{
        letter-spacing:3px;
        font-size:13px;
      }

      .hero-content h1{
        font-size:clamp(34px,7vw,70px);
        margin:18px 0;
        line-height:1.08;
      }

      .hero-content p{
        font-size:18px;
        line-height:1.8;
      }

      .contact-wrap{
        max-width:1400px;
        margin:auto;
        padding:70px 16px;
        display:grid;
        grid-template-columns:420px 1fr;
        gap:28px;
      }

      .info-box,
      .form-box{
        background:#fff;
        border-radius:24px;
        padding:32px;
        box-shadow:0 10px 24px rgba(0,0,0,.05);
      }

      .info-box h2,
      .form-box h2{
        font-size:34px;
        margin-bottom:14px;
      }

      .info-box p{
        color:#666;
        line-height:1.8;
        margin-bottom:24px;
      }

      .item{
        display:flex;
        gap:14px;
        align-items:flex-start;
        margin-bottom:20px;
        color:#333;
        line-height:1.7;
      }

      .item svg{
        margin-top:4px;
      }

      .grid-2{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:14px;
      }

      input,
      textarea{
        width:100%;
        border:1px solid #ddd;
        outline:none;
        padding:15px;
        border-radius:14px;
        font-size:15px;
        margin-bottom:14px;
      }

      textarea{
        resize:none;
      }

      button{
        border:none;
        background:#111;
        color:#fff;
        padding:15px 24px;
        border-radius:14px;
        font-weight:700;
        cursor:pointer;
        display:flex;
        gap:8px;
        align-items:center;
      }

      .map-box{
        max-width:1400px;
        margin:auto;
        padding:0 16px 80px;
      }

      .map-box iframe{
        width:100%;
        height:420px;
        border:none;
        border-radius:24px;
      }

      @media(max-width:992px){

        .contact-wrap{
          grid-template-columns:1fr;
        }

      }

      @media(max-width:700px){

        .grid-2{
          grid-template-columns:1fr;
        }

        .info-box,
        .form-box{
          padding:24px;
        }

        .hero-content p{
          font-size:16px;
        }

        .map-box iframe{
          height:320px;
        }

      }

      `}</style>
    </div>
  );
};

export default Contact;