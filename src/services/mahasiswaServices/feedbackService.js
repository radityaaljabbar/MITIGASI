// src/services/mahasiswaServices/feedbackService.js
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
 * Memformat tanggal ke format Indonesia lengkap dengan waktu.
 * Formats a date to the full Indonesian format with time.
 * @param {Date|string} date - Objek tanggal atau string yang akan diformat.
 * @returns {string} - Tanggal yang sudah diformat.
 */
export const formatDateTime = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
        return 'Invalid Date';
    }

    const dateObj = new Date(date);
    const days = [
        'MINGGU',
        'SENIN',
        'SELASA',
        'RABU',
        'KAMIS',
        'JUMAT',
        'SABTU',
    ];
    const months = [
        'JANUARI',
        'FEBRUARI',
        'MARET',
        'APRIL',
        'MEI',
        'JUNI',
        'JULI',
        'AGUSTUS',
        'SEPTEMBER',
        'OKTOBER',
        'NOVEMBER',
        'DESEMBER',
    ];

    const day = days[dateObj.getDay()];
    const dateNum = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    // Format to 24-hour format
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${day}, ${dateNum} ${month} ${year} ${hours}:${minutes} WIB`;
};

/**
 * Memvalidasi apakah sebuah file memiliki tipe yang diizinkan.
 * Validates if a file has an allowed type.
 * @param {File} file - File yang akan divalidasi.
 * @returns {boolean} - True jika valid.
 */
export const isValidFileType = (file) => {
    if (!file) return true; // No file is valid (optional attachment)
    return VALID_FILE_TYPES.includes(file.type);
};

/**
 * Mendapatkan daftar ekstensi file yang diizinkan dalam format string.
 * Gets a string list of allowed file extensions.
 * @returns {string} - Daftar ekstensi.
 */
export const getAllowedFileExtensions = () => {
    return 'PDF, DOC, DOCX, XLS, XLSX, JPG, dan PNG';
};

/**
 * Mengirimkan feedback beserta lampiran (jika ada) ke server.
 * Submits feedback with an optional attachment to the server.
 * @param {string} title - Judul feedback.
 * @param {string} detail - Isi feedback.
 * @param {File} file - File lampiran (opsional).
 * @returns {Promise<Object>} - Hasil dari panggilan API.
 */
export const submitFeedback = async (title, detail, file) => {
    try {
        // Validasi tipe file sebelum mengirim
        // Validate file type before sending
        if (file && !isValidFileType(file)) {
            throw new Error(
                `Tipe file tidak didukung. Hanya ${getAllowedFileExtensions()} yang diperbolehkan.`
            );
        }

        // Create FormData for multipart/form-data request (required for file upload)
        const formData = new FormData();
        formData.append('title_keluhan', title);
        formData.append('detail_keluhan', detail);

        // Only append file if it exists
        if (file) {
            formData.append('file', file);
        }

        // Make the API request
        const response = await fetch(
            getApiUrl('/student/uploadLampiranKeluhan'),
            {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    // Browser akan mengatur Content-Type secara otomatis untuk FormData
                },
                body: formData,
            }
        );

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            if (!response.ok) {
                throw new Error(
                    `Server error: ${response.status} ${response.statusText}`
                );
            }
            // If it's not JSON but the request was successful
            return { success: true, message: 'Feedback berhasil dikirim' };
        }

        // Parse JSON response
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to submit feedback');
        }

        return data;
    } catch (error) {
        console.error('Error in submitFeedback:', error);
        throw error;
    }
};

/**
 * Mengambil daftar semua feedback yang pernah dikirim oleh mahasiswa.
 * Fetches a list of all feedback previously submitted by the student.
 * @returns {Promise<Object>} - Hasil dari panggilan API dengan data yang sudah diformat.
 */
export const getFeedbackList = async () => {
    try {
        // Make the API request
        const response = await fetch(getApiUrl('/student/myKeluhan'), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });

        // Parse response
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to get feedback list');
        }

        // Memformat tanggal di setiap item data sebelum mengembalikannya
        // Formatting the date in each data item before returning
        if (data.data && Array.isArray(data.data)) {
            data.data = data.data.map((item) => ({
                ...item,
                tanggal_keluhan: item.tanggal_keluhan
                    ? formatDateTime(new Date(item.tanggal_keluhan))
                    : 'N/A',
            }));
        }

        if (data.data && data.data.response && data.data.response.date) {
            data.data.response.date = formatDateTime(
                new Date(data.data.response.date)
            );
        }

        return data;
    } catch (error) {
        console.error('Error in getFeedbackList:', error);
        throw error;
    }
};

/**
 * Mengambil detail dari satu feedback berdasarkan ID-nya.
 * Fetches the details of a single feedback by its ID.
 * @param {string|number} id - ID feedback.
 * @returns {Promise<Object>} - Hasil dari panggilan API dengan data yang sudah diformat.
 */
export const getFeedbackDetail = async (id) => {
    try {
        // Make the API request
        const response = await fetch(getApiUrl(`/student/myKeluhan/${id}`), {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });

        // Parse response
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to get feedback details');
        }

        // Memformat tanggal di data sebelum mengembalikannya
        // Formatting the date in the data before returning it
        if (data.data && data.data.tanggal_keluhan) {
            data.data.tanggal_keluhan = formatDateTime(
                new Date(data.data.tanggal_keluhan)
            );
        }

        return data;
    } catch (error) {
        console.error('Error in getFeedbackDetail:', error);
        throw error;
    }
};
