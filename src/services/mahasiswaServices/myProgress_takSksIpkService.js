import { getApiUrl, getAuthHeaders } from '../../config/api';

/**
 * Get TAK dari mahasiswa yang sedang login
 * @param nim
 * @return {Promise<Object>}
 */

/**
 * Mengambil data TAK, SKS, IPK, dan IPS mahasiswa yang sedang login.
 * Fetches TAK, SKS, GPA, and semester GPA data for the currently logged-in student.
 * @returns {Promise<Object>} - Sebuah promise yang resolve dengan data akademik atau objek error.
 * @param nim
 */
export const getStudentTAK = async () => {
    try {
        // Mendapatkan token dari localStorage
        // Getting the token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            return {
                success: false,
                message: 'No Token Found',
                data: [],
            };
        }

        // Melakukan panggilan fetch ke API
        // Making a fetch call to the API
        const response = await fetch(getApiUrl('/student/takMahasiswa'), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });

        // Memeriksa jika respons tidak berhasil 
        // Checking if the response is not ok 
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Mengembalikan data JSON dari respons
        // Returning the JSON data from the response
        const data = await response.json();
        return data;
    } catch (error) {
        // Menangani error jaringan atau kesalahan lainnya
        // Handling network or other errors
        console.error('Error fetching TAK data:', error);
        return {
            success: false,
            message: 'Network error. Could not fetch TAK data.',
            data: [],
        };
    }
};
