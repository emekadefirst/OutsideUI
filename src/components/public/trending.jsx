import React, { useEffect, useState } from "react";
import { MapPin, Calendar, Users, Sparkles } from "lucide-react";
import { AllEvent } from "../../services/events";
import { formatDateTime } from "../../utils/dateUtils";
import { getUserLocation, calculateDistance, formatDistance } from "../../utils/locationUtils";

const TrendingComponent = () => {
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  const fetchTrendingEvents = async () => {
    setLoading(true);
    try {
      // Get user location
      const location = await getUserLocation();
      setUserLocation(location);
      
      // Fetch all events
      const response = await AllEvent();
      const data = response.data;

      if (data && Array.isArray(data) && data.length > 0) {
        // Take first 3 events and enhance with location/formatting
        const firstThreeEvents = data.slice(0, 3).map(event => {
          const distance = location ? 
            calculateDistance(
              location.latitude, 
              location.longitude, 
              event.latitude, 
              event.longitude
            ) : null;
          
          const dateTime = formatDateTime(event.time);
          
          return {
            ...event,
            distance,
            formattedDate: dateTime.date,
            formattedTime: dateTime.time,
            endTime: dateTime.endTime
          };
        });

        setTrendingEvents(firstThreeEvents);
      }
    } catch (error) {
      console.error("Error fetching trending events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-black relative">

        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Trending Now
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/10 rounded-2xl h-[400px] backdrop-blur-sm border border-white/10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Trending Now
              </h2>
              <p className="text-white/60 text-sm">Hottest events everyone's talking about</p>
            </div>
          </div>
          <a
            href="/events"
            className="group flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            <span>View All</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="recent">
          {trendingEvents.map((event, index) => (
            <TrendingEventCard 
              key={event.id} 
              event={event} 
              index={index}
            />
          ))}
        </div>

        {trendingEvents.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white/50" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">No Trending Events</h3>
            <p className="text-white/60">Check back soon for the hottest events!</p>
          </div>
        )}
      </div>
    </section>
  );
};

// Enhanced Trending Event Card Component
const TrendingEventCard = ({ event, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Trending badge colors
  const badgeColors = [
    'from-yellow-500 to-orange-500', // Gold for #1
    'from-gray-300 to-gray-500',     // Silver for #2  
    'from-amber-600 to-yellow-700',  // Bronze for #3
  ];

  const trendingLabels = ['#1 Trending', '#2 Trending', '#3 Trending'];

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden transition-all duration-700 hover:scale-[1.05] ${
        isHovered ? 'shadow-2xl shadow-purple-500/25' : 'shadow-xl shadow-black/50'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Trending Badge */}
      <div className="absolute top-4 left-4 z-30">
        <div className={`bg-gradient-to-r ${badgeColors[index]} px-3 py-1.5 rounded-full shadow-lg`}>
          <span className="text-white text-xs font-bold tracking-wider">
            {trendingLabels[index]}
          </span>
        </div>
      </div>

      {/* Distance Badge */}
      {event.distance && (
        <div className="absolute top-4 right-4 z-30">
          <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
            <span className="text-white text-xs font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {formatDistance(event.distance)}
            </span>
          </div>
        </div>
      )}

      {/* Background Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
      <div className={`absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent z-10 transition-opacity duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>

      {/* Event Image */}
      <img
        src={event.banner}
        alt={event.title}
        className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        {/* Date & Time */}
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span className="text-purple-300 text-sm font-medium uppercase tracking-wider">
            {event.formattedDate} • {event.formattedTime}
          </span>
        </div>

        {/* Event Title */}
        <h3 className="text-white text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-200 transition-colors">
          {event.title}
        </h3>

        {/* Event Description */}
        <p className="text-white/80 text-sm mb-4 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Location & Attendees */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-white/60" />
            <span className="text-white/70 text-sm truncate max-w-[150px]">
              {event.address}
            </span>
          </div>
          
          {event.attendees && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-white/60" />
              <span className="text-white/70 text-sm">
                {event.attendees > 1000 ? `${(event.attendees/1000).toFixed(1)}k` : event.attendees} going
              </span>
            </div>
          )}
        </div>

        {/* Host Info */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xs">
              {event.host?.name?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
          <span className="text-white/70 text-sm">
            by {event.host?.name || 'Unknown Host'}
          </span>
        </div>

        {/* Hover Action Button */}
        <div className={`mt-4 transition-all duration-300 transform ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}>
          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingComponent;