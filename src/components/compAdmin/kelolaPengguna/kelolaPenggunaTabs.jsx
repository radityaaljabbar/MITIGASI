import React from 'react';

/**
 * Komponen untuk menampilkan tombol tab navigasi (Admin, Dosen, Mahasiswa).
 * Component to display navigation tab buttons (Admin, Dosen, Mahasiswa).
 * @param {object} props - Props komponen.
 * @param {string} props.activeTab - Kunci tab yang sedang aktif.
 * @param {function} props.onTabChange - Fungsi yang dipanggil saat tab diklik.
 */
const KelolaPenggunaTabs = ({ activeTab, onTabChange }) => {
    // Definisi data untuk setiap tab
    // Definition of data for each tab
    const tabs = [
        { key: 'admin', label: 'Admin', color: 'bg-green-500' },
        { key: 'dosen', label: 'Dosen Wali', color: 'bg-red-500' },
        { key: 'mahasiswa', label: 'Mahasiswa', color: 'bg-blue-500' },
    ];

    return (
        <div className="mb-6">
            <div className="flex space-x-2 bg-white rounded-lg p-2 shadow-sm">
                {/* Loop melalui array tabs untuk membuat setiap tombol */}
                {/* Loop through the tabs array to create each button */}
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        // Menerapkan style berbeda untuk tab aktif dan tidak aktif
                        // Applying different styles for active and inactive tabs
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                            activeTab === tab.key
                                ? `${tab.color} text-white shadow-lg transform scale-105`
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default KelolaPenggunaTabs;