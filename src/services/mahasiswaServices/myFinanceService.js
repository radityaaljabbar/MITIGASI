// src/services/mahasiswaServices/myFinanceService.js
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
 * Validate if a file is of an allowed type
 */
export const isValidFileType = (file) => {
    if (!file) return true;
    return VALID_FILE_TYPES.includes(file.type);
};

/**
 * Get human-readable list of allowed file extensions
 */
export const getAllowedFileExtensions = () => {
    return 'PDF, DOC, DOCX, XLS, XLSX, JPG, dan PNG';
};

export const submitRelief = async (formData, file) => {
    try {
        // Validate file type before sending
        if (file && !isValidFileType(file)) {
            throw new Error(
                `Tipe file tidak didukung. Hanya ${getAllowedFileExtensions()} yang diperbolehkan.`
            );
        }

        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                message: 'Token tidak ditemukan',
            };
        }

        const formDataToSend = new FormData();

        // Append all form fields
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        // Append file if exists
        if (file) {
            formDataToSend.append('file', file);
        }

        const response = await fetch(getApiUrl('/student/sendRelief'), {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
            },
            body: formDataToSend,
        });

        const data = await response.json();

        // Check if response was successful
        if (!response.ok) {
            return {
                success: false,
                message:
                    data.message ||
                    'Gagal mengirim jawab formulir keringanan biaya',
                data: data,
            };
        }

        // Return successful response with proper structure
        return {
            success: true,
            message: 'Pengajuan keringanan berhasil dikirim',
            data: data,
        };
    } catch (error) {
        console.error('Error in submitRelief:', error);
        return {
            success: false,
            message: 'Terjadi kesalahan saat menghubungi server',
            error: error.message,
        };
    }
};

export const getReliefList = async () => {
    try {
        // Make the API request
        const response = await fetch(getApiUrl('/student/getStudentsRelief'), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });

        // Parse response
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to get relief list');
        }

        return data;
    } catch (error) {
        console.error('Error in getReliefList:', error);
        throw error;
    }
};
