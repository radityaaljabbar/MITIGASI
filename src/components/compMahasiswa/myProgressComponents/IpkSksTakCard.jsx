import React from 'react';

// Pemetaan judul ke kelas warna untuk styling dinamis
// Mapping titles to color classes for dynamic styling
const colorMap = {
    IPK: 'bg-blue-50 text-blue-800 ring-blue-300',
    SKS: 'bg-yellow-50 text-yellow-800 ring-yellow-300',
    TAK: 'bg-green-50 text-green-800 ring-green-300',
};

/**
 * Komponen Card yang dapat digunakan kembali untuk menampilkan metrik seperti IPK, SKS, atau TAK.
 * A reusable card component to display metrics like GPA, SKS, or TAK.
 * @param {object} props - Props komponen.
 * @param {string} props.title - Judul Card (IPK, SKS, TAK).
 * @param {string|number} props.value - Nilai yang akan ditampilkan.
 */
const IpkSksTakCard = ({ title, value }) => {
    // Memilih kelas warna berdasarkan judul, dengan fallback ke warna abu-abu
    // Selecting the color class based on the title, with a fallback to gray
    const colorClass = colorMap[title] || 'bg-gray-100 text-gray-700';

    return (
        <div
            className={`shadow-md rounded-xl px-5 py-4 min-w-[120px] text-center ring-1 ring-opacity-40 ${colorClass}`}
        >
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
    );
};

export default IpkSksTakCard;