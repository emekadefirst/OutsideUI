// components/public/tickets.js
import React, { memo, useMemo } from "react";
import { useEvents } from "../../hooks/useEvents";
import TicketCard from "../ui/ticketcard";
import LoadingState from "../ui/loading-events";
import ErrorState from "../ui/error-state";
import EmptyState from "../ui/empty-state";
import EventsHeader from "../ui/events-header";

const EventsComponent = memo(() => {
  const { tickets, loading, error, refetch } = useEvents();

  // Memoize the events list to prevent re-renders
  const eventsList = useMemo(() => {
    if (loading || error || tickets.length === 0) return null;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tickets.map((ticket) => (
          <TicketCard 
            key={ticket.id} 
            ticket={ticket}
          />
        ))}
      </div>
    );
  }, [tickets, loading, error]);

  const headerProps = useMemo(() => ({
    eventsCount: tickets.length,
    loading,
    error,
  }), [tickets.length, loading, error]);

  return (
    <section className="py-20 from-slate-900 via-black to-slate-900">
      <div className="container mx-auto px-4">
        <EventsHeader {...headerProps} />

        {loading && <LoadingState />}
        {error && <ErrorState onRetry={refetch} />}
        {!loading && !error && tickets.length === 0 && <EmptyState />}
        {eventsList}
      </div>
    </section>
  );
});

EventsComponent.displayName = 'EventsComponent';

export default EventsComponent;