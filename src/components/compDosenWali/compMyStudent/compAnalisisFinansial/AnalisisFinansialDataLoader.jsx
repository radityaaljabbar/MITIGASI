import React from 'react';
import { toast } from 'react-toastify';
import { getFinancialRelief, sendFinancialResponse } from '../../../../services/dosenWali/myStudent/cekAnalisisFinansial';

/**
 * Mengambil data finansial mahasiswa dari server.
 * Fetches student financial data from the server.
 * @param {string} nim - Nomor Induk Mahasiswa.
 * @returns {Promise<object>} - Data finansial mahasiswa.
 */
export const fetchStudentFinancialData = async (nim) => {
    try {
        if (!nim) throw new Error('NIM is required');
        const data = await getFinancialRelief(nim);
        return data;
    } catch (error) {
        console.error('Error fetching student financial data:', error);
        // Menampilkan pesan error yang sesuai kepada pengguna
        // Displaying appropriate error messages to the user
        if (error.message.includes('404')) toast.error(`Data mahasiswa dengan NIM ${nim} tidak ditemukan`);
        else if (error.message.includes('token')) toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
        else if (error.message.includes('network')) toast.error('Koneksi bermasalah. Periksa koneksi internet Anda.');
        else toast.error('Gagal memuat data mahasiswa. Silakan coba lagi.');
        // Mengembalikan struktur data default untuk mencegah error pada UI
        // Returning a default data structure to prevent UI errors
        return { name: 'Data Tidak Ditemukan', nim: nim || '-', semester: '-', lastUpdated: '-', pendingRequests: [], previousRequests: [] };
    }
};

/**
 * Menyetujui pengajuan bantuan finansial.
 * Approves a financial relief request.
 * @param {string|number} id - ID pengajuan.
 * @returns {Promise<object>} - Hasil dari operasi.
 */
export const approveRequest = async (id) => {
    try {
        if (!id) throw new Error('ID pengajuan diperlukan');
        const result = await sendFinancialResponse(id, 'approve');
        toast.success('Pengajuan berhasil disetujui');
        return { success: true, data: result };
    } catch (error) {
        console.error('Error approving request:', error);
        // Menangani berbagai jenis error dengan pesan yang spesifik
        // Handling various error types with specific messages
        if (error.message.includes('token')) toast.error('Sesi Anda telah berakhir.');
        else if (error.message.includes('not found')) toast.error('Data pengajuan tidak ditemukan.');
        else if (error.message.includes('already exists')) toast.error('Response untuk pengajuan ini sudah pernah diberikan.');
        else toast.error('Gagal menyetujui pengajuan. Silakan coba lagi.');
        throw error;
    }
};

/**
 * Menolak pengajuan bantuan finansial.
 * Rejects a financial relief request.
 * @param {string|number} id - ID pengajuan.
 * @returns {Promise<object>} - Hasil dari operasi.
 */
export const rejectRequest = async (id) => {
    try {
        if (!id) throw new Error('ID pengajuan diperlukan');
        const result = await sendFinancialResponse(id, 'reject');
        toast.success('Pengajuan berhasil ditolak');
        return { success: true, data: result };
    } catch (error) {
        console.error('Error rejecting request:', error);
        // Penanganan error yang serupa dengan approveRequest
        // Error handling similar to approveRequest
        if (error.message.includes('token')) toast.error('Sesi Anda telah berakhir.');
        else if (error.message.includes('not found')) toast.error('Data pengajuan tidak ditemukan.');
        else if (error.message.includes('already exists')) toast.error('Response untuk pengajuan ini sudah pernah diberikan.');
        else toast.error('Gagal menolak pengajuan. Silakan coba lagi.');
        throw error;
    }
};

/**
 * Mengunduh lampiran. (Saat ini hanya placeholder).
 * Downloads an attachment. (Currently a placeholder).
 * @param {string} filename - Nama file yang akan diunduh.
 * @returns {Promise<object>} - Hasil dari operasi.
 */
export const downloadAttachment = async (filename) => {
    try {
        if (!filename) throw new Error('Nama file diperlukan');
        // TODO: Implementasi logika unduh file dari server
        // TODO: Implement file download logic from the server
        toast.info(`Mengunduh ${filename}...`);
        return { success: true };
    } catch (error) {
        console.error('Error downloading attachment:', error);
        toast.error('Gagal mengunduh lampiran');
        throw error;
    }
};

/**
 * Helper function untuk mencoba ulang operasi yang gagal (misal: karena masalah jaringan).
 * Helper function to retry a failed operation (e.g., due to network issues).
 * @param {function} operation - Fungsi yang akan dijalankan.
 * @param {number} maxRetries - Jumlah maksimum percobaan ulang.
 * @param {number} delay - Waktu tunda awal antar percobaan.
 * @returns {Promise<any>} - Hasil dari operasi yang berhasil.
 */
export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            // Jangan coba ulang untuk error autentikasi atau error dari client (4xx)
            // Do not retry for authentication or client-side (4xx) errors
            if (error.message.includes('Authentication') || /4\d\d/.test(error.message)) {
                throw error;
            }
            // Coba ulang hanya untuk error server (5xx) atau masalah jaringan
            // Retry only for server errors (5xx) or network issues
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Terapkan exponential backoff / Apply exponential backoff
            }
        }
    }
    throw lastError;
};