// utils/eventsService.js
export const fetchAndEnhanceEvents = async (events, userCoords = null) => {
  // Return basic events immediately
  const basicEvents = events.map(event => ({
    ...event,
    // Only include essential fields
    id: event.id,
    title: event.title,
    date: event.date,
    venue: event.venue,
    image: event.image,
    // Defer heavy calculations
    _enhancementsPending: true
  }));

  // If no user coordinates, return basic events
  if (!userCoords) {
    return basicEvents;
  }

  // Enhance with location data in background
  setTimeout(async () => {
    try {
      const enhancedEvents = await Promise.all(
        basicEvents.map(async (event) => {
          const distance = await calculateDistance(
            userCoords.lat,
            userCoords.lng,
            event.venue.lat,
            event.venue.lng
          );
          
          const travelTime = await calculateTravelTime(
            userCoords.lat,
            userCoords.lng,
            event.venue.lat,
            event.venue.lng
          );

          return {
            ...event,
            distance,
            travelTime,
            _enhancementsPending: false
          };
        })
      );
      
      // Update events with enhancements
      // You'll need to pass a callback or use state management to update
      return enhancedEvents;
    } catch (error) {
      console.error('Failed to enhance events:', error);
      return basicEvents;
    }
  }, 1000); // Delay enhancement by 1 second

  return basicEvents;
};

// Simple distance calculation - avoid complex APIs initially
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Haversine formula - lightweight calculation
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return `${distance.toFixed(1)} km`;
};

const calculateTravelTime = async (lat1, lon1, lat2, lon2) => {
  // Defer to actual API call or use simple estimation
  return 'Calculating...';
};