import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useMemo,
} from 'react';
import { toast } from 'react-toastify';

// Import the service functions
import {
    getClassAndStudentList,
    getStudentCourseHistory,
    getAvailableCourse,
    sendRecommendedCourses,
    getLastIPSemester,
    getRecommendedMK,
} from '../../../services/dosenWali/myCourseAdvisor/myCourseAdvisorService';

// Create context
const MyCourseAdvisorContext = createContext();

// Default maximum SKS (akan diupdate berdasarkan IP mahasiswa)
const DEFAULT_MAX_SKS = 24;

export const MyCourseAdvisorProvider = ({ children }) => {
    const [classesList, setClassesList] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [targetSemester, setTargetSemester] = useState('');
    const [maxSKS, setMaxSKS] = useState(DEFAULT_MAX_SKS);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [staticAvailableCoursesData, setStaticAvailableCoursesData] =
        useState([]);
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const [studentCourseHistory, setStudentCourseHistory] = useState([]);
    const [mergedCourseHistory, setMergedCourseHistory] = useState([]);
    const [sksLimitExceeded, setSksLimitExceeded] = useState(false);
    // State getRecommendedCourse
    const [hasExistingRecommendations, setHasExistingRecommendations] =
        useState(false);
    const [isLoadingRecommendations, setIsLoadingRecommendations] =
        useState(false);

    const totalRecommendedSKS = recommendedCourses.reduce(
        (total, course) => total + course.sks,
        0
    );

    useEffect(() => {
        // ... (fungsi fetch data awal tetap sama) ...
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const classStudentResult = await getClassAndStudentList();
                if (classStudentResult.success) {
                    const formattedClasses = classStudentResult.classesList.map(
                        (className, index) => ({
                            id: `class_${index}`,
                            name: className,
                        })
                    );
                    const classNameToIdMap = {};
                    formattedClasses.forEach((cls) => {
                        classNameToIdMap[cls.name] = cls.id;
                    });
                    const formattedStudents =
                        classStudentResult.studentsList.map((student) => ({
                            id: student.id,
                            name: student.name,
                            classId: classNameToIdMap[student.class] || null,
                        }));
                    setClassesList(formattedClasses);
                    setStudentsList(formattedStudents);
                } else {
                    toast.error(
                        classStudentResult.message ||
                            'Failed to fetch class/student data'
                    );
                }
            } catch (error) {
                console.error('Error fetching class/student data:', error);
                toast.error(
                    'An error occurred while fetching class/student data'
                );
            } finally {
                setIsLoading(false);
            }
        };

        const fetchAvailableCourses = async () => {
            setIsLoadingCourses(true);
            try {
                const courseResult = await getAvailableCourse();
                if (courseResult.success) {
                    const coursesWithId = courseResult.availableCourses.map(
                        (c, i) => ({ ...c, id: c.id || `course_${i}` })
                    );
                    setAvailableCourses(coursesWithId);
                    setStaticAvailableCoursesData(coursesWithId);
                } else {
                    toast.error(
                        courseResult.message ||
                            'Failed to fetch available courses'
                    );
                }
            } catch (error) {
                console.error('Error fetching available courses:', error);
                toast.error(
                    'An error occurred while fetching available courses'
                );
            } finally {
                setIsLoadingCourses(false);
            }
        };

        fetchData();
        fetchAvailableCourses();
    }, []);

    // Fetch student-specific data (IP and Course History) when selection changes
    useEffect(() => {
        if (!selectedStudent) {
            setMaxSKS(DEFAULT_MAX_SKS);
            setStudentCourseHistory([]);
            return;
        }

        const fetchStudentIP = async () => {
            try {
                const result = await getLastIPSemester(selectedStudent);
                setMaxSKS(result.success ? result.maxSKS : DEFAULT_MAX_SKS);
                if (result.success && result.maxSKS < DEFAULT_MAX_SKS) {
                    toast.info(
                        `Batas SKS mahasiswa adalah ${result.maxSKS} karena IP semester lalu di bawah 3.00.`
                    );
                }
            } catch (error) {
                setMaxSKS(DEFAULT_MAX_SKS);
                toast.warn(
                    'Data IP tidak ditemukan, menggunakan batas SKS default (24)'
                );
            }
        };

        // =========================================================================
        // === PERUBAHAN DI SINI ===
        // =========================================================================
        const fetchCourseHistory = async () => {
            setIsLoadingHistory(true);
            try {
                const result = await getStudentCourseHistory(selectedStudent);

                if (result.success) {
                    setStudentCourseHistory(result.courseHistory || []);
                    // Tampilkan pesan peringatan dari backend jika ada
                    if (result.message) {
                        toast.warn(result.message);
                    }
                } else {
                    // Jika proses gagal total, tampilkan sebagai error
                    setStudentCourseHistory([]);
                    toast.error(
                        result.message || 'Gagal memuat riwayat mata kuliah'
                    );
                }
            } catch (error) {
                setStudentCourseHistory([]);
                toast.error(
                    'Terjadi kesalahan saat memuat riwayat mata kuliah'
                );
            } finally {
                setIsLoadingHistory(false);
            }
        };
        // =========================================================================

        fetchStudentIP();
        fetchCourseHistory();
    }, [selectedStudent]);

    // ... (semua logika dan fungsi lain tetap sama) ...
    useEffect(() => {
        // Guard clause
        if (
            !selectedStudent ||
            !targetSemester ||
            isLoadingHistory ||
            isLoadingCourses ||
            !staticAvailableCoursesData.length ||
            !studentCourseHistory
        ) {
            if (!selectedStudent || !targetSemester) {
                setRecommendedCourses([]);
                setAvailableCourses([...staticAvailableCoursesData]);
                setHasExistingRecommendations(false);
            }
            return;
        }

        const fetchAndProcessRecommendations = async () => {
            setIsLoadingRecommendations(true);

            try {
                // Cek apakah sudah ada rekomendasi existing
                const existingRec = await getRecommendedMK(
                    selectedStudent,
                    targetSemester
                );

                if (
                    existingRec.success &&
                    existingRec.recommendations.length > 0
                ) {
                    // Jika ada rekomendasi existing, gunakan itu
                    setRecommendedCourses(existingRec.recommendations);
                    setHasExistingRecommendations(true);

                    // Update availableCourses dengan menghilangkan yang sudah direkomendasikan
                    const recommendedIds = existingRec.recommendations.map(
                        (r) => r.kodeMataKuliah
                    );
                    const updatedAvailable = staticAvailableCoursesData.filter(
                        (course) => !recommendedIds.includes(course.kode_mk)
                    );
                    setAvailableCourses(updatedAvailable);

                    toast.info(
                        `Menampilkan ${existingRec.recommendations.length} rekomendasi yang sudah ada untuk semester ${targetSemester}`
                    );
                } else {
                    // Jika tidak ada, generate rekomendasi otomatis
                    setHasExistingRecommendations(false);
                    generateAutoRecommendations();
                }
            } catch (error) {
                console.error(
                    'Error fetching existing recommendations:',
                    error
                );
                // Fallback ke auto-generation jika error
                generateAutoRecommendations();
            } finally {
                setIsLoadingRecommendations(false);
            }
        };

        const generateAutoRecommendations = () => {
            // Pindahkan semua logic generateRecommendations yang sudah ada ke sini
            let recommendations = [];
            let currentSKS = 0;
            let availableForPicking = [...staticAvailableCoursesData];

            const targetSemesterInt = parseInt(targetSemester, 10);
            if (isNaN(targetSemesterInt)) return;

            const isTargetSemesterOdd = targetSemesterInt % 2 !== 0;

            // ... (rest of the auto-generation logic remains the same)

            const mapToRecommendedFormat = (course) => ({
                id: course.id,
                kodeMataKuliah: course.kode_mk,
                namaMataKuliah: course.nama_mk,
                sks: course.sks_mk,
                jenis: course.jenis_mk,
                semester_mk: course.semester_mk,
            });

            const addCourseToPlan = (course) => {
                const recCourse = mapToRecommendedFormat(course);
                if (recommendations.some((r) => r.id === recCourse.id))
                    return false;
                if (currentSKS + recCourse.sks <= maxSKS) {
                    recommendations.push(recCourse);
                    currentSKS += recCourse.sks;
                    availableForPicking = availableForPicking.filter(
                        (c) => c.id !== course.id
                    );
                    return true;
                }
                return false;
            };

            // Logic to use course names as the key for matching
            const courseAttemptsByName = new Map();
            studentCourseHistory.forEach((h) => {
                const name = h.namaMataKuliah?.trim();
                if (!name) return;
                if (!courseAttemptsByName.has(name))
                    courseAttemptsByName.set(name, []);
                courseAttemptsByName.get(name).push(h);
            });

            const retakeCourseNames = new Set();
            const passedCourseNames = new Set();
            const allPassingGrades = ['A', 'B', 'C', 'D', 'AB', 'BC'];

            courseAttemptsByName.forEach((attempts, name) => {
                attempts.sort(
                    (a, b) =>
                        (parseInt(b.semester, 10) || 0) -
                        (parseInt(a.semester, 10) || 0)
                );
                const lastAttempt = attempts[0];
                const lastIndeks = lastAttempt?.indeks?.trim().toUpperCase();

                if (['E', 'T'].includes(lastIndeks)) {
                    retakeCourseNames.add(name);
                } else if (allPassingGrades.includes(lastIndeks)) {
                    passedCourseNames.add(name);
                }
            });

            // PRIORITY 1: Add courses that must be retaken
            retakeCourseNames.forEach((name) => {
                const courseData = staticAvailableCoursesData.find(
                    (c) => c.nama_mk?.trim() === name
                );
                if (courseData) {
                    const courseSemesterInt = parseInt(
                        courseData.semester_mk,
                        10
                    );
                    if (isNaN(courseSemesterInt)) return;

                    const isSemesterNotTooHigh =
                        courseSemesterInt <= targetSemesterInt;
                    const isSemesterTypeMatch =
                        (courseSemesterInt % 2 !== 0) === isTargetSemesterOdd;

                    if (isSemesterNotTooHigh && isSemesterTypeMatch) {
                        addCourseToPlan(courseData);
                    }
                }
            });

            // PRIORITY 2: Fill remaining SKS with new mandatory courses
            const allTakenNames = new Set([
                ...passedCourseNames,
                ...retakeCourseNames,
            ]);

            const newMandatoryCourses = staticAvailableCoursesData
                .filter((course) => {
                    const courseName = course.nama_mk?.trim();
                    if (!courseName) return false;

                    const courseSemesterInt = parseInt(course.semester_mk, 10);
                    if (isNaN(courseSemesterInt)) return false;

                    const isMandatory = course.jenis_mk === 'WAJIB PRODI';
                    const isNew = !allTakenNames.has(courseName);

                    const isSemesterNotTooHigh =
                        courseSemesterInt <= targetSemesterInt;
                    const isSemesterTypeMatch =
                        (courseSemesterInt % 2 !== 0) === isTargetSemesterOdd;

                    return (
                        isMandatory &&
                        isNew &&
                        isSemesterTypeMatch &&
                        isSemesterNotTooHigh
                    );
                })
                .sort(
                    (a, b) =>
                        parseInt(a.semester_mk, 10) -
                        parseInt(b.semester_mk, 10)
                );

            newMandatoryCourses.forEach((course) => {
                addCourseToPlan(course);
            });

            setRecommendedCourses(recommendations);
            setAvailableCourses(availableForPicking);

            if (recommendations.length > 0) {
                toast.success('Rekomendasi mata kuliah otomatis telah dibuat.');
            } else {
                toast.info(
                    'Tidak ada rekomendasi otomatis yang dapat dibuat sesuai aturan.'
                );
            }
        };

        fetchAndProcessRecommendations();
    }, [
        selectedStudent,
        targetSemester,
        studentCourseHistory,
        maxSKS,
        isLoadingHistory,
        isLoadingCourses,
    ]);

    useEffect(() => {
        if (!studentCourseHistory || studentCourseHistory.length === 0) {
            setMergedCourseHistory([]);
            return;
        }
        const merged = studentCourseHistory.map((historyItem) => {
            const details = staticAvailableCoursesData.find(
                (c) => c.nama_mk === historyItem.namaMataKuliah
            );
            return details
                ? {
                      ...historyItem,
                      id: historyItem.id || `hist_${details.id}`,
                      kodeMataKuliah: historyItem.kodeMataKuliah,
                      namaMataKuliah: details.nama_mk,
                      sks: details.sks_mk,
                      jenis: details.jenis_mk,
                  }
                : historyItem;
        });
        setMergedCourseHistory(merged);
    }, [studentCourseHistory, staticAvailableCoursesData]);

    const filteredStudents = useMemo(() => {
        return selectedClass
            ? studentsList.filter((s) => s.classId === selectedClass)
            : [];
    }, [selectedClass, studentsList]);

    const resetFormStates = () => {
        setSelectedStudent('');
        setTargetSemester('');
        setRecommendedCourses([]);
        setAvailableCourses([...staticAvailableCoursesData]);
        setMaxSKS(DEFAULT_MAX_SKS);
        setSksLimitExceeded(false);
    };
    const handleClassChange = (e) => {
        setSelectedClass(e.target.value);
        resetFormStates();
    };
    const handleStudentChange = (e) => {
        setSelectedStudent(e.target.value);
        setTargetSemester('');
        setRecommendedCourses([]);
        setAvailableCourses([...staticAvailableCoursesData]);
        setSksLimitExceeded(false);
    };
    const handleTargetSemesterChange = (e) => {
        setTargetSemester(e.target.value);
    };
    const handleSemesterChange = (e) => setSelectedSemester(e.target.value);

    const addCourse = (course) => {
        if (wouldExceedSKSLimit(course.sks)) {
            setSksLimitExceeded(true);
            toast.error(
                `Tidak dapat menambahkan. Batas ${maxSKS} SKS akan terlampaui.`
            );
            return;
        }
        setAvailableCourses((prev) => prev.filter((c) => c.id !== course.id));
        setRecommendedCourses((prev) => [...prev, course]);
        setSksLimitExceeded(false);
    };

    const removeCourse = (course) => {
        setRecommendedCourses((prev) => prev.filter((c) => c.id !== course.id));
        const courseToAddBack = staticAvailableCoursesData.find(
            (c) => c.id === course.id
        );
        if (
            courseToAddBack &&
            !availableCourses.some((c) => c.id === courseToAddBack.id)
        ) {
            setAvailableCourses((prev) => [...prev, courseToAddBack]);
        }
        setSksLimitExceeded(false);
    };

    const resetAvailableCourses = () => {
        toast.info(
            'Perubahan manual di-reset. Pilih ulang semester tujuan untuk menjalankan ulang rekomendasi otomatis.'
        );
        setRecommendedCourses([]);
        setAvailableCourses([...staticAvailableCoursesData]);
        setSksLimitExceeded(false);
    };

    const sendRecommendations = async () => {
        if (
            !selectedStudent ||
            !targetSemester ||
            recommendedCourses.length === 0
        ) {
            toast.warn(
                'Pastikan mahasiswa, semester tujuan, dan rekomendasi sudah terisi.'
            );
            return;
        }
        if (totalRecommendedSKS > maxSKS) {
            toast.error(
                `Total SKS (${totalRecommendedSKS}) melebihi batas (${maxSKS}).`
            );
            return;
        }
        const toastId = toast.loading('Mengirim rekomendasi...');
        try {
            const result = await sendRecommendedCourses(
                selectedStudent,
                recommendedCourses,
                targetSemester
            );
            console.log(recommendedCourses);
            if (result.success) {
                toast.update(toastId, {
                    render: hasExistingRecommendations
                        ? 'Rekomendasi berhasil diperbarui!'
                        : 'Rekomendasi berhasil dikirim!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                });
                setSelectedClass('');
                resetFormStates();
                setHasExistingRecommendations(false);
            } else {
                toast.update(toastId, {
                    render: result.message || 'Gagal mengirim rekomendasi',
                    type: 'error',
                    isLoading: false,
                    autoClose: 5000,
                });
            }
        } catch (error) {
            toast.dismiss(toastId);
            toast.error('Terjadi kesalahan saat mengirim rekomendasi');
        }
    };

    const wouldExceedSKSLimit = (courseSKS) =>
        totalRecommendedSKS + courseSKS > maxSKS;

    const filteredAvailableCourses = useMemo(() => {
        if (!selectedSemester) return availableCourses;
        return availableCourses.filter(
            (c) => String(c.semester_mk) === String(selectedSemester)
        );
    }, [availableCourses, selectedSemester]);

    const contextValue = {
        classesList,
        studentsList,
        isLoading,
        isLoadingHistory,
        isLoadingCourses,
        selectedClass,
        selectedStudent,
        selectedSemester,
        targetSemester,
        maxSKS,
        availableCourses,
        recommendedCourses,
        studentCourseHistory,
        mergedCourseHistory,
        sksLimitExceeded,
        totalRecommendedSKS,
        filteredStudents,
        filteredAvailableCourses,
        handleClassChange,
        handleStudentChange,
        handleSemesterChange,
        handleTargetSemesterChange,
        addCourse,
        removeCourse,
        resetAvailableCourses,
        sendRecommendations,
        wouldExceedSKSLimit,
        hasExistingRecommendations,
        isLoadingRecommendations,
    };

    return (
        <MyCourseAdvisorContext.Provider value={contextValue}>
            {children}
        </MyCourseAdvisorContext.Provider>
    );
};

export function useMyCourseAdvisor() {
    const context = useContext(MyCourseAdvisorContext);
    if (!context) {
        throw new Error(
            'useMyCourseAdvisor must be used within a MyCourseAdvisorProvider'
        );
    }
    return context;
}
