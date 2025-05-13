const API_URL = 'http://localhost:5000/api/faculty';

/**
 * Get TAK dari mahasiswa yang sedang login
 * @param nim
 * @return {Promise<Object>}
 */

export const getStudentTAKIPKSKS = async (nim) => {
    try {
        // Get token dari localStorage user
        const token = localStorage.getItem('token');

        if (!token) {
            return {
                success: false,
                message: 'No Token Found',
                data: [],
            };
        }

        // Fetch ke API:
        const response = await fetch(`${API_URL}/takipksksMahasiswa?nim=${nim}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching TAK data:', error);
        return {
            success: false,
            message: 'Network error. Could not fetch TAK data.',
            data: [],
        };
    }
};