// src/services/mahasiswaServices/myCourseService.js
import { getApiUrl, getAuthHeaders } from '../../config/api.js';

/**
 * Mengambil riwayat mata kuliah mahasiswa yang sedang login dari backend.
 * Fetches the course history of the currently logged-in student from the backend.
 * @returns {Promise<Object>} - Sebuah promise yang resolve dengan data riwayat atau objek error.
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

        // Melakukan panggilan fetch ke API
        // Making a fetch call to the API
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

/**
 * Mengambil rekomendasi mata kuliah yang dikirimkan oleh dosen wali.
 * Fetches course recommendations sent by the course advisor.
 * @returns {Promise<Object>} - Hasil dari panggilan API.
 */
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
                message: result.message || 'Failed to fetch recommended courses',
                data: [],
            };
        }

        // Mengembalikan data dengan struktur yang lebih detail
        // Returning data with a more detailed structure
        return {
            success: true,
            message: result.message || 'successfully fetch recommended course data',
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


/**
 * Mengambil daftar semua kelompok keahlian/peminatan dari backend.
 * Fetches a list of all specialization groups from the backend.
 * @returns {Promise<Object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengirim atau memperbarui pilihan peminatan mahasiswa ke backend.
 * Sends or updates the student's specialization choice to the backend.
 * @param {string} peminatan - Peminatan yang dipilih.
 * @returns {Promise<Object>} - Hasil dari panggilan API.
 */
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


/**
 * Mengambil peminatan yang sudah dipilih oleh mahasiswa dari backend.
 * Fetches the student's currently selected specialization from the backend.
 * @returns {Promise<Object>} - Hasil dari panggilan API.
 */
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
