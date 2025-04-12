import React, { useState, useRef } from 'react';

// Mock data for available courses based on your provided schema
const availableCoursesData = [
    {
        id: 1,
        kodeMataKuliah: 'TK-001',
        namaMataKuliah: 'Pemrograman Dasar',
        sks: 3,
        jenis: 'Wajib',
        semester: '1',
    },
    {
        id: 2,
        kodeMataKuliah: 'TK-002',
        namaMataKuliah: 'Kalkulus',
        sks: 3,
        jenis: 'Wajib',
        semester: '1',
    },
    {
        id: 3,
        kodeMataKuliah: 'TK-003',
        namaMataKuliah: 'Struktur Data',
        sks: 3,
        jenis: 'Wajib',
        semester: '2',
    },
    {
        id: 4,
        kodeMataKuliah: 'TK-004',
        namaMataKuliah: 'Basis Data',
        sks: 3,
        jenis: 'Wajib Prodi',
        semester: '2',
    },
    {
        id: 5,
        kodeMataKuliah: 'TK-005',
        namaMataKuliah: 'Jaringan Komputer',
        sks: 3,
        jenis: 'Wajib',
        semester: '3',
    },
    {
        id: 6,
        kodeMataKuliah: 'TK-006',
        namaMataKuliah: 'Jaringan Komputer 2',
        sks: 3,
        jenis: 'Wajib',
        semester: '4',
    },
    {
        id: 7,
        kodeMataKuliah: 'TK-007',
        namaMataKuliah: 'Fisika',
        sks: 3,
        jenis: 'Wajib',
        semester: '1',
    },
    {
        id: 8,
        kodeMataKuliah: 'TK-008',
        namaMataKuliah: 'Fisika 2',
        sks: 3,
        jenis: 'Wajib',
        semester: '2',
    },
    {
        id: 9,
        kodeMataKuliah: 'TK-009',
        namaMataKuliah: 'Elektronika Dasar',
        sks: 3,
        jenis: 'Wajib',
        semester: '3',
    },
    {
        id: 10,
        kodeMataKuliah: 'TK-011',
        namaMataKuliah: 'Matriks dan Vektor',
        sks: 3,
        jenis: 'Wajib',
        semester: '1',
    },
    {
        id: 11,
        kodeMataKuliah: 'TK-012',
        namaMataKuliah: 'Bahasa Inggris',
        sks: 3,
        jenis: 'Wajib',
        semester: '2',
    },
];

// Mock data for classes
const classesList = [
    { id: 1, name: 'Teknik Informatika A' },
    { id: 2, name: 'Teknik Informatika B' },
    { id: 3, name: 'Sistem Informasi A' },
];

// Mock data for students (will be filtered by class)
const studentsList = [
    { id: 1, name: 'Andi Pratama', classId: 1 },
    { id: 2, name: 'Budi Santoso', classId: 1 },
    { id: 3, name: 'Citra Dewi', classId: 2 },
    { id: 4, name: 'Dina Fitriani', classId: 2 },
    { id: 5, name: 'Eko Prasetyo', classId: 3 },
];

// Mock data for course history (will be filtered by student)
const courseHistoryData = [
    {
        id: 1,
        kodeMataKuliah: 'TK-001',
        namaMataKuliah: 'Pemrograman Dasar',
        sks: 3,
        jenis: 'Wajib',
        indeks: 'A',
        tingkat: 1,
        studentId: 1,
    },
    {
        id: 2,
        kodeMataKuliah: 'TK-002',
        namaMataKuliah: 'Kalkulus',
        sks: 3,
        jenis: 'Wajib',
        indeks: 'B',
        tingkat: 1,
        studentId: 1,
    },
    {
        id: 3,
        kodeMataKuliah: 'TK-007',
        namaMataKuliah: 'Fisika',
        sks: 3,
        jenis: 'Wajib',
        indeks: 'C',
        tingkat: 1,
        studentId: 1,
    },
    {
        id: 4,
        kodeMataKuliah: 'TK-001',
        namaMataKuliah: 'Pemrograman Dasar',
        sks: 3,
        jenis: 'Wajib',
        indeks: 'B',
        tingkat: 1,
        studentId: 2,
    },
    {
        id: 5,
        kodeMataKuliah: 'TK-002',
        namaMataKuliah: 'Kalkulus',
        sks: 3,
        jenis: 'Wajib',
        indeks: 'D',
        tingkat: 1,
        studentId: 2,
    },
    {
        id: 6,
        kodeMataKuliah: 'TK-001',
        namaMataKuliah: 'Pemrograman Dasar',
        sks: 3,
        jenis: 'Wajib',
        indeks: 'A',
        tingkat: 1,
        studentId: 3,
    },
    {
        id: 7,
        kodeMataKuliah: 'TK-003',
        namaMataKuliah: 'Struktur Data',
        sks: 3,
        jenis: 'Wajib',
        indeks: 'E',
        tingkat: 1,
        studentId: 3,
    },
];

const MyCourseAdvisor = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [availableCourses, setAvailableCourses] =
        useState(availableCoursesData);
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const componentRef = useRef();

    // Filter students based on selected class
    const filteredStudents = selectedClass
        ? studentsList.filter(
              (student) => student.classId === parseInt(selectedClass)
          )
        : [];

    // Filter course history based on selected student
    const studentCourseHistory = selectedStudent
        ? courseHistoryData.filter(
              (course) => course.studentId === parseInt(selectedStudent)
          )
        : [];

    // Filter available courses based on selected semester
    const filteredAvailableCourses = selectedSemester
        ? availableCourses.filter(
              (course) => course.semester === selectedSemester
          )
        : availableCourses;

    // Handle class selection
    const handleClassChange = (e) => {
        setSelectedClass(e.target.value);
        setSelectedStudent(''); // Reset student when class changes
    };

    // Handle student selection
    const handleStudentChange = (e) => {
        setSelectedStudent(e.target.value);
    };

    // Handle semester selection for filtering available courses
    const handleSemesterChange = (e) => {
        setSelectedSemester(e.target.value);
    };

    // Add course to recommended list
    const addCourse = (course) => {
        setAvailableCourses(availableCourses.filter((c) => c.id !== course.id));
        setRecommendedCourses([...recommendedCourses, course]);
    };

    // Remove course from recommended list
    const removeCourse = (course) => {
        setRecommendedCourses(
            recommendedCourses.filter((c) => c.id !== course.id)
        );
        setAvailableCourses([...availableCourses, course]);
    };

    // Send recommendations to the selected student
    const sendRecommendations = () => {
        if (!selectedStudent) {
            alert('Pilih mahasiswa terlebih dahulu');
            return;
        }

        if (recommendedCourses.length === 0) {
            alert('Tambahkan mata kuliah rekomendasi terlebih dahulu');
            return;
        }

        alert(`Rekomendasi mata kuliah berhasil dikirim ke mahasiswa`);
        // Here you would normally send this data to your backend
    };

    return (
        <div className="p-6 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Rekomendasi Mata Kuliah</h1>

            {/* Selection Controls - Now hierarchical */}
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
                            disabled={!selectedClass}
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

            {selectedStudent && (
                <div ref={componentRef}>
                    {/* Course History */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">
                            Riwayat Mata Kuliah
                        </h2>
                        {studentCourseHistory.length > 0 ? (
                            <div className="overflow-x-auto border rounded-lg shadow-sm">
                                <table className="w-full border-collapse bg-white">
                                    <thead className="bg-[#951A22] text-white">
                                        <tr>
                                            <th className="py-3 px-4 text-left">
                                                Kode
                                            </th>
                                            <th className="py-3 px-4 text-left">
                                                Nama
                                            </th>
                                            <th className="py-3 px-4 text-left">
                                                Jenis
                                            </th>
                                            <th className="py-3 px-4 text-center">
                                                SKS
                                            </th>
                                            <th className="py-3 px-4 text-center">
                                                Indeks
                                            </th>
                                            <th className="py-3 px-4 text-center">
                                                Tingkat
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentCourseHistory.map((course) => {
                                            // Determine row color based on grade
                                            const gradeColor =
                                                course.indeks === 'E'
                                                    ? 'bg-red-100'
                                                    : course.indeks === 'D'
                                                    ? 'bg-orange-100'
                                                    : course.indeks === 'A'
                                                    ? 'bg-green-100'
                                                    : '';

                                            return (
                                                <tr
                                                    key={course.id}
                                                    className={`border-b hover:bg-gray-50 ${gradeColor}`}>
                                                    <td className="py-2 px-4 border-r">
                                                        {course.kodeMataKuliah}
                                                    </td>
                                                    <td className="py-2 px-4 border-r">
                                                        {course.namaMataKuliah}
                                                    </td>
                                                    <td className="py-2 px-4 border-r">
                                                        {course.jenis}
                                                    </td>
                                                    <td className="py-2 px-4 text-center border-r">
                                                        {course.sks}
                                                    </td>
                                                    <td className="py-2 px-4 text-center border-r font-medium">
                                                        {course.indeks}
                                                    </td>
                                                    <td className="py-2 px-4 text-center">
                                                        {course.tingkat}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">
                                Tidak ada riwayat mata kuliah
                            </p>
                        )}
                    </div>

                    {/* Recommendation Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xl font-semibold">
                                Rekomendasi Mata Kuliah
                            </h2>
                            <button
                                onClick={sendRecommendations}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 print:hidden">
                                Kirim Rekomendasi
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Available Courses */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-medium">
                                        Mata Kuliah Tersedia
                                    </h3>
                                    <div className="flex items-center">
                                        <label className="mr-2 text-sm font-medium text-gray-700">
                                            Semester:
                                        </label>
                                        <select
                                            value={selectedSemester}
                                            onChange={handleSemesterChange}
                                            className="text-sm p-1 border border-gray-300 rounded focus:ring-[#951A22] focus:border-[#951A22]">
                                            <option value="">Semua</option>
                                            <option value="1">
                                                Semester 1
                                            </option>
                                            <option value="2">
                                                Semester 2
                                            </option>
                                            <option value="3">
                                                Semester 3
                                            </option>
                                            <option value="4">
                                                Semester 4
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="overflow-x-auto border rounded-lg shadow-sm">
                                    <table className="w-full border-collapse bg-white">
                                        <thead className="bg-[#951A22] text-white">
                                            <tr>
                                                <th className="py-3 px-4 text-left">
                                                    Kode
                                                </th>
                                                <th className="py-3 px-4 text-left">
                                                    Nama
                                                </th>
                                                <th className="py-3 px-4 text-center">
                                                    SKS
                                                </th>
                                                <th className="py-3 px-4 text-left">
                                                    Jenis
                                                </th>
                                                <th className="py-3 px-4 text-center">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAvailableCourses.length >
                                            0 ? (
                                                filteredAvailableCourses
                                                    .sort((a, b) =>
                                                        a.namaMataKuliah.localeCompare(
                                                            b.namaMataKuliah
                                                        )
                                                    )
                                                    .map((course) => (
                                                        <tr
                                                            key={course.id}
                                                            className="border-b hover:bg-gray-50">
                                                            <td className="py-2 px-4 border-r">
                                                                {
                                                                    course.kodeMataKuliah
                                                                }
                                                            </td>
                                                            <td className="py-2 px-4 border-r">
                                                                {
                                                                    course.namaMataKuliah
                                                                }
                                                            </td>
                                                            <td className="py-2 px-4 text-center border-r">
                                                                {course.sks}
                                                            </td>
                                                            <td className="py-2 px-4 border-r">
                                                                {course.jenis}
                                                            </td>
                                                            <td className="py-2 px-4 text-center">
                                                                <button
                                                                    onClick={() =>
                                                                        addCourse(
                                                                            course
                                                                        )
                                                                    }
                                                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                                                                    +
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="py-4 px-4 text-center text-gray-500 italic">
                                                        Tidak ada mata kuliah
                                                        tersedia
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Recommended Courses */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">
                                    Mata Kuliah Direkomendasikan
                                </h3>
                                <div className="overflow-x-auto border rounded-lg shadow-sm">
                                    <table className="w-full border-collapse bg-white">
                                        <thead className="bg-[#951A22] text-white">
                                            <tr>
                                                <th className="py-3 px-4 text-left">
                                                    Kode
                                                </th>
                                                <th className="py-3 px-4 text-left">
                                                    Nama
                                                </th>
                                                <th className="py-3 px-4 text-center">
                                                    SKS
                                                </th>
                                                <th className="py-3 px-4 text-left">
                                                    Jenis
                                                </th>
                                                <th className="py-3 px-4 text-center">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recommendedCourses.length > 0 ? (
                                                recommendedCourses.map(
                                                    (course) => (
                                                        <tr
                                                            key={course.id}
                                                            className="border-b hover:bg-gray-50">
                                                            <td className="py-2 px-4 border-r">
                                                                {
                                                                    course.kodeMataKuliah
                                                                }
                                                            </td>
                                                            <td className="py-2 px-4 border-r">
                                                                {
                                                                    course.namaMataKuliah
                                                                }
                                                            </td>
                                                            <td className="py-2 px-4 text-center border-r">
                                                                {course.sks}
                                                            </td>
                                                            <td className="py-2 px-4 border-r">
                                                                {course.jenis}
                                                            </td>
                                                            <td className="py-2 px-4 text-center">
                                                                <button
                                                                    onClick={() =>
                                                                        removeCourse(
                                                                            course
                                                                        )
                                                                    }
                                                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                                                                    -
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="py-4 px-4 text-center text-gray-500 italic">
                                                        Belum ada mata kuliah
                                                        direkomendasikan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!selectedStudent && (
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600">
                        Silahkan pilih kelas dan mahasiswa terlebih dahulu untuk
                        melihat riwayat dan membuat rekomendasi mata kuliah
                    </p>
                </div>
            )}
        </div>
    );
};

export default MyCourseAdvisor;
