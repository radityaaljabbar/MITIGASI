import { getApiUrl, getAuthHeaders } from '../../../config/api';

/**
 * Mengambil detail riwayat nilai mata kuliah seorang mahasiswa.
 * Gets the detailed course grade history of a student.
 * @param {string}
 * @return {Promise <Object>}
 */

export const getStudentCourseHistory = async (nim) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                message: 'Not authorized, No token found',
                data: [],
            };
        }

        console.log('Fetching riwayat mata kuliah untuk: ', nim);

        const response = await fetch(
            getApiUrl(`/faculty/MyStudentDetailNilaiMK/${nim}`),
            {
                method: 'GET',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
            }
        );

        // Penanganan error berdasarkan status code HTTP
        // Error handling based on HTTP status code
        if (!response.ok) {
            if (response.status === 401) {
                return {
                    success: false,
                    message: 'Unauthorized: Please login again',
                    data: [],
                };
            } else if (response.status === 404) {
                return {
                    success: false,
                    message:
                        'Data riwayat mata kuliah tidak ditemukan untuk NIM ini',
                    data: [],
                };
            } else if (response.status === 403) {
                return {
                    success: false,
                    message: 'Forbidden: Anda tidak memiliki akses ke data ini',
                    data: [],
                };
            } else {
                return {
                    success: false,
                    message: `HTTP error! status: ${response.status}`,
                    data: [],
                };
            }
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Memastikan struktur respons konsisten
        // Ensuring a consistent response structure
        return {
            success: data.success || true,
            message: data.message || 'Data berhasil diambil',
            data: data.data || [],
            count: data.count || 0,
        };
    } catch (error) {
        console.error('Error fetching course history:', error);
        return {
            success: false,
            message:
                error.message || 'Gagal mengambil data riwayat mata kuliah',
            data: [],
        };
    }
};
