// src/config/api.js - Centralized API configuration

/**
 * Mendapatkan URL dasar API dari environment variables dengan fallback.
 * Ini memungkinkan konfigurasi yang fleksibel untuk development dan production.
 * Gets the base API URL from environment variables with fallbacks.
 * This allows for flexible configuration for development and production.
 * @returns {string} - URL dasar untuk panggilan API.
 */
const getApiBaseUrl = () => {

    // Di lingkungan production, utamakan variabel environment.
    // In a production environment, prioritize the environment 
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }

    // Fallback untuk development.
    // Fallback for development.
    if (import.meta.env.DEV) {
        return '/api';
    }

    // Fallback untuk production jika variabel environment tidak diset.
    // Fallback for production if the environment variable is not set.
    return 'https://capstone-backend-1059248723043.asia-southeast2.run.app';
};

// Mengekspor URL dasar yang sudah ditentukan.
// Export the determined base URL.
export const API_BASE_URL = getApiBaseUrl();

// Mengekspor konfigurasi umum untuk instance Axios atau panggilan fetch.
// Exporting common configuration for Axios instances or fetch calls.
export const API_CONFIG = {
    baseURL: API_BASE_URL,
    timeout: 30000, // Waktu tunggu 30 detik sebelum permintaan dibatalkan. / 30-second timeout before a request is cancelled.
    headers: {
        'Content-Type': 'application/json',
    },
};

/**
 * Fungsi helper untuk mendapatkan header otentikasi (Authorization).
 * Mengambil token dari localStorage dan menyiapkannya dalam format Bearer.
 * Helper function to get authentication headers (Authorization).
 * It retrieves the token from localStorage and prepares it in Bearer format.
 * @returns {object} - Objek header otentikasi atau objek kosong jika tidak ada token.
 */
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fungsi helper untuk membangun URL API lengkap dari sebuah endpoint.
 * Helper function to construct a full API URL from an endpoint.
 * @param {string} endpoint - Path endpoint (misal: '/users' atau 'users').
 * @returns {string} - URL API lengkap.
 */
export const getApiUrl = (endpoint) => {
    // Menghapus garis miring di awal untuk menghindari URL ganda (//).
    // Removes a leading slash if present to avoid double slashes in the URL.
    const cleanEndpoint = endpoint.startsWith('/')
        ? endpoint.slice(1)
        : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Mengekspor informasi environment untuk keperluan debugging.
// Exporting environment information for debugging purposes.
export const ENV_INFO = {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    apiBaseUrl: API_BASE_URL,
    mode: import.meta.env.MODE,
};

