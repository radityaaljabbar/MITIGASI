import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

// Mengimpor komponen tabel mahasiswa
// Importing the student table component
import MahasiswaTable from '../../components/compAdmin/kelolaAkademik/MahasiswaTable';

// Mengimpor custom hook untuk logika halaman
// Importing the custom hook for page logic
import { useKelolaAkademik } from '../../components/compAdmin/kelolaAkademik/hooks/useKelolaAkademik';

/**
 * Komponen halaman untuk menampilkan daftar mahasiswa yang data akademiknya dapat dikelola.
 * Page component to display a list of students whose academic data can be managed.
 */
const KelolaAkademikPage = () => {
    // Menggunakan custom hook untuk mendapatkan state dan fungsi
    // Using the custom hook to get state and functions
    const {
        // State
        loading,
        searchTerm,
        currentPage,
        itemsPerPage,

        // Data
        mahasiswaList,
        currentData,
        filteredData,
        totalPages,
        startIndex,
        endIndex,

        // Actions
        setSearchTerm,
        setCurrentPage,
    } = useKelolaAkademik();

    return (
        <div className="p-6 bg-[#FAF0E6] min-h-screen">
            {/* Header Halaman */}
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Kelola Akademik
                </h1>
                <p className="text-gray-600">
                    Kelola data akademik mahasiswa - nilai, prestasi, dan IP
                    semester
                </p>
            </div>

            {/* Kotak Petunjuk */}
            {/* Instruction Box */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-5 w-5 text-blue-400"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <strong>Petunjuk:</strong> Pilih mahasiswa dari
                            daftar di bawah untuk melihat dan mengelola data
                            akademik mereka (nilai mata kuliah, data prestasi,
                            dan IP semester).
                        </p>
                    </div>
                </div>
            </div>

            {/* Komponen Tabel Mahasiswa */}
            {/* Student Table Component */}
            <MahasiswaTable
                currentData={currentData}
                filteredData={filteredData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                itemsPerPage={itemsPerPage}
                loading={loading}
            />
        </div>
    );
};

export default KelolaAkademikPage;
