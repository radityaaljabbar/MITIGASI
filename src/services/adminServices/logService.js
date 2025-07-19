// src/services/adminServices/logService.js
import { getApiUrl, getAuthHeaders } from '../../config/api.js';

/**
 * Mengambil semua log aktivitas admin dari backend.
 * Fetches all admin activity logs from the backend.
 * @returns {Promise<object>}
 */
export const getAllLogs = async () => {
    try {
        const response = await fetch(getApiUrl('/admin/logAktivitasAdmin'), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};