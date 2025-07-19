import { getApiUrl, getAuthHeaders } from '../../../config/api';

/**
 * Memformat tanggal ke format Indonesia (misal: SENIN, 10 JANUARI 2023).
 * Formats a date to the Indonesian format (e.g., "SENIN, 10 JANUARI 2023").
 * @param {Date|string} date - Objek tanggal atau string yang akan diformat.
 * @returns {string} - Tanggal yang sudah diformat.
 */
export const formatDateOnly = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
        return 'Invalid Date';
    }

    const dateObj = new Date(date);
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

    const day = days[dateObj.getDay()];
    const dateNum = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    return `${day}, ${dateNum} ${month} ${year}`;
};

/**
 * Memformat tanggal ke format Indonesia lengkap dengan waktu.
 * Formats a date to the full Indonesian format with time.
 * @param {Date|string} date - Objek tanggal atau string yang akan diformat.
 * @returns {string} - Tanggal yang sudah diformat dengan waktu.
 */
export const formatDateTime = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
        return 'Invalid Date';
    }

    const dateObj = new Date(date);
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

    const day = days[dateObj.getDay()];
    const dateNum = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    // Format to 24-hour format
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${day}, ${dateNum} ${month} ${year} ${hours}:${minutes} WIB`;
};

/**
 * Mengambil daftar semua feedback/keluhan dari mahasiswa yang menjadi bimbingan dosen.
 * Fetches a list of all feedback/complaints from students advised by the lecturer.
 * @returns {Promise<Object>} - Hasil dari panggilan API.
 */
export const getFeedbackList = async () => {
    try {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            return {
                success: false,
                message: 'No Token Found',
            };
        }

        const response = await fetch(getApiUrl('/faculty/keluhanMahasiswa'), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });

        const rawData = await response.json();

        // PENANGANAN STRUKTUR DATA BERTINGKAT (TRIPLE-NESTED)
        // TRIPLE-NESTED STRUCTURE HANDLING
        // Kode ini secara spesifik mencari data aktual yang mungkin terbungkus dalam beberapa lapisan 'payload'.
        // This code specifically looks for the actual data which might be wrapped in several 'payload' layers.
        if (
            Array.isArray(rawData) &&
            rawData.length > 0 &&
            rawData[0]?.payload &&
            Array.isArray(rawData[0].payload) &&
            rawData[0].payload.length > 0 &&
            rawData[0].payload[0]?.payload &&
            Array.isArray(rawData[0].payload[0].payload)
        ) {
            // The actual data is 3 levels deep
            const actualData = rawData[0].payload[0].payload;

            const formattedData = actualData.map((item) => ({
                feedbackId: item.id_keluhan,
                nim: item.nim || '',
                name: item.nama || '',
                kelas: item.kelas || '',
                title: item.title_keluhan || '',
                details: item.detail_keluhan || '',
                feedbackDate: item.tanggal_keluhan
                    ? formatDateTime(new Date(item.tanggal_keluhan)) // CHANGED: formatDateOnly -> formatDateTime
                    : 'N/A',
                // FIXED: Use the new 'status' field from backend
                status:
                    item.status ||
                    (item.has_response === 1
                        ? 'Sudah Direspon'
                        : 'Menunggu Respon'),
                statusCode: item.status_keluhan || 0,
            }));

            return { success: true, data: formattedData };
        }

        // Pencarian data alternatif jika struktur tidak sesuai dengan yang utama.
        // Alternative data search if the structure doesn't match the primary one.
        const findDataArray = (obj, depth = 0, maxDepth = 5) => {
            if (depth > maxDepth) return null;

            if (Array.isArray(obj) && obj.length > 0 && obj[0]?.id_keluhan) {
                return obj;
            }

            if (typeof obj === 'object' && obj !== null) {
                for (const key in obj) {
                    const result = findDataArray(obj[key], depth + 1, maxDepth);
                    if (result) return result;
                }
            }

            return null;
        };

        const foundData = findDataArray(rawData);
        if (foundData) {
            const formattedData = foundData.map((item) => ({
                feedbackId: item.id_keluhan,
                nim: item.nim || '',
                name: item.nama || '',
                kelas: item.kelas || '',
                title: item.title_keluhan || '',
                details: item.detail_keluhan || '',
                feedbackDate: item.tanggal_keluhan
                    ? formatDateTime(new Date(item.tanggal_keluhan)) // CHANGED: formatDateOnly -> formatDateTime
                    : 'N/A',
                // FIXED: Use the new 'status' field from backend
                status:
                    item.status ||
                    (item.has_response === 1
                        ? 'Sudah Direspon'
                        : 'Menunggu Respon'),
                statusCode: item.status_keluhan || 0,
            }));

            return { success: true, data: formattedData };
        }

        return {
            success: false,
            message: 'No data found in the response',
            data: [],
        };
    } catch (error) {
        console.error('Error fetching feedback data:', error);
        return {
            success: false,
            message: 'Network error. Could not fetch feedback data.',
            data: [],
        };
    }
};

/**
 * Mengambil detail dari satu feedback/keluhan tertentu.
 * Fetches the detail of a specific feedback/complaint.
 * @param {string|number} id - ID feedback.
 * @returns {Promise<Object>} - Hasil dari panggilan API.
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

        const response = await fetch(
            getApiUrl(`/faculty/keluhanMahasiswa/${id}`),
            {
                method: 'GET',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
            }
        );

        const rawData = await response.json();

        // Fungsi helper untuk mencari objek detail di dalam respons yang mungkin bertingkat.
        // Helper function to find the detail object within a potentially nested response.
        const findDetailObject = (data) => {
            // Check if this object has the expected properties
            if (data && data.id_keluhan && data.nim && data.title_keluhan) {
                return data;
            }

            // If this is an object, search its properties
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                for (const key in data) {
                    const result = findDetailObject(data[key]);
                    if (result) return result;
                }
            }

            // If this is an array, search its items
            if (Array.isArray(data)) {
                for (const item of data) {
                    const result = findDetailObject(item);
                    if (result) return result;
                }
            }

            return null;
        };

        // Try to find the detail object
        const detailItem = findDetailObject(rawData);

        if (detailItem) {
            return {
                success: true,
                data: {
                    feedbackId: detailItem.id_keluhan,
                    nim: detailItem.nim || '',
                    name: detailItem.nama || '',
                    kelas: detailItem.kelas || '',
                    title: detailItem.title_keluhan || '',
                    details: detailItem.detail_keluhan || '',
                    feedbackDate: detailItem.tanggal_keluhan
                        ? formatDateTime(new Date(detailItem.tanggal_keluhan)) // CHANGED: formatDateOnly -> formatDateTime
                        : 'N/A',
                    lampiran: detailItem.lampiran || null,
                    // FIXED: Use the new 'status' field from backend, with fallback logic
                    status:
                        detailItem.status ||
                        (detailItem.status_keluhan === 1
                            ? 'Sudah Direspon'
                            : detailItem.has_response === 1
                            ? 'Sudah Direspon'
                            : 'Menunggu Respon'),
                    statusCode: detailItem.status_keluhan || 0,
                },
            };
        }

        return {
            success: false,
            message: 'Detail data not found in response',
        };
    } catch (error) {
        console.error('Error fetching feedback detail:', error);
        return {
            success: false,
            message: 'Network error. Could not fetch feedback detail.',
        };
    }
};

/**
 * Mengambil tanggapan dosen wali untuk sebuah feedback.
 * Fetches the course advisor's response for a specific feedback.
 * @param {string|number} id - ID feedback.
 * @returns {Promise<Object>} - Hasil dari panggilan API.
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

        // Use the correct endpoint with query parameter
        const response = await fetch(
            getApiUrl(`faculty/responseDosenWali?feedbackId=${id}`),
            {
                method: 'GET',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
            }
        );

        const rawData = await response.json();

        // Fungsi helper untuk mencari data tanggapan di dalam respons yang mungkin bertingkat.
        // Helper function to find response data within a potentially nested response.
        const findResponseData = (data) => {
            // If this is an array with response properties, return the first item
            if (
                Array.isArray(data) &&
                data.length > 0 &&
                data[0]?.id_response
            ) {
                return data[0];
            }

            // If this is an array, search its items
            if (Array.isArray(data)) {
                for (const item of data) {
                    const result = findResponseData(item);
                    if (result) return result;
                }
            }

            // If this is an object, search its properties
            if (data && typeof data === 'object') {
                // Check if this object has response properties
                if (data.id_response && data.response_keluhan) {
                    return data;
                }

                // Otherwise search its properties
                for (const key in data) {
                    if (
                        key === 'payload' ||
                        Array.isArray(data[key]) ||
                        typeof data[key] === 'object'
                    ) {
                        const result = findResponseData(data[key]);
                        if (result) return result;
                    }
                }
            }

            return null;
        };

        // Find the response data
        const responseItem = findResponseData(rawData);

        if (responseItem) {
            return {
                success: true,
                data: {
                    responseId: responseItem.id_response,
                    feedbackId: responseItem.id_keluhan,
                    dosenNip: responseItem.nip_dosen_wali,
                    responseText: responseItem.response_keluhan,
                    responseDate: formatDateTime(
                        new Date(responseItem.tanggal_response)
                    ),
                    status:
                        responseItem.status ||
                        (responseItem.status_keluhan === 1
                            ? 'Sudah Direspon'
                            : 'Menunggu Respon'),
                    statusCode: responseItem.status_keluhan,
                    // FIXED: Include lampiran data
                    lampiran: responseItem.lampiran || null,
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

/**
 * Mengirim atau memperbarui tanggapan dosen wali, dengan lampiran opsional.
 * Sends or updates a course advisor's response, with an optional attachment.
 * @param {Object} responseData - Data tanggapan.
 * @param {File|null} file - File lampiran (opsional).
 * @returns {Promise<Object>} - Hasil dari panggilan API.
 */
export const sendResponse = async (responseData, file = null) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'Token tidak ditemukan' };
        }

        let body;
        let headers = {
            ...getAuthHeaders(),
        };

        // Jika ada file, gunakan FormData. Jika tidak, gunakan JSON.
        // If a file is present, use FormData. Otherwise, use JSON.
        if (file) {
            const formData = new FormData();
            formData.append('id_keluhan', responseData.id_keluhan);
            formData.append('response_keluhan', responseData.response_keluhan);
            formData.append('status_keluhan', responseData.status_keluhan);
            formData.append('file', file);

            body = formData;
            // Don't set Content-Type when using FormData, let browser set it with boundary
        } else {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(responseData);
        }

        const response = await fetch(getApiUrl('/faculty/sendResponDosWal'), {
            method: 'POST',
            headers: headers,
            body: body,
        });

        console.log('HTTP Status:', response.status, response.statusText);

        if (!response.ok) {
            return {
                success: false,
                message: `HTTP Error: ${response.status}`,
            };
        }

        const data = await response.json();

        // Always return success if we got here and there's no explicit error
        return {
            success: true,
            message: data.message || 'Tanggapan berhasil dikirim',
            data: data.payload || {},
        };
    } catch (error) {
        console.error('Network error:', error);
        return {
            success: false,
            message: `Error: ${error.message || 'Unknown error'}`,
        };
    }
};
