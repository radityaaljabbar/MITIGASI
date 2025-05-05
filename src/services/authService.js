// authService.js
const API_URL = 'http://localhost:5000/api'; // Base backend URL

// Login function
export const loginUser = async (id, password, role) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, password, role }),
        });

        const data = await response.json();

        // If login is successful, store the token and user info
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

// Get current user from localStorage
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Get auth token from localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getToken();
};

// Get user role
export const getUserRole = () => {
    const user = getCurrentUser();
    return user ? user.role : null;
};

// Logout function - calls the backend logout endpoint and clears localStorage
export const logoutUser = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            // If no token, just clear localStorage and return
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return { success: true };
        }

        // Call the backend logout endpoint with the token
        const response = await fetch(`${API_URL}/logout`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Clear localStorage regardless of response
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        return await response.json();
    } catch (error) {
        console.error('Logout error:', error);
        // Clear localStorage even if there was an error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return {
            success: false,
            message:
                'Network error during logout. You have been logged out locally.',
        };
    }
};
