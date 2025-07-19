import axios from 'axios';

import { getApiUrl, getAuthHeaders } from '../../../config/api';

/**
 * Service untuk ML Prediction API calls
 */
export const mlPredictionService = {
    /**
     * Memprediksi status mahasiswa berdasarkan NIM dan data akademik/non-akademik.
     * Predicts a student's status based on NIM and academic/non-academic data.
     * @param {string} nim - NIM mahasiswa
     * @param {Object} predictionData - Data untuk prediksi
     * @param {number} predictionData.ipk - IPK mahasiswa (0-4)
     * @param {number} predictionData.skor_psikologi - Skor psikologi (1-100)
     * @param {number} predictionData.finansial - Status finansial (0/1)
     */
    async predictStudentStatus(nim, predictionData) {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return { success: false, message: 'No token found' };
            }

            const response = await axios.post(
                getApiUrl(`/faculty/ml/predict/${nim}`),
                predictionData,
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'application/json',
                    },
                    timeout: 35000, // 35 seconds timeout (sedikit lebih lama dari backend)
                }
            );

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('ML Prediction error:', error);
            // Penanganan error spesifik untuk timeout
            // Specific error handling for timeout
            if (error.code === 'ECONNABORTED') {
                return {
                    success: false,
                    error: 'Prediction timeout. Please try again.',
                };
            }

            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    error.message ||
                    'Failed to predict student status',
            };
        }
    },

    /**
     * Menguji kesehatan service (endpoint) Machine Learning.
     * Tests the health of the Machine Learning service (endpoint).
     * @returns {Promise<Object>} - Status dari service ML.
     */
    async testMLService() {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get(getApiUrl(`/faculty/ml/test`), {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
                timeout: 15000,
            });

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('ML Test error:', error);
            return {
                success: false,
                error:
                    error.response?.data?.message || 'ML service test failed',
            };
        }
    },
};
