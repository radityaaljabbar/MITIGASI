import React, {
    useState,
    useRef,
    useEffect,
    useMemo,
    useCallback,
} from 'react';

// Mock data for available courses based on your provided schema
import availableCoursesData from '../../assets/data/mockupjsonDosenWali/myCourseAdvisor/availableCourses.json';

// Mock data for classes
const classesList = [
    { id: 4506, name: 'TK-45-06' },
    { id: 4604, name: 'TK-46-04' },
    { id: 4705, name: 'TK-47-05' },
];

// Mock data for students (will be filtered by class)
const studentsList = [
    { id: 1103210708, name: 'Andi Pratama', classId: 4506 },
    { id: 1103210056, name: 'Budi Santoso', classId: 4506 },
    { id: 1103220070, name: 'Citra Dewi', classId: 4604 },
    { id: 1103220788, name: 'Dina Fitriani', classId: 4604 },
    { id: 1103230099, name: 'Eko Prasetyo', classId: 4705 },
];

// Simplified mock data for student course histories (only contains kodeMK, nilaiMK, indeksMK)
const studentCourseHistoryData = [
    { id: 1, kodeMataKuliah: 'TK-001', indeks: 'A', studentId: 1103210708 },
    { id: 2, kodeMataKuliah: 'TK-002', indeks: 'B', studentId: 1103210708 },
    { id: 3, kodeMataKuliah: 'TK-007', indeks: 'C', studentId: 1103210708 },
    { id: 4, kodeMataKuliah: 'TK-001', indeks: 'B', studentId: 1103210056 },
    { id: 5, kodeMataKuliah: 'TK-002', indeks: 'E', studentId: 1103210056 },
    { id: 6, kodeMataKuliah: 'TK-001', indeks: 'A', studentId: 1103220070 },
    { id: 7, kodeMataKuliah: 'TK-003', indeks: 'E', studentId: 1103220070 },
];

const MyCourseAdvisor = () => {
    // Maximum SKS allowed
    const MAX_SKS = 24;

    // Use static reference for constant data
    const staticAvailableCoursesData = useMemo(
        () => [...availableCoursesData],
        []
    );

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [availableCourses, setAvailableCourses] = useState([
        ...staticAvailableCoursesData,
    ]);
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const [mergedCourseHistory, setMergedCourseHistory] = useState([]);
    const [sksLimitExceeded, setSksLimitExceeded] = useState(false);
    const componentRef = useRef();

    // Calculate total SKS of recommended courses
    const totalRecommendedSKS = recommendedCourses.reduce(
        (total, course) => total + course.sks,
        0
    );

    // Filter students based on selected class - memozied to avoid recalculation
    const filteredStudents = useMemo(() => {
        return selectedClass
            ? studentsList.filter(
                  (student) => student.classId === parseInt(selectedClass)
              )
            : [];
    }, [selectedClass]);

    // Get raw course history data for selected student - memozied to avoid recalculation
    const studentCourseHistory = useMemo(() => {
        return selectedStudent
            ? studentCourseHistoryData.filter(
                  (course) => course.studentId === parseInt(selectedStudent)
              )
            : [];
    }, [selectedStudent]);

    // Merge course history with available courses data to get complete information
    useEffect(() => {
        // Don't run this effect if there's no student selected or no course history
        if (!selectedStudent || studentCourseHistory.length === 0) {
            setMergedCourseHistory([]);
            return;
        }

        const merged = studentCourseHistory.map((historyItem) => {
            // Find the course details from staticAvailableCoursesData
            const courseDetails = staticAvailableCoursesData.find(
                (course) => course.kodeMataKuliah === historyItem.kodeMataKuliah
            );

            // Merge the history item with course details
            return courseDetails
                ? {
                      ...historyItem,
                      namaMataKuliah: courseDetails.namaMataKuliah,
                      sks: courseDetails.sks,
                      jenis: courseDetails.jenis,
                      tingkat: courseDetails.semester, // Using semester as tingkat
                  }
                : historyItem;
        });

        setMergedCourseHistory(merged);
    }, [selectedStudent, studentCourseHistory, staticAvailableCoursesData]);

    // Filter available courses based on selected semester - memozied to avoid recalculation
    const filteredAvailableCourses = useMemo(() => {
        return selectedSemester
            ? availableCourses.filter(
                  (course) => course.semester === selectedSemester
              )
            : availableCourses;
    }, [selectedSemester, availableCourses]);

    // Modified: Helper function to check if a course has been taken and passed
    // For Wajib: pass if grade is not 'E'
    // For Peminatan: pass if grade is not 'D' or 'E'
    const hasCourseTaken = useCallback(
        (kodeMataKuliah) => {
            // Find the course in available courses to determine its type
            const courseDetails = staticAvailableCoursesData.find(
                (course) => course.kodeMataKuliah === kodeMataKuliah
            );

            // Find student's history for this course
            const courseHistory = studentCourseHistory.find(
                (course) => course.kodeMataKuliah === kodeMataKuliah
            );

            // If no history found, the course hasn't been taken
            if (!courseHistory) return false;

            // Get course type (Wajib or Peminatan)
            const courseType = courseDetails?.jenis;

            // Apply different rules based on course type
            if (courseType === 'Wajib') {
                // For Wajib courses, only E grades need retaking
                return courseHistory.indeks !== 'E';
            } else if (courseType === 'Peminatan') {
                // For Peminatan courses, both D and E grades need retaking
                return (
                    courseHistory.indeks !== 'E' && courseHistory.indeks !== 'D'
                );
            }

            // Default fallback - consider course as taken if it exists in history
            // with any grade other than E (most conservative approach)
            return courseHistory.indeks !== 'E';
        },
        [studentCourseHistory, staticAvailableCoursesData]
    );

    // Filter available courses to exclude courses already taken with passing grades
    const eligibleAvailableCourses = useMemo(() => {
        return filteredAvailableCourses.filter(
            (course) => !hasCourseTaken(course.kodeMataKuliah)
        );
    }, [filteredAvailableCourses, hasCourseTaken]);

    // Handle class selection
    const handleClassChange = (e) => {
        setSelectedClass(e.target.value);
        setSelectedStudent(''); // Reset student when class changes
        setRecommendedCourses([]); // Reset recommendations
        setSksLimitExceeded(false); // Reset SKS limit warning
    };

    // Handle student selection
    const handleStudentChange = (e) => {
        setSelectedStudent(e.target.value);
        setRecommendedCourses([]); // Reset recommendations when student changes
        setSksLimitExceeded(false); // Reset SKS limit warning
    };

    // Handle semester selection for filtering available courses
    const handleSemesterChange = (e) => {
        setSelectedSemester(e.target.value);
    };

    // Add course to recommended list with SKS limit check
    const addCourse = (course) => {
        const newTotalSKS = totalRecommendedSKS + course.sks;

        // Check if adding this course would exceed the SKS limit
        if (newTotalSKS > MAX_SKS) {
            setSksLimitExceeded(true);
            return; // Don't add the course if it exceeds the limit
        }

        setAvailableCourses((prevCourses) =>
            prevCourses.filter((c) => c.id !== course.id)
        );
        setRecommendedCourses((prevCourses) => [...prevCourses, course]);
        setSksLimitExceeded(false); // Reset warning if successful
    };

    // Remove course from recommended list
    const removeCourse = (course) => {
        setRecommendedCourses((prevCourses) =>
            prevCourses.filter((c) => c.id !== course.id)
        );
        setAvailableCourses((prevCourses) => [...prevCourses, course]);
        setSksLimitExceeded(false); // Reset warning as we've removed a course
    };

    // Reset all available courses
    const resetAvailableCourses = () => {
        setAvailableCourses([...staticAvailableCoursesData]);
        setRecommendedCourses([]);
        setSksLimitExceeded(false); // Reset warning
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
        resetAvailableCourses();
    };

    // Check if adding a course would exceed the SKS limit
    const wouldExceedSKSLimit = useCallback(
        (courseSKS) => {
            return totalRecommendedSKS + courseSKS > MAX_SKS;
        },
        [totalRecommendedSKS, MAX_SKS]
    );

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
                        {mergedCourseHistory.length > 0 ? (
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
                                                Semester
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mergedCourseHistory.map((course) => {
                                            // Determine row color based on grade and course type
                                            let gradeColor = '';

                                            if (course.indeks === 'A') {
                                                gradeColor = 'bg-green-100';
                                            } else if (course.indeks === 'E') {
                                                // E is always a failing grade
                                                gradeColor = 'bg-red-100';
                                            } else if (
                                                course.indeks === 'D' &&
                                                course.jenis === 'Peminatan'
                                            ) {
                                                // D is a failing grade only for Peminatan courses
                                                gradeColor = 'bg-orange-100';
                                            }

                                            return (
                                                <tr
                                                    key={course.id}
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
                                                        {course.tingkat || '-'}
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
                            <div className="flex space-x-2">
                                <button
                                    onClick={resetAvailableCourses}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 print:hidden">
                                    Reset
                                </button>
                                <button
                                    onClick={sendRecommendations}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 print:hidden">
                                    Kirim Rekomendasi
                                </button>
                            </div>
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

                                {/* SKS Limit Warning */}
                                {sksLimitExceeded && (
                                    <div className="mb-3 p-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                        <p>
                                            Tidak dapat menambahkan mata kuliah.
                                            Batas maksimum {MAX_SKS} SKS
                                            terlampaui.
                                        </p>
                                    </div>
                                )}

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
                                            {eligibleAvailableCourses.length >
                                            0 ? (
                                                eligibleAvailableCourses
                                                    .sort((a, b) =>
                                                        a.namaMataKuliah.localeCompare(
                                                            b.namaMataKuliah
                                                        )
                                                    )
                                                    .map((course) => {
                                                        // Check if course has a failing grade based on course type
                                                        const courseHistory =
                                                            studentCourseHistory.find(
                                                                (history) =>
                                                                    history.kodeMataKuliah ===
                                                                    course.kodeMataKuliah
                                                            );

                                                        // Set different highlighting based on course type and grade
                                                        let failedCourseHighlight =
                                                            '';

                                                        if (courseHistory) {
                                                            if (
                                                                courseHistory.indeks ===
                                                                'E'
                                                            ) {
                                                                // E is always a failed course
                                                                failedCourseHighlight =
                                                                    'bg-red-50';
                                                            } else if (
                                                                courseHistory.indeks ===
                                                                    'D' &&
                                                                course.jenis ===
                                                                    'Peminatan'
                                                            ) {
                                                                // D is a failed course only for Peminatan
                                                                failedCourseHighlight =
                                                                    'bg-yellow-50';
                                                            }
                                                        }

                                                        // Check if adding this course would exceed the SKS limit
                                                        const exceedsSKSLimit =
                                                            wouldExceedSKSLimit(
                                                                course.sks
                                                            );

                                                        return (
                                                            <tr
                                                                key={course.id}
                                                                className={`border-b hover:bg-gray-50 ${failedCourseHighlight} ${
                                                                    exceedsSKSLimit
                                                                        ? 'bg-red-50'
                                                                        : ''
                                                                }`}>
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
                                                                    {
                                                                        course.jenis
                                                                    }
                                                                </td>
                                                                <td className="py-2 px-4 text-center">
                                                                    <button
                                                                        onClick={() =>
                                                                            addCourse(
                                                                                course
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            exceedsSKSLimit
                                                                        }
                                                                        className={`text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 
                                                                            ${
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
                                                    Semester
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
                                                            <td className="py-2 px-4 text-center border-r">
                                                                {
                                                                    course.semester
                                                                }
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
                                                        colSpan="6"
                                                        className="py-4 px-4 text-center text-gray-500 italic">
                                                        Belum ada mata kuliah
                                                        direkomendasikan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Summary section with SKS limit indicator */}
                                {recommendedCourses.length > 0 && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h4 className="font-medium mb-2">
                                            Ringkasan
                                        </h4>
                                        <div className="flex justify-between">
                                            <span>Total Mata Kuliah:</span>
                                            <span className="font-medium">
                                                {recommendedCourses.length}
                                            </span>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span>Total SKS:</span>
                                            <span
                                                className={`font-medium ${
                                                    totalRecommendedSKS >=
                                                    MAX_SKS
                                                        ? 'text-red-600'
                                                        : ''
                                                }`}>
                                                {totalRecommendedSKS} /{' '}
                                                {MAX_SKS}
                                            </span>
                                        </div>
                                    </div>
                                )}
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
