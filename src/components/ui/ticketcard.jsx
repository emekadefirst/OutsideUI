import React, { useState, memo } from "react";
import { MapPin } from "lucide-react";
import { formatDistance } from "../../utils/locationUtils";

const TicketCard = memo(({ ticket }) => {
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
        <div className="md:w-2/5 relative overflow-hidden">
          <img
            src={ticket.banner}
            alt={ticket.title}
            className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
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
                <MapPin className="w-4 h-4" />
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
                  {ticket.host?.name?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">
                  Hosted by {ticket.host?.name || 'Unknown Host'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 border border-white/10 hover:border-white/30"
              aria-label={`Save ${ticket.title} event`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save Event
            </button>
            
            <button 
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              aria-label={`Get tickets for ${ticket.title}`}
            >
              Cop Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

TicketCard.displayName = 'TicketCard';

export default TicketCard;