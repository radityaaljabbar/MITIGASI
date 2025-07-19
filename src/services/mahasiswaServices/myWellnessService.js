import { getApiUrl, getAuthHeaders } from '../../config/api';

/**
 * Mengambil hasil tes psikologi mahasiswa untuk memeriksa apakah sudah pernah mengisi.
 * Fetches the student's psychology test results to check if they have completed it before.
 * @returns {Promise<Object>} - Hasil dari panggilan API.
 */
export const getPsiResult = async () => {
    try {
        // Get token dari localStorage user
        const token = localStorage.getItem('token');

        if (!token) {
            return {
                success: false,
                message: 'No Token Found',
                data: [],
            };
        }

        // Melakukan panggilan API
        // Making the API call
        const response = await fetch(getApiUrl('/student/getPsiResult'), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || 'Failed to fetch results',
                data: [],
            };
        }

        const responseData = await response.json();

        // Mengembalikan data dengan struktur yang konsisten
        // Returning data with a consistent structure
        return {
            success: responseData.success,
            message: responseData.message || 'Results fetched successfully',
            count: responseData.count,
            data: responseData.data || [],
        };
    } catch (error) {
        console.error('Error fetching result data:', error);
        return {
            success: false,
            message: 'Network error. Could not fetch result data.',
            data: [],
        };
    }
};

/**
 * Mengirimkan data hasil tes psikologi ke database.
 * Sends the psychology test result data to the database.
 * @param {object} psiTestData - Data hasil tes yang akan dikirim.
 * @returns {Promise<Object>} - Hasil dari panggilan API.
 */
export const sendPsiResult = async (psiTestData) => {
    try {
        // Get token dari localStorage user
        const token = localStorage.getItem('token');

        if (!token) {
            return {
                success: false,
                message: 'No Token Found',
                data: [],
            };
        }

        // Melakukan panggilan API dengan metode POST
        // Making the API call with the POST method
        const response = await fetch(getApiUrl('/student/sendPsiResult'), {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(psiTestData),
        });

        const data = await response.json();

        // Memeriksa jika respons tidak berhasil
        // Checking if the response was not successful
        if (!response.ok) {
            return {
                success: false,
                message:
                    data.message || 'Failed to send psychological test data',
                data: data.data || [],
            };
        }

        // Mengembalikan respons sukses
        // Returning a successful response
        return {
            success: true,
            message:
                data.message || 'Psychological test data sent successfully',
            data: data.data || [],
        };
    } catch (error) {
        console.error('Error sending psychological test data:', error);
        return {
            success: false,
            message: 'An error occurred while sending the test data',
            data: [],
        };
    }
};
