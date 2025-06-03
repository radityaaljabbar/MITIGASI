// src/config/api.js - Centralized API configuration

// Get base URL from environment variables with fallbacks
const getApiBaseUrl = () => {
    // In production, use environment variable
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }

    // Development fallbacks
    if (import.meta.env.DEV) {
        // For local development with proxy
        return '/api';
    }

    // Production fallback (if env var is missing)
    return 'https://capstone-backend-1059248723043.asia-southeast2.run.app';
};

// Export the base URL
export const API_BASE_URL = getApiBaseUrl();

// Export common API configuration
export const API_CONFIG = {
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    },
};

// Helper function for making authenticated requests
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function for API URLs
export const getApiUrl = (endpoint) => {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/')
        ? endpoint.slice(1)
        : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Environment info (for debugging)
export const ENV_INFO = {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    apiBaseUrl: API_BASE_URL,
    mode: import.meta.env.MODE,
};

// Log environment info in development
if (import.meta.env.DEV) {
    console.log('🔧 API Configuration:', ENV_INFO);
}
