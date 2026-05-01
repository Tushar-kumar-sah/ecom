import React from "react";
import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailure = () => {
  return (
    <div className="payment-status-page">
      <div className="status-card failure">
        <FaTimesCircle />
        <h2>Payment Failed</h2>
        <p>Something went wrong. Please try again.</p>
        <Link to="/checkout" className="btn">Retry Checkout</Link>
      </div>
    </div>
  );
};

export default PaymentFailure;