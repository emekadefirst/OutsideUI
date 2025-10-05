import axios from "axios";

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API;
const REQUEST_TIMEOUT = 10000;

// Error classes
class ApiError extends Error {
  constructor(message, statusCode, originalError) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

class AuthenticationError extends ApiError {
  constructor(message = "Authentication failed") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

class NetworkError extends ApiError {
  constructor(message = "Network error") {
    super(message);
    this.name = "NetworkError";
  }
}

// Token management
class TokenManager {
  static ACCESS_TOKEN_KEY = "access_token";
  static REFRESH_TOKEN_KEY = "refresh_token";

  static getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken, refreshToken) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static hasTokens() {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }
}

// API client class
class ApiClient {
  constructor() {
    this.client = this.createClient();
    this.refreshClient = this.createRefreshClient();
    this.isRefreshing = false;
    this.refreshSubscribers = [];
    this.setupInterceptors();
  }

  createClient() {
    return axios.create({
      baseURL: API_BASE_URL,
      timeout: REQUEST_TIMEOUT,
    });
  }

  createRefreshClient() {
    return axios.create({
      baseURL: API_BASE_URL,
    });
  }

  setupInterceptors() {
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  setupRequestInterceptor() {
    this.client.interceptors.request.use(
      (config) => {
        const token = TokenManager.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  setupResponseInterceptor() {
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (this.shouldRefreshToken(error) && !originalRequest._retry) {
          originalRequest._retry = true;

          if (this.isRefreshing) {
            return this.waitForTokenRefresh(originalRequest);
          }

          this.isRefreshing = true;

          try {
            const newAccessToken = await this.refreshAccessToken();
            this.onRefreshSuccess(newAccessToken);
            return this.retryOriginalRequest(originalRequest, newAccessToken);
          } catch (refreshError) {
            this.onRefreshFailure();
            throw this.handleRefreshError(refreshError);
          }
        }

        throw this.handleApiError(error);
      }
    );
  }

  shouldRefreshToken(error) {
    return error.response?.status === 401 || error.response?.status === 403;
  }

  waitForTokenRefresh(originalRequest) {
    return new Promise((resolve, reject) => {
      this.refreshSubscribers.push((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        this.client(originalRequest)
          .then(resolve)
          .catch(reject);
      });
    });
  }

  async refreshAccessToken() {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new AuthenticationError("No refresh token available");
    }

    const response = await this.refreshClient.post("/users/refresh", { 
      token: refreshToken 
    });

    if (!response.data.access_token) {
      throw new AuthenticationError("Invalid token response");
    }

    // Store the new tokens
    TokenManager.setTokens(
      response.data.access_token, 
      response.data.refresh_token
    );

    return response.data.access_token;
  }

  onRefreshSuccess(accessToken) {
    this.refreshSubscribers.forEach((callback) => callback(accessToken));
    this.refreshSubscribers = [];
    this.isRefreshing = false;
  }

  onRefreshFailure() {
    TokenManager.clearTokens();
    this.refreshSubscribers = [];
    this.isRefreshing = false;
  }

  retryOriginalRequest(originalRequest, accessToken) {
    if (originalRequest.headers) {
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    }
    return this.client(originalRequest);
  }

  handleRefreshError(error) {
    if (error instanceof ApiError) {
      return error;
    }

    if (axios.isAxiosError(error)) {
      return new AuthenticationError(
        error.response?.data?.message || "Session expired. Please log in again."
      );
    }

    return new AuthenticationError("Session expired. Please log in again.");
  }

  handleApiError(error) {
    if (error.response) {
      return new ApiError(
        error.response.data?.message || `Request failed with status ${error.response.status}`,
        error.response.status,
        error
      );
    } else if (error.request) {
      return new NetworkError("Network error. Please check your connection.");
    } else {
      return new ApiError(error.message || "An unexpected error occurred", undefined, error);
    }
  }

  async request(config) {
    try {
      this.logRequest(config);

      const response = await this.client(config);

      this.logResponse(response);

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  logRequest(config) {
    if (import.meta.env.DEV) {
      console.group("🚀 API Request");
      console.log("URL:", `${config.baseURL || API_BASE_URL}${config.url}`);
      console.log("Method:", config.method?.toUpperCase());
      console.log("Headers:", config.headers);
      console.log("Data:", config.data);
      console.log("Auth Token:", TokenManager.getAccessToken() ? "Present" : "Missing");
      console.groupEnd();
    }
  }

  logResponse(response) {
    if (import.meta.env.DEV) {
      console.group("✅ API Response");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.groupEnd();
    }
  }

  logError(error) {
    if (import.meta.env.DEV) {
      console.group("❌ API Error");
      
      if (error instanceof ApiError) {
        console.error("Error Type:", error.name);
        console.error("Message:", error.message);
        console.error("Status Code:", error.statusCode);
      } else if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.message);
        console.error("Response Data:", error.response?.data);
        console.error("Status:", error.response?.status);
      } else {
        console.error("Unknown Error:", error);
      }
      
      console.groupEnd();
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Main API call function
async function apiCall(path, method = "GET", body = null, options = {}) {
  const config = {
    url: path,
    method: method.toLowerCase(),
    ...options,
  };

  if (body) {
    if (body instanceof FormData) {
      config.data = body;
      // Let browser set Content-Type for FormData
    } else {
      config.data = body;
      config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
      };
    }
  }

  return apiClient.request(config);
}

// Utility functions for common HTTP methods
export const api = {
  get: (path, options = {}) =>
    apiCall(path, "GET", null, options),

  post: (path, data = null, options = {}) =>
    apiCall(path, "POST", data, options),

  put: (path, data = null, options = {}) =>
    apiCall(path, "PUT", data, options),

  patch: (path, data = null, options = {}) =>
    apiCall(path, "PATCH", data, options),

  delete: (path, options = {}) =>
    apiCall(path, "DELETE", null, options),
};

// Export for external use
export { TokenManager, ApiError, AuthenticationError, NetworkError };

export default apiCall;