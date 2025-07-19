// src/services/adminServices/kelolaKelasService.js
import { getApiUrl, getAuthHeaders } from '../../config/api.js';

/**
 * Mengambil semua data kelas dari server.
 * Fetches all class data from the server.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengambil daftar dosen untuk digunakan di dropdown penugasan dosen wali.
 * Fetches a list of lecturers for use in the course advisor assignment dropdown.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengirim data untuk membuat kelas baru.
 * Sends data to create a new class.
 * @param {object} kelasData - Data kelas baru.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengirim data untuk memperbarui data kelas yang ada (cntoh, mengubah dosen wali).
 * Sends data to update an existing class  data(example, changing the course advisor).
 * @param {number|string} id - ID kelas yang akan diupdate.
 * @param {object} kelasData - Data kelas yang diperbarui.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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
