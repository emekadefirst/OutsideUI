import React from "react";
import { useState, useEffect } from "react";
import { userListService } from "../../../services/users";
import { Download, Plus } from "lucide-react";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userListService();
        setEvents(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load Events.");
        // Set users to empty array on error
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filtering - Add safety check
  const filteredEvents = Array.isArray(events)
    ? events.filter((event) => {
      const fullName = `${event.first_name || ""} ${event.last_name || ""}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone_number?.includes(searchTerm);

      // Map API fields to filter values
      const userRole = user.is_superuser ? "admin" : user.is_staff ? "staff" : "user";
      const userStatus = "active"; // Since API doesn't have status, assume all are active

      const matchesStatus = statusFilter === "all" || userStatus === statusFilter;
      const matchesRole = roleFilter === "all" || userRole === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    })
    : [];

  // Sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue, bValue;

    if (sortBy === "name") {
      aValue = `${a.first_name || ""} ${a.last_name || ""}`.toLowerCase();
      bValue = `${b.first_name || ""} ${b.last_name || ""}`.toLowerCase();
    } else if (sortBy === "role") {
      aValue = a.is_superuser ? "admin" : a.is_staff ? "staff" : "user";
      bValue = b.is_superuser ? "admin" : b.is_staff ? "staff" : "user";
    } else if (sortBy === "joinDate") {
      aValue = a.created_at || "";
      bValue = b.created_at || "";
    } else {
      aValue = a[sortBy] || "";
      bValue = b[sortBy] || "";
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  return (
    <div className="space-y-6">
      {/* Loading and Error States */}
      {loading && <p className="text-gray-400">Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">User Management</h1>
              <p className="text-gray-400">
                Manage and monitor all platform users
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {showFilters && (
            <div className="flex space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="user">User</option>
              </select>
            </div>
          )}

          {/* Users Table */}
          <div className="overflow-x-auto bg-white/5 rounded-lg border border-white/10">
            <table className="w-full text-left text-gray-300">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-white/10">
                  <th className="px-4 py-3 font-medium">
                    <button
                      onClick={() => {
                        if (sortBy === "name") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("name");
                          setSortOrder("asc");
                        }
                      }}
                      className="flex items-center hover:text-white transition-colors"
                    >
                      Name
                      {sortBy === "name" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => {
                    const userRole = user.is_superuser ? "admin" : user.is_staff ? "staff" : "user";
                    const userStatus = "active"; // API doesn't provide status, assume active
                    const joinDate = user.created_at
                      ? new Date(user.created_at).toLocaleString("en-US", {
                        weekday: "long",    // "Monday"
                        year: "numeric",    // "2025"
                        month: "long",      // "September"
                        day: "numeric",     // "18"
                        hour: "numeric",    // "6 PM"
                        minute: "2-digit",  // "06"
                        hour12: true        // AM/PM format
                      })
                      : "N/A";

                    return (
                      <tr
                        key={user.email || Math.random()} // Use email as key since no ID
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3">
                          {`${user.first_name || ""} ${user.last_name || ""}`.trim() || "N/A"}
                        </td>
                        <td className="px-4 py-3">{user.email || "N/A"}</td>
                        <td className="px-4 py-3">{user.phone_number || "N/A"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${userRole === "admin"
                              ? "bg-red-500/20 text-red-300"
                              : userRole === "staff"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-blue-500/20 text-blue-300"
                            }`}>
                            {userRole}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300">
                            {userStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">{joinDate}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                      {searchTerm || statusFilter !== "all" || roleFilter !== "all"
                        ? "No users match your filters"
                        : "No users found"
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 text-gray-300">
              <p>
                Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, sortedUsers.length)} of {sortedUsers.length} users
              </p>
              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 bg-white/10 rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 bg-white/10 rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventList;