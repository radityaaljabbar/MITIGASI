import React, { useState, useEffect } from 'react';
// Import file service fitur MyCourse
import { getCourseHistory } from '../../../services/mahasiswaServices/myCourseService';

const RiwayatMataKuliah = () => {
    const [courseHistory, setCourseHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSemesterFilter, setSelectedSemesterFilter] = useState(''); // Filter semester

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

        if (grade === 'A' || grade === 'A-' || grade === 'AB') {
            return 'bg-green-500 text-white';
        } else if (grade === 'D' || grade === 'E') {
            return 'bg-red-500 text-white';
        }
        return '';
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

    if (loading) {
        return (
            <div className="bg-white w-full max-w-[1200px] min-h-[500px] p-6 rounded-2xl shadow-xl border border-gray-200 flex justify-center items-center">
                <div className="text-center">
                    <p className="text-gray-600">Loading course history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white w-full max-w-[1200px] min-h-[500px] p-6 rounded-2xl shadow-xl border border-gray-200 flex justify-center items-center">
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => window.location.reload()}>
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
                    <p className="text-gray-500 italic">
                        Tidak ada data riwayat mata kuliah
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white w-full max-w-[1200px] min-h-[500px] max-h-[1000px] p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center space-y-5">
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Riwayat Mata Kuliah
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Daftar mata kuliah yang telah Anda tempuh beserta
                        nilainya
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-500">
                        {selectedSemesterFilter
                            ? `Semester ${selectedSemesterFilter}: `
                            : 'Total: '}
                        {totalCourses} mata kuliah
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="w-full flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                    <label className="mr-3 text-sm font-medium text-gray-700">
                        Filter Semester:
                    </label>
                    <select
                        value={selectedSemesterFilter}
                        onChange={(e) =>
                            setSelectedSemesterFilter(e.target.value)
                        }
                        className="p-2 border border-gray-300 rounded focus:ring-[#951a22] focus:border-[#951a22] text-sm">
                        <option value="">Semua Semester</option>
                        {availableSemesters.map((semester) => (
                            <option key={semester} value={semester}>
                                Semester {semester}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedSemesterFilter && (
                    <button
                        onClick={() => setSelectedSemesterFilter('')}
                        className="text-sm text-[#951a22] hover:text-[#7d1519] font-medium">
                        Reset Filter
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="w-full h-[calc(100%-160px)] overflow-y-auto overflow-x-auto rounded-lg">
                <table className="w-full border-separate border-spacing-0 text-sm">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-[#951a22] text-white">
                            <th className="border border-gray-300 p-3 text-center font-bold uppercase bg-[#951a22]">
                                NAMA MATA KULIAH
                            </th>
                            <th className="border border-gray-300 p-3 text-center font-bold uppercase bg-[#951a22]">
                                KODE MATA KULIAH
                            </th>
                            <th className="border border-gray-300 p-3 text-center font-bold uppercase bg-[#951a22]">
                                JENIS
                            </th>
                            <th className="border border-gray-300 p-3 text-center font-bold uppercase bg-[#951a22]">
                                SKS
                            </th>
                            <th className="border border-gray-300 p-3 text-center font-bold uppercase bg-[#951a22]">
                                SEMESTER
                            </th>
                            <th className="border border-gray-300 p-3 text-center font-bold uppercase bg-[#951a22]">
                                NILAI
                            </th>
                            <th className="border border-gray-300 p-3 text-center font-bold uppercase bg-[#951a22]">
                                TAHUN AJARAN
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCourses.length > 0 ? (
                            filteredCourses
                                .sort(
                                    (a, b) =>
                                        (parseInt(a.semester) || 0) -
                                        (parseInt(b.semester) || 0)
                                )
                                .map((course, index) => (
                                    <tr
                                        key={index}
                                        className={`hover:bg-gray-100 transition duration-200 ${getRowStyle(
                                            course.nilai
                                        )}`}>
                                        <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                            {course.nama_mata_kuliah ||
                                                'Mata Kuliah Tidak Ditemukan'}
                                        </td>
                                        <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                            {course.kode_mata_kuliah}
                                        </td>
                                        <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                            {course.jenis || 'Tidak Diketahui'}
                                        </td>
                                        <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                            {course.sks || '-'}
                                        </td>
                                        <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                            {course.semester}
                                        </td>
                                        <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                            {course.nilai
                                                ? course.nilai.trim()
                                                : '-'}
                                        </td>
                                        <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                            {course.tahun_ajaran || '-'}
                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="p-5 text-center text-gray-500">
                                    {selectedSemesterFilter
                                        ? `Tidak ada mata kuliah di Semester ${selectedSemesterFilter}`
                                        : 'Tidak ada data riwayat mata kuliah'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RiwayatMataKuliah;
