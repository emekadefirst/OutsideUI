import React, { useEffect, useState, useCallback } from "react";
import { fetchAndEnhanceEvents } from "../../utils/eventsService";
import TicketCard from "../ui/ticketcard";
import LoadingState from "../ui/loading-events";
import ErrorState from "../ui/error-state";
import EmptyState from "../ui/empty-state";
import EventsHeader from "../ui/events-header";

const TicketsComponent = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { events, userLocation } = await fetchAndEnhanceEvents();
      setTickets(events);
      setUserLocation(userLocation);
    } catch (error) {
      setError(error.message);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <div className="container mx-auto px-4">
        <EventsHeader 
          eventsCount={tickets.length}
          hasUserLocation={!!userLocation}
          loading={loading}
          error={error}
        />

        {loading && <LoadingState />}
        
        {error && <ErrorState onRetry={fetchTickets} />}
        
        {!loading && !error && (
          <>
            {tickets.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default TicketsComponent;