// src/services/mahasiswaServices/myFinanceService.js
import { getApiUrl, getAuthHeaders } from '../../config/api.js';

export const submitRelief = async (formData) => {
    try {
        const token = localStorage.getItem('token');

        console.log('Sending data to backend:', formData);

        if (!token) {
            return {
                success: false,
                message: 'Token tidak ditemukan',
            };
        }

        // Log the request payload for debugging
        console.log('Sending response with payload:', formData);

        const response = await fetch(getApiUrl('/student/sendRelief'), {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
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
