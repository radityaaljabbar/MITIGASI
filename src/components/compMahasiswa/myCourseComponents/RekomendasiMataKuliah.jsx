import React, { useState, useEffect } from 'react';
import { getRecommendedCourse } from '../../../services/mahasiswaServices/myCourseService';

const RekomendasiMataKuliah = () => {
    const [recommendedData, setRecommendedData] = useState({});
    const [groupedData, setGroupedData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noRecommendations, setNoRecommendations] = useState(false);

    // Handle data dari service
    useEffect(() => {
        const fetchRecommendedCourse = async () => {
            try {
                setLoading(true);

                const response = await getRecommendedCourse();

                // Check if success is true regardless of status code
                if (response.success) {
                    if (response.data && response.data.length > 0) {
                        setRecommendedData(response);
                        setGroupedData(response.groupedData || {});
                    } else {
                        // Handle case where response is successful but there are no recommendations
                        setNoRecommendations(true);
                    }
                } else {
                    setError(
                        response.message || 'Failed to fetch recommended course'
                    );
                }
            } catch (error) {
                console.error(
                    'An error occurred while fetching recommended course'
                );
                console.log(error);
                setError(
                    'Terjadi kesalahan dalam mengambil data rekomendasi mata kuliah'
                );
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendedCourse();
    }, []);

    // Format tanggal
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="bg-white w-full max-w-[1200px] min-h-[500px] p-6 rounded-2xl shadow-xl border border-gray-200 flex justify-center items-center">
                <div className="text-center">
                    <p className="text-gray-600">
                        Loading course recommendations...
                    </p>
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

    if (noRecommendations || Object.keys(groupedData).length === 0) {
        return (
            <div className="bg-white w-full max-w-[1200px] min-h-[500px] p-6 rounded-2xl shadow-xl border border-gray-200 flex justify-center items-center">
                <div className="text-center">
                    <p className="text-gray-500 italic">
                        Belum ada mata kuliah rekomendasi dari dosen wali...
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
                        Mata Kuliah Rekomendasi
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Daftar mata kuliah yang direkomendasikan oleh dosen wali
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-500">
                        Total: {recommendedData.totalRecommendations} mata
                        kuliah
                    </div>
                    <div className="text-sm text-gray-500">
                        {recommendedData.semesterCount} semester
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="w-full h-[calc(100%-70px)] overflow-y-auto overflow-x-auto rounded-lg">
                {Object.entries(groupedData)
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .map(([semester, courses]) => (
                        <div key={semester} className="mb-6 last:mb-0">
                            {/* Semester Header */}
                            <div className="flex items-center justify-between mb-3 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="bg-[#951a22] text-white px-3 py-1 rounded-full text-sm font-medium">
                                        Diperuntukan untuk Semester: {semester}
                                    </div>
                                    <div className="ml-3 text-sm text-gray-600">
                                        {courses.length} mata kuliah •{' '}
                                        {courses.reduce(
                                            (total, course) =>
                                                total + course.sks_mk,
                                            0
                                        )}{' '}
                                        SKS
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Dibuat:{' '}
                                    {formatDate(courses[0]?.tanggal_dibuat)}
                                </div>
                            </div>

                            {/* Table */}
                            <table className="w-full border-separate border-spacing-0 text-sm mb-4">
                                <thead className="sticky top-0 z-10">
                                    <tr className="bg-[#951a22] text-white">
                                        <th className="border border-gray-300 p-3 text-center font-bold uppercase bg-[#951a22]">
                                            KODE MATA KULIAH
                                        </th>
                                        <th className="border border-gray-300 p-3 text-center font-bold uppercase bg-[#951a22]">
                                            NAMA MATA KULIAH
                                        </th>
                                        <th className="border border-gray-300 p-3 text-center font-bold uppercase bg-[#951a22]">
                                            JENIS
                                        </th>
                                        <th className="border border-gray-300 p-3 text-center font-bold uppercase bg-[#951a22]">
                                            SKS
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-100 transition duration-200">
                                            <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                                {course.kode_mk}
                                            </td>
                                            <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                                {course.nama_mk}
                                            </td>
                                            <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                                {course.jenis_mk}
                                            </td>
                                            <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                                {course.sks_mk}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default RekomendasiMataKuliah;
