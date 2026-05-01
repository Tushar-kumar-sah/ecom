import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  useEffect(() => {
    // Optionally clear cart or show message
  }, []);

  return (
    <div className="payment-status-page">
      <div className="status-card success">
        <FaCheckCircle />
        <h2>Payment Successful!</h2>
        <p>Your order has been placed successfully.</p>
        <Link to="/profile" className="btn">View Orders</Link>
        <Link to="/shop" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;