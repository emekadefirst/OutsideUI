import React, { useEffect, useState } from "react";
import { AllEvent } from "../../services/events";
import { MapPin } from "lucide-react";

const TicketsComponent = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Get user's current location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          // Fallback to Alimosho, Lagos coordinates if geolocation fails
          resolve({
            latitude: 6.5244,
            longitude: 3.2017
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  // Format date and time
  const formatDateTime = (timeArray) => {
    if (!timeArray || timeArray.length === 0) return { date: 'TBD', time: 'TBD' };
    
    const startDate = new Date(timeArray[0]);
    const endDate = timeArray.length > 1 ? new Date(timeArray[1]) : null;
    
    const dateOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    const timeOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    };
    
    const formattedDate = startDate.toLocaleDateString('en-US', dateOptions);
    const formattedTime = startDate.toLocaleTimeString('en-US', timeOptions);
    
    return { 
      date: formattedDate, 
      time: formattedTime,
      endTime: endDate ? endDate.toLocaleTimeString('en-US', timeOptions) : null
    };
  };

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get user location first
      const location = await getUserLocation();
      setUserLocation(location);
      
      const response = await AllEvent();
      const data = response.data;
      console.log(data);

      if (data && Array.isArray(data) && data.length > 0) {
        // Calculate distances and enhance ticket data
        const enhancedTickets = data.map(ticket => {
          const distance = location ? 
            calculateDistance(
              location.latitude, 
              location.longitude, 
              ticket.latitude, 
              ticket.longitude
            ) : null;
          
          const dateTime = formatDateTime(ticket.time);
          
          return {
            ...ticket,
            distance,
            formattedDate: dateTime.date,
            formattedTime: dateTime.time,
            endTime: dateTime.endTime
          };
        });

        setTickets(enhancedTickets);
      } else {
        setError("No events found");
      }
    } catch (error) {
      setError("Error fetching events: " + error.message);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Format distance for display
  const formatDistance = (distance) => {
    if (!distance) return '';
    if (distance < 1) return `${Math.round(distance * 1000)}m away`;
    return `${distance}km away`;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Discover Events
            </h2>
            <p className="text-white/60 text-lg">
              Find amazing events happening around you
            </p>
          </div>

          {!loading && !error && tickets.length > 0 && (
            <div className="bg-white/5 rounded-2xl px-6 py-3 border border-white/10">
              <p className="text-white/70 text-sm font-medium">
                {tickets.length} events found
              </p>
              {userLocation && (
                <p className="text-orange-400 text-xs mt-1">
                  <MapPin /> Location-based results
                </p>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-t-orange-500 border-white/20 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-t-white/40 border-transparent rounded-full animate-spin absolute top-2 left-2"></div>
            </div>
            <p className="text-white/70 mt-6 text-lg">Discovering events near you...</p>
            <p className="text-white/50 mt-2 text-sm">This may take a moment</p>
          </div>
        ) : error ? (
          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-12 text-center border border-red-500/20">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Oops! Something went wrong</h3>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              We couldn't load the events right now. Please check your connection and try again.
            </p>
            <button
              onClick={fetchTickets}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              🔄 Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  formatDistance={formatDistance}
                />
              ))}
            </div>

            {tickets.length === 0 && (
              <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
                <div className="w-20 h-20 mx-auto mb-6 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 5V3a2 2 0 012-2h4a2 2 0 012 2v4M3 11h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V11z" />
                  </svg>
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">No Events Available</h3>
                <p className="text-white/70">
                  There are no events available at this time. Check back soon for exciting new events!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

// Enhanced TicketCard component
const TicketCard = ({ ticket, formatDistance }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:border-orange-500/30 ${
        isHovered ? "shadow-2xl shadow-orange-500/10 translate-y-[-8px] scale-[1.02]" : "shadow-lg"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section */}
        <div className="md:w-2/5 relative overflow-hidden">
          <img
            src={ticket.banner}
            alt={ticket.title}
            className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Date overlay */}
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl px-3 py-2">
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider">
              {ticket.formattedDate}
            </p>
          </div>

          {/* Distance overlay */}
          {ticket.distance && (
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
              <p className="text-white text-xs font-medium flex gap-x-2 items-center">
                <MapPin className="w-4 h-" />
                <span>
                  {formatDistance(ticket.distance)}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            {/* Event Details */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 text-orange-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">
                  {ticket.formattedTime}
                  {ticket.endTime && ` - ${ticket.endTime}`}
                </span>
              </div>
              
              <span className="w-1 h-1 rounded-full bg-white/40"></span>
              
              <div className="flex items-center gap-2 text-white/70">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">
                  {ticket.address}
                </span>
              </div>
            </div>

            {/* Event Title */}
            <h3 className="text-white text-2xl font-bold mb-3 leading-tight group-hover:text-orange-300 transition-colors">
              {ticket.title}
            </h3>

            {/* Event Description */}
            <p className="text-white/70 text-sm mb-4 leading-relaxed">
              {ticket.description}
            </p>

            {/* Host Information */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {ticket.host.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">
                  Hosted by {ticket.host.name}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 border border-white/10 hover:border-white/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save Event
            </button>
            
            <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              Get Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsComponent;