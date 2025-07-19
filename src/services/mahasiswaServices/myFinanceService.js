// src/services/mahasiswaServices/myFinanceService.js
import { getApiUrl, getAuthHeaders } from '../../config/api.js';

// Daftar tipe file yang diizinkan untuk diunggah
// List of allowed file types for upload
const VALID_FILE_TYPES = [
    'application/pdf', // PDF
    'application/msword', // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.ms-excel', // XLS
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'image/jpeg', // JPG
    'image/png', // PNG
];

/**
 * Memvalidasi apakah sebuah file memiliki tipe yang diizinkan.
 * Validates if a file has an allowed type.
 * @param {File} file - File yang akan divalidasi.
 * @returns {boolean} - True jika valid, false jika tidak.
 */
export const isValidFileType = (file) => {
    if (!file) return true;
    return VALID_FILE_TYPES.includes(file.type);
};

/**
 * Mendapatkan daftar ekstensi file yang diizinkan dalam format yang mudah dibaca.
 * Gets a human-readable list of allowed file extensions.
 * @returns {string} - Daftar ekstensi.
 */
export const getAllowedFileExtensions = () => {
    return 'PDF, DOC, DOCX, XLS, XLSX, JPG, dan PNG';
};

/**
 * Mengirimkan formulir pengajuan keringanan biaya kuliah ke server.
 * Submits the tuition fee relief application form to the server.
 * @param {object} formData - Data dari form.
 * @param {File} file - File lampiran (opsional).
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const submitRelief = async (formData, file) => {
    try {
        // Validasi tipe file sebelum mengirim
        // Validate file type before sending
        if (file && !isValidFileType(file)) {
            throw new Error(
                `Tipe file tidak didukung. Hanya ${getAllowedFileExtensions()} yang diperbolehkan.`
            );
        }

        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                message: 'Token tidak ditemukan',
            };
        }

        // Menggunakan FormData karena ada pengiriman file
        // Using FormData because a file is being sent
        const formDataToSend = new FormData();

        // Menambahkan semua field dari form
        // Appending all form fields
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        // Menambahkan file jika ada
        // Appending the file if it exists
        if (file) {
            formDataToSend.append('file', file);
        }

        const response = await fetch(getApiUrl('/student/sendRelief'), {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
            },
            body: formDataToSend,
        });

        const data = await response.json();

        // Memeriksa apakah respons berhasil 
        // Checking if the response was successful
        if (!response.ok) {
            return {
                success: false,
                message:
                    data.message ||
                    'Gagal mengirim jawab formulir keringanan biaya',
                data: data,
            };
        }

        // Mengembalikan respons sukses dengan struktur yang konsisten
        // Returning a successful response with a consistent structure
        return {
            success: true,
            message: 'Pengajuan keringanan berhasil dikirim',
            data: data,
        };
    } catch (error) {
        console.error('Error in submitRelief:', error);
        return {
            success: false,
            message: 'Terjadi kesalahan saat menghubungi server',
            error: error.message,
        };
    }
};

/**
 * Mengambil daftar riwayat pengajuan keringanan biaya mahasiswa.
 * Fetches the history list of the student's tuition relief applications.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
export const getReliefList = async () => {
    try {
        // Melakukan panggilan API
        // Making the API call
        const response = await fetch(getApiUrl('/student/getStudentsRelief'), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });

        // Mem-parsing respons
        // Parsing the response
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to get relief list');
        }

        return data;
    } catch (error) {
        console.error('Error in getReliefList:', error);
        throw error;
    }
};
