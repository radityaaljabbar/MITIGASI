import React from 'react';
import { useMyCourseAdvisor } from './MyCourseAdvisorContext';
import StudentInfoBox from '../../../components/compDosenWali/compMyCourseAdvisor/StudentInfoBox'; // Add this import

/**
 * Komponen untuk memilih kelas, mahasiswa, dan semester tujuan.
 * Component for selecting a class, student, and target semester.
 */
const ClassStudentSelector = () => {
    // Mengambil semua state dan handler yang diperlukan dari konteks
    // Fetching all necessary state and handlers from the context
    const {
        classesList,
        selectedClass,
        handleClassChange,
        filteredStudents,
        selectedStudent,
        handleStudentChange,
        targetSemester,
        handleTargetSemesterChange,
        isLoading,
    } = useMyCourseAdvisor();

    // Tampilan loading saat data awal (kelas & mahasiswa) sedang diambil
    // Loading view while initial data (classes & students) is being fetched
    if (isLoading) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-600 text-lg">
                    Memuat data kelas dan mahasiswa...
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Kontainer untuk semua input pilihan */}
            {/* Container for all selection inputs */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex flex-col w-full md:w-1/3">
                        <label className="mb-1 font-medium text-gray-700">
                            Pilih Kelas
                        </label>
                        <select
                            value={selectedClass}
                            onChange={handleClassChange}
                            className="p-2 border border-gray-300 rounded focus:ring-[#951A22] focus:border-[#951A22]">
                            <option value="">Pilih Kelas</option>
                            {classesList.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dropdown untuk memilih mahasiswa (aktif setelah kelas dipilih) */}
                    {/* Dropdown for selecting a student (enabled after a class is selected) */}
                    <div className="flex flex-col w-full md:w-1/3">
                        <label className="mb-1 font-medium text-gray-700">
                            Pilih Mahasiswa
                        </label>
                        <select
                            value={selectedStudent}
                            onChange={handleStudentChange}
                            disabled={!selectedClass || isLoading}
                            className="p-2 border border-gray-300 rounded focus:ring-[#951A22] focus:border-[#951A22] disabled:bg-gray-100 disabled:text-gray-500">
                            <option value="">Pilih Mahasiswa</option>
                            {filteredStudents.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dropdown untuk memilih semester tujuan (aktif setelah mahasiswa dipilih) */}
                    {/* Dropdown for selecting a target semester (enabled after a student is selected) */}
                    <div className="flex flex-col w-full md:w-1/3">
                        <label className="mb-1 font-medium text-gray-700">
                            Semester Tujuan
                        </label>
                        <select
                            value={targetSemester}
                            onChange={handleTargetSemesterChange}
                            disabled={!selectedStudent || isLoading}
                            className="p-2 border border-gray-300 rounded focus:ring-[#951A22] focus:border-[#951A22] disabled:bg-gray-100 disabled:text-gray-500">
                            <option value="">Pilih Semester</option>
                            {/* Membuat opsi semester dari 1 hingga 14 */}
                            {/* Creating semester options from 1 to 14 */}
                            {Array.from({ length: 14 }, (_, i) => i + 1).map(
                                (semester) => (
                                    <option key={semester} value={semester}>
                                        Semester {semester}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>
            </div>

            {/* Kotak Info Mahasiswa - Ditampilkan setelah mahasiswa dipilih */}
            {/* Student Info Box - Displayed after a student is selected */}
            <StudentInfoBox />
        </div>
    );
};

export default ClassStudentSelector;
