import React, { useState, useEffect, useCallback } from "react";
import { AllEvent } from "../../../services/events";
import {
    Download,
    Plus,
    Calendar,
    MapPin,
    Users,
    Clock,
    Filter,
    Search,
    Eye,
    Edit,
    Trash2,
    MoreVertical
} from "lucide-react";
import { Link } from "react-router-dom";
import AddEvent from "./create";
import { fetchAndEnhanceEvents } from "../../../utils/eventsService";

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddEvent, setShowAddEvent] = useState(false);

    // Fetch events from API
    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await AllEvent()
            console.log("Response D", response)
            setEvents(response);
        } catch (err) {
            console.error("Error fetching events:", err);
            setError("Failed to load events.");
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Helper function to format date
    const formatDate = (timeArray) => {
        if (!timeArray || timeArray.length === 0) return 'TBD';
        const date = new Date(timeArray[0]);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper function to get event status based on date
    const getEventStatus = (timeArray) => {
        if (!timeArray || timeArray.length === 0) return 'draft';
        const eventDate = new Date(timeArray[0]);
        const now = new Date();

        if (eventDate > now) return 'upcoming';
        if (eventDate.toDateString() === now.toDateString()) return 'ongoing';
        return 'completed';
    };

    // Filtering
    const filteredEvents = Array.isArray(events)
        ? events.filter((event) => {
            const matchesSearch =
                event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.host?.name?.toLowerCase().includes(searchTerm.toLowerCase());

            const eventStatus = getEventStatus(event.time);
            const matchesStatus = statusFilter === "all" || eventStatus === statusFilter;

            // Date filtering
            let matchesDate = true;
            if (dateFilter !== "all" && event.time && event.time.length > 0) {
                const eventDate = new Date(event.time[0]);
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const thisWeek = new Date(today);
                thisWeek.setDate(thisWeek.getDate() + 7);
                const thisMonth = new Date(today);
                thisMonth.setMonth(thisMonth.getMonth() + 1);

                switch (dateFilter) {
                    case "today":
                        matchesDate = eventDate >= today && eventDate < tomorrow;
                        break;
                    case "this_week":
                        matchesDate = eventDate >= today && eventDate < thisWeek;
                        break;
                    case "this_month":
                        matchesDate = eventDate >= today && eventDate < thisMonth;
                        break;
                    default:
                        matchesDate = true;
                }
            }

            return matchesSearch && matchesStatus && matchesDate;
        })
        : [];

    // Sorting
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
            case "title":
                aValue = a.title?.toLowerCase() || "";
                bValue = b.title?.toLowerCase() || "";
                break;
            case "date":
                aValue = a.time && a.time.length > 0 ? new Date(a.time[0]) : new Date(0);
                bValue = b.time && b.time.length > 0 ? new Date(b.time[0]) : new Date(0);
                break;
            case "host":
                aValue = a.host?.name?.toLowerCase() || "";
                bValue = b.host?.name?.toLowerCase() || "";
                break;
            case "location":
                aValue = a.address?.toLowerCase() || "";
                bValue = b.address?.toLowerCase() || "";
                break;
            default:
                aValue = a[sortBy] || "";
                bValue = b[sortBy] || "";
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    // Pagination
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);

    // Handle sort
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    // Status color mapping
    const getStatusColor = (status) => {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-500/20 text-blue-300';
            case 'ongoing':
                return 'bg-green-500/20 text-green-300';
            case 'completed':
                return 'bg-gray-500/20 text-gray-300';
            case 'draft':
                return 'bg-yellow-500/20 text-yellow-300';
            default:
                return 'bg-gray-500/20 text-gray-300';
        }
    };

    // Handle modal close and refresh
    const handleAddEventClose = () => {
        setShowAddEvent(false);
    };

    const handleEventAdded = () => {
        fetchEvents(); // Refresh the events list
        setShowAddEvent(false);
    };

    return (
        <div className="space-y-6 m-8">
            {/* Loading and Error States */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-t-yellow-500 border-white/20 rounded-full animate-spin"></div>
                    <p className="text-gray-400 ml-3">Loading events...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400">{error}</p>
                    <button
                        onClick={fetchEvents}
                        className="mt-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && (
                <>
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                Event Management
                            </h1>
                            <p className="text-gray-400 mt-1">
                                Manage and monitor all platform events ({sortedEvents.length} total)
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
                                <Download className="w-4 h-4" />
                                <span>Export</span>
                            </button>
                            <Link 
                            to="/admin/site/create-ticket"
                            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
                            >
                            Create Ticket
                            </Link>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/10"
                        >
                            <Filter className="w-4 h-4" />
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-yellow-500/50"
                                >
                                    <option value="all">All Status</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-yellow-500/50"
                                >
                                    <option value="all">All Dates</option>
                                    <option value="today">Today</option>
                                    <option value="this_week">This Week</option>
                                    <option value="this_month">This Month</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Events Table */}
                    <div className="overflow-x-auto bg-white/5 rounded-xl border border-white/10">
                        <table className="w-full text-left text-gray-300">
                            <thead className="bg-white/5">
                                <tr className="text-gray-400 text-sm border-b border-white/10">
                                    <th className="px-6 py-4 font-medium">
                                        <button
                                            onClick={() => handleSort("title")}
                                            className="flex items-center hover:text-white transition-colors"
                                        >
                                            Event
                                            {sortBy === "title" && (
                                                <span className="ml-1 text-yellow-400">
                                                    {sortOrder === "asc" ? "↑" : "↓"}
                                                </span>
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        <button
                                            onClick={() => handleSort("date")}
                                            className="flex items-center hover:text-white transition-colors"
                                        >
                                            <Clock className="w-4 h-4 mr-1" />
                                            Date & Time
                                            {sortBy === "date" && (
                                                <span className="ml-1 text-yellow-400">
                                                    {sortOrder === "asc" ? "↑" : "↓"}
                                                </span>
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        <button
                                            onClick={() => handleSort("location")}
                                            className="flex items-center hover:text-white transition-colors"
                                        >
                                            <MapPin className="w-4 h-4 mr-1" />
                                            Location
                                            {sortBy === "location" && (
                                                <span className="ml-1 text-yellow-400">
                                                    {sortOrder === "asc" ? "↑" : "↓"}
                                                </span>
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 font-medium">
                                        <button
                                            onClick={() => handleSort("host")}
                                            className="flex items-center hover:text-white transition-colors"
                                        >
                                            <Users className="w-4 h-4 mr-1" />
                                            Host
                                            {sortBy === "host" && (
                                                <span className="ml-1 text-yellow-400">
                                                    {sortOrder === "asc" ? "↑" : "↓"}
                                                </span>
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEvents.length > 0 ? (
                                    currentEvents.map((event) => {
                                        const eventStatus = getEventStatus(event.time);
                                        const formattedDate = formatDate(event.time);

                                        return (
                                            <tr
                                                key={event.id || Math.random()}
                                                className="border-b border-white/10 hover:bg-white/5 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={event.banner || '/default-event-image.jpg'}
                                                            alt={event.title}
                                                            className="w-12 h-12 object-cover rounded-lg"
                                                            onError={(e) => {
                                                                e.target.src = '/default-event-image.jpg';
                                                            }}
                                                        />
                                                        <div>
                                                            <h3 className="font-medium text-white truncate max-w-[200px]">
                                                                {event.title || "Untitled Event"}
                                                            </h3>
                                                            <p className="text-sm text-gray-400 truncate max-w-[200px]">
                                                                {event.description || "No description"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm">{formattedDate}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm truncate max-w-[150px]">
                                                            {event.address || "Location TBD"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-xs font-semibold">
                                                            {event.host?.name?.charAt(0)?.toUpperCase() || '?'}
                                                        </div>
                                                        <span className="text-sm">{event.host?.name || "Unknown Host"}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(eventStatus)}`}>
                                                        {eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-all">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-500/20 rounded-full flex items-center justify-center">
                                                    <Calendar className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p className="text-gray-400 font-medium">
                                                    {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                                                        ? "No events match your filters"
                                                        : "No events found"
                                                    }
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                                                        ? "Try adjusting your search criteria"
                                                        : "Create your first event to get started"
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/10">
                            <p className="text-gray-300 text-sm">
                                Showing {indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, sortedEvents.length)} of {sortedEvents.length} events
                            </p>
                            <div className="flex items-center space-x-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                    className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-sm text-gray-300">
                                    {currentPage} of {totalPages}
                                </span>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                    className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Add Event Modal */}
            {showAddEvent && (
                <AddEvent
                    reloadList={handleEventAdded}
                    onClose={handleAddEventClose}
                />
            )}
        </div>
    );
};

export default EventList;