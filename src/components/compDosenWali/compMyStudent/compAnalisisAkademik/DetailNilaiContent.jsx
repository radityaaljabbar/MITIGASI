// src/components/compDosenWali/compMyStudent/compAnalisisAkademik/DetailNilaiContent.jsx

import React, { useState, useEffect } from 'react';
import { getStudentCourseHistory } from '../../../../services/dosenWali/myStudent/academicDetailService';

/**
 * Komponen untuk menampilkan detail riwayat nilai akademik mahasiswa.
 * Component to display the detailed academic grade history of a student.
 * @param {object} props - Props komponen.
 * @param {string} props.nim - Nomor Induk Mahasiswa.
 */
const DetailNilaiContent = ({ nim }) => {
    // State untuk menyimpan riwayat mata kuliah, data yang difilter, status loading, dan error
    // State to store course history, filtered data, loading status, and errors
    const [courseHistory, setCourseHistory] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTingkat, setSelectedTingkat] = useState('semua');

    // Mengambil data riwayat mata kuliah saat NIM berubah
    // Fetch course history data when NIM changes
    useEffect(() => {
        const fetchCourseHistory = async () => {
            if (!nim) return;

            try {
                setLoading(true);
                setError(null);

                const response = await getStudentCourseHistory(nim);

                if (response.success) {
                    setCourseHistory(response.data);
                    setFilteredCourses(response.data); // Inisialisasi dengan semua data
                } else {
                    setError(response.message);
                }
            } catch (err) {
                console.error('Error fetching course history:', err);
                setError('Gagal memuat data riwayat mata kuliah');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseHistory();
    }, [nim]);

    /**
     * Mendapatkan tingkat (tahun ke-) dari semester.
     * Gets the academic year level from the semester.
     * @param {string|number} semester - Nomor semester.
     * @returns {number} - Tingkat (1-6).
     */
    const getTingkatFromSemester = (semester) => {
        const sem = parseInt(semester);
        if (sem >= 1 && sem <= 2) return 1;
        if (sem >= 3 && sem <= 4) return 2;
        if (sem >= 5 && sem <= 6) return 3;
        if (sem >= 7 && sem <= 8) return 4;
        if (sem >= 9 && sem <= 10) return 5;
        if (sem >= 11 && sem <= 12) return 6;
        return 0; // Untuk semester yang tidak diketahui / For unknown semesters
    };

    // Menerapkan filter berdasarkan tingkat yang dipilih
    // Apply filter based on the selected academic year level
    useEffect(() => {
        if (selectedTingkat === 'semua') {
            setFilteredCourses(courseHistory);
        } else {
            const tingkat = parseInt(selectedTingkat);
            const filtered = courseHistory.filter((course) => {
                const courseTingkat = getTingkatFromSemester(course.semester);
                return courseTingkat === tingkat;
            });
            setFilteredCourses(filtered);
        }
    }, [selectedTingkat, courseHistory]);

    /**
     * Mendapatkan style untuk baris tabel berdasarkan nilai (grade).
     * Gets the styling for a table row based on the grade.
     * @param {string} grade - Nilai huruf (A, AB, B, dst.).
     * @returns {string} - Kelas Tailwind CSS.
     */
    const getRowStyle = (grade) => {
        if (!grade) return '';
        const cleanGrade = grade.trim().toUpperCase();
        const gradeColors = {
            A: 'bg-green-50 border-l-4 border-green-500', AB: 'bg-green-50 border-l-4 border-green-400',
            B: 'bg-blue-50 border-l-4 border-blue-500', BC: 'bg-blue-50 border-l-4 border-blue-400',
            C: 'bg-yellow-50 border-l-4 border-yellow-500', D: 'bg-orange-50 border-l-4 border-orange-500',
            E: 'bg-red-50 border-l-4 border-red-500', F: 'bg-red-100 border-l-4 border-red-600',
        };
        return gradeColors[cleanGrade] || '';
    };

    /**
     * Mendapatkan style untuk badge nilai.
     * Gets the styling for a grade badge.
     * @param {string} grade - Nilai huruf.
     * @returns {string} - Kelas Tailwind CSS.
     */
    const getGradeBadge = (grade) => {
        if (!grade) return 'bg-gray-100 text-gray-800';
        const cleanGrade = grade.trim().toUpperCase();
        const badgeColors = {
            A: 'bg-green-100 text-green-800 font-semibold', AB: 'bg-green-100 text-green-700 font-semibold',
            B: 'bg-blue-100 text-blue-800 font-semibold', BC: 'bg-blue-100 text-blue-700 font-semibold',
            C: 'bg-yellow-100 text-yellow-800 font-semibold', D: 'bg-orange-100 text-orange-800 font-semibold',
            E: 'bg-red-100 text-red-800 font-semibold', F: 'bg-red-200 text-red-900 font-bold',
        };
        return badgeColors[cleanGrade] || 'bg-gray-100 text-gray-800';
    };

    /**
     * Mendapatkan style untuk badge tingkat.
     * Gets the styling for a level badge.
     * @param {string|number} semester - Nomor semester.
     * @returns {string} - Kelas Tailwind CSS.
     */
    const getTingkatBadge = (semester) => {
        const tingkat = getTingkatFromSemester(semester);
        const colors = {
            1: 'bg-blue-100 text-blue-800', 2: 'bg-green-100 text-green-800', 3: 'bg-yellow-100 text-yellow-800',
            4: 'bg-purple-100 text-purple-800', 5: 'bg-pink-100 text-pink-800', 6: 'bg-indigo-100 text-indigo-800',
        };
        return colors[tingkat] || 'bg-gray-100 text-gray-800';
    };

    // Tampilan saat data sedang dimuat
    // Display when data is loading
    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
                </div>
            </div>
        );
    }

    // Tampilan jika terjadi error
    // Display if an error occurs
    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex justify-center items-center">
                        <div className="text-red-800">
                            <p className="font-medium">Error: {error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="bg-white w-full max-w-[1200px] mx-auto min-h-[300px] max-h-[500px] rounded-2xl shadow-xl border border-gray-200 flex flex-col space-y-4">
                {/* Header dengan filter dan jumlah data */}
                {/* Header with filter and data count */}
                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center px-6 pt-6 gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Detail Nilai Akademik
                    </h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        {/* Filter Berdasarkan Tingkat */}
                        {/* Filter by Level */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                Filter Tingkat:
                            </label>
                            <select
                                value={selectedTingkat}
                                onChange={(e) => setSelectedTingkat(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
                                <option value="semua">Semua Tingkat</option>
                                <option value="1">Tingkat 1</option> <option value="2">Tingkat 2</option>
                                <option value="3">Tingkat 3</option> <option value="4">Tingkat 4</option>
                                <option value="5">Tingkat 5</option> <option value="6">Tingkat 6</option>
                            </select>
                        </div>
                        {/* Jumlah Data yang Ditampilkan */}
                        {/* Displayed Data Count */}
                        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-full">
                            Menampilkan: {filteredCourses.length} dari {courseHistory.length} mata kuliah
                        </div>
                    </div>
                </div>

                {/* Kontainer tabel dengan overflow */}
                {/* Table container with overflow */}
                <div className="w-full flex-1 overflow-y-auto overflow-x-auto rounded-lg px-6 pb-4">
                    <table className="w-full border-separate border-spacing-0 text-sm">
                        {/* Header tabel yang tetap di atas saat scroll */}
                        {/* Table header that stays at the top on scroll */}
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-[#951a22] text-white">
                                {['NAMA MATA KULIAH', 'KODE MATA KULIAH', 'JENIS', 'SKS', 'SEMESTER', 'NILAI', 'TAHUN AJARAN'].map((header, index) => (
                                    <th key={index} className="border border-gray-300 p-3 text-center font-bold uppercase bg-[#951a22] first:rounded-tl-lg last:rounded-tr-lg">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((course, index) => (
                                    <tr key={index} className={`hover:bg-gray-100 transition duration-200 ${getRowStyle(course.nilai)}`}>
                                        <td className="p-3 text-gray-700 border-b border-gray-200"><div className="font-medium">{course.nama_mata_kuliah || 'Mata Kuliah Tidak Ditemukan'}</div></td>
                                        <td className="p-3 text-gray-700 text-center border-b border-gray-200"><code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{course.kode_mata_kuliah}</code></td>
                                        <td className="p-3 text-gray-700 text-center border-b border-gray-200"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{course.jenis || 'Tidak Diketahui'}</span></td>
                                        <td className="p-3 text-gray-700 text-center border-b border-gray-200"><span className="font-semibold">{course.sks || '-'}</span></td>
                                        <td className="p-3 text-center border-b border-gray-200">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getTingkatBadge(course.semester)}`}>Semester {course.semester || '-'}</span>
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{course.jenis_semester || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-center border-b border-gray-200"><span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeBadge(course.nilai)}`}>{course.nilai ? course.nilai.trim() : '-'}</span></td>
                                        <td className="p-3 text-gray-700 text-center border-b border-gray-200"><span className="font-medium">{course.tahun_ajaran || '-'}</span></td>
                                    </tr>
                                ))
                            ) : (
                                // Tampilan jika tidak ada data yang cocok dengan filter
                                // Display if no data matches the filter
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            <p className="text-lg font-medium">{selectedTingkat === 'semua' ? 'Tidak ada data riwayat mata kuliah' : `Tidak ada mata kuliah pada Tingkat ${selectedTingkat}`}</p>
                                            <p className="text-sm text-gray-400">{selectedTingkat === 'semua' ? 'Data akan muncul setelah mahasiswa mengambil mata kuliah' : 'Coba pilih tingkat lain untuk melihat data mata kuliah'}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DetailNilaiContent;