import React from 'react';
import {
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
} from 'react-icons/fa';

const StatusAksiDosen = ({ status }) => {
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
            return (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full flex items-center text-xs justify-center">
                    {status}
                </span>
            );
    }
};

export default StatusAksiDosen;
