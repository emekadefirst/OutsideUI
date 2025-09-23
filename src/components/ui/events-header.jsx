import React, { memo } from "react";
import { MapPin } from "lucide-react";

const EventsHeader = memo(({ eventsCount, hasUserLocation, loading, error }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        Discover Events
      </h2>
      <p className="text-white/60 text-lg">
        Find amazing events happening around you
      </p>
    </div>

    {!loading && !error && eventsCount > 0 && (
      <div className="bg-white/5 rounded-2xl px-6 py-3 border border-white/10">
        <p className="text-white/70 text-sm font-medium">
          {eventsCount} events found
        </p>
        {hasUserLocation && (
          <p className="text-orange-400 text-xs mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Location-based results
          </p>
        )}
      </div>
    )}
  </div>
));

EventsHeader.displayName = 'EventsHeader';

export default EventsHeader;