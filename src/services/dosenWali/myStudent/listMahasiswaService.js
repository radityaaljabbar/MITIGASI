import { getApiUrl, getAuthHeaders } from '../../../config/api.js';

export const getListMahasiswa = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            return { success: false, message: 'No token found' };
        }

        const response = await fetch(getApiUrl('/faculty/listMahasiswa'), {
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
