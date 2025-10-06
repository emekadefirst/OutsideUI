// hooks/useEvents.js
import { useState, useEffect, useCallback } from 'react';

export const useEvents = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Memoize the fetch function
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch basic event data without enhancements initially
      const response = await fetch('/api/events'); // Your API endpoint
      const basicEvents = await response.json();
      
      setTickets(basicEvents);
      
      // Load location and enhancements separately after initial render
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            // Enhance events with location data in background
            enhanceEventsWithLocation(basicEvents, position.coords);
          },
          (error) => {
            console.log('Location access denied or failed');
            // Continue without location enhancements
          }
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Separate function for location-based enhancements
  const enhanceEventsWithLocation = async (events, coords) => {
    // This runs after initial render, doesn't block the UI
    const enhancedEvents = await fetchAndEnhanceEvents(events, coords);
    setTickets(enhancedEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    tickets,
    loading,
    error,
    userLocation,
    refetch: fetchEvents,
  };
};