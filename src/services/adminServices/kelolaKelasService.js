// src/services/adminServices/kelolaKelasService.js
import { getApiUrl, getAuthHeaders } from '../../config/api.js';

// =============================================
// ==           KELAS SERVICES                ==
// =============================================

// GET - Ambil semua kelas
export const getAllKelas = async () => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaKelas/getAllKelas'),
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
        console.error('Error fetching kelas:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// GET - Ambil daftar dosen untuk dropdown
export const getDosenList = async () => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaKelas/getDosenList'),
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
        console.error('Error fetching dosen list:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// POST - Tambah kelas baru
export const createKelas = async (kelasData) => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaKelas/createKelas'),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(kelasData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating kelas:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// PUT - Update kelas (hanya dosen wali)
export const updateKelas = async (id, kelasData) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaKelas/updateKelas/${id}`),
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(kelasData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating kelas:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// DELETE - Hapus kelas
export const deleteKelas = async (id) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaKelas/deleteKelas/${id}`),
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
        console.error('Error deleting kelas:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};
