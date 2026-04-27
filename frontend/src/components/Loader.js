// src/components/Loader.js

import React from "react";

const Loader = ({
  text = "Loading...",
  fullScreen = true,
  small = false,
}) => {
  return (
    <div
      className={`loader-wrapper ${fullScreen ? "fullscreen" : ""} ${
        small ? "small-loader" : ""
      }`}
    >
      <div className="loader-content">
        <div className="spinner"></div>
        <p>{text}</p>
      </div>

      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        .loader-wrapper{
          width:100%;
          display:flex;
          justify-content:center;
          align-items:center;
          padding:40px 20px;
          font-family:Arial,sans-serif;
        }

        .loader-wrapper.fullscreen{
          min-height:100vh;
          background:#fafafa;
        }

        .loader-content{
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:18px;
          text-align:center;
        }

        .spinner{
          width:60px;
          height:60px;
          border:6px solid #e5e5e5;
          border-top:6px solid #111;
          border-radius:50%;
          animation:spin 0.8s linear infinite;
        }

        .loader-content p{
          font-size:18px;
          color:#333;
          font-weight:600;
          letter-spacing:0.3px;
        }

        .small-loader .spinner{
          width:38px;
          height:38px;
          border-width:4px;
        }

        .small-loader .loader-content p{
          font-size:14px;
        }

        @keyframes spin{
          0%{
            transform:rotate(0deg);
          }
          100%{
            transform:rotate(360deg);
          }
        }

        @media(max-width:768px){
          .loader-wrapper{
            padding:30px 15px;
          }

          .spinner{
            width:50px;
            height:50px;
            border-width:5px;
          }

          .loader-content p{
            font-size:16px;
          }
        }

        @media(max-width:480px){
          .spinner{
            width:44px;
            height:44px;
            border-width:4px;
          }

          .loader-content p{
            font-size:15px;
          }

          .small-loader .spinner{
            width:34px;
            height:34px;
          }

          .small-loader .loader-content p{
            font-size:13px;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;