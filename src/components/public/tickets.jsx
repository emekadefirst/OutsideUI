import React, { useEffect, useState, useCallback } from "react";
import { fetchAndEnhanceEvents } from "../../utils/eventsService";
import TicketCard from "../ui/ticketcard";
import LoadingState from "../ui/loading-events";
import ErrorState from "../ui/error-state";
import EmptyState from "../ui/empty-state";
import EventsHeader from "../ui/events-header";

// Custom hook
import { useEvents } from "../../hooks/useEvents";

const TicketsComponent = () => {
  const { tickets, loading, error, userLocation, refetch } = useEvents();

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
        
        {error && <ErrorState onRetry={refetch} />}
        
        {!loading && !error && (
          <>
            {tickets.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
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