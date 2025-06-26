// src/services/mahasiswaServices/myCourseService.js
import { getApiUrl, getAuthHeaders } from '../../config/api.js';

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
        const response = await fetch(getApiUrl('/student/riwayatMataKuliah'), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

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
        const response = await fetch(
            getApiUrl('/student/rekomendasiMataKuliah'),
            {
                method: 'GET',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
            }
        );

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
            groupedData: result.groupedData || {},
            totalRecommendations: result.totalRecommendations || 0,
            semesterCount: result.semesterCount || 0,
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


// Get list kelompok keahlian/peminatan dari backend
export const getListPeminatan = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                message: 'No Token Found',
                data: [],
            };
        }

        // Fetch API:
        const response = await fetch(getApiUrl('/student/getAllListPeminatan'), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || 'Failed to fetch list peminatan',
                data: [],
            };
        }

        return result;
        
    } catch (error) {
        console.error('Error fetching List Peminatan:', error);
        return {
            success: false,
            message: 'Network error. Could not fetch List Peminatan.',
            data: [],
        };
    }
};

// Send/Update peminatan mahasiswa ke backend
export const sendPeminatanMahasiswa = async (peminatan) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                message: 'No Token Found',
            };
        }

        const response = await fetch(
            getApiUrl('/student/sendPeminatanMahasiswa'),
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify({ peminatan }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || 'Failed to send peminatan mahasiswa',
            };
        }

        return {
            success: true,
            message: result.message || 'Peminatan mahasiswa berhasil dikirim',
            data: result.data || {},
        };

    } catch (error) {
        console.error('Error sending peminatan mahasiswa:', error);
        return {
            success: false,
            message: 'Network error. Could not send peminatan mahasiswa.',
        };
    }
};


// Get peminatan mahasiswa dari backend
export const getStudentPeminatan = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No Token Found' };
        }

        const response = await fetch(getApiUrl('/student/getPeminatanMahasiswa'), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || 'Failed to fetch student peminatan.',
            };
        }

        return result;
    } catch (error) {
        console.error('Error fetching student peminatan:', error);
        return {
            success: false,
            message: 'Network error. Could not fetch student peminatan.',
        };
    }
};
