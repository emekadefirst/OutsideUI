import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/public/index";
import Tickets from "./pages/public/Allticket";
import AdminLogin from "./pages/admin";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  </StrictMode>
);