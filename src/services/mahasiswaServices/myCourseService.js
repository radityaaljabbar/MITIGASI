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
