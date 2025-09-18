import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  Eye,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeMenu] = useState("home");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: "12,543",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Events",
      value: "156",
      change: "+8%",
      changeType: "increase",
      icon: Calendar,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Revenue",
      value: "₦45,678",
      change: "+15%",
      changeType: "increase",
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Pending KYCs",
      value: "23",
      change: "-5%",
      changeType: "decrease",
      icon: Activity,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const recentActivities = [
    { id: 1, action: "New user registration", user: "John Doe", time: "2m ago" },
    { id: 2, action: "Event created", user: "Admin", time: "15m ago" },
    { id: 3, action: "Payment processed", user: "Jane Smith", time: "1h ago" },
    { id: 4, action: "KYC approved", user: "Mike Johnson", time: "2h ago" },
    { id: 5, action: "Ticket purchased", user: "Sarah Wilson", time: "3h ago" },
  ];

  const topEvents = [
    { id: 1, name: "Tech Conference 2024", tickets: 1250, revenue: "₦125,000", status: "active" },
    { id: 2, name: "Music Festival", tickets: 890, revenue: "₦89,000", status: "active" },
    { id: 3, name: "Business Summit", tickets: 650, revenue: "₦65,000", status: "upcoming" },
    { id: 4, name: "Art Exhibition", tickets: 420, revenue: "₦42,000", status: "active" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === "increase" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-400 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "increase" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-lg font-semibold">Recent Activities</h3>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Eye className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mr-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{activity.action}</p>
                  <p className="text-gray-400 text-xs">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Events */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-lg font-semibold">Top Events</h3>
            <button className="text-gray-400 hover:text-white transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            {topEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{event.name}</p>
                  <div className="flex items-center mt-1 space-x-4">
                    <p className="text-gray-400 text-xs">{event.tickets} tickets</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
                <p className="text-white font-medium">{event.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
