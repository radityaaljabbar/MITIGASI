import React from 'react';
import { useMyCourseAdvisor } from './MyCourseAdvisorContext';

const CourseHistory = () => {
    const { mergedCourseHistory, isLoadingHistory } = useMyCourseAdvisor();

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Riwayat Mata Kuliah</h2>
            {isLoadingHistory ? (
                <p className="text-gray-500 italic">
                    Memuat riwayat mata kuliah...
                </p>
            ) : mergedCourseHistory.length > 0 ? (
                // Table for course history
                <div className="overflow-x-auto border rounded-lg shadow-sm max-h-[400px] overflow-y-auto">
                    <table className="w-full border-collapse bg-white">
                        <thead className="sticky top-0 z-10 ">
                            <tr className="bg-[#951A22] text-white">
                                <th className="py-3 px-4 text-left">Kode</th>
                                <th className="py-3 px-4 text-left">Nama</th>
                                <th className="py-3 px-4 text-left">Jenis</th>
                                <th className="py-3 px-4 text-center">SKS</th>
                                <th className="py-3 px-4 text-center">
                                    Indeks
                                </th>
                                <th className="py-3 px-4 text-center">
                                    Semester
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {mergedCourseHistory.map((course) => {
                                // Normalize the grade value for robust comparison
                                const indeks = course.indeks
                                    ? course.indeks
                                          .toString()
                                          .trim()
                                          .toUpperCase()
                                    : '';
                                const jenis = course.jenis
                                    ? course.jenis.toString().trim()
                                    : '';

                                // Determine row color based on normalized values
                                let gradeColor = '';

                                if (indeks === 'A') {
                                    gradeColor = 'bg-green-100';
                                } else if (indeks === 'E') {
                                    gradeColor = 'bg-red-100';
                                } else if (
                                    indeks === 'D' &&
                                    jenis.includes('Peminatan')
                                ) {
                                    gradeColor = 'bg-orange-100';
                                }

                                return (
                                    <tr
                                        key={course.id || course.kodeMataKuliah}
                                        className={`border-b hover:bg-gray-50 ${gradeColor}`}>
                                        <td className="py-2 px-4 border-r">
                                            {course.kodeMataKuliah}
                                        </td>
                                        <td className="py-2 px-4 border-r">
                                            {course.namaMataKuliah ||
                                                'Data tidak tersedia'}
                                        </td>
                                        <td className="py-2 px-4 border-r">
                                            {course.jenis ||
                                                'Data tidak tersedia'}
                                        </td>
                                        <td className="py-2 px-4 text-center border-r">
                                            {course.sks || '-'}
                                        </td>
                                        <td className="py-2 px-4 text-center border-r font-medium">
                                            {course.indeks}
                                        </td>
                                        <td className="py-2 px-4 text-center">
                                            {course.semester || '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 italic">
                    Tidak ada riwayat mata kuliah untuk mahasiswa ini atau gagal
                    memuat.
                </p>
            )}
        </div>
    );
};

export default CourseHistory;
