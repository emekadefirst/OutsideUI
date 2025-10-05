import apiCall from "./config";
import { toast } from "react-toastify";

export async function AllEvent() {
    try {
        const response = await apiCall("events/", "GET"); 
        return response.data;
    } catch (error) {
        if (error.name === "NetworkError") {
            toast.error("Network error. Please check your connection.");
        } else {
            toast.error("Failed to load events");
        }
        throw error;
    }
}

export async function CreateEvent(data) {
    try {
        const response = await apiCall("events/", "POST", data); 
    
        toast.success("Event created successfully");
        return response.data;
        
    } catch (error) {
        if (error.statusCode === 400) {
            toast.error("Invalid data. Please check your input.");
            console.error("Validation error:", error.response?.data);
        } else if (error.statusCode === 401 || error.statusCode === 403) {
            toast.error("Unauthorized. Please login again.");
        } else if (error.name === "NetworkError") {
            toast.error("Network error. Please check your connection.");
        } else {
            toast.error("Failed to create event");
            console.error("Create event error:", error);
        }
        throw error;
    }
}


export async function getEventById(id) {
    try {
        const response = await apiCall(`events/${id}`, "GET");
        return response.data;
    } catch (error) {
        if (error.statusCode === 404) {
            toast.error("Event not found");
        } else {
            toast.error("Failed to load event details");
        }
        throw error;
    }
}

export async function updateEvent(id, data) {
    try {
        const response = await apiCall(`events/${id}`, "PUT", data);
        toast.success("Event updated successfully");
        return response.data;
    } catch (error) {
        if (error.statusCode === 400) {
            toast.error("Invalid update data");
        } else if (error.statusCode === 404) {
            toast.error("Event not found");
        } else {
            toast.error("Failed to update event");
        }
        throw error;
    }
}

export async function deleteEvent(id) {
    try {
        const response = await apiCall(`events/${id}`, "DELETE");
        toast.success("Event deleted successfully");
        return response.data;
    } catch (error) {
        if (error.statusCode === 404) {
            toast.error("Event not found");
        } else {
            toast.error("Failed to delete event");
        }
        throw error;
    }
}