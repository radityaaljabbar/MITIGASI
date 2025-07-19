import React from 'react';
import {
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
} from 'react-icons/fa';

/**
 * Komponen untuk menampilkan badge status dengan ikon yang sesuai.
 * Component to display a status badge with a corresponding icon.
 * @param {object} props - Props komponen.
 * @param {string} props.status - Status pengajuan ('Menunggu Review', 'Disetujui', 'Ditolak').
 */
const StatusAksiDosen = ({ status }) => {
    // Switch-case untuk menentukan tampilan badge berdasarkan status
    // Switch-case to determine the badge appearance based on the status
    switch (status) {
        case 'Menunggu Review':
            return (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full flex items-center text-xs justify-center">
                    <FaExclamationTriangle className="mr-1" /> {status}
                </span>
            );
        case 'Disetujui':
            return (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center text-xs justify-center">
                    <FaCheckCircle className="mr-1" /> {status}
                </span>
            );
        case 'Ditolak':
            return (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full flex items-center text-xs justify-center">
                    <FaTimesCircle className="mr-1" /> {status}
                </span>
            );
        default:
            // Tampilan default untuk status yang tidak dikenali
            // Default appearance for unrecognized status
            return (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full flex items-center text-xs justify-center">
                    {status}
                </span>
            );
    }
};

export default StatusAksiDosen;