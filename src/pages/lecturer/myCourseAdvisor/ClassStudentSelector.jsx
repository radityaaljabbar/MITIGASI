import React from 'react';
import { useMyCourseAdvisor } from './MyCourseAdvisorContext';

const ClassStudentSelector = () => {
    const {
        classesList,
        selectedClass,
        handleClassChange,
        filteredStudents,
        selectedStudent,
        handleStudentChange,
        isLoading,
    } = useMyCourseAdvisor();

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

                <div className="flex flex-col w-full md:w-1/3">
                    <label className="mb-1 font-medium text-gray-700">
                        Pilih Mahasiswa
                    </label>
                    <select
                        value={selectedStudent}
                        onChange={handleStudentChange}
                        disabled={!selectedClass || isLoading} // Disable if no class or initial loading
                        className="p-2 border border-gray-300 rounded focus:ring-[#951A22] focus:border-[#951A22] disabled:bg-gray-100 disabled:text-gray-500">
                        <option value="">Pilih Mahasiswa</option>
                        {filteredStudents.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ClassStudentSelector;
