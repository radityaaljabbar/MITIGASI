import React, { useState, useEffect } from 'react';
// Import file service fitur MyCourse
import { getCourseHistory } from '../../../services/mahasiswaServices/myCourseService';

const RiwayatMataKuliah = () => {
    const [courseHistory, setCourseHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // handle file service
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
            return 'bg-red-500 text-white'; // Fixed the missing hyphen in "text-white"
        }
        return '';
    };

    if (loading) {
        return (
            <div className="bg-white w-full max-w-[1200px] min-h-[300px] p-6 rounded-2xl shadow-xl border border-gray-200 flex justify-center items-center">
                <div className="text-center">
                    <p className="text-gray-600">Loading course history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white w-full max-w-[1200px] min-h-[300px] p-6 rounded-2xl shadow-xl border border-gray-200 flex justify-center items-center">
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

    return (
        <div className="bg-white w-full max-w-[1200px] min-h-[300px] max-h-[450px] p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center space-y-5">
            <h2 className="text-center text-xl font-semibold text-gray-900">
                Riwayat Mata Kuliah
            </h2>
            <div className="w-full h-[calc(100%-70px)] overflow-y-auto overflow-x-auto rounded-lg">
                <table className="w-full border-separate border-spacing-0 text-sm">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-[#951a22] text-white">
                            {[
                                'Nama Mata Kuliah',
                                'Kode Mata Kuliah',
                                'Jenis',
                                'SKS',
                                'Semester',
                                'Nilai',
                                'Tahun Ajaran',
                            ].map((header, index) => (
                                <th
                                    key={index}
                                    className="border border-gray-300 p-3 text-center font-bold uppercase bg-[#951a22]">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {courseHistory.length > 0 ? (
                            courseHistory.map((course, index) => (
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
                                    Tidak ada data riwayat mata kuliah
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
