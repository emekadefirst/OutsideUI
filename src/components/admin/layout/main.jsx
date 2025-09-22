import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminNavBar from "../adminNav.jsx";
import AdminSidebar from "../sidebar.jsx";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile toggle
  const location = useLocation();

  // derive active menu from current path
  const activeMenu = location.pathname.split("/")[2] || "home";

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "md:ml-16"
        }`}
      >
        {/* Navbar */}
        <AdminNavBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeMenu={activeMenu}
        />

        {/* Page Content */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
