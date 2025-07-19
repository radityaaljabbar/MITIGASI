import React, { useState } from 'react';

/**
 * Komponen Navbar untuk navigasi antar tab detail mahasiswa (Akademik, Psikologi, Finansial).
 * Navbar component for navigating between student detail tabs (Academic, Psychology, Financial).
 * @param {object} props - Props komponen.
 * @param {function} props.onTabChange - Fungsi callback yang dipanggil saat tab berubah.
 */
const StudentDetailNavbar = ({ onTabChange }) => {
    // State untuk melacak tab yang sedang aktif
    // State to track the currently active tab
    const [activeTab, setActiveTab] = useState('akademik');

    // Definisi data untuk setiap tab
    // Definition of data for each tab
    const tabs = [
        { id: 'akademik', name: 'ANALISIS AKADEMIK' },
        { id: 'psikologi', name: 'ANALISIS PSIKOLOGI' },
        { id: 'finansial', name: 'ANALISIS FINANSIAL' },
    ];

    /**
     * Menangani klik pada tab, mengubah state, dan memanggil callback.
     * Handles tab clicks, changes state, and calls the callback function.
     * @param {string} tabId - ID dari tab yang diklik.
     */
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        onTabChange(tabId);
    };

    return (
        <div className="flex justify-center w-full">
            <div className="flex bg-[#951A22] rounded-b-lg p-1 mx-auto w-full md:w-3/4">
                <div className="flex justify-between w-full">
                    {/* Loop melalui array tabs untuk membuat setiap tombol */}
                    {/* Loop through the tabs array to create each button */}
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex-1 mx-1 text-center ${
                                activeTab === tab.id
                                    ? 'bg-white text-[#951A22] shadow-sm'
                                    : 'text-white hover:text-gray-200'
                            }`}
                            onClick={() => handleTabClick(tab.id)}>
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDetailNavbar;
