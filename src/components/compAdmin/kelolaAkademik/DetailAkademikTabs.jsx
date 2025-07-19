// DetailAkademikTabs Component - Komponen untuk menampilkan tab navigasi detail akademik mahasiswa
// DetailAkademikTabs Component for displaying academic detail navigation tabs
import React from 'react';

/**
 * Komponen untuk menampilkan tab navigasi dan header info mahasiswa
 * Component to display navigation tabs and student header information
 * @param {string} activeTab - Tab yang sedang aktif / Currently active tab
 * @param {function} onTabChange - Callback untuk mengganti tab / Callback to change tab
 * @param {object} mahasiswaData - Data mahasiswa yang ditampilkan / Student data to display
 */
const DetailAkademikTabs = ({ activeTab, onTabChange, mahasiswaData }) => {
    // Konfigurasi tab-tab yang tersedia dengan icon SVG
    // Configuration of available tabs with SVG icons
    const tabs = [
        {
            key: 'nilai',
            label: 'Nilai Mata Kuliah',
            icon: (
                // Icon untuk tab nilai mata kuliah (dokumen dengan garis)
                // Icon for course grades tab (document with lines)
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            ),
        },
        {
            key: 'prestasi',
            label: 'Data Prestasi',
            icon: (
                // Icon untuk tab prestasi (badge/medali)
                // Icon for achievement tab (badge/medal)
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                </svg>
            ),
        },
        {
            key: 'semester',
            label: 'IP Semester',
            icon: (
                // Icon untuk tab IP semester (chart/grafik batang)
                // Icon for semester GPA tab (bar chart)
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Header dengan informasi detail mahasiswa */}
            {/* Header with detailed student information */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        {/* Nama mahasiswa dengan fallback default */}
                        {/* Student name with default fallback */}
                        <h2 className="text-2xl font-bold text-gray-800">
                            {mahasiswaData?.name || 'Nama Mahasiswa'}
                        </h2>
                        
                        {/* Informasi detail mahasiswa dalam bentuk badge */}
                        {/* Student detail information in badge format */}
                        <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600">
                            {/* NIM dengan icon kartu identitas */}
                            {/* Student ID with ID card icon */}
                            <div className="flex items-center space-x-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                    />
                                </svg>
                                <span className="font-medium">NIM:</span>
                                <span className="text-blue-600 font-medium">
                                    {mahasiswaData?.nim || '-'}
                                </span>
                            </div>
                            
                            {/* Kelas dengan icon gedung */}
                            {/* Class with building icon */}
                            <div className="flex items-center space-x-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                                <span className="font-medium">Kelas:</span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                    {mahasiswaData?.detail_kelas?.kelas || '-'}
                                </span>
                            </div>
                            
                            {/* Angkatan dengan icon kalender */}
                            {/* Class year with calendar icon */}
                            <div className="flex items-center space-x-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 9a2 2 0 002 2h6a2 2 0 002-2l-2-9"
                                    />
                                </svg>
                                <span className="font-medium">Angkatan:</span>
                                <span>
                                    {mahasiswaData?.detail_kelas?.angkatan ||
                                        '-'}
                                </span>
                            </div>
                            
                            {/* Dosen Wali - tampil hanya jika ada data */}
                            {/* Academic Advisor - only shown if data exists */}
                            {mahasiswaData?.detail_kelas?.dosen_wali && (
                                <div className="flex items-center space-x-2">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span className="font-medium">
                                        Dosen Wali:
                                    </span>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                        {mahasiswaData.detail_kelas.dosen_wali}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Badge status mahasiswa dengan kondisi warna */}
                    {/* Student status badge with conditional color */}
                    <div className="flex items-center space-x-3">
                        <span
                            className={`px-3 py-1 text-sm font-medium rounded-full ${
                                mahasiswaData?.status === 'aktif'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                            {mahasiswaData?.status === 'aktif'
                                ? 'Aktif'
                                : 'Tidak Aktif'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigasi Tab dengan styling yang responsive */}
            {/* Tab Navigation with responsive styling */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => onTabChange(tab.key)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                                activeTab === tab.key
                                    ? 'border-blue-500 text-blue-600' // Style untuk tab aktif
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' // Style untuk tab tidak aktif dengan hover
                            }`}>
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default DetailAkademikTabs;