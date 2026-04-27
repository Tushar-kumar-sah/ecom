// src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global CSS (if available)
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);