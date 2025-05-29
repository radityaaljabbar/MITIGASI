import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/faculty';

/**
 * Service untuk ML Prediction API calls
 */
export const mlPredictionService = {
    /**
     * Prediksi status mahasiswa berdasarkan NIM dan data akademik
     * @param {string} nim - NIM mahasiswa
     * @param {Object} predictionData - Data untuk prediksi
     * @param {number} predictionData.ipk - IPK mahasiswa (0-4)
     * @param {number} predictionData.skor_psikologi - Skor psikologi (1-100)
     * @param {number} predictionData.finansial - Status finansial (0/1)
     */
    async predictStudentStatus(nim, predictionData) {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(
                `${API_BASE_URL}/ml/predict/${nim}`,
                predictionData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
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
     * Test ML service health
     */
    async testMLService() {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get(`${API_BASE_URL}/ml/test`, {
                headers: {
                    Authorization: `Bearer ${token}`,
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
