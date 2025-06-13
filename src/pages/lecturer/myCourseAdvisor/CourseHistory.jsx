import React, { useState, useMemo } from 'react';
import { useMyCourseAdvisor } from './MyCourseAdvisorContext';

// --- HELPER FUNCTIONS UNTUK STYLING ---

// Helper untuk Badge Indeks (tetap sama)
const getGradeBadgeClass = (indeks, jenis) => {
    const normalizedIndeks = indeks ? indeks.toString().trim().toUpperCase() : '';
    const normalizedJenis = jenis ? jenis.toString().trim() : '';

    if (normalizedIndeks === 'A') return 'bg-green-100 text-green-800';
    if (normalizedIndeks === 'B') return 'bg-blue-100 text-blue-800';
    if (normalizedIndeks === 'C') return 'bg-yellow-100 text-yellow-800';
    if (normalizedIndeks === 'D' && normalizedJenis.toLowerCase().includes('pilihan')) return 'bg-orange-100 text-orange-800';
    if (normalizedIndeks === 'D') return 'bg-amber-100 text-amber-800';
    if (normalizedIndeks === 'E' && 'T') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
};

// Helper untuk Badge Jenis Mata Kuliah (tetap sama)
const getCourseTypeBadgeClass = (jenis) => {
    const normalizedJenis = jenis ? jenis.toString().trim().toLowerCase() : '';
    if (normalizedJenis.includes('wajib')) return 'bg-slate-200 text-slate-700';
    if (normalizedJenis.includes('peminatan')) return 'bg-indigo-100 text-indigo-800';
    return 'bg-gray-100 text-gray-800';
};

// --- [BARU] Helper untuk Background Baris berdasarkan Indeks ---
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


const CourseHistory = () => {
    const { mergedCourseHistory, isLoadingHistory } = useMyCourseAdvisor();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'semester', direction: 'ascending' });

    const processedHistory = useMemo(() => {
        // ... (Logika searching & sorting tidak berubah)
        let sortableItems = [...mergedCourseHistory];
        if (searchTerm) {
            sortableItems = sortableItems.filter((course) =>
                course.namaMataKuliah
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        }
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

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
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

    if (isLoadingHistory) {
        return <div className="mb-8"><h2 className="text-xl font-semibold mb-3">Riwayat Mata Kuliah</h2><p className="text-gray-500 italic">Memuat riwayat mata kuliah...</p></div>;
    }

    if (mergedCourseHistory.length === 0) {
        return <div className="mb-8"><h2 className="text-xl font-semibold mb-3">Riwayat Mata Kuliah</h2><p className="text-gray-500 italic">Tidak ada riwayat mata kuliah untuk mahasiswa ini atau gagal memuat.</p></div>;
    }

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Riwayat Mata Kuliah</h2>

            <div className="mb-4">
                <input type="text" placeholder="Cari berdasarkan nama mata kuliah..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#951A22] focus:border-transparent transition" />
            </div>

            <div className="border rounded-lg shadow-sm bg-white max-h-[500px] overflow-auto">
                <div className="min-w-[800px] md:min-w-full">
                    <div className="sticky top-0 z-10 hidden sm:grid md:grid-cols-10 gap-4 bg-[#951A22] text-white">
                        <SortableHeader columnKey="kodeMataKuliah" title="Kode" className="col-span-1" />
                        <SortableHeader columnKey="namaMataKuliah" title="Mata Kuliah" className="col-span-3" />
                        <SortableHeader columnKey="jenis" title="Jenis" className="col-span-2" />
                        <SortableHeader columnKey="sks" title="SKS" className="text-center" />
                        <SortableHeader columnKey="indeks" title="Indeks" className="text-center" />
                        <SortableHeader columnKey="jenis_semester" title="Semester" className="text-center" />
                        <SortableHeader columnKey="tahun_ajaran" title="Tahun Ajaran" className="text-center" />
                    </div>

                    <div>
                        {processedHistory.length > 0 ? (
                            processedHistory.map((course) => {
                                const gradeBadgeClass = getGradeBadgeClass(course.indeks, course.jenis);
                                const typeBadgeClass = getCourseTypeBadgeClass(course.jenis);
                                // --- [BARU] Panggil helper untuk mendapatkan class background baris ---
                                const rowBgClass = getGradeRowClass(course.indeks, course.jenis);

                                return (
                                    <div
                                        key={course.id || course.kodeMataKuliah}
                                        // --- [DIUBAH] Tambahkan `rowBgClass` ke dalam className ---
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


const DataItem = ({ label, value, className = '', children }) => {
    // ... (Komponen ini tidak berubah)
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