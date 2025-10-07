import React, { useState, useEffect } from "react";
import { AllEvent } from "../../services/events";
import EventDetailPage from "./eventsDetails";

// Simple date formatting without heavy operations
const formatEventDates = (timeArray) => {
  if (!timeArray || timeArray.length === 0) return { dateDisplay: '', timeDisplay: '' };
  
  const dates = timeArray.map(time => new Date(time));
  
  if (dates.length === 1) {
    const date = dates[0];
    return {
      dateDisplay: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      timeDisplay: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  } else {
    const dateDisplay = dates.map(date => 
      date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    ).join(', ');
    
    const timeDisplay = dates.map(date =>
      date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    ).join(', ');
    
    return { dateDisplay, timeDisplay };
  }
};

// Simplified TicketCard without heavy memoization
const TicketCard = ({ ticket, onEventClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { dateDisplay, timeDisplay } = formatEventDates(ticket.time);
  const hostInitial = ticket.host?.name?.charAt(0).toUpperCase() || '?';

  const handleClick = () => {
    onEventClick(ticket.id);
  };

  return (
    <div
      className={`group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:border-orange-500/30 ${
        isHovered ? "shadow-2xl shadow-orange-500/10 translate-y-[-8px] scale-[1.02]" : "shadow-lg"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row h-full">
        <div className="md:w-2/5 relative overflow-hidden">
          <div className="relative w-full h-64 md:h-full bg-gray-800/50">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={ticket.banner}
              alt={ticket.title}
              className={`w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl px-3 py-2">
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider">
              {dateDisplay}
            </p>
          </div>
        </div>

        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 text-orange-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{timeDisplay}</span>
              </div>
            </div>

            <h3 className="text-white text-2xl font-bold mb-3 leading-tight group-hover:text-orange-300 transition-colors">
              {ticket.title}
            </h3>

            <p className="text-white/70 text-sm mb-4 leading-relaxed">
              {ticket.description}
            </p>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{hostInitial}</span>
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">
                  Hosted by {ticket.host?.name || 'Unknown Host'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 border border-white/10 hover:border-white/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save Event
            </button>
            
            <button 
              onClick={handleClick}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple loading state
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-white/70 text-lg">Loading events...</p>
  </div>
);

// Simple error state
const ErrorState = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-white text-xl font-bold mb-2">Failed to load events</h3>
    <button
      onClick={onRetry}
      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Simple empty state
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </div>
    <h3 className="text-white text-xl font-bold mb-2">No events found</h3>
    <p className="text-white/70">Check back later for new events</p>
  </div>
);

// Simple header with filters
const EventsHeader = ({ eventsCount, loading, error, filter, onFilterChange }) => (
  <div className="text-center mb-12">
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Upcoming Events</h1>
    <p className="text-white/70 text-lg mb-6 max-w-2xl mx-auto">
      Discover amazing events and experiences
    </p>
    
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      {['all', 'upcoming', 'nearest', 'host'].map((filterType) => (
        <button
          key={filterType}
          onClick={() => onFilterChange(filterType)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            filter === filterType 
              ? 'bg-orange-500 text-white shadow-lg' 
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          {filterType === 'all' && 'All Events'}
          {filterType === 'upcoming' && 'Upcoming'}
          {filterType === 'nearest' && 'Nearest'}
          {filterType === 'host' && 'By Host'}
        </button>
      ))}
    </div>

    {!loading && !error && (
      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
        <span className="text-orange-400 font-semibold">{eventsCount}</span>
        <span className="text-white/70 text-sm">events</span>
      </div>
    )}
  </div>
);

// Main component - simplified
const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedEventId, setSelectedEventId] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const events = await AllEvent();
      setTickets(events);
    } catch (err) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventClick = (eventId) => {
    setSelectedEventId(eventId);
  };

  const handleCloseDetail = () => {
    setSelectedEventId(null);
  };

  // Simple filter logic
  const filteredTickets = React.useMemo(() => {
    if (!tickets.length) return [];
    
    const now = new Date();
    
    switch (filter) {
      case 'upcoming':
        return tickets
          .filter(event => event.time.some(time => new Date(time) > now))
          .sort((a, b) => new Date(a.time[0]) - new Date(b.time[0]));
      
      case 'host':
        return [...tickets].sort((a, b) => 
          (a.host?.name || '').localeCompare(b.host?.name || '')
        );
      
      case 'nearest':
        // Simple implementation without location for now
        return tickets;
      
      default:
        return tickets;
    }
  }, [tickets, filter]);

  // If an event is selected, show the EventDetailPage
  if (selectedEventId) {
    return (
      <EventDetailPage 
        eventId={selectedEventId} 
        onClose={handleCloseDetail}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <EventsHeader 
            eventsCount={filteredTickets.length}
            loading={loading}
            error={error}
            filter={filter}
            onFilterChange={setFilter}
          />

          {loading && <LoadingState />}
          {error && <ErrorState onRetry={fetchEvents} />}
          {!loading && !error && filteredTickets.length === 0 && <EmptyState />}
          
          {!loading && !error && filteredTickets.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTickets.map((ticket) => (
                <TicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  onEventClick={handleEventClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Tickets;