const API_URL = 'http://localhost:5000/api/faculty';

/**
 * Format date to Indonesian format without time
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date (e.g., "SENIN, 10 JANUARI 2023")
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
 * Format date to Indonesian format with time
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date with time (e.g., "SENIN, 10 JANUARI 2023 14:30 WIB")
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
 * Get list of student feedback/complaints
 * @returns {Promise<Object>} - API response with feedback list
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

        const response = await fetch(`${API_URL}/keluhanMahasiswa`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const rawData = await response.json();
        console.log('API Raw Response:', rawData);

        // TRIPLE-NESTED STRUCTURE HANDLING
        // [0].payload[0].payload is where the actual data lives
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
            console.log(
                'Found actual data array with length:',
                actualData.length
            );
            console.log('First item sample:', actualData[0]);

            const formattedData = actualData.map((item) => ({
                feedbackId: item.id_keluhan,
                nim: item.nim || '',
                name: item.nama || '',
                kelas: item.kelas || '',
                title: item.title_keluhan || '',
                details: item.detail_keluhan || '',
                feedbackDate: item.tanggal_keluhan
                    ? formatDateOnly(new Date(item.tanggal_keluhan))
                    : 'N/A',
                // FIXED: Use the new 'status' field from backend
                status:
                    item.status ||
                    (item.has_response === 1
                        ? 'Sudah Direspon'
                        : 'Menunggu Respon'),
                statusCode: item.status_keluhan || 0,
            }));

            console.log('Formatted data sample:', formattedData[0]);
            return { success: true, data: formattedData };
        }

        // Fallback for different structure - try to find the data wherever it might be
        console.log(
            'Triple nested structure not found, trying alternative approaches'
        );

        // Try to search for any array with id_keluhan property in first item
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
            console.log(
                'Found data array using deep search:',
                foundData.length
            );

            const formattedData = foundData.map((item) => ({
                feedbackId: item.id_keluhan,
                nim: item.nim || '',
                name: item.nama || '',
                kelas: item.kelas || '',
                title: item.title_keluhan || '',
                details: item.detail_keluhan || '',
                feedbackDate: item.tanggal_keluhan
                    ? formatDateOnly(new Date(item.tanggal_keluhan))
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
 * Get detail of a specific feedback/complaint
 * @param {string|number} id - Feedback ID
 * @returns {Promise<Object>} - API response with feedback detail
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

        const rawData = await response.json();
        console.log('🔧 Detail Raw API Response:', rawData);

        // Helper function to find the details object at any nesting level
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
            console.log('🔧 Found detail item:', detailItem);
            console.log('🔧 Detail item status field:', detailItem.status);
            console.log(
                '🔧 Detail item status_keluhan field:',
                detailItem.status_keluhan
            );
            console.log(
                '🔧 Detail item has_response field:',
                detailItem.has_response
            );

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
                        ? formatDateOnly(new Date(detailItem.tanggal_keluhan))
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
 * Get response from dosen wali for a specific feedback
 * @param {string|number} id - Feedback ID
 * @returns {Promise<Object>} - API response with response data
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

        console.log(`🔧 Fetching response for feedback ID: ${id}`);

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

        const rawData = await response.json();
        console.log('🔧 Response data (raw):', rawData);

        // Helper function to find response data at any level of nesting
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
            console.log('🔧 Found response item:', responseItem);
            console.log('🔧 Response item status field:', responseItem.status);
            console.log(
                '🔧 Response item status_keluhan field:',
                responseItem.status_keluhan
            );

            return {
                success: true,
                data: {
                    responseId: responseItem.id_response,
                    feedbackId: responseItem.id_keluhan,
                    dosenNip: responseItem.nip_dosen_wali,
                    responseText: responseItem.response_keluhan,
                    responseDate: formatDateOnly(
                        new Date(responseItem.tanggal_response)
                    ),
                    // FIXED: Use the new 'status' field from backend, with fallback logic
                    status:
                        responseItem.status ||
                        (responseItem.status_keluhan === 1
                            ? 'Sudah Direspon'
                            : 'Menunggu Respon'),
                    statusCode: responseItem.status_keluhan,
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
 * Send or update response from dosen wali
 * @param {Object} responseData - Response data
 * @returns {Promise<Object>} - API response
 */
export const sendResponse = async (responseData) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            return {
                success: false,
                message: 'Token tidak ditemukan',
            };
        }

        // Log the request payload for debugging
        console.log('🔧 Sending response with payload:', responseData);

        const response = await fetch(`${API_URL}/sendResponDosWal`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(responseData),
        });

        // Log HTTP status for debugging
        console.log(
            `🔧 Response status: ${response.status} ${response.statusText}`
        );

        if (!response.ok) {
            console.error(
                `HTTP Error: ${response.status} ${response.statusText}`
            );
            return {
                success: false,
                message: `Server error: ${response.status} ${response.statusText}`,
            };
        }

        const data = await response.json();
        console.log('🔧 Server response data:', data);

        // Now we understand the exact structure from your backend:
        // {
        //   status: 'success' | 'error',
        //   message: 'Response berhasil dibuat' | 'Response berhasil diperbarui' | ...,
        //   payload: {...}
        // }

        return {
            success: data && data.status === 'success',
            message: data ? data.message : 'No message from server',
            data:
                data && data.payload && data.payload.payload
                    ? data.payload.payload // Doubly nested payload
                    : data && data.payload
                    ? data.payload
                    : {}, // Single nested payload or empty
        };
    } catch (error) {
        console.error('Error in sendResponse:', error);
        return {
            success: false,
            message: `Network error: ${error.message || 'Unknown error'}`,
        };
    }
};
