import { getApiUrl, getAuthHeaders } from '../../config/api';

// Get all kurikulum
export const getAllKurikulum = async () => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaKurikulum/getAllKurikulum'),
            {
                method: 'GET',
                headers: {
                    ...getAuthHeaders(),
                },
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching kurikulum:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// Get mata kuliah by kurikulum
export const getMataKuliahByKurikulum = async (kurikulum) => {
    try {
        const response = await fetch(
            getApiUrl(
                `/admin/kelolaKurikulum/getMataKuliahByKurikulum?kurikulum=${kurikulum}`
            ),
            {
                method: 'GET',
                headers: {
                    ...getAuthHeaders(),
                },
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching mata kuliah:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// Get mata kuliah by ID
export const getMataKuliahById = async (id) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaKurikulum/getMataKuliahById/${id}`),
            {
                method: 'GET',
                headers: {
                    ...getAuthHeaders(),
                },
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching mata kuliah by id:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// Create new mata kuliah
export const createNewMataKuliah = async (mataKuliahData) => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaKurikulum/createNewMataKuliah'),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(mataKuliahData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating mata kuliah:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// Update mata kuliah
export const updateMataKuliah = async (id, mataKuliahData) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaKurikulum/updateMataKuliah/${id}`),
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(mataKuliahData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating mata kuliah:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// Delete mata kuliah
export const deleteMataKuliah = async (id) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaKurikulum/deleteMataKuliah/${id}`),
            {
                method: 'DELETE',
                headers: {
                    ...getAuthHeaders(),
                },
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting mata kuliah:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// Get ekuivalensi options
export const getEkuivalensiOptions = async (kurikulum) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaKurikulum/getEkuivalensiOptions/${kurikulum}`),
            {
                method: 'GET',
                headers: {
                    ...getAuthHeaders(),
                },
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching ekuivalensi options:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// Get all Kelompok Keahlian
export const getAllKelompokKeahlian = async () => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaKurikulum/getAllKelompokKeahlian'),
            {
                method: 'GET',
                headers: {
                    ...getAuthHeaders(),
                },
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching kelompok keahlian:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};