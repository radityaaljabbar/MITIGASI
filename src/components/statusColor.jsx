/**
 * Fungsi utilitas untuk mendapatkan kelas warna Tailwind CSS berdasarkan string status.
 * Utility function to get Tailwind CSS color classes based on a status string.
 * @param {string} status - String status (misal: 'selesai', 'pending', 'ditolak').
 * @returns {string} - String berisi kelas Tailwind CSS.
 */
const getStatusColor = (status) => {
    // Menggunakan switch-case untuk menangani berbagai variasi status
    // Using a switch-case to handle various status strings
    switch (status?.toLowerCase()) {
        case 'selesai':
        case 'completed':
        case 'done':
            // Status berhasil atau selesai
            // Success or completed status
            return 'bg-green-100 text-green-800';

        case 'dalam proses':
        case 'processing':
        case 'in progress':
            // Status sedang dalam proses
            // In-progress status
            return 'bg-blue-100 text-blue-800';

        case 'ditolak':
        case 'rejected':
        case 'denied':
            // Status ditolak atau gagal
            // Rejected or failed status
            return 'bg-red-100 text-red-800';

        case 'menunggu':
        case 'menunggu respon':
        case 'pending':
        case 'waiting':
        default:
            // Status default atau menunggu
            // Default or waiting status
            return 'bg-yellow-100 text-yellow-800';
    }
};

export default getStatusColor;