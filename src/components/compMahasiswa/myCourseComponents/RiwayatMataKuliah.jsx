import React, { useState, useEffect } from 'react';
// Import file service fitur MyCourse
import { getCourseHistory } from '../../../services/mahasiswaServices/myCourseService';

const RiwayatMataKuliah = () => {
    const [courseHistory, setCourseHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSemesterFilter, setSelectedSemesterFilter] = useState(''); // Filter semester
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

    // handle data dari service
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
                console.error('An error occured while fetching course history');
                console.log(error);
                setError(
                    'Terjadi kesalahan dalam mengambil data riwayat mata kuliah'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCourseHistory();
    }, []);

    // Conditional styling untuk nilai
    const getRowStyle = (nilai) => {
        // Remove any trailing spaces from the nilai
        const grade = nilai ? nilai.trim() : '';

        if (grade === 'A' || grade === 'A-' || grade === 'AB'  ) {
            return 'bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-400 text-gray-800 shadow-sm';
        } else if (grade === 'B' || grade === 'B+' || grade === 'BC') {
            return 'bg-gradient-to-r from-blue-50 to-blue-50 border-l-4 border-blue-400 text-gray-800 shadow-sm';
        } else if (grade === 'C' || grade === 'C+' || grade === 'CD') {
            return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 text-gray-800 shadow-sm';
        } else if (grade === 'D' || grade === 'D+') {
            return 'bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-400 text-gray-800 shadow-sm';
        }else if (grade === 'E') {
            return 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 text-gray-800 shadow-sm';
        }
        return '';
    };

    // Get grade badge style
    const getGradeBadgeStyle = (nilai) => {
        const grade = nilai ? nilai.trim() : '';
        
        if (grade === 'A' || grade === 'A-' || grade === 'AB') {
            return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-sm font-semibold shadow-sm';
        } else if (grade === 'E') {
            return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200 px-3 py-1 rounded-full text-sm font-semibold shadow-sm';
        } else if (grade === 'B' || grade === 'B+' || grade === 'BC') {
            return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-sm font-semibold shadow-sm';
        } else if (grade === 'C' || grade === 'C+' || grade === 'CD') {
            return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-sm font-semibold shadow-sm';
        } else if (grade === 'D' || grade === 'D+') {
            return 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border border-orange-200 px-3 py-1 rounded-full text-sm font-semibold shadow-sm';
        }
        return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-sm font-medium shadow-sm';
    };

    // Filter courses by selected semester
    const filteredCourses = selectedSemesterFilter
        ? courseHistory.filter(
              (course) =>
                  String(course.semester) === String(selectedSemesterFilter)
          )
        : courseHistory;

    // Get unique semesters for filter dropdown
    const availableSemesters = [
        ...new Set(courseHistory.map((course) => course.semester)),
    ]
        .filter(Boolean)
        .sort((a, b) => parseInt(a) - parseInt(b));

    // Calculate statistics
    const totalCourses = filteredCourses.length;
    const totalSKS = filteredCourses.reduce((sum, course) => sum + (parseInt(course.sks) || 0), 0);
    const gradeStats = filteredCourses.reduce((stats, course) => {
        const grade = course.nilai ? course.nilai.trim() : '';
        if (grade === 'A' || grade === 'A-' || grade === 'AB') stats.excellent++;
        else if (grade === 'B' || grade === 'B+' || grade === 'BC') stats.good++;
        else if (grade === 'C' || grade === 'C+' || grade === 'CD') stats.average++;
        else if (grade === 'D' || grade === 'D+') stats.below++;
        else if (grade === 'E') stats.fail++;
        return stats;
    }, { excellent: 0, good: 0, average: 0, below: 0, fail: 0 });

    if (loading) {
        return (
            <div className="bg-white w-full max-w-[1200px] min-h-[500px] p-6 rounded-2xl shadow-xl border border-gray-200 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#951a22] mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading course history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white w-full max-w-[1200px] min-h-[500px] p-6 rounded-2xl shadow-xl border border-gray-200 flex justify-center items-center">
                <div className="text-center">
                    <div className="bg-red-100 p-4 rounded-lg mb-4">
                        <p className="text-red-600 text-lg font-medium">{error}</p>
                    </div>
                    <button
                        className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg transform hover:scale-105"
                        onClick={() => window.location.reload()}>
                        <i className="fas fa-redo mr-2"></i>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (courseHistory.length === 0) {
        return (
            <div className="bg-white w-full max-w-[1200px] min-h-[500px] p-6 rounded-2xl shadow-xl border border-gray-200 flex justify-center items-center">
                <div className="text-center">
                    <div className="bg-gray-100 p-8 rounded-full mb-4 mx-auto w-32 h-32 flex items-center justify-center">
                        <i className="fas fa-book-open text-4xl text-gray-400"></i>
                    </div>
                    <p className="text-gray-500 italic text-lg">
                        Tidak ada data riwayat mata kuliah
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white w-full max-w-[1200px] min-h-[500px] p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col space-y-5">
            {/* Header */}
            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 space-y-4 lg:space-y-0">
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                        <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-3 rounded-lg mr-4">
                            <i className="fas fa-graduation-cap text-white text-xl"></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                Riwayat Mata Kuliah
                            </h2>
                            <p className="text-sm text-gray-600">
                                Daftar mata kuliah yang telah Anda tempuh beserta nilainya
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-3 rounded-lg border border-indigo-200">
                        <div className="text-2xl font-bold text-indigo-700">{totalCourses}</div>
                        <div className="text-xs text-indigo-600">Mata Kuliah</div>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center">
                            <label className="mr-3 text-sm font-semibold text-gray-700 flex items-center">
                                <i className="fas fa-filter mr-2 text-[#951a22]"></i>
                                Filter Semester:
                            </label>
                            <select
                                value={selectedSemesterFilter}
                                onChange={(e) => setSelectedSemesterFilter(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#951a22] focus:border-[#951a22] text-sm bg-white shadow-sm min-w-[150px]">
                                <option value="">Semua Semester</option>
                                {availableSemesters.map((semester) => (
                                    <option key={semester} value={semester}>
                                        Semester {semester}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* View Mode Toggle */}
                        <div className="flex items-center">
                            <label className="mr-2 text-sm font-semibold text-gray-700">View:</label>
                            <div className="flex bg-white rounded-lg border border-slate-300 p-1">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                                        viewMode === 'table' 
                                            ? 'bg-slate-600 text-white shadow-sm' 
                                            : 'text-slate-600 hover:text-slate-800'
                                    }`}>
                                    <i className="fas fa-table mr-1"></i>
                                    <span className="hidden sm:inline">Table</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('card')}
                                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                                        viewMode === 'card' 
                                            ? 'bg-slate-600 text-white shadow-sm' 
                                            : 'text-slate-600 hover:text-slate-800'
                                    }`}>
                                    <i className="fas fa-th-large mr-1"></i>
                                    <span className="hidden sm:inline">Cards</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {selectedSemesterFilter && (
                        <button
                            onClick={() => setSelectedSemesterFilter('')}
                            className="text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors flex items-center">
                            <i className="fas fa-times mr-1"></i>
                            Reset Filter
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-x-hidden">
                {viewMode === 'table' ? (
                    /* Table View */
                                            <div className="w-full h-full overflow-x rounded-xl border border-slate-200 shadow-sm">
                        <table className="w-full border-separate border-spacing-0 text-sm">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                                    <th className="border border-slate-300 p-3 text-center font-bold uppercase bg-gradient-to-r from-slate-600 to-slate-700 text-xs md:text-sm">
                                        MATA KULIAH
                                    </th>
                                    <th className="border border-slate-300 p-3 text-center font-bold uppercase bg-gradient-to-r from-slate-600 to-slate-700 text-xs md:text-sm hidden md:table-cell">
                                        KODE
                                    </th>
                                    <th className="border border-slate-300 p-3 text-center font-bold uppercase bg-gradient-to-r from-slate-600 to-slate-700 text-xs md:text-sm hidden lg:table-cell">
                                        JENIS
                                    </th>
                                    <th className="border border-slate-300 p-3 text-center font-bold uppercase bg-gradient-to-r from-slate-600 to-slate-700 text-xs md:text-sm">
                                        SKS
                                    </th>
                                    <th className="border border-slate-300 p-3 text-center font-bold uppercase bg-gradient-to-r from-slate-600 to-slate-700 text-xs md:text-sm">
                                        SEM
                                    </th>
                                    <th className="border border-slate-300 p-3 text-center font-bold uppercase bg-gradient-to-r from-slate-600 to-slate-700 text-xs md:text-sm">
                                        NILAI
                                    </th>
                                    <th className="border border-slate-300 p-3 text-center font-bold uppercase bg-gradient-to-r from-slate-600 to-slate-700 text-xs md:text-sm hidden xl:table-cell">
                                        TAHUN AJARAN
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.length > 0 ? (
                                    filteredCourses
                                        .sort((a, b) => (parseInt(a.semester) || 0) - (parseInt(b.semester) || 0))
                                        .map((course, index) => (
                                            <tr
                                                key={index}
                                                className={`hover:bg-slate-50 transition-all duration-200 transform hover:scale-[1.01] ${getRowStyle(course.nilai)}`}>
                                                <td className="p-3 text-gray-700 text-left border-b border-gray-200 font-medium">
                                                    <div className="max-w-[200px] truncate" title={course.nama_mata_kuliah}>
                                                        {course.nama_mata_kuliah || 'Mata Kuliah Tidak Ditemukan'}
                                                    </div>
                                                    <div className="md:hidden text-xs text-gray-500 mt-1">
                                                        {course.kode_mata_kuliah}
                                                    </div>
                                                </td>
                                                <td className="p-3 text-gray-700 text-center border-b border-gray-200 hidden md:table-cell">
                                                    {course.kode_mata_kuliah}
                                                </td>
                                                <td className="p-3 text-gray-700 text-center border-b border-gray-200 hidden lg:table-cell">
                                                    {course.jenis || 'Tidak Diketahui'}
                                                </td>
                                                <td className="p-3 text-gray-700 text-center border-b border-gray-200 font-semibold">
                                                    {course.sks || '-'}
                                                </td>
                                                <td className="p-3 text-gray-700 text-center border-b border-gray-200 font-semibold">
                                                    {course.semester}
                                                </td>
                                                <td className="p-3 text-center border-b border-gray-200">
                                                    <span className={getGradeBadgeStyle(course.nilai)}>
                                                        {course.nilai ? course.nilai.trim() : '-'}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-gray-700 text-center border-b border-gray-200 hidden xl:table-cell">
                                                    {course.tahun_ajaran || '-'}
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <i className="fas fa-search text-4xl text-gray-300 mb-3"></i>
                                                <p className="text-lg">
                                                    {selectedSemesterFilter
                                                        ? `Tidak ada mata kuliah di Semester ${selectedSemesterFilter}`
                                                        : 'Tidak ada data riwayat mata kuliah'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Card View */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 h-full overflow-x pr-2">
                        {filteredCourses.length > 0 ? (
                            filteredCourses
                                .sort((a, b) => (parseInt(a.semester) || 0) - (parseInt(b.semester) || 0))
                                .map((course, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                                                    {course.nama_mata_kuliah || 'Mata Kuliah Tidak Ditemukan'}
                                                </h3>
                                                <p className="text-xs text-gray-500 mb-2">{course.kode_mata_kuliah}</p>
                                            </div>
                                            <span className={getGradeBadgeStyle(course.nilai)}>
                                                {course.nilai ? course.nilai.trim() : '-'}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="bg-slate-50 p-2 rounded-lg">
                                                <div className="text-xs text-slate-500 mb-1">SKS</div>
                                                <div className="font-semibold text-slate-700">{course.sks || '-'}</div>
                                            </div>
                                            <div className="bg-slate-50 p-2 rounded-lg">
                                                <div className="text-xs text-slate-500 mb-1">Semester</div>
                                                <div className="font-semibold text-slate-700">{course.semester}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-3 pt-3 border-t border-slate-100">
                                            <div className="flex justify-between items-center text-xs text-slate-500">
                                                <span>{course.jenis || 'Tidak Diketahui'}</span>
                                                <span>{course.tahun_ajaran || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-12">
                                <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
                                <p className="text-xl text-gray-500 text-center">
                                    {selectedSemesterFilter
                                        ? `Tidak ada mata kuliah di Semester ${selectedSemesterFilter}`
                                        : 'Tidak ada data riwayat mata kuliah'}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiwayatMataKuliah;