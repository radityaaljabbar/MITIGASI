import React, {
    useState,
    useRef,
    useEffect,
    useMemo,
    useCallback,
} from 'react';
import { toast } from 'react-toastify';

// Import the service functions
import {
    getClassAndStudentList,
    getStudentCourseHistory, // Your service function
} from '../../services/dosenWali/myCourseAdvisor/myCourseAdvisorService';

// Import mock data for available courses since you still need them
import availableCoursesData from '../../assets/data/mockupjsonDosenWali/myCourseAdvisor/availableCourses.json';

const MyCourseAdvisor = () => {
    // Maximum SKS allowed
    const MAX_SKS = 24;

    // Use static reference for constant data
    const staticAvailableCoursesData = useMemo(
        () => [...availableCoursesData],
        []
    );

    // State for API data
    const [classesList, setClassesList] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // General loading for initial data
    const [isLoadingHistory, setIsLoadingHistory] = useState(false); // Specific loading for course history

    // Existing state variables
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(''); // This will be the 'nim' for the service
    const [selectedSemester, setSelectedSemester] = useState('');
    const [availableCourses, setAvailableCourses] = useState([
        ...staticAvailableCoursesData,
    ]);
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const [studentCourseHistory, setStudentCourseHistory] = useState([]); // This will store the result from your service
    const [mergedCourseHistory, setMergedCourseHistory] = useState([]); // This is displayed in the table
    const [sksLimitExceeded, setSksLimitExceeded] = useState(false);
    const componentRef = useRef();

    // Calculate total SKS of recommended courses
    const totalRecommendedSKS = recommendedCourses.reduce(
        (total, course) => total + course.sks,
        0
    );

    // Fetch classes and students data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await getClassAndStudentList();
                if (result.success) {
                    const formattedClasses = result.classesList.map(
                        (className, index) => ({
                            id: `class_${index}`,
                            name: className,
                        })
                    );
                    const classNameToIdMap = {};
                    formattedClasses.forEach((cls) => {
                        classNameToIdMap[cls.name] = cls.id;
                    });
                    const formattedStudents = result.studentsList.map(
                        (student) => ({
                            id: student.id, // Assuming student.id is the NIM
                            name: student.name,
                            classId: classNameToIdMap[student.class] || null,
                        })
                    );
                    setClassesList(formattedClasses);
                    setStudentsList(formattedStudents);
                } else {
                    toast.error(result.message || 'Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('An error occurred while fetching data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Fetch student course history when a student is selected
    useEffect(() => {
        if (!selectedStudent) {
            // selectedStudent here is the student's ID (NIM)
            setStudentCourseHistory([]);
            // mergedCourseHistory will be cleared by its own useEffect
            return;
        }

        const fetchCourseHistory = async () => {
            setIsLoadingHistory(true); // Start loading history
            try {
                // Call your service function with the selected student's ID (NIM)
                const result = await getStudentCourseHistory(selectedStudent);

                if (result.success) {
                    // The service already transforms the data, so result.courseHistory should be an array
                    setStudentCourseHistory(result.courseHistory || []);
                } else {
                    toast.error(
                        result.message || 'Failed to fetch course history'
                    );
                    setStudentCourseHistory([]); // Clear history on failure
                }
            } catch (error) {
                console.error('Error fetching student course history:', error);
                toast.error('An error occurred while fetching course history');
                setStudentCourseHistory([]); // Clear history on error
            } finally {
                setIsLoadingHistory(false); // Stop loading history
            }
        };

        fetchCourseHistory();
    }, [selectedStudent]); // This effect runs whenever selectedStudent changes

    // Filter students based on selected class - memozied to avoid recalculation
    const filteredStudents = useMemo(() => {
        return selectedClass
            ? studentsList.filter(
                  (student) => student.classId === selectedClass
              )
            : [];
    }, [selectedClass, studentsList]);

    // Merge course history with available courses data to get complete information
    // This useEffect should now work correctly with the data from studentCourseHistory
    useEffect(() => {
        if (!selectedStudent || studentCourseHistory.length === 0) {
            setMergedCourseHistory([]);
            return;
        }

        const merged = studentCourseHistory.map((historyItem) => {
            // historyItem comes from your API call and service transformation
            // It should already have: id, kodeMataKuliah, namaMataKuliah, jenis, sks, indeks, tingkat, tahunAjaran

            // Find additional/canonical course details from staticAvailableCoursesData
            // This is useful if staticAvailableCoursesData has more complete or preferred names/types, etc.
            const courseDetails = staticAvailableCoursesData.find(
                (course) => course.kodeMataKuliah === historyItem.kodeMataKuliah
            );

            if (courseDetails) {
                // Merge, giving preference to courseDetails for some fields if needed,
                // but ensuring historyItem's unique data (like 'indeks', 'tahunAjaran') is kept.
                return {
                    ...historyItem, // Base data from API (includes indeks, tahunAjaran, and API's version of name, sks, jenis, tingkat)
                    id:
                        historyItem.id ||
                        `history_${courseDetails.kodeMataKuliah}`, // Ensure ID, prefer API's generated one
                    namaMataKuliah:
                        courseDetails.namaMataKuliah ||
                        historyItem.namaMataKuliah, // Prefer static data's name if available
                    sks: courseDetails.sks || historyItem.sks, // Prefer static data's SKS
                    jenis: courseDetails.jenis || historyItem.jenis, // Prefer static data's type
                    tingkat: courseDetails.semester || historyItem.tingkat, // Prefer static data's semester for tingkat
                    // 'indeks' and 'tahunAjaran' will come from historyItem
                };
            } else {
                // If not found in static data, use the history item as is from the API
                return historyItem;
            }
        });

        setMergedCourseHistory(merged);
    }, [selectedStudent, studentCourseHistory, staticAvailableCoursesData]); // Re-run when studentCourseHistory changes

    // ... (rest of your handleClassChange, handleStudentChange, etc. functions remain the same)
    const handleClassChange = (e) => {
        setSelectedClass(e.target.value);
        setSelectedStudent('');
        setRecommendedCourses([]);
        setSksLimitExceeded(false);
    };

    const handleStudentChange = (e) => {
        setSelectedStudent(e.target.value); // This triggers the course history fetch
        setRecommendedCourses([]);
        setSksLimitExceeded(false);
    };

    const handleSemesterChange = (e) => {
        setSelectedSemester(e.target.value);
    };

    const addCourse = (course) => {
        const newTotalSKS = totalRecommendedSKS + course.sks;
        if (newTotalSKS > MAX_SKS) {
            setSksLimitExceeded(true);
            return;
        }
        setAvailableCourses((prevCourses) =>
            prevCourses.filter((c) => c.id !== course.id)
        );
        setRecommendedCourses((prevCourses) => [...prevCourses, course]);
        setSksLimitExceeded(false);
    };

    const removeCourse = (course) => {
        setRecommendedCourses((prevCourses) =>
            prevCourses.filter((c) => c.id !== course.id)
        );
        setAvailableCourses((prevCourses) => [...prevCourses, course]);
        setSksLimitExceeded(false);
    };

    const resetAvailableCourses = () => {
        setAvailableCourses([...staticAvailableCoursesData]);
        setRecommendedCourses([]);
        setSksLimitExceeded(false);
    };

    const sendRecommendations = () => {
        if (!selectedStudent) {
            toast.warn('Pilih mahasiswa terlebih dahulu!');
            return;
        }
        if (recommendedCourses.length === 0) {
            toast.warn('Tambahkan mata kuliah rekomendasi terlebih dahulu');
            return;
        }
        toast.info(`Backend haven't been developed, Comming out soon.`);
        resetAvailableCourses();
    };

    const wouldExceedSKSLimit = useCallback(
        (courseSKS) => {
            return totalRecommendedSKS + courseSKS > MAX_SKS;
        },
        [totalRecommendedSKS, MAX_SKS]
    );

    const filteredAvailableCourses = useMemo(() => {
        if (!selectedSemester) {
            return availableCourses;
        }
        return availableCourses.filter(
            (course) => course.semester === selectedSemester
        );
    }, [availableCourses, selectedSemester]);

    // ... (rest of your component's JSX)

    return (
        <div className="p-6 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Rekomendasi Mata Kuliah</h1>

            {/* Display loading for initial data fetch */}
            {isLoading && (
                <div className="text-center p-8">
                    <p className="text-gray-600 text-lg">
                        Memuat data kelas dan mahasiswa...
                    </p>
                    {/* You can add a spinner here */}
                </div>
            )}

            {/* Selection Controls - Now hierarchical (Show only after initial load) */}
            {!isLoading && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow">
                    {/* ... (select class, select student - no changes needed here) ... */}
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
            )}

            {/* Show content only if a student is selected AND initial data has loaded */}
            {!isLoading && selectedStudent && (
                <div ref={componentRef}>
                    {/* Course History */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">
                            Riwayat Mata Kuliah
                        </h2>
                        {isLoadingHistory ? (
                            <p className="text-gray-500 italic">
                                Memuat riwayat mata kuliah...
                            </p>
                        ) : mergedCourseHistory.length > 0 ? (
                            // Tabel riwayat MK
                            <div className="overflow-x-auto border rounded-lg shadow-sm max-h-[400px] overflow-y-auto">
                                <table className="w-full border-collapse bg-white">
                                    {/* ... (thead remains the same) ... */}
                                    <thead className="sticky top-0 z-10 ">
                                        <tr className="bg-[#951A22] text-white">
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
                                            </th>{' '}
                                            {/* This is course.tingkat */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mergedCourseHistory.map((course) => {
                                            // Determine row color based on grade and course type
                                            let gradeColor = '';
                                            if (course.indeks === 'A')
                                                gradeColor = 'bg-green-100';
                                            else if (course.indeks === 'E')
                                                gradeColor = 'bg-red-100';
                                            else if (
                                                course.indeks === 'D' &&
                                                course.jenis === 'Peminatan'
                                            )
                                                gradeColor = 'bg-orange-100';

                                            return (
                                                <tr
                                                    key={
                                                        course.id ||
                                                        course.kodeMataKuliah
                                                    } // Ensure a unique key
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
                                                    </td>{' '}
                                                    {/* `tingkat` from your service/merge */}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">
                                Tidak ada riwayat mata kuliah untuk mahasiswa
                                ini atau gagal memuat.
                            </p>
                        )}
                    </div>

                    {/* ... (Recommendation Section - no changes needed here for this task) ... */}
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
                                            {/* Add more semesters as needed */}
                                        </select>
                                    </div>
                                </div>

                                {sksLimitExceeded && (
                                    <div className="mb-3 p-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                        <p>
                                            Tidak dapat menambahkan mata kuliah.
                                            Batas maksimum {MAX_SKS} SKS
                                            terlampaui.
                                        </p>
                                    </div>
                                )}
                                {/* Tabel mata kuliah tersedia */}
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
                                                    .map((course) => {
                                                        const courseHistory =
                                                            studentCourseHistory.find(
                                                                (history) =>
                                                                    history.kodeMataKuliah ===
                                                                    course.kodeMataKuliah
                                                            );
                                                        let failedCourseHighlight =
                                                            '';
                                                        if (courseHistory) {
                                                            if (
                                                                courseHistory.indeks ===
                                                                'E'
                                                            ) {
                                                                failedCourseHighlight =
                                                                    'bg-red-50';
                                                            } else if (
                                                                courseHistory.indeks ===
                                                                    'D' &&
                                                                course.jenis ===
                                                                    'Peminatan'
                                                            ) {
                                                                failedCourseHighlight =
                                                                    'bg-yellow-50';
                                                            }
                                                        }
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

            {/* Show message if no student selected AND initial data has loaded */}
            {!isLoading && !selectedStudent && (
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
