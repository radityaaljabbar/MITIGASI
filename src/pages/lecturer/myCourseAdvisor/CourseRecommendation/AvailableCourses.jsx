import React from 'react';
import { useMyCourseAdvisor } from '../MyCourseAdvisorContext';

/**
 * Komponen untuk menampilkan daftar mata kuliah yang tersedia untuk direkomendasikan.
 * Dilengkapi dengan filter semester dan logika untuk menambahkan mata kuliah ke daftar rekomendasi.
 * Component to display the list of available courses for recommendation.
 * It includes a semester filter and logic for adding courses to the recommendation list.
 */
const AvailableCourses = () => {
    // Mengambil state dan fungsi yang dibutuhkan dari context
    // Fetching the necessary state and functions from the context
    const {
        selectedSemester,
        handleSemesterChange,
        sksLimitExceeded,
        filteredAvailableCourses,
        studentCourseHistory,
        wouldExceedSKSLimit,
        addCourse,
        MAX_SKS,
    } = useMyCourseAdvisor();

    // Logika untuk memastikan setiap mata kuliah hanya muncul sekali dalam daftar
    // Logic to ensure each course appears only once in the list
    // Map digunakan untuk efisiensi, menimpa entri dengan kunci (kode_mk) yang sama.
    // A Map is used for efficiency, overwriting entries with the same key (kode_mk).
    const uniqueCoursesMap = new Map();
    filteredAvailableCourses.forEach((course) => {
        uniqueCoursesMap.set(course.kode_mk, course);
    });
    const uniqueFilteredCourses = Array.from(uniqueCoursesMap.values());

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Mata Kuliah Tersedia</h3>
                {/* Filter berdasarkan semester */}
                {/* Filter by semester */}
                <div className="flex items-center">
                    <label className="mr-2 text-sm font-medium text-gray-700">
                        Semester:
                    </label>
                    <select
                        value={selectedSemester}
                        onChange={handleSemesterChange}
                        className="text-sm p-1 border border-gray-300 rounded focus:ring-[#951A22] focus:border-[#951A22]">
                        <option value="">Semua</option>
                        <option value="1">GANJIL - Tingkat 1</option>
                        <option value="2">GENAP - Tingkat 1</option>
                        <option value="3">GANJIL - Tingkat 2</option>
                        <option value="4">GENAP - Tingkat 2</option>
                        <option value="5">GANJIL - Tingkat 3</option>
                        <option value="6">GENAP - Tingkat 3</option>
                        <option value="7">GANJIL - Tingkat 4</option>
                        <option value="8">GENAP - Tingkat 4</option>
                    </select>
                </div>
            </div>

            {/* Peringatan jika batas SKS terlampaui */}
            {/* Warning if the SKS limit is exceeded */}
            {sksLimitExceeded && (
                <div className="mb-3 p-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                    <p>
                        Tidak dapat menambahkan mata kuliah. Batas maksimum SKS
                        terlampaui.
                    </p>
                </div>
            )}

            {/* Tabel mata kuliah yang tersedia */}
            {/* Table of available courses */}
            <div className="overflow-x-auto border rounded-lg shadow-sm max-h-[600px] overflow-y-auto">
                <table className="w-full border-collapse bg-white">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-[#951A22] text-white">
                            <th className="py-3 px-4 text-left">Kode</th>
                            <th className="py-3 px-4 text-left">Nama</th>
                            <th className="py-3 px-4 text-center">SKS</th>
                            <th className="py-3 px-4 text-left">Jenis</th>
                            <th className="py-3 px-4 text-left">Kelompok Keahlian</th>
                            <th className="py-3 px-4 text-center">Semester</th>
                            <th className="py-3 px-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Menggunakan data unik untuk dirender */}
                        {/* Using the unique data for rendering */}
                        {uniqueFilteredCourses.length > 0 ? (
                            uniqueFilteredCourses
                                .sort((a, b) => {
                                    const aName = a.nama_mk || '';
                                    const bName = b.nama_mk || '';
                                    return aName.localeCompare(bName);
                                })
                                .map((course) => {
                                    // Memeriksa riwayat mata kuliah untuk memberikan highlight
                                    // Checking course history to apply highlighting
                                    const courseHistory =
                                        studentCourseHistory.find(
                                            (history) =>
                                                history.kodeMataKuliah ===
                                                course.kode_mk
                                        );

                                    let failedCourseHighlight = '';
                                    if (courseHistory) {
                                        if (courseHistory.indeks === 'E') {
                                            failedCourseHighlight = 'bg-red-50';
                                        } else if (
                                            courseHistory.indeks === 'D' &&
                                            course.jenis_mk === 'Peminatan'
                                        ) {
                                            failedCourseHighlight =
                                                'bg-yellow-50';
                                        }
                                    }

                                    // Memeriksa apakah penambahan mata kuliah ini akan melebihi batas SKS
                                    // Checking if adding this course will exceed the SKS limit
                                    const exceedsSKSLimit = wouldExceedSKSLimit(
                                        course.sks_mk
                                    );

                                    return (
                                        <tr
                                            key={course.id} // Kunci tetap bisa menggunakan `id` karena unik per baris data
                                            className={`border-b hover:bg-gray-50 ${failedCourseHighlight} ${
                                                exceedsSKSLimit
                                                    ? 'bg-red-50 opacity-60'
                                                    : ''
                                            }`}>
                                            <td className="py-2 px-4 border-r">
                                                {course.kode_mk}
                                            </td>
                                            <td className="py-2 px-4 border-r">
                                                {course.nama_mk}
                                            </td>
                                            <td className="py-2 px-4 text-center border-r">
                                                {course.sks_mk}
                                            </td>
                                            <td className="py-2 px-4 border-r">
                                                {course.jenis_mk}
                                            </td>
                                            <td className="py-1 px-4 border-r">
                                                {course.kelompok_keahlian || '-'}
                                            
                                            </td>
                                            <td className="py-2 px-4 text-center border-r">
                                                {course.semester_mk}
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                <button
                                                    onClick={() =>
                                                        addCourse({
                                                            id: course.id,
                                                            kodeMataKuliah: course.kode_mk,
                                                            namaMataKuliah: course.nama_mk,
                                                            sks: course.sks_mk,
                                                            jenis: course.jenis_mk,
                                                            kelompokKeahlian: course.kelompok_keahlian,
                                                            semester_mk: course.semester_mk,
                                                        })
                                                    }
                                                    disabled={exceedsSKSLimit}
                                                    className={`text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 ${
                                                        exceedsSKSLimit
                                                            ? 'bg-gray-400 cursor-not-allowed'
                                                            : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                                    }`}>
                                                    +
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                        ) : (
                            // Pesan jika tidak ada mata kuliah tersedia
                            // Message if no available courses
                            <tr>
                                <td
                                    colSpan="7"
                                    className="py-4 px-4 text-center text-gray-500 italic">
                                    Tidak ada mata kuliah tersedia
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AvailableCourses;