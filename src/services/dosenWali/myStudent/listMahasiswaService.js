import { getApiUrl, getAuthHeaders } from '../../../config/api.js';

/**
 * Mengambil daftar mahasiswa yang berada di bawah perwalian dosen yang sedang login.
 * Fetches the list of advisee students for the currently logged-in lecturer.
 * @returns {Promise<Object>} - Sebuah promise yang resolve dengan data mahasiswa atau objek error.
 */
export const getListMahasiswa = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            return { success: false, message: 'No token found' };
        }

        // Melakukan panggilan GET ke endpoint daftar mahasiswa
        // Making a GET call to the student list endpoint
        const response = await fetch(getApiUrl('/faculty/listMahasiswa'), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
            },
        });

        // Mengembalikan respons dalam format JSON
        // Returning the response in JSON format
        return await response.json();
    } catch (error) {
        // Menangani error jaringan atau kesalahan lainnya
        // Handling network or other errors
        console.error('Error fetching user data:', error);
        return {
            success: false,
            message: 'Network error. Could not fetch user data.',
        };
    }
};
