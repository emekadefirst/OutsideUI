import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Initialize API configuration
import "./services/api";

// Pages & Components
import HomePage from "./pages/public/index";
import Tickets from "./pages/public/Allevents";
import EventDetailPage from "./pages/public/eventsDetails";
import PaymentSuccess from "./pages/public/PaymentSuccess";
import PaymentFailure from "./pages/public/PaymentFailure";
import AdminLogin from "./pages/admin";
import AdminDashboard from "./pages/admin/dashboard";
import UserList from "./pages/admin/user/allusers";
import AddEvent from "./pages/admin/event/create";
import EventList from "./pages/admin/event/allevents";
import AboutPage from "./pages/public/about";

// Layouts
import AdminLayout from "./components/admin/layout/main";
import PublicLayout from "./components/public/layout/main";

// Styles
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>

        {/* 🌍 Public Layout Wrapper */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<Tickets />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />
        </Route>

        {/* 🔐 Admin login (standalone) */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* 🧭 Admin Layout Wrapper */}
        <Route path="/admin/site" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="events" element={<EventList />} />
          <Route path="create-ticket" element={<AddEvent />} />
        </Route>

        {/* ❌ Catch-all for unknown routes */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  </StrictMode>
);
