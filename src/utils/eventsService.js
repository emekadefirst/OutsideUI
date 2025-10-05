import { AllEvent } from "../services/events";
import { getUserLocation, calculateDistance } from "./locationUtils";
import { formatDateTime } from "./dateUtils";

/**
 * Fetch and enhance events with location and formatting data
 * @returns {Promise<{events: Array, userLocation: Object}>}
 */
export const fetchAndEnhanceEvents = async () => {
  try {
    // Get user location first
    const userLocation = await getUserLocation();
    
    // Fetch events from API
    const response = await AllEvent();
    const data = response;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("No events found");
    }

    // Calculate distances and enhance event data
    const enhancedEvents = data.map(event => {
      const distance = userLocation ? 
        calculateDistance(
          userLocation.latitude, 
          userLocation.longitude, 
          event.latitude, 
          event.longitude
        ) : null;
      
      const dateTime = formatDateTime(event.time);
      
      return {
        ...event,
        distance,
        formattedDate: dateTime.date,
        formattedTime: dateTime.time,
        endTime: dateTime.endTime
      };
    });

    return {
      events: enhancedEvents,
      userLocation
    };
  } catch (error) {
    console.error("Error fetching and enhancing events:", error);
    throw new Error(`Error fetching events: ${error.message}`);
  }
};