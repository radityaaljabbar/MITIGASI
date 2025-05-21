const API_URL = 'http://localhost:5000/api/student';

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

        const response = await fetch(`${API_URL}/sendRelief`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
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
                    data.message || 'Gagal mengirim jawab formulir keringanan biaya',
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
            error: error.message
        };
    }
}


export const getReliefList = async () => {
    try {
        // Get auth token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Authentication token not found');
        }

        // Make the API request
        const response = await fetch(`${API_URL}/getStudentsRelief`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
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