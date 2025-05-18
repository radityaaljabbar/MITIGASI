/**
 * Service for handling feedback-related API calls
 */

// Base API URL - replace with your actual API URL
const API_URL = 'http://localhost:5000/api';

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

        // Get auth token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Authentication token not found');
        }

        // Make the API request
        const response = await fetch(
            `${API_URL}/student/uploadLampiranKeluhan`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
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
        // Get auth token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Authentication token not found');
        }

        // Make the API request
        const response = await fetch(`${API_URL}/student/myKeluhan`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Parse response
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to get feedback list');
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
        // Get auth token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Authentication token not found');
        }

        // Make the API request
        const response = await fetch(`${API_URL}/student/myKeluhan/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Parse response
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to get feedback details');
        }

        return data;
    } catch (error) {
        console.error('Error in getFeedbackDetail:', error);
        throw error;
    }
};
