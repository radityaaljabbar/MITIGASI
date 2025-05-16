import React, { useState, useEffect } from 'react';
import { getRecommendedCourse } from '../../../services/mahasiswaServices/myCourseService';

const RekomendasiMataKuliah = () => {
    const [recommendedCourse, setRecommendedCourse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Handle data dri service
    useEffect(() => {
        const fetchRecommendedCourse = async () => {
            try {
                setLoading(true);

                const response = await getRecommendedCourse();

                if (response.success && response.data) {
                    setRecommendedCourse(response.data);
                } else {
                    setError(
                        response.message || 'Failed to fetch recommended course'
                    );
                }
            } catch (error) {
                console.error('An error occured while recommended course');
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendedCourse();
    }, []);

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

    if (recommendedCourse.length === 0) {
        return (
            <p className="text-gray-500 italic">
                Tidak ada riwayat mata kuliah untuk mahasiswa ini atau gagal
                memuat.
            </p>
        );
    }

    return (
        <div className="bg-white w-full max-w-[1200px] min-h-[300px] max-h-[450px] p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center space-y-5">
            <h2 className="text-center text-xl font-semibold text-gray-900">
                Mata Kuliah Rekomendasi
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
                        {recommendedCourse.map((course, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-100 transition duration-200">
                                <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                    {course.nama_mk}
                                </td>
                                <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                    {course.kode_mk}
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
        </div>
    );
};

export default RekomendasiMataKuliah;
