const API_URL = 'http://localhost:5000/api/faculty';

// Dapetin list keluhan mahasiswa dari backend
/**
 *
 * @returns {Promise<Object>}
 */
export const getFeedbackList = async () => {
    try {
        // Get token dari localStorage user
        const token = localStorage.getItem('token');

        if (!token) {
            return {
                success: false,
                message: 'No Token Found',
            };
        }

        const response = await fetch(`${API_URL}/keluhanMahasiswa`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('API Response:', data);

        // Format data yang diambil biar match sama format data di frontend
        if (data && data[0]?.payload) {
            const formattedData = data[0].payload.map((item) => ({
                feedbackId: item.id_keluhan,
                nim: item.nim,
                name: item.nama,
                kelas: item.kode_kelas,
                title: item.title_keluhan,
                details: item.detail_keluhan,
                feedbackDate: formatDate(new Date(item.tanggal_keluhan)),
                status: 'Menunggu Respon', // Default status as it's not in the API response
            }));
            return { success: true, data: formattedData };
        }
        return { success: false, message: 'No data found', data: [] };
    } catch (error) {
        console.error('Error fetching feedback data:', error);
        return {
            success: false,
            message: 'Network error. Could not fetch feedback data.',
            data: [],
        };
    }
};

// Get detil dari feedback mahasiswa sesuai params
/**
 * @param {string|number}
 * @returns {Promise<Object>}
 */

export const getFeedbackDetail = async (id) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            return {
                success: false,
                message: 'No token found',
            };
        }

        const response = await fetch(`${API_URL}/keluhanMahasiswa/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (data && data.payload) {
            const item = data.payload;
            return {
                success: true,
                data: {
                    feedbackId: item.id_keluhan,
                    nim: item.nim,
                    name: item.nama,
                    kelas: item.kode_kelas,
                    title: item.title_keluhan,
                    details: item.detail_keluhan,
                    feedbackDate: formatDate(new Date(item.tanggal_keluhan)),
                    status: 'Menunggu Respon', // Default status
                },
            };
        }

        return {
            success: false,
            message: 'Feedback not found',
        };
    } catch (error) {
        console.error('Error fetching feedback deta', error);
        return {
            success: false,
            message: 'Network error. Could not fetch feedback detail.',
        };
    }
};

// Get response dari dosen wali terkait feedback mahasiswa sesuai id params
/**
 * @param {string|number}
 * @returns {Promise<Object>}
 */

/**
 * Get response dari dosen wali terkait feedback mahasiswa sesuai id params
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export const getFeedbackResponse = async (id) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            return {
                success: false,
                message: 'No token found',
            };
        }

        console.log(`Fetching response for feedback ID: ${id}`);

        // Use the correct endpoint with query parameter
        const response = await fetch(
            `${API_URL}/responseDosenWali?feedbackId=${id}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();
        console.log('Response data:', data);

        // Check if we received valid data from the endpoint
        if (data && data[0]?.payload && data[0].payload.length > 0) {
            const item = data[0].payload[0]; // Get the first item in the payload array
            return {
                success: true,
                data: {
                    responseId: item.id_response,
                    feedbackId: item.id_keluhan,
                    dosenNip: item.nip_dosen_wali,
                    responseText: item.response_keluhan,
                    responseDate: formatDate(new Date(item.tanggal_response)),
                    status:
                        item.status_keluhan === 1
                            ? 'Sudah Direspon'
                            : 'Menunggu Respon',
                },
            };
        }

        return {
            success: false,
            message: 'No response found for this feedback',
        };
    } catch (error) {
        console.error('Error fetching feedback response:', error);
        return {
            success: false,
            message: 'Network error could not fetch feedback response',
        };
    }
};

// Make sure this function is properly exported
/**
 * Format date to Indonesian format
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
    if (!date || isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    const days = [
        'MINGGU',
        'SENIN',
        'SELASA',
        'RABU',
        'KAMIS',
        'JUMAT',
        'SABTU',
    ];
    const months = [
        'JANUARI',
        'FEBRUARI',
        'MARET',
        'APRIL',
        'MEI',
        'JUNI',
        'JULI',
        'AGUSTUS',
        'SEPTEMBER',
        'OKTOBER',
        'NOVEMBER',
        'DESEMBER',
    ];

    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Format ke format 24-hour
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}, ${dateNum} ${month} ${year} ${hours}:${minutes} WIB`;
}
