import { getApiUrl, getAuthHeaders } from '../../config/api';
// Get data mahasiswa di tabel hasil (untuk cek user sudah isi atau belum)
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

        // Fetch API
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

// Kirim data hasil tes ke database
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

        // API
        const response = await fetch(getApiUrl('/student/sendPsiResult'), {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(psiTestData),
        });

        // console.log('Ini dari file service:', psiTestData);
        const data = await response.json();

        // Check if response was successful
        if (!response.ok) {
            return {
                success: false,
                message:
                    data.message || 'Failed to send psychological test data',
                data: data.data || [],
            };
        }

        // Return successful response
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
