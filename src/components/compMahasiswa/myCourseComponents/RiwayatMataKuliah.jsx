import React, { useState, useEffect, useMemo } from 'react';
// Mengimpor service untuk mengambil data riwayat mata kuliah
// Importing the service to fetch course history data
import { getCourseHistory } from '../../../services/mahasiswaServices/myCourseService';

/**
 * Komponen untuk menampilkan riwayat mata kuliah yang telah diambil oleh mahasiswa.
 * Component to display the history of courses taken by the student.
 */
const RiwayatMataKuliah = () => {
    // State untuk data mentah, status loading, error, dan filter
    // State for raw data, loading status, errors, and filters
    const [courseHistory, setCourseHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTahunAjaranFilter, setSelectedTahunAjaranFilter] =
        useState('');
    // State untuk mode tampilan (tabel atau Card)
    // State for view mode (table or card)
    const [viewMode, setViewMode] = useState('table');

    // State untuk konfigurasi sorting tabel
    // State for table sorting configuration
    const [sortConfig, setSortConfig] = useState({
        key: 'semester',
        direction: 'ascending',
    });

    // Effect untuk mengambil data saat komponen pertama kali dimuat
    // Effect to fetch data when the component first mounts
    useEffect(() => {
        const fetchCourseHistory = async () => {
            try {
                setLoading(true);
                const response = await getCourseHistory();
                if (response.success && response.data) {
                    setCourseHistory(response.data);
                } else {
                    setError(
                        response.message || 'Failed to fetch course history'
                    );
                }
            } catch (error) {
                console.error(
                    'An error occured while fetching course history',
                    error
                );
                setError(
                    'Terjadi kesalahan dalam mengambil data riwayat mata kuliah'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCourseHistory();
    }, []); // Dependensi kosong, hanya berjalan sekali

    // Menerapkan filter tahun ajaran pada data
    // Applying the academic year filter to the data
    const filteredCourses = selectedTahunAjaranFilter
        ? courseHistory.filter(
              (course) => course.tahun_ajaran === selectedTahunAjaranFilter
          )
        : courseHistory;

    // Logika sorting dengan useMemo untuk optimasi, hanya berjalan jika filter atau config berubah
    // Sorting logic with useMemo for optimization, only runs if filters or config change
    const sortedCourses = useMemo(() => {
        let sortableItems = [...filteredCourses];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                // Helper untuk menangani nilai null atau undefined
                // Helper to handle null or undefined values
                const valA = a[sortConfig.key] || '';
                const valB = b[sortConfig.key] || '';

                // Logika sorting berdasarkan tipe data
                // Sorting logic based on data type
                if (sortConfig.key === 'sks' || sortConfig.key === 'semester') {
                    // Sorting numerik untuk SKS dan Semester
                    // Numeric sorting for SKS and Semester
                    if (parseInt(valA) < parseInt(valB)) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (parseInt(valA) > parseInt(valB)) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                } else if (sortConfig.key === 'nilai') {
                    // Sorting kustom untuk Nilai (A > B > C > D > E)
                    // Custom sorting for Grades (A > B > C > D > E)
                    const gradeOrder = {
                        A: 5,
                        'A-': 4.7,
                        AB: 4.5,
                        'B+': 3.5,
                        B: 3,
                        BC: 2.5,
                        'C+': 2.5,
                        C: 2,
                        CD: 1.5,
                        'D+': 1.5,
                        D: 1,
                        E: 0,
                    };
                    const gradeA = gradeOrder[valA.trim()] ?? -1;
                    const gradeB = gradeOrder[valB.trim()] ?? -1;
                    if (gradeA < gradeB) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    if (gradeA > gradeB) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                } else {
                    // Sorting string (default)
                    // String sorting (default)
                    if (
                        valA.toString().toLowerCase() <
                        valB.toString().toLowerCase()
                    ) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (
                        valA.toString().toLowerCase() >
                        valB.toString().toLowerCase()
                    ) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredCourses, sortConfig]);

    /**
     * Menangani permintaan sorting saat header tabel diklik.
     * Handles sorting requests when a table header is clicked.
     * @param {string} key - Kunci kolom yang akan di-sort.
     */
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    /**
     * Menampilkan ikon sorting yang sesuai pada header tabel.
     * Displays the appropriate sorting icon in the table header.
     * @param {string} columnKey - Kunci kolom.
     * @returns {JSX.Element} - Ikon sorting.
     */
    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <i className="fas fa-sort text-slate-400 ml-2"></i>;
        }
        if (sortConfig.direction === 'ascending') {
            return <i className="fas fa-sort-up text-white ml-2"></i>;
        }
        return <i className="fas fa-sort-down text-white ml-2"></i>;
    };

    // Mendapatkan daftar unik tahun ajaran untuk filter dropdown
    // Getting a unique list of academic years for the filter dropdown
    const availableTahunAjaran = [
        ...new Set(courseHistory.map((course) => course.tahun_ajaran)),
    ]
        .filter(Boolean)
        .sort((a, b) => b.localeCompare(a)); // Urutkan dari terbaru
    const totalCourses = filteredCourses.length;

    // Fungsi-fungsi helper untuk styling berdasarkan nilai
    // Helper functions for styling based on grades
    const getRowStyle = (nilai) => {
        const grade = nilai ? nilai.trim() : '';

        if (grade === 'A' || grade === 'A-' || grade === 'AB') {
            return 'bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-400 text-gray-800 shadow-sm';
        } else if (grade === 'B' || grade === 'B+' || grade === 'BC' || grade === 'B-') {
            return 'bg-gradient-to-r from-blue-50 to-blue-50 border-l-4 border-blue-400 text-gray-800 shadow-sm';
        } else if (grade === 'C' || grade === 'C+' || grade === 'C-') {
            return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 text-gray-800 shadow-sm';
        } else if (grade === 'D') {
            return 'bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-400 text-gray-800 shadow-sm';
        } else if (grade === 'E') {
            return 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 text-gray-800 shadow-sm';
        }
        return '';
    };
    const getGradeBadgeStyle = (nilai) => {
        const grade = nilai ? nilai.trim() : '';

        if (grade === 'A' || grade === 'A-' || grade === 'AB') {
            return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-sm font-semibold shadow-sm';
        } else if (grade === 'E') {
            return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200 px-3 py-1 rounded-full text-sm font-semibold shadow-sm';
        } else if (grade === 'B' || grade === 'B+' || grade === 'BC' || grade === 'B-') {
            return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-sm font-semibold shadow-sm';
        } else if (grade === 'C' || grade === 'C+' || grade === 'C-') {
            return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-sm font-semibold shadow-sm';
        } else if (grade === 'D') {
            return 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border border-orange-200 px-3 py-1 rounded-full text-sm font-semibold shadow-sm';
        }
        return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-sm font-medium shadow-sm';
    };


    return (
        <div className="bg-white w-full max-w-[1200px] min-h-[500px] p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col space-y-5">
            {/* Bagian Header dan Filter */}
            {/* Header and Filter Section */}
            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                        <div className="bg-gradient-to-r from-[#951a22] to-[#7a1419] p-3 rounded-lg mr-4">
                            <i className="fas fa-graduation-cap text-white text-xl"></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                Riwayat Mata Kuliah
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br text-center from-indigo-50 to-blue-50 p-3 rounded-lg border border-indigo-200">
                    <div className="text-2xl font-bold text-indigo-700">
                        {totalCourses}
                    </div>
                    <div className="text-xs text-indigo-600">Mata Kuliah</div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center">
                            <label className="mr-3 text-sm font-semibold text-gray-700 flex items-center">
                                <i className="fas fa-filter mr-2 text-[#951a22]"></i>
                                Filter Tahun Ajaran:
                            </label>
                            <select
                                value={selectedTahunAjaranFilter}
                                onChange={(e) =>
                                    setSelectedTahunAjaranFilter(e.target.value)
                                }
                                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#951a22] focus:border-[#951a22] text-sm bg-white shadow-sm min-w-[150px]">
                                <option value="">Semua Tahun Ajaran</option>
                                {availableTahunAjaran.map((tahun) => (
                                    <option key={tahun} value={tahun}>
                                        {tahun}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tombol Ganti Mode Tampilan */}
                        {/* View Mode Toggle Button */}
                        <div className="flex items-center">
                            <label className="mr-2 text-sm font-semibold text-gray-700">
                                View:
                            </label>
                            <div className="flex bg-white rounded-lg border border-slate-300 p-1">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                                        viewMode === 'table'
                                            ? 'bg-slate-600 text-white shadow-sm'
                                            : 'text-slate-600 hover:text-slate-800'
                                    }`}>
                                    <i className="fas fa-table mr-1"></i>
                                    <span className="hidden sm:inline">
                                        Table
                                    </span>
                                </button>
                                <button
                                    onClick={() => setViewMode('card')}
                                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                                        viewMode === 'card'
                                            ? 'bg-slate-600 text-white shadow-sm'
                                            : 'text-slate-600 hover:text-slate-800'
                                    }`}>
                                    <i className="fas fa-th-large mr-1"></i>
                                    <span className="hidden sm:inline">
                                        Cards
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Reset Filter */}
                    {/* Reset Filter Button */}
                    {selectedTahunAjaranFilter && (
                        <button
                            onClick={() => setSelectedTahunAjaranFilter('')}
                            className="text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors flex items-center">
                            <i className="fas fa-times mr-1"></i>
                            Reset Filter
                        </button>
                    )}
                </div>
            </div>

            {/* Konten Utama (Tabel atau Card) */}
            {/* Main Content (Table or Cards) */}
            <div className="flex-1 overflow-x-hidden">
                {viewMode === 'table' ? (
                    // Tampilan Tabel
                    // Table View
                    <div className="w-full h-full overflow-x rounded-xl border border-slate-200 shadow-sm">
                        <table className="w-full border-separate border-spacing-0 text-sm">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-gradient-to-r from-[#951a22] to-[#7a1419] text-white">
                                    {/* Header Tabel dengan fungsi sorting */}
                                    {/* Table Headers with sorting functionality */}
                                    <th
                                        className="p-3 text-center font-bold uppercase hidden md:table-cell cursor-pointer hover:bg-white/10 transition-colors"
                                        onClick={() =>
                                            requestSort('kode_mata_kuliah')
                                        }>
                                        KODE {getSortIcon('kode_mata_kuliah')}
                                    </th>
                                    <th
                                        className="p-3 text-left font-bold uppercase cursor-pointer hover:bg-white/10 transition-colors"
                                        onClick={() =>
                                            requestSort('nama_mata_kuliah')
                                        }>
                                        NAMA MATA KULIAH{' '}
                                        {getSortIcon('nama_mata_kuliah')}
                                    </th>
                                    <th
                                        className="p-3 text-center font-bold uppercase hidden lg:table-cell cursor-pointer hover:bg-white/10 transition-colors"
                                        onClick={() => requestSort('jenis')}>
                                        JENIS {getSortIcon('jenis')}
                                    </th>
                                    <th
                                        className="p-3 text-center font-bold uppercase cursor-pointer hover:bg-white/10 transition-colors"
                                        onClick={() => requestSort('sks')}>
                                        SKS {getSortIcon('sks')}
                                    </th>
                                    <th
                                        className="p-3 text-center font-bold uppercase cursor-pointer hover:bg-white/10 transition-colors"
                                        onClick={() => requestSort('nilai')}>
                                        NILAI {getSortIcon('nilai')}
                                    </th>
                                    <th
                                        className="p-3 text-center font-bold uppercase cursor-pointer hover:bg-white/10 transition-colors"
                                        onClick={() => requestSort('semester')}>
                                        SEMESTER {getSortIcon('semester')}
                                    </th>
                                    <th
                                        className="p-3 text-center font-bold uppercase hidden xl:table-cell cursor-pointer hover:bg-white/10 transition-colors"
                                        onClick={() =>
                                            requestSort('tahun_ajaran')
                                        }>
                                        TAHUN AJARAN{' '}
                                        {getSortIcon('tahun_ajaran')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Render baris data menggunakan data yang sudah di-sort */}
                                {/* Render data rows using the sorted data */}
                                {sortedCourses.length > 0 ? (
                                    sortedCourses.map((course, index) => (
                                        <tr
                                            key={index}
                                            className={`hover:bg-slate-50 transition-all duration-200 ${getRowStyle(
                                                course.nilai
                                            )}`}>
                                            <td className="p-3 text-gray-700 text-center border-b border-gray-200 hidden md:table-cell">
                                                {course.kode_mata_kuliah}
                                            </td>
                                            <td className="p-3 text-gray-700 text-left border-b border-gray-200 font-medium">
                                                <div
                                                    className="max-w-[200px] truncate"
                                                    title={
                                                        course.nama_mata_kuliah
                                                    }>
                                                    {course.nama_mata_kuliah ||
                                                        'Mata Kuliah Tidak Ditemukan'}
                                                </div>
                                                <div className="md:hidden text-xs text-gray-500 mt-1">
                                                    {course.kode_mata_kuliah}
                                                </div>
                                            </td>
                                            <td className="p-3 text-gray-700 text-center border-b border-gray-200 hidden lg:table-cell">
                                                {course.jenis ||
                                                    'Tidak Diketahui'}
                                            </td>
                                            <td className="p-3 text-gray-700 text-center border-b border-gray-200 font-semibold">
                                                {course.sks || '-'}
                                            </td>
                                            <td className="p-3 text-center border-b border-gray-200">
                                                <span
                                                    className={getGradeBadgeStyle(
                                                        course.nilai
                                                    )}>
                                                    {course.nilai
                                                        ? course.nilai.trim()
                                                        : '-'}
                                                </span>
                                            </td>
                                            <td className="p-3 text-gray-700 text-center border-b border-gray-200 font-semibold">
                                                {course.jenis_semester}
                                            </td>
                                            <td className="p-3 text-gray-700 text-center border-b border-gray-200 hidden xl:table-cell">
                                                {course.tahun_ajaran || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="p-8 text-center text-gray-500">
                                            {/* Pesan "tidak ada hasil" jika filter tidak menemukan data */}
                                            {/* "No results" message if the filter finds no data */}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // Tampilan Card
                    // Card View
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 h-full overflow-x pr-2">
                        {/* Render Card data menggunakan data yang sudah di-sort */}
                        {/* Render data cards using the sorted data */}
                        {sortedCourses.map((course, index) => (
                            <div
                                key={index}
                                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                                {/* Konten Card */}
                                {/* Card Content */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                                            {course.nama_mata_kuliah ||
                                                'Mata Kuliah Tidak Ditemukan'}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-2">
                                            {course.kode_mata_kuliah}
                                        </p>
                                    </div>
                                    <span
                                        className={getGradeBadgeStyle(
                                            course.nilai
                                        )}>
                                        {course.nilai
                                            ? course.nilai.trim()
                                            : '-'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-slate-50 p-2 rounded-lg">
                                        <div className="text-xs text-slate-500 mb-1">
                                            SKS
                                        </div>
                                        <div className="font-semibold text-slate-700">
                                            {course.sks || '-'}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg">
                                        <div className="text-xs text-slate-500 mb-1">
                                            Semester
                                        </div>
                                        <div className="font-semibold text-slate-700">
                                            {course.jenis_semester}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-slate-100">
                                    <div className="flex justify-between items-center text-xs text-slate-500">
                                        <span>
                                            {course.jenis || 'Tidak Diketahui'}
                                        </span>
                                        <span>
                                            {course.tahun_ajaran || '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiwayatMataKuliah;