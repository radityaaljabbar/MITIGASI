import React, { useState, useMemo } from 'react';
import { useMyCourseAdvisor } from './MyCourseAdvisorContext';

// --- FUNGSI HELPER UNTUK STYLING ---
// --- HELPER FUNCTIONS FOR STYLING ---

/**
 * Mendapatkan kelas CSS untuk badge indeks nilai.
 * Gets the CSS class for the grade index badge.
 * @param {string} indeks - Indeks nilai (A, B, C, D, E).
 * @param {string} jenis - Jenis mata kuliah.
 * @returns {string} - Kelas Tailwind CSS.
 */
const getGradeBadgeClass = (indeks, jenis) => {
    // Normalisasi input untuk konsistensi
    const normalizedIndeks = indeks ? indeks.toString().trim().toUpperCase() : '';
    const normalizedJenis = jenis ? jenis.toString().trim() : '';

    if (normalizedIndeks === 'A') return 'bg-green-100 text-green-800';
    if (normalizedIndeks === 'B') return 'bg-blue-100 text-blue-800';
    if (normalizedIndeks === 'C') return 'bg-yellow-100 text-yellow-800';
    // Penanganan khusus untuk nilai D pada MK Pilihan/Peminatan
    if (normalizedIndeks === 'D' && normalizedJenis.toLowerCase().includes('pilihan')) return 'bg-orange-100 text-orange-800';
    if (normalizedIndeks === 'D') return 'bg-amber-100 text-amber-800';
    if (normalizedIndeks === 'E' && 'T') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
};

/**
 * Mendapatkan kelas CSS untuk badge jenis mata kuliah.
 * Gets the CSS class for the course type badge.
 * @param {string} jenis - Jenis mata kuliah (Wajib, Peminatan).
 * @returns {string} - Kelas Tailwind CSS.
 */
const getCourseTypeBadgeClass = (jenis) => {
    const normalizedJenis = jenis ? jenis.toString().trim().toLowerCase() : '';
    if (normalizedJenis.includes('wajib')) return 'bg-slate-200 text-slate-700';
    if (normalizedJenis.includes('peminatan')) return 'bg-indigo-100 text-indigo-800';
    return 'bg-gray-100 text-gray-800';
};

/**
 * Mendapatkan kelas CSS untuk background baris tabel berdasarkan indeks nilai.
 * Gets the CSS class for the table row background based on the grade index.
 * @param {string} indeks - Indeks nilai.
 * @param {string} jenis - Jenis mata kuliah.
 * @returns {string} - Kelas Tailwind CSS.
 */
const getGradeRowClass = (indeks, jenis) => {
    const normalizedIndeks = indeks ? indeks.toString().trim().toUpperCase() : '';
    const normalizedJenis = jenis ? jenis.toString().trim().toLowerCase() : '';

    if (normalizedIndeks === 'A') return 'bg-green-50';
    if (normalizedIndeks === 'B') return 'bg-blue-50';
    if (normalizedIndeks === 'C') return 'bg-yellow-50';
    if (normalizedIndeks === 'D' && normalizedJenis.includes('peminatan')) return 'bg-orange-50';
    if (normalizedIndeks === 'D') return 'bg-amber-50';
    if (normalizedIndeks === 'E') return 'bg-red-50';
    return 'bg-white'; // Default background
};

/**
 * Komponen untuk menampilkan riwayat mata kuliah mahasiswa yang dipilih.
 * Dilengkapi fitur pencarian dan sorting.
 * Component to display the course history of the selected student.
 * Includes search and sorting features.
 */
const CourseHistory = () => {
    // Mengambil data dan status loading dari konteks
    // Fetching data and loading status from the context
    const { mergedCourseHistory, isLoadingHistory } = useMyCourseAdvisor();

    // State lokal untuk pencarian dan konfigurasi sorting
    // Local state for search and sorting configuration
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'semester', direction: 'ascending' });

    // Menggunakan useMemo untuk memproses (filter & sort) data hanya ketika dependensi berubah
    // Using useMemo to process (filter & sort) data only when dependencies change
    const processedHistory = useMemo(() => {
        // Logika filter pencarian
        let sortableItems = [...mergedCourseHistory];
        if (searchTerm) {
            sortableItems = sortableItems.filter((course) =>
                course.namaMataKuliah
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        }
        // Logika sorting
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                if (valA === null || valA === undefined) return 1;
                if (valB === null || valB === undefined) return -1;
                if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [mergedCourseHistory, searchTerm, sortConfig]);

    /**
     * Memperbarui konfigurasi sorting saat header tabel diklik.
     * Updates the sorting configuration when a table header is clicked.
     * @param {string} key - Kunci kolom untuk di-sort.
     */
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    /**
     * Komponen internal untuk membuat header tabel yang bisa di-sort.
     * Internal component to create a sortable table header.
     * @param {object} props - Props.
     */
    const SortableHeader = ({ columnKey, title, className = '' }) => {
        // ... (Komponen SortableHeader tidak berubah)
        const isSorted = sortConfig.key === columnKey;
        const icon = isSorted ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '';
        return (
            <div className={`py-3 px-4 ${className}`}>
                <button type="button" onClick={() => requestSort(columnKey)} className="flex items-center space-x-1 font-semibold text-white/90 hover:text-white transition-colors">
                    <span>{title}</span>
                    {icon && <span className="text-xs">{icon}</span>}
                </button>
            </div>
        );
    };

    // -- RENDER SECTION --

    // Tampilan saat riwayat sedang dimuat
    if (isLoadingHistory) {
        return <div className="mb-8"><h2 className="text-xl font-semibold mb-3">Riwayat Mata Kuliah</h2><p className="text-gray-500 italic">Memuat riwayat mata kuliah...</p></div>;
    }

    // Tampilan jika tidak ada riwayat mata kuliah
    if (mergedCourseHistory.length === 0) {
        return <div className="mb-8"><h2 className="text-xl font-semibold mb-3">Riwayat Mata Kuliah</h2><p className="text-gray-500 italic">Tidak ada riwayat mata kuliah untuk mahasiswa ini atau gagal memuat.</p></div>;
    }

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Riwayat Mata Kuliah</h2>

            {/* Input untuk pencarian mata kuliah */}
            {/* Input for course search */}
            <div className="mb-4">
                <input type="text" placeholder="Cari berdasarkan nama mata kuliah..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#951A22] focus:border-transparent transition" />
            </div>

            {/* Kontainer tabel dengan scroll */}
            {/* Table container with scroll */}
            <div className="border rounded-lg shadow-sm bg-white max-h-[500px] overflow-auto">
                <div className="min-w-[800px] md:min-w-full">
                    {/* Header tabel yang "sticky" */}
                    {/* Sticky table header */}
                    <div className="sticky top-0 z-10 hidden sm:grid md:grid-cols-10 gap-4 bg-[#951A22] text-white">
                        <SortableHeader columnKey="kodeMataKuliah" title="Kode" className="col-span-1" />
                        <SortableHeader columnKey="namaMataKuliah" title="Mata Kuliah" className="col-span-3" />
                        <SortableHeader columnKey="jenis" title="Jenis" className="col-span-2" />
                        <SortableHeader columnKey="sks" title="SKS" className="text-center" />
                        <SortableHeader columnKey="indeks" title="Indeks" className="text-center" />
                        <SortableHeader columnKey="jenis_semester" title="Semester" className="text-center" />
                        <SortableHeader columnKey="tahun_ajaran" title="Tahun Ajaran" className="text-center" />
                    </div>

                    {/* Body tabel */}
                    {/* Table body */}
                    <div>
                        {processedHistory.length > 0 ? (
                            processedHistory.map((course) => {
                                // Mendapatkan kelas styling dinamis
                                // Getting dynamic styling classes
                                const gradeBadgeClass = getGradeBadgeClass(course.indeks, course.jenis);
                                const typeBadgeClass = getCourseTypeBadgeClass(course.jenis);
                                const rowBgClass = getGradeRowClass(course.indeks, course.jenis);

                                return (
                                    // Baris data dengan layout grid responsif
                                    // Data row with responsive grid layout
                                    <div
                                        key={course.id || course.kodeMataKuliah}
                                        className={`block border-b p-4 md:p-0 md:grid md:grid-cols-10 md:gap-4 hover:bg-gray-200/70 transition-colors duration-200 ${rowBgClass}`}
                                    >
                                        <DataItem label="Kode" value={course.kodeMataKuliah} className="md:col-span-1 font-mono" />
                                        <DataItem label="Nama" value={course.namaMataKuliah || 'Data tidak tersedia'} className="md:col-span-3 font-medium" />
                                        <DataItem label="Jenis" className="md:col-span-2">
                                            <span className={`py-1 px-2.5 rounded-full text-xs font-semibold ${typeBadgeClass}`}>
                                                {course.jenis || 'Data tidak tersedia'}
                                            </span>
                                        </DataItem>
                                        <DataItem label="SKS" value={course.sks || '-'} className="md:text-center" />
                                        <DataItem label="Indeks" className="md:text-center">
                                            <span className={`py-1 px-2.5 rounded-full text-sm font-bold ${gradeBadgeClass}`}>
                                                {course.indeks || '-'}
                                            </span>
                                        </DataItem>
                                        <DataItem label="Semester" value={course.jenis_semester || '-'} className="md:text-center" />
                                        <DataItem label="Tahun Ajaran" value={course.tahun_ajaran || '-'} className="md:text-center" />
                                    </div>
                                );
                            })
                        ) : (
                           // Pesan jika pencarian tidak menemukan hasil
                           // Message if search yields no results 
                           <div className="p-4 text-center text-gray-500 italic">
                                Tidak ada mata kuliah yang cocok dengan pencarian Anda.
                           </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Komponen kecil untuk merender item data dalam layout responsif.
 * Small component to render a data item in a responsive layout.
 * @param {object} props - Props.
 */
const DataItem = ({ label, value, className = '', children }) => {
    return (
        <div className={`flex justify-between items-center py-1 md:py-2 md:px-4 ${className}`}>
            <span className="font-bold text-gray-700 md:hidden">{label}</span>
            <div className="text-right md:text-left">
                {children || <span className="text-gray-800">{value}</span>}
            </div>
        </div>
    );
};

export default CourseHistory;