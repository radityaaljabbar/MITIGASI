// src/services/adminServices/kelolaPenggunaService.js
import { getApiUrl, getAuthHeaders } from '../../config/api';

// =============================================
// ==           ADMIN SERVICES                ==
// =============================================

// GET - Ambil semua admin
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

// POST - Tambah admin baru
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

// PUT - Update admin
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

// DELETE - Hapus admin
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

// =============================================
// ==           DOSEN WALI SERVICES           ==
// =============================================

// GET - Ambil semua dosen wali
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

// POST - Tambah dosen wali baru
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

// PUT - Update dosen wali
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

// DELETE - Hapus dosen wali
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

// =============================================
// ==           MAHASISWA SERVICES            ==
// =============================================

// GET - Ambil semua mahasiswa
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

// POST - Tambah mahasiswa baru
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

// PUT - Update mahasiswa
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

// DELETE - Hapus mahasiswa
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

// =============================================
// ==           HELPER SERVICES               ==
// =============================================

// GET - Ambil daftar kelas untuk dropdown
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
