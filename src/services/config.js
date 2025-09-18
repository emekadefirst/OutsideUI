import axios from "axios";

const API = import.meta.env.VITE_API;

// Main Axios instance
const apiClient = axios.create({
  baseURL: API.replace(/\/$/, ""),
  timeout: 10000,
});

// Separate Axios instance for refresh requests
const refreshClient = axios.create({
  baseURL: API.replace(/\/$/, "")
});

// Request interceptor to attach access token
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and 403
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 or 403 and make sure we haven't retried yet
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          // Send refresh request
          const { data } = await refreshClient.post("/users/refresh", { token: refreshToken });

          const { access_token, refresh_token: newRefreshToken } = data;

          // Save new tokens
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", newRefreshToken);

          // Retry the original request with new access token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          return Promise.reject(new Error("Session expired. Please log in again."));
        }
      }
    }

    return Promise.reject(error);
  }
);

export default async function apiCall(path, method = "GET", body = null) {
  try {
    const config = { method, url: path.replace(/^\//, "") };
    if (body) config.data = body;

    const response = await apiClient(config);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error("API call failed:", error);

    if (error.response) {
      throw new Error(error.response.data?.message || `Request failed: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw error;
    }
  }
}
