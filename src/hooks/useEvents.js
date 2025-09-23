import { useState, useEffect, useCallback } from "react";
import { fetchAndEnhanceEvents } from "../utils/eventsService";

export const useEvents = () => {
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

  const refetch = useCallback(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return {
    tickets,
    loading,
    error,
    userLocation,
    refetch
  };
};