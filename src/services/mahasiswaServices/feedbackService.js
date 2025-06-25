// src/services/mahasiswaServices/feedbackService.js
import { getApiUrl, getAuthHeaders } from '../../config/api.js';

// Valid file types
const VALID_FILE_TYPES = [
    'application/pdf', // PDF
    'application/msword', // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.ms-excel', // XLS
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'image/jpeg', // JPG
    'image/png', // PNG
];

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
 * Validate if a file is of an allowed type
 * @param {File} file - File to validate
 * @returns {boolean} - Whether the file is valid
 */
export const isValidFileType = (file) => {
    if (!file) return true; // No file is valid (optional attachment)
    return VALID_FILE_TYPES.includes(file.type);
};

/**
 * Get human-readable list of allowed file extensions
 * @returns {string} - Comma-separated list of allowed extensions
 */
export const getAllowedFileExtensions = () => {
    return 'PDF, DOC, DOCX, XLS, XLSX, JPG, dan PNG';
};

/**
 * Submit feedback with optional file attachment
 * @param {string} title - Feedback title
 * @param {string} detail - Feedback content/details
 * @param {File} file - Optional file attachment
 * @returns {Promise} - API response
 */
export const submitFeedback = async (title, detail, file) => {
    try {
        // Validate file type before sending
        if (file && !isValidFileType(file)) {
            throw new Error(
                `Tipe file tidak didukung. Hanya ${getAllowedFileExtensions()} yang diperbolehkan.`
            );
        }

        // Create FormData for multipart/form-data request (required for file upload)
        const formData = new FormData();
        formData.append('title_keluhan', title);
        formData.append('detail_keluhan', detail);

        // Only append file if it exists
        if (file) {
            formData.append('file', file);
        }

        // Make the API request
        const response = await fetch(
            getApiUrl('/student/uploadLampiranKeluhan'),
            {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    // Don't set Content-Type for FormData - let browser set it with boundary
                },
                body: formData,
            }
        );

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            if (!response.ok) {
                throw new Error(
                    `Server error: ${response.status} ${response.statusText}`
                );
            }
            // If it's not JSON but the request was successful
            return { success: true, message: 'Feedback berhasil dikirim' };
        }

        // Parse JSON response
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to submit feedback');
        }

        return data;
    } catch (error) {
        console.error('Error in submitFeedback:', error);
        throw error;
    }
};

/**
 * Get list of user's feedback
 * @returns {Promise} - API response with feedback list
 */
export const getFeedbackList = async () => {
    try {
        // Make the API request
        const response = await fetch(getApiUrl('/student/myKeluhan'), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });

        // Parse response
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to get feedback list');
        }

        // Format the tanggal_keluhan in the response data
        if (data.data && Array.isArray(data.data)) {
            data.data = data.data.map((item) => ({
                ...item,
                tanggal_keluhan: item.tanggal_keluhan
                    ? formatDateTime(new Date(item.tanggal_keluhan))
                    : 'N/A',
            }));
        }

        return data;
    } catch (error) {
        console.error('Error in getFeedbackList:', error);
        throw error;
    }
};

/**
 * Get feedback details by ID
 * @param {string|number} id - Feedback ID
 * @returns {Promise} - API response with feedback details
 */
export const getFeedbackDetail = async (id) => {
    try {
        // Make the API request
        const response = await fetch(getApiUrl(`/student/myKeluhan/${id}`), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });

        // Parse response
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to get feedback details');
        }

        // Format the tanggal_keluhan in the response data
        if (data.data && data.data.tanggal_keluhan) {
            data.data.tanggal_keluhan = formatDateTime(
                new Date(data.data.tanggal_keluhan)
            );
        }

        return data;
    } catch (error) {
        console.error('Error in getFeedbackDetail:', error);
        throw error;
    }
};
