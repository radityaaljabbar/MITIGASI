const API_URL = 'http://localhost:5000/api/student';

// Get list riwayat MK mahasiswa dari backend:
/**
 * @returns {Promise<Object>}
 */
export const getCourseHistory = async () => {
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

        // Fetch API:
        const response = await fetch(`${API_URL}/riwayatMataKuliah`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log('API Response:', data);

        return data; // Return data dri API
    } catch (error) {
        console.error('Error fetching course history data:', error);
        return {
            success: false,
            message: 'Network error. Could not fetch course history data.',
            data: [],
        };
    }
};

// Get rekomendasi MK yang dikirimkan oleh dosen wali
export const getRecommendedCourse = async () => {
    try {
        // Get dan validasi token dari localStorage user
        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                message: 'No Token Found',
                data: [],
            };
        }

        // Fetch api
        const response = await fetch(`${API_URL}/rekomendasiMataKuliah`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message:
                    result.message || 'Failed to fetch recommended courses',
                data: [],
            };
        }

        return {
            success: true,
            message:
                result.message || 'successfully fetch recommended course data',
            data: result.data || [],
        };
    } catch (error) {
        console.error('Error fetching recommended courses: ', error);
        return {
            success: false,
            message: 'An error occurred while fetching recommended courses',
            data: [],
        };
    }
};
