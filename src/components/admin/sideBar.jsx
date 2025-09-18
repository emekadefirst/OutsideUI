import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Calendar,
  Shield,
  Ticket,
  CreditCard,
  DollarSign,
  ShoppingCart,
  Settings,
  Menu,
  X,
  ChevronRight,
  LogOut
} from "lucide-react";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { id: "home", label: "Home", icon: Home, color: "from-blue-500 to-blue-600", path: "/admin/site/dashboard" },
    { id: "users", label: "Users", icon: Users, color: "from-green-500 to-green-600", path: "/admin/site/users" },
    { id: "events", label: "Events", icon: Calendar, color: "from-purple-500 to-purple-600", path: "/admin/site/events" },
    { id: "kycs", label: "KYCs", icon: Shield, color: "from-orange-500 to-orange-600", path: "/admin/site/kycs" },
    { id: "tickets", label: "Tickets", icon: Ticket, color: "from-red-500 to-red-600", path: "/admin/site/tickets" },
    { id: "payments", label: "Payments", icon: CreditCard, color: "from-indigo-500 to-indigo-600", path: "/admin/site/payments" },
    { id: "payouts", label: "Payouts", icon: DollarSign, color: "from-teal-500 to-teal-600", path: "/admin/site/payouts" },
    { id: "tickets-sale", label: "Tickets Sale", icon: ShoppingCart, color: "from-pink-500 to-pink-600", path: "/admin/site/tickets-sale" },
  ];

  const bottomMenuItems = [
    { id: "settings", label: "Account Settings", icon: Settings, color: "from-gray-500 to-gray-600", path: "/admin/settings" },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  const getActiveMenu = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 border-r border-white/10 shadow-2xl z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-0 md:w-16"
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className={`flex items-center transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-white rounded-lg flex items-center justify-center mr-3">
              <Shield className="w-5 h-5 text-black" />
            </div>
            {isOpen && <span className="text-white font-bold text-lg">Admin Panel</span>}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white md:hidden"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = getActiveMenu(item.path);
            const isHovered = hoveredItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.path)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-white/20 to-white/10 text-white shadow-lg border border-white/20"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {(isActive || isHovered) && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10 rounded-xl`} />
                )}

                <div className={`relative z-10 flex-shrink-0 ${isActive ? `text-white` : 'text-gray-400 group-hover:text-white'}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {isOpen && <span className="ml-3 font-medium truncate relative z-10">{item.label}</span>}

                {isActive && (
                  <div className="ml-auto relative z-10">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}

                {!isOpen && (
                  <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-white/10">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = getActiveMenu(item.path);
            const isHovered = hoveredItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.path)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-white/20 to-white/10 text-white shadow-lg border border-white/20"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {(isActive || isHovered) && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10 rounded-xl`} />
                )}

                <div className={`relative z-10 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {isOpen && <span className="ml-3 font-medium truncate relative z-10">{item.label}</span>}

                {!isOpen && (
                  <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-white/10">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}

          {/* Logout button */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/admin/login");
            }}
            onMouseEnter={() => setHoveredItem("logout")}
            onMouseLeave={() => setHoveredItem(null)}
            className="w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            {hoveredItem === "logout" && (
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl" />
            )}

            <div className="relative z-10 flex-shrink-0">
              <LogOut className="w-5 h-5" />
            </div>

            {isOpen && <span className="ml-3 font-medium truncate relative z-10">Logout</span>}

            {!isOpen && (
              <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-white/10">
                Logout
              </div>
            )}
          </button>
        </div>

        {/* Desktop toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex absolute -right-3 top-8 w-6 h-6 bg-gray-800 border border-white/20 rounded-full items-center justify-center text-white hover:bg-gray-700 transition-colors shadow-lg"
        >
          <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
    </>
  );
};

export default AdminSidebar;
