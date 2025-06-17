// src/services/adminServices/kelolaAkademikService.js
import { getApiUrl, getAuthHeaders } from '../../config/api.js';

// =============================================
// ==           MAHASISWA SERVICES            ==
// =============================================

// GET - Ambil semua mahasiswa
export const getAllMahasiswa = async () => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaAkademik/getAllMahasiswa'),
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

// =============================================
// ==           NILAI/GRADES SERVICES         ==
// =============================================

// GET - Ambil nilai mahasiswa berdasarkan NIM
export const getGradesMahasiswa = async (nim) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaAkademik/getGradesMahasiswa/${nim}`),
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
        console.error('Error fetching grades:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// GET - Ambil semua mata kuliah
export const getAllCourses = async () => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaAkademik/getAllCourses'),
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
        console.error('Error fetching courses:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// POST - Tambah nilai baru
export const createGrade = async (gradeData) => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaAkademik/createGrade'),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(gradeData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating grade:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// PUT - Update nilai
export const updateGrade = async (id, gradeData) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaAkademik/updateGrade/${id}`),
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(gradeData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating grade:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// DELETE - Hapus nilai
export const deleteGrade = async (id) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaAkademik/deleteGrade/${id}`),
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
        console.error('Error deleting grade:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// =============================================
// ==           PRESTASI SERVICES             ==
// =============================================

// GET - Ambil data prestasi mahasiswa
export const getPrestasiData = async (nim) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaAkademik/getPrestasiData/${nim}`),
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
        console.error('Error fetching prestasi data:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// POST - Tambah data prestasi
export const createPrestasiData = async (prestasiData) => {
    try {
        const response = await fetch(
            getApiUrl('/admin/kelolaAkademik/createPrestasiData'),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(prestasiData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating prestasi data:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// PUT - Update data prestasi
export const updatePrestasiData = async (nim, prestasiData) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaAkademik/updatePrestasiData/${nim}`),
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(prestasiData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating prestasi data:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// DELETE - Hapus data prestasi
export const deletePrestasiData = async (nim) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaAkademik/deletePrestasiData/${nim}`),
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
        console.error('Error deleting prestasi data:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// =============================================
// ==           SEMESTER SERVICES             ==
// =============================================

// GET - Ambil data semester mahasiswa
export const getSemesterData = async (nim) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaAkademik/getSemesterData/${nim}`),
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
        console.error('Error fetching semester data:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// POST - Tambah data semester
export const createSemesterData = async (nim, semesterData) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaAkademik/createSemesterData/${nim}`),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(semesterData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating semester data:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// PUT - Update data semester
export const updateSemesterData = async (id, semesterData) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaAkademik/updateSemesterData/${id}`),
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(semesterData),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating semester data:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};

// DELETE - Hapus data semester
export const deleteSemesterData = async (id) => {
    try {
        const response = await fetch(
            getApiUrl(`/admin/kelolaAkademik/deleteSemesterData/${id}`),
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
        console.error('Error deleting semester data:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};
