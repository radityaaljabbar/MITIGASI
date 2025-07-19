// src/services/adminServices/kelolaAkademikService.js
import { getApiUrl, getAuthHeaders } from '../../config/api.js';

/**
 * Mengambil semua data mahasiswa untuk ditampilkan di halaman Kelola Akademik.
 * Fetches all student data to be displayed on the Manage Academics page.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengambil riwayat nilai mahasiswa berdasarkan NIM.
 * Fetches student's grade history by NIM.
 * @param {string} nim - NIM mahasiswa.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengambil daftar semua mata kuliah.
 * Fetches a list of all courses.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengirim data untuk membuat/menambahkan nilai baru untuk mahasiswa.
 * Sends data to create/add a new grade for a student.
 * @param {object} gradeData - Data nilai baru.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengirim data untuk memperbarui nilai yang sudah ada.
 * Sends data to update an existing grade.
 * @param {number|string} id - ID dari entri nilai yang akan diupdate.
 * @param {object} gradeData - Data nilai yang diperbarui.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Menghapus entri nilai berdasarkan ID-nya.
 * Deletes a grade entry by its ID.
 * @param {number|string} id - ID entri nilai.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengambil data prestasi seorang mahasiswa berdasarkan NIM.
 * Fetches a student's achievement data by NIM.
 * @param {string} nim - NIM mahasiswa.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengirim data untuk membuat/menambahkan data prestasi baru.
 * Sends data to create/add new achievement data.
 * @param {object} prestasiData - Data prestasi baru.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengirim data untuk memperbarui data prestasi yang ada.
 * Sends data to update existing achievement data.
 * @param {string} nim - NIM mahasiswa yang prestasinya akan diupdate.
 * @param {object} prestasiData - Data prestasi yang diperbarui.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Menghapus data prestasi berdasarkan NIM.
 * Deletes achievement data by NIM.
 * @param {string} nim - NIM mahasiswa.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengambil data per semester (seperti IP) seorang mahasiswa.
 * Fetches per-semester data (like GPA) for a student.
 * @param {string} nim - NIM mahasiswa.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengirim data untuk membuat/menambahkan data semester (seperti IP) baru.
 * Sends data to create/add new semester data (like GPA).
 * @param {string} nim - NIM mahasiswa.
 * @param {object} semesterData - Data semester baru.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengirim data untuk memperbarui data semester (IP, SKS) yang ada.
 * Sends data to update existing semester data (GPA, SKS).
 * @param {number|string} id - ID dari entri data semester.
 * @param {object} semesterData - Data semester yang diperbarui.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Menghapus data semester mahasiswa berdasarkan ID.
 * Deletes student semester data by ID.
 * @param {number|string} id - ID entri data semester.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengirim file CSV untuk import data nilai mahasiswa secara massal.
 * Sends a CSV file to bulk import student's grade data.
 * @param {string} nim - NIM mahasiswa yang nilainya akan diimpor.
 * @param {File} file - File CSV yang berisi data nilai.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const bulkCreateGrades = async (nim, file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(
            getApiUrl(`/admin/kelolaAkademik/bulkCreateGrades/${nim}`),
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
        console.error('Error bulk creating grades:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection.',
        };
    }
};
