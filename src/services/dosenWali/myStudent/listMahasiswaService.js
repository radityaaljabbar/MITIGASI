const API_URL = 'http://localhost:5000/api/faculty'; // Base backend URL

export const getListMahasiswa = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            return { success: false, message: 'No token found' };
        }

        const response = await fetch(`${API_URL}/listMahasiswa`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        return {
            success: false,
            message: 'Network error. Could not fetch user data.',
        };
    }
};
