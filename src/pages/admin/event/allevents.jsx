import React, { useState, useEffect, useCallback } from "react";
import { useEventsStore } from "../../../stores";
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
    MoreVertical,
    Navigation,
    X,
    ChevronDown,
    SlidersHorizontal
} from "lucide-react";
import { Link } from "react-router-dom";
import AddEvent from "./create";

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
    const [userLocation, setUserLocation] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const { getAllEvents, refreshEvents, events: storeEvents } = useEventsStore();
    
    // Fetch events from API
    const fetchEvents = useCallback(async (forceRefresh = false) => {
        try {
            setLoading(true);
            setError(null);
            const response = forceRefresh ? await refreshEvents() : await getAllEvents();
            console.log("Response D", response);
            setEvents(response);
        } catch (err) {
            console.error("Error fetching events:", err);
            setError("Failed to load events.");
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [getAllEvents, refreshEvents]);

    // Use store data if available
    useEffect(() => {
        if (storeEvents.length > 0 && events.length === 0) {
            setEvents(storeEvents);
            setLoading(false);
        }
    }, [storeEvents, events.length]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Get user location
    const getUserLocation = () => {
        setLoadingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLoadingLocation(false);
                    setSortBy("nearest");
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to get your location. Please enable location services.");
                    setLoadingLocation(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
            setLoadingLocation(false);
        }
    };

    // Calculate distance between two coordinates (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

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
            case "nearest":
                if (userLocation && a.latitude && a.longitude && b.latitude && b.longitude) {
                    aValue = calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude);
                    bValue = calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
                } else {
                    aValue = Infinity;
                    bValue = Infinity;
                }
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
        if (field === "nearest" && !userLocation) {
            getUserLocation();
            return;
        }

        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder(field === "nearest" ? "asc" : "asc");
        }
    };

    // Status color mapping
    const getStatusColor = (status) => {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
            case 'ongoing':
                return 'bg-green-500/20 text-green-300 border-green-400/30';
            case 'completed':
                return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
            case 'draft':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
        }
    };

    // Handle modal close and refresh
    const handleAddEventClose = () => {
        setShowAddEvent(false);
    };

    const handleEventAdded = () => {
        fetchEvents();
        setShowAddEvent(false);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setDateFilter("all");
        setSortBy("date");
        setSortOrder("desc");
    };

    // Active filter count
    const activeFiltersCount = 
        (searchTerm ? 1 : 0) + 
        (statusFilter !== "all" ? 1 : 0) + 
        (dateFilter !== "all" ? 1 : 0);

    return (
        <div className="min-h-screen bg-black from-yellow-400 via-yellow-500 to-black">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header Section */}
                <div className="relative">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl"></div>
                    <div className="relative p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                                        <Calendar className="w-8 h-8 text-yellow-500" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-white">
                                            Event Management
                                        </h1>
                                        <p className="text-white/70 text-lg mt-1">
                                            {sortedEvents.length} events • Manage and monitor all platform events
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl">
                                    <Download className="w-5 h-5" />
                                    <span className="font-medium">Export</span>
                                </button>
                                <Link 
                                    to="/admin/site/create-ticket"
                                    className="px-6 py-3 bg-white text-yellow-600 font-semibold rounded-xl hover:bg-yellow-50 transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create Ticket
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading and Error States */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-t-white border-white/20 rounded-full animate-spin mb-4"></div>
                        <p className="text-white text-lg font-medium">Loading events...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 backdrop-blur-sm border-2 border-red-500/30 rounded-2xl p-6">
                        <p className="text-red-200 text-lg font-medium">{error}</p>
                        <button
                            onClick={fetchEvents}
                            className="mt-4 px-6 py-3 bg-red-500/20 text-red-200 rounded-xl hover:bg-red-500/30 transition-colors font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Search and Filter Bar */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl"></div>
                            <div className="relative p-6 space-y-4">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Search Bar */}
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search by title, description, location, or host..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-12 pr-4 py-4 w-full rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:border-white focus:ring-2 focus:ring-white/30 transition-all font-medium text-lg"
                                        />
                                    </div>

                                    {/* Filter Toggle Button */}
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/20 text-white hover:bg-white/20 transition-all font-medium text-lg min-w-[180px] relative"
                                    >
                                        <SlidersHorizontal className="w-5 h-5" />
                                        <span>Filters</span>
                                        {activeFiltersCount > 0 && (
                                            <span className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                                                {activeFiltersCount}
                                            </span>
                                        )}
                                        <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>

                                {/* Active Filters Display */}
                                {activeFiltersCount > 0 && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-white/70 text-sm font-medium">Active filters:</span>
                                        {searchTerm && (
                                            <span className="px-3 py-1 bg-white/20 text-white rounded-lg text-sm flex items-center gap-2">
                                                Search: "{searchTerm}"
                                                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                                            </span>
                                        )}
                                        {statusFilter !== "all" && (
                                            <span className="px-3 py-1 bg-white/20 text-white rounded-lg text-sm flex items-center gap-2">
                                                Status: {statusFilter}
                                                <X className="w-3 h-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
                                            </span>
                                        )}
                                        {dateFilter !== "all" && (
                                            <span className="px-3 py-1 bg-white/20 text-white rounded-lg text-sm flex items-center gap-2">
                                                Date: {dateFilter.replace('_', ' ')}
                                                <X className="w-3 h-3 cursor-pointer" onClick={() => setDateFilter("all")} />
                                            </span>
                                        )}
                                        <button
                                            onClick={clearFilters}
                                            className="px-3 py-1 text-white/70 hover:text-white text-sm underline"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Filter Options Panel */}
                        {showFilters && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl"></div>
                                <div className="relative p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {/* Status Filter */}
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider">
                                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                Status
                                            </label>
                                            <select
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white focus:border-white transition-all font-medium cursor-pointer"
                                            >
                                                <option value="all" className="bg-gray-900">All Status</option>
                                                <option value="upcoming" className="bg-gray-900">Upcoming</option>
                                                <option value="ongoing" className="bg-gray-900">Ongoing</option>
                                                <option value="completed" className="bg-gray-900">Completed</option>
                                                <option value="draft" className="bg-gray-900">Draft</option>
                                            </select>
                                        </div>

                                        {/* Date Filter */}
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider">
                                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                Date Range
                                            </label>
                                            <select
                                                value={dateFilter}
                                                onChange={(e) => setDateFilter(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white focus:border-white transition-all font-medium cursor-pointer"
                                            >
                                                <option value="all" className="bg-gray-900">All Dates</option>
                                                <option value="today" className="bg-gray-900">Today</option>
                                                <option value="this_week" className="bg-gray-900">This Week</option>
                                                <option value="this_month" className="bg-gray-900">This Month</option>
                                            </select>
                                        </div>

                                        {/* Sort By */}
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider">
                                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                Sort By
                                            </label>
                                            <select
                                                value={sortBy}
                                                onChange={(e) => handleSort(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white focus:border-white transition-all font-medium cursor-pointer"
                                                disabled={loadingLocation}
                                            >
                                                <option value="date" className="bg-gray-900">Date</option>
                                                <option value="title" className="bg-gray-900">Title</option>
                                                <option value="host" className="bg-gray-900">Host</option>
                                                <option value="location" className="bg-gray-900">Location</option>
                                                <option value="nearest" className="bg-gray-900">
                                                    {loadingLocation ? "Getting Location..." : "Nearest to Me"}
                                                </option>
                                            </select>
                                        </div>

                                        {/* Sort Order */}
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider">
                                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                Order
                                            </label>
                                            <select
                                                value={sortOrder}
                                                onChange={(e) => setSortOrder(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white focus:border-white transition-all font-medium cursor-pointer"
                                            >
                                                <option value="asc" className="bg-gray-900">Ascending</option>
                                                <option value="desc" className="bg-gray-900">Descending</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Events Table */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/80 backdrop-blur-xl rounded-2xl"></div>
                            <div className="relative overflow-x-auto rounded-2xl">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b-2 border-white/10">
                                            <th className="px-6 py-5 text-sm font-bold text-white/80 uppercase tracking-wider">Event</th>
                                            <th className="px-6 py-5 text-sm font-bold text-white/80 uppercase tracking-wider">Date & Time</th>
                                            <th className="px-6 py-5 text-sm font-bold text-white/80 uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-5 text-sm font-bold text-white/80 uppercase tracking-wider">Host</th>
                                            {sortBy === "nearest" && userLocation && (
                                                <th className="px-6 py-5 text-sm font-bold text-white/80 uppercase tracking-wider">Distance</th>
                                            )}
                                            <th className="px-6 py-5 text-sm font-bold text-white/80 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-5 text-sm font-bold text-white/80 uppercase tracking-wider text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentEvents.length > 0 ? (
                                            currentEvents.map((event) => {
                                                const eventStatus = getEventStatus(event.time);
                                                const formattedDate = formatDate(event.time);
                                                const distance = userLocation && event.latitude && event.longitude
                                                    ? calculateDistance(userLocation.lat, userLocation.lng, event.latitude, event.longitude)
                                                    : null;

                                                return (
                                                    <tr
                                                        key={event.id || Math.random()}
                                                        className="border-b border-white/5 hover:bg-white/5 transition-all duration-200"
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
                                                                <span className="text-sm text-gray-300">{formattedDate}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                                <span className="text-sm truncate max-w-[150px] text-gray-300">
                                                                    {event.address || "Location TBD"}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                                                                    {event.host?.name?.charAt(0)?.toUpperCase() || '?'}
                                                                </div>
                                                                <span className="text-sm text-gray-300">{event.host?.name || "Unknown Host"}</span>
                                                            </div>
                                                        </td>
                                                        {sortBy === "nearest" && userLocation && (
                                                            <td className="px-6 py-4">
                                                                {distance !== null ? (
                                                                    <span className="text-sm font-medium text-yellow-400">
                                                                        {distance.toFixed(1)} km
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-sm text-gray-500">-</span>
                                                                )}
                                                            </td>
                                                        )}
                                                        <td className="px-6 py-4">
                                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(eventStatus)}`}>
                                                                {eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-center gap-1">
                                                                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="View">
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                                <button className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-all" title="Edit">
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="More">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center">
                                                            <Calendar className="w-10 h-10 text-white/30" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-semibold text-xl mb-2">
                                                                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                                                                    ? "No events match your filters"
                                                                    : "No events found"
                                                                }
                                                            </p>
                                                            <p className="text-white/50">
                                                                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                                                                    ? "Try adjusting your search criteria"
                                                                    : "Create your first event to get started"
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl"></div>
                                <div className="relative p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <p className="text-white/80 font-medium">
                                            Showing <span className="text-white font-bold">{indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, sortedEvents.length)}</span> of <span className="text-white font-bold">{sortedEvents.length}</span> events
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage((p) => p - 1)}
                                                className="px-5 py-2.5 bg-white/10 rounded-xl hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-white border-2 border-white/20 hover:border-white/40"
                                            >
                                                Previous
                                            </button>
                                            <div className="flex items-center gap-2">
                                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                                    let pageNum;
                                                    if (totalPages <= 5) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage <= 3) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage >= totalPages - 2) {
                                                        pageNum = totalPages - 4 + i;
                                                    } else {
                                                        pageNum = currentPage - 2 + i;
                                                    }
                                                    
                                                    return (
                                                        <button
                                                            key={i}
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                                                                currentPage === pageNum
                                                                    ? 'bg-white text-yellow-600 shadow-lg'
                                                                    : 'bg-white/10 text-white hover:bg-white/20 border-2 border-white/20'
                                                            }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <button
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage((p) => p + 1)}
                                                className="px-5 py-2.5 bg-white/10 rounded-xl hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-white border-2 border-white/20 hover:border-white/40"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
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
        </div>
    );
};

export default EventList;