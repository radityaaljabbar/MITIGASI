import React from 'react';
import { useMyCourseAdvisor } from '../MyCourseAdvisorContext';
import RecommendationSummary from './RecommendationSummary';

const RecommendedCourses = () => {
    const {
        recommendedCourses,
        removeCourse,
        hasExistingRecommendations,
        isLoadingRecommendations,
    } = useMyCourseAdvisor();

    return (
        <div>
            <h3 className="text-lg font-medium mb-2 flex items-center justify-between">
                <span>Mata Kuliah Direkomendasikan</span>
                {hasExistingRecommendations &&
                    recommendedCourses.length > 0 && (
                        <span className="text-xs text-gray-500">
                            {recommendedCourses[0].tanggalDibuat &&
                                `Dibuat: ${new Date(
                                    recommendedCourses[0].tanggalDibuat
                                ).toLocaleDateString('id-ID')}`}
                        </span>
                    )}
            </h3>
            <div className="overflow-x-auto border rounded-lg shadow-sm">
                <table className="w-full border-collapse bg-white">
                    <thead className="bg-[#951A22] text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Kode</th>
                            <th className="py-3 px-4 text-left">Nama</th>
                            <th className="py-3 px-4 text-center">SKS</th>
                            <th className="py-3 px-4 text-left">Jenis</th>
                            <th className="py-3 px-4 text-center">Semester</th>
                            <th className="py-3 px-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingRecommendations ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="py-4 px-4 text-center text-gray-500 italic">
                                    Memuat rekomendasi...
                                </td>
                            </tr>
                        ) : recommendedCourses.length > 0 ? (
                            recommendedCourses.map((course) => (
                                <tr
                                    key={course.id}
                                    className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-4 border-r">
                                        {course.kodeMataKuliah}
                                    </td>
                                    <td className="py-2 px-4 border-r">
                                        {course.namaMataKuliah}
                                    </td>
                                    <td className="py-2 px-4 text-center border-r">
                                        {course.sks}
                                    </td>
                                    <td className="py-2 px-4 border-r">
                                        {course.jenis}
                                    </td>
                                    <td className="py-2 px-4 text-center border-r">
                                        {course.semester_mk}
                                    </td>
                                    <td className="py-2 px-4 text-center">
                                        <button
                                            onClick={() => removeCourse(course)}
                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                                            -
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="py-4 px-4 text-center text-gray-500 italic">
                                    {hasExistingRecommendations
                                        ? 'Tidak ada rekomendasi existing untuk semester ini.'
                                        : 'Sistem akan membuat rekomendasi setelah Anda memilih mahasiswa dan semester tujuan.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Show summary if there are recommended courses */}
            {recommendedCourses.length > 0 && <RecommendationSummary />}
        </div>
    );
};

export default RecommendedCourses;
