import React, { useState, useEffect } from "react";
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
  LogOut,
  Bell,
  Search
} from "lucide-react";
import { logoutUser } from "../../services/auth";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const menuItems = [
    { 
      id: "home", 
      label: "Dashboard", 
      icon: Home, 
      color: "from-blue-500 to-blue-600", 
      path: "/admin/site/dashboard",
      badge: null
    },
    { 
      id: "users", 
      label: "User Management", 
      icon: Users, 
      color: "from-green-500 to-green-600", 
      path: "/admin/site/users",
      badge: null
    },
    { 
      id: "events", 
      label: "Events", 
      icon: Calendar, 
      color: "from-purple-500 to-purple-600", 
      path: "/admin/site/events",
      badge: null
    },
    { 
      id: "kycs", 
      label: "KYC Verification", 
      icon: Shield, 
      color: "from-orange-500 to-orange-600", 
      path: "/admin/site/kycs",
      badge: null
    },
    { 
      id: "tickets", 
      label: "Ticket Management", 
      icon: Ticket, 
      color: "from-red-500 to-red-600", 
      path: "/admin/site/tickets",
      badge: null
    },
    { 
      id: "payments", 
      label: "Payments", 
      icon: CreditCard, 
      color: "from-indigo-500 to-indigo-600", 
      path: "/admin/site/payments",
      badge: null
    },
    { 
      id: "payouts", 
      label: "Payouts", 
      icon: DollarSign, 
      color: "from-teal-500 to-teal-600", 
      path: "/admin/site/payouts",
      badge: null
    },
    { 
      id: "tickets-sale", 
      label: "Sales Analytics", 
      icon: ShoppingCart, 
      color: "from-pink-500 to-pink-600", 
      path: "/admin/site/tickets-sale",
      badge: null
    },
  ];

  const bottomMenuItems = [
    { 
      id: "settings", 
      label: "Settings", 
      icon: Settings, 
      color: "from-gray-500 to-gray-600", 
      path: "/admin/settings" 
    },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  const getActiveMenu = (path) => location.pathname === path;

  // Auto-collapse on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-br from-slate-900 via-gray-900 to-black border-r border-white/10 shadow-2xl z-50 transition-all duration-300 ease-out ${
          isOpen ? "w-72" : "w-0 md:w-20"
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
          <div className={`flex items-center transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <Shield className="w-6 h-6 text-black font-bold" />
            </div>
            {isOpen && (
              <div className="animate-in slide-in-from-left-2 duration-300">
                <h1 className="text-white font-bold text-xl">Admin</h1>
                <p className="text-gray-400 text-sm">Control Panel</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white md:hidden group"
          >
            <div className="relative">
              {isOpen ? (
                <X className="w-5 h-5 transition-transform group-hover:rotate-90 duration-200" />
              ) : (
                <Menu className="w-5 h-5 transition-transform group-hover:scale-110 duration-200" />
              )}
            </div>
          </button>
        </div>

        {/* Quick Actions (only when open) */}
        {isOpen && (
          <div className="p-4 border-b border-white/5 bg-white/5">
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105">
                <Bell className="w-4 h-4" />
                Alerts
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = getActiveMenu(item.path);
            const isHovered = hoveredItem === item.id;

            return (
              <div
                key={item.id}
                className="relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => handleMenuClick(item.path)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-white/20 to-white/10 text-white shadow-lg border border-white/20 scale-105"
                      : "text-gray-300 hover:text-white hover:bg-white/10 hover:scale-102"
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-orange-400 to-yellow-400 rounded-r-full" />
                  )}

                  {/* Background gradient overlay */}
                  {isOpen && (isActive || isHovered) && (
                    <div 
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10 rounded-xl transition-opacity duration-300`} 
                    />
                  )}

                  {/* Icon container */}
                  <div className={`relative z-10 flex-shrink-0 transition-all duration-300 ${
                    isActive
                      ? 'text-white scale-110'
                      : isOpen
                        ? 'text-gray-400 group-hover:text-white group-hover:scale-110'
                        : 'text-gray-200 group-hover:text-white group-hover:scale-125'
                  }`}>
                    {/* Enhanced backgrounds for collapsed state */}
                    {!isOpen && isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-lg -m-2 shadow-lg" />
                    )}
                    {!isOpen && isHovered && !isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-30 rounded-lg -m-2 shadow-lg`} />
                    )}
                    <Icon className="w-6 h-6 relative z-10" />
                  </div>

                  {/* Label and badge */}
                  {isOpen && (
                    <div className="ml-4 flex-1 flex items-center justify-between relative z-10">
                      <span className="font-medium truncate text-sm">{item.label}</span>
                      {item.badge && (
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center font-semibold shadow-lg">
                          {item.badge}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Arrow for active items */}
                  {isActive && isOpen && (
                    <div className="ml-auto relative z-10">
                      <ChevronRight className="w-4 h-4 text-orange-400" />
                    </div>
                  )}

                  {/* Enhanced tooltip for collapsed state */}
                  {!isOpen && (
                    <div className="absolute left-20 bg-gray-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 border border-white/20 shadow-2xl">
                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-900 rotate-45 border-l border-t border-white/20"></div>
                      <div className="font-medium">{item.label}</div>
                      {item.badge && (
                        <div className="text-xs text-orange-400 mt-1">{item.badge} pending</div>
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/10 bg-black/20 space-y-2">
          {/* User info when expanded */}
          {isOpen && (
            <div className="bg-white/5 rounded-xl p-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">AD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">Admin User</p>
                  <p className="text-gray-400 text-xs truncate">admin@eventify.com</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
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
                {isOpen && (isActive || isHovered) && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10 rounded-xl`} />
                )}

                <div className={`relative z-10 flex-shrink-0 transition-all duration-300 ${
                  isActive
                    ? 'text-white scale-110'
                    : isOpen
                      ? 'text-gray-400 group-hover:text-white group-hover:scale-105'
                      : 'text-gray-200 group-hover:text-white group-hover:scale-110'
                }`}>
                  {!isOpen && isActive && (
                    <div className="absolute inset-0 bg-white/20 rounded-lg -m-1" />
                  )}
                  {!isOpen && isHovered && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 rounded-lg -m-1`} />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                </div>

                {isOpen && <span className="ml-3 font-medium truncate relative z-10 text-sm">{item.label}</span>}

                {!isOpen && (
                  <div className="absolute left-20 bg-gray-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 border border-white/20 shadow-2xl">
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-900 rotate-45 border-l border-t border-white/20"></div>
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}

          {/* Logout button */}
          <button
            onClick={() => {
              logoutUser(); 
            }}
            onMouseEnter={() => setHoveredItem("logout")}
            onMouseLeave={() => setHoveredItem(null)}
            className="w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/30"
          >
            {isOpen && hoveredItem === "logout" && (
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl" />
            )}

            <div className={`relative z-10 flex-shrink-0 transition-all duration-300 ${
              isOpen
                ? 'text-red-400 group-hover:text-red-300 group-hover:scale-105'
                : 'text-red-300 group-hover:text-red-200 group-hover:scale-110'
            }`}>
              {!isOpen && hoveredItem === "logout" && (
                <div className="absolute inset-0 bg-red-500/30 rounded-lg -m-1 shadow-lg" />
              )}
              <LogOut className="w-5 h-5 relative z-10" />
            </div>

            {isOpen && <span className="ml-3 font-medium truncate relative z-10 text-sm">Sign Out</span>}

            {!isOpen && (
              <div className="absolute left-20 bg-red-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 border border-red-500/30 shadow-2xl">
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-red-900 rotate-45 border-l border-t border-red-500/30"></div>
                Sign Out
              </div>
            )}
          </button>
        </div>

        {/* Desktop toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex absolute -right-4 top-10 w-8 h-8 bg-gradient-to-br from-gray-800 to-black border border-white/20 rounded-full items-center justify-center text-white hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 group"
        >
          <ChevronRight className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
    </>
  );
};

export default AdminSidebar;