// src/services/adminServices/kelolaPenggunaService.js
import { getApiUrl, getAuthHeaders } from '../../config/api';

/**
 * Mengambil semua data admin dari server.
 * Fetches all admin data from the server.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const getAllAdmins = async () => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaPengguna/getAdmin'),
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
        console.error('Error fetching admins:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

/**
 * Mengirim data untuk membuat admin baru.
 * Sends data to create a new admin.
 * @param {object} adminData - Data admin baru (nama, username, password).
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const createAdmin = async (adminData) => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaPengguna/createAdmin'),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(adminData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating admin:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

/**
 * Mengirim data untuk memperbarui admin yang ada.
 * Sends data to update an existing admin.
 * @param {number|string} id - ID admin yang akan diupdate.
 * @param {object} adminData - Data admin yang diperbarui.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const updateAdmin = async (id, adminData) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaPengguna/updateAdmin/${id}`),
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(adminData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating admin:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

/**
 * Menghapus data admin berdasarkan ID.
 * Deletes admin data by ID.
 * @param {number|string} id - ID admin yang akan dihapus.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const deleteAdmin = async (id) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaPengguna/deleteAdmin/${id}`),
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
        console.error('Error deleting admin:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

/**
 * Mengambil semua data dosen wali dari server.
 * Fetches all course advisor data from the server.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const getAllDosen = async () => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaPengguna/getDosenWali'),
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
        console.error('Error fetching dosen:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

/**
 * Mengirim data untuk membuat dosen wali baru.
 * Sends data to create a new course advisor.
 * @param {object} dosenData - Data dosen wali baru.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const createDosen = async (dosenData) => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaPengguna/createDosenWali'),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(dosenData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating dosen:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

/**
 * Mengirim data untuk memperbarui data dosen wali yang ada.
 * Sends data to update an existing course advisor data.
 * @param {string} nip - NIP dosen wali yang akan diupdate.
 * @param {object} dosenData - Data dosen wali yang diperbarui.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const updateDosen = async (nip, dosenData) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaPengguna/updateDosenWali/${nip}`),
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(dosenData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating dosen:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

/**
 * Menghapus data dosen wali berdasarkan NIP.
 * Deletes course advisor data by NIP.
 * @param {string} nip - NIP dosen wali yang akan dihapus.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const deleteDosen = async (nip) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaPengguna/deleteDosenWali/${nip}`),
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
        console.error('Error deleting dosen:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

/**
 * Mengambil semua data mahasiswa.
 * Fetches all student data.
 * @returns {Promise<object>}
 */
export const getAllMahasiswa = async () => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaPengguna/getMahasiswa'),
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
        console.error('Error fetching mahasiswa:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

/**
 * Mengirim data untuk membuat mahasiswa baru.
 * Sends data to create a new student.
 * @param {object} mahasiswaData - Data mahasiswa baru.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const createMahasiswa = async (mahasiswaData) => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaPengguna/createMahasiswa'),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(mahasiswaData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating mahasiswa:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

/**
 * Mengirim data untuk memperbarui mahasiswa yang ada.
 * Sends data to update an existing student.
 * @param {string} nim - NIM mahasiswa yang akan diupdate.
 * @param {object} mahasiswaData - Data mahasiswa yang diperbarui.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const updateMahasiswa = async (nim, mahasiswaData) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaPengguna/updateMahasiswa/${nim}`),
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(mahasiswaData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating mahasiswa:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

/**
 * Menghapus data mahasiswa berdasarkan NIM.
 * Deletes student data by NIM.
 * @param {string} nim - NIM mahasiswa yang akan dihapus.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const deleteMahasiswa = async (nim) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaPengguna/deleteMahasiswa/${nim}`),
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
        console.error('Error deleting mahasiswa:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

/**
 * Mengirim file CSV untuk import data mahasiswa secara massal.
 * Sends a CSV file to bulk import student data.
 * @param {File} file - File CSV yang berisi data mahasiswa.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const bulkCreateMahasiswa = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(
            getApiUrl('/admin/kelolaPengguna/bulkCreateMahasiswa'),
            {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                },
                body: formData,
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error bulk creating mahasiswa:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

/**
 * Mengambil daftar semua kelas untuk digunakan di dropdown.
 * Fetches a list of all classes for use in a dropdown.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const getAllKelas = async () => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaPengguna/getAllKelas'),
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
