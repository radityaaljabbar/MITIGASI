import { getApiUrl, getAuthHeaders } from '../../../config/api';

/**
 * Mengambil data TAK, IPK, dan SKS seorang mahasiswa berdasarkan NIM.
 * Fetches TAK, GPA, and SKS data for a student by NIM.
 * @param {string} nim - NIM mahasiswa.
 * @return {Promise<Object>} - Hasil dari panggilan API.
 */

export const getStudentTAKIPKSKS = async (nim) => {
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

        // Fetch ke API:
        const response = await fetch(getApiUrl(`/faculty/takipksksMahasiswa?nim=${nim}`), {
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
        return data;
    } catch (error) {
        console.error('Error fetching TAK data:', error);
        return {
            success: false,
            message: 'Network error. Could not fetch TAK data.',
            data: [],
        };
    }
};