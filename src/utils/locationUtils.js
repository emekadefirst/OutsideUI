// utils/locationUtils.js

// Cache for user location to avoid repeated geolocation calls
let userLocationCache = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get user's current location with caching
 * Falls back to Alimosho, Lagos coordinates if geolocation fails
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getUserLocation = () => {
  // Return cached location if still valid
  if (userLocationCache && (Date.now() - userLocationCache.timestamp < CACHE_DURATION)) {
    return Promise.resolve(userLocationCache.location);
  }

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      const fallback = { latitude: 6.5244, longitude: 3.2017 };
      userLocationCache = { location: fallback, timestamp: Date.now() };
      resolve(fallback);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        // Cache the successful location
        userLocationCache = { location, timestamp: Date.now() };
        resolve(location);
      },
      (error) => {
        // Fallback to Alimosho, Lagos coordinates if geolocation fails
        console.warn("Geolocation failed, using fallback location:", error.message);
        const fallback = { latitude: 6.5244, longitude: 3.2017 };
        userLocationCache = { location: fallback, timestamp: Date.now() };
        resolve(fallback);
      },
      {
        enableHighAccuracy: false, // Changed to false for faster response
        timeout: 5000, // Reduced timeout
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Optimized version with early returns
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in kilometers rounded to 1 decimal place
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Early return if coordinates are the same
  if (lat1 === lat2 && lon1 === lon2) return 0;

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

/**
 * Batch calculate distances for multiple events
 * More efficient than individual calls
 * @param {Array} events - Array of events with venue coordinates
 * @param {Object} userCoords - User coordinates {latitude, longitude}
 * @returns {Array} Events with distance added
 */
export const calculateDistancesBatch = (events, userCoords) => {
  if (!userCoords) return events;

  return events.map(event => {
    if (!event.venue?.lat || !event.venue?.lng) {
      return { ...event, distance: null };
    }

    const distance = calculateDistance(
      userCoords.latitude,
      userCoords.longitude,
      event.venue.lat,
      event.venue.lng
    );

    return {
      ...event,
      distance
    };
  });
};

/**
 * Format distance for display
 * @param {number|null} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (!distance && distance !== 0) return '';
  if (distance < 1) return `${Math.round(distance * 1000)}m away`;
  return `${distance}km away`;
};

/**
 * Clear location cache
 * Useful for testing or when you need fresh location
 */
export const clearLocationCache = () => {
  userLocationCache = null;
};