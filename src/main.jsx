import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Pages & Components
import AdminLayout from "./components/admin/layout/main";
import HomePage from "./pages/public/index";
import EventsComponent from "./pages/public/Allevents";
import AdminLogin from "./pages/admin";
import AdminDashboard from "./pages/admin/dashboard";
import UserList from "./pages/admin/user/allusers";

// Styles
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsComponent />} />

        {/* Admin login (standalone page) */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Admin layout wrapper */}
        <Route path="/admin/site" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserList />} />
          {/* Add more nested admin routes here */}
        </Route>

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>

      {/* Toast Container (global notifications) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  </StrictMode>
);
