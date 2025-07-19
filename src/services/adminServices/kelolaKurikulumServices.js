import { getApiUrl, getAuthHeaders } from '../../config/api';

/**
 * Mengambil daftar semua tahun kurikulum yang tersedia.
 * Fetches a list of all available curriculum years.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengambil daftar mata kuliah berdasarkan tahun kurikulum.
 * Fetches a list of courses based on the curriculum year.
 * @param {string} kurikulum - Tahun kurikulum yang dipilih.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengambil detail satu mata kuliah berdasarkan ID-nya.
 * Fetches the details of a single course by its ID.
 * @param {number|string} id - ID mata kuliah.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengirim data untuk membuat mata kuliah baru.
 * Sends data to create a new course.
 * @param {object} mataKuliahData - Data mata kuliah baru.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengirim data untuk memperbarui data mata kuliah yang ada.
 * Sends data to update an existing course data.
 * @param {number|string} id - ID mata kuliah yang akan diupdate.
 * @param {object} mataKuliahData - Data mata kuliah yang diperbarui.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Menghapus data mata kuliah berdasarkan ID.
 * Deletes course data by ID.
 * @param {number|string} id - ID mata kuliah yang akan dihapus.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengambil daftar mata kuliah yang bisa dijadikan ekuivalensi.
 * Fetches a list of courses that can be used as equivalencies.
 * @param {string} kurikulum - Tahun kurikulum.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengambil semua data Kelompok Keahlian (peminatan).
 * Fetches all Specialization Group (peminatan) data.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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