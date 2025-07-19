// src/services/authService.js - Updated with dynamic API configuration
import { getApiUrl, getAuthHeaders } from '../config/api.js';

/**
 * Mengirim permintaan login ke server.
 * Sends a login request to the server.
 * @param {string} id - NIM/NIP/Username pengguna.
 * @param {string} password - Password pengguna.
 * @param {string} role - Peran pengguna ('mahasiswa', 'dosen_wali', 'admin').
 * @returns {Promise<object>} - Hasil dari panggilan API, termasuk token dan data pengguna jika berhasil.
 */
export const loginUser = async (id, password, role) => {
    try {
        const response = await fetch(getApiUrl('/login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, password, role }),
        });

        const data = await response.json();

        // Jika login berhasil, simpan token dan informasi pengguna di localStorage
        // If login is successful, store the token and user info in localStorage
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

/**
 * Mengambil data pengguna yang saat ini login dari localStorage.
 * Gets the currently logged-in user's data from localStorage.
 * @returns {object} - Objek pengguna.
 */
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

/**
 * Mengambil token otentikasi dari localStorage.
 * Gets the authentication token from localStorage.
 * @returns {string} - Token.
 */
export const getToken = () => {
    return localStorage.getItem('token');
};

/**
 * Memeriksa apakah pengguna sudah terotentikasi (memiliki token).
 * Checks if the user is authenticated (has a token).
 */
export const isAuthenticated = () => {
    return !!getToken();
};

/**
 * Mengambil peran (role) pengguna yang saat ini login.
 * Gets the role of the currently logged-in user.
 */
export const getUserRole = () => {
    const user = getCurrentUser();
    return user ? user.role : null;
};

/**
 * Menangani proses logout, memanggil endpoint logout di backend dan membersihkan localStorage.
 * Handles the logout process, calling the backend logout endpoint and clearing localStorage.
 * @returns {Promise<object>} - Hasil dari panggilan API logout.
 */
export const logoutUser = async () => {
    try {
        const token = localStorage.getItem('token');

        // Jika tidak ada token, cukup bersihkan localStorage
        // If no token exists, just clear localStorage
        if (!token) {
            // If no token, just clear localStorage and return
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return { success: true };
        }

        // Memanggil endpoint logout di backend dengan token
        // Calling the backend logout endpoint with the token
        const response = await fetch(getApiUrl('/logout'), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
            },
        });

        // Membersihkan localStorage terlepas dari respons server
        // Clearing localStorage regardless of the server's response
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        return await response.json();
    } catch (error) {
        console.error('Logout error:', error);
        // Tetap bersihkan localStorage meskipun terjadi error jaringan
        // Still clear localStorage even if a network error occurs
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return {
            success: false,
            message:
                'Network error during logout. You have been logged out locally.',
        };
    }
};

/**
 * Mengambil data pengguna yang sedang login langsung dari backend menggunakan token.
 * Fetches the currently logged-in user's data directly from the backend using the token.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const fetchCurrentUser = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            return { success: false, message: 'No token found' };
        }

        const response = await fetch(getApiUrl('/me'), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        return {
            success: false,
            message: 'Network error. Could not fetch user data.',
        };
    }
};
