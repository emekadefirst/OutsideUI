import apiCall from "./config";
import { toast } from "react-toastify";

// Note: You cannot use useNavigate here since this is not a React component
// You'll need to handle navigation in your components

export async function getUser() {
  try {
    const response = await apiCall("users/whoami", "GET");
    return response.data;
  } catch (err) {
    // More specific error handling based on error type
    if (err.message?.includes("Network error") || err.name === "NetworkError") {
      toast.error("Network error. Please check your connection.");
    } else if (err.name === "AuthenticationError") {
      toast.error("Session expired. Please login again.");
    } else {
      toast.error("Failed to load user data");
    }
    throw err;
  }
}

export async function login(data) {
  try {
    const response = await apiCall("users/login", "POST", data);
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    toast.success("Login successful");
    return response.data;
    
  } catch (err) {
    if (err.response?.status === 401) {
      toast.error("Invalid email or password");
    } else if (err.name === "NetworkError") {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("Login failed. Please try again.");
    }
    throw err;
  }
}

export async function logoutUser() {
  try {
    await apiCall("users/logout", "POST");
  } catch (err) {
    console.warn("Logout API call failed, but clearing local storage anyway");
  } finally {
    localStorage.clear();
    return true;
  }
}


export async function refreshToken() {
  try {
    const response = await apiCall("users/refresh", "POST");
    return response.data;
  } catch (err) {
    throw new Error("Token refresh failed");
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem("access_token");
}

export function getAuthTokens() {
  return {
    accessToken: localStorage.getItem("access_token"),
    refreshToken: localStorage.getItem("refresh_token")
  };
}