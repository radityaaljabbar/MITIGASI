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
        if (
            !selectedStudent || !targetSemester || isLoadingHistory || isLoadingCourses ||
            !staticAvailableCoursesData.length || !studentCourseHistory
        ) {
            if (!selectedStudent || !targetSemester) {
                setRecommendedCourses([]);
                setAvailableCourses([...staticAvailableCoursesData]);
                setHasExistingRecommendations(false);
            }
            return;
        }
        
        // --- PRE-PROCESSING: Create efficient look-up maps ---
        const courseMap = new Map(staticAvailableCoursesData.map(c => [c.kode_mk, c]));
        const equivalenceMap = new Map();
        staticAvailableCoursesData.forEach(c => {
            if (c.ekivalensi) {
                // Assuming ekivalensi is a single code, not an array
                equivalenceMap.set(c.ekivalensi, c.kode_mk);
            }
        });

        // Function to find the current course code from a history code
        const getCurrentCode = (historyCode) => {
            return equivalenceMap.get(historyCode) || historyCode;
        };
        
        const fetchAndProcessRecommendations = async () => {
            setIsLoadingRecommendations(true);
            try {
                const existingRec = await getRecommendedMK(selectedStudent, targetSemester);
                if (existingRec.success && existingRec.recommendations.length > 0) {
                    const recsFromStaticData = existingRec.recommendations
                        .map(rec => courseMap.get(rec.kodeMataKuliah))
                        .filter(Boolean) // Filter out any courses that might no longer exist
                        .map(course => ({
                            id: course.id,
                            kodeMataKuliah: course.kode_mk,
                            namaMataKuliah: course.nama_mk,
                            sks: course.sks_mk,
                            jenis: course.jenis_mk,
                            semester_mk: course.semester_mk,
                        }));
                    
                    setRecommendedCourses(recsFromStaticData);
                    setHasExistingRecommendations(true);

                    const recommendedIds = new Set(recsFromStaticData.map(r => r.kodeMataKuliah));
                    const updatedAvailable = staticAvailableCoursesData.filter(
                        course => !recommendedIds.has(course.kode_mk)
                    );
                    setAvailableCourses(updatedAvailable);
                    toast.info(`Menampilkan ${recsFromStaticData.length} rekomendasi yang sudah ada.`);
                } else {
                    setHasExistingRecommendations(false);
                    generateAutoRecommendations();
                }
            } catch (error) {
                console.error('Error fetching existing recommendations:', error);
                generateAutoRecommendations();
            } finally {
                setIsLoadingRecommendations(false);
            }
        };

        const generateAutoRecommendations = () => {
            let recommendations = [];
            let currentSKS = 0;
            let availableForPicking = [...staticAvailableCoursesData];

            const targetSemesterInt = parseInt(targetSemester, 10);
            if (isNaN(targetSemesterInt)) return;

            const isTargetSemesterOdd = targetSemesterInt % 2 !== 0;

            const addCourseToPlan = (course) => {
                if (recommendations.some((r) => r.id === course.id)) return false;
                if (currentSKS + course.sks_mk <= maxSKS) {
                    recommendations.push({
                        id: course.id,
                        kodeMataKuliah: course.kode_mk,
                        namaMataKuliah: course.nama_mk,
                        sks: course.sks_mk,
                        jenis: course.jenis_mk,
                        semester_mk: course.semester_mk,
                        jenis_semester: course.jenis_semester,
                        tahun_ajaran: course.tahun_ajaran
                    });
                    currentSKS += course.sks_mk;
                    availableForPicking = availableForPicking.filter((c) => c.id !== course.id);
                    return true;
                }
                return false;
            };

            const passedCodes = new Set();
            const failedCodes = new Set();
            const allPassingGrades = ['A', 'B', 'C', 'AB', 'BC']; // Grade 'D' is now conditional

            // First pass: find all courses that have at least one passing grade
            studentCourseHistory.forEach((h) => {
                const currentCode = getCurrentCode(h.kodeMataKuliah);
                const indeks = h.indeks?.trim().toUpperCase();
                const semesterTaken = parseInt(h.semester, 10);

                // A, B, C, AB, BC always count as a pass.
                if (allPassingGrades.includes(indeks)) {
                    passedCodes.add(currentCode);
                } 
                // Grade 'D' is a pass ONLY if taken in semester 6 or below.
                else if (indeks === 'D' && !isNaN(semesterTaken) && semesterTaken < 7) {
                    passedCodes.add(currentCode);
                }
            });

            // Second pass: find all failed courses, but only add them if they were never passed
            studentCourseHistory.forEach((h) => {
                const currentCode = getCurrentCode(h.kodeMataKuliah);
                const indeks = h.indeks?.trim().toUpperCase();
                const semesterTaken = parseInt(h.semester, 10);

                let isFailure = false;

                // E or T is always a failure.
                if (['E', 'T'].includes(indeks)) {
                    isFailure = true;
                } 
                // Grade 'D' is a failure if taken in semester 7 or above.
                else if (indeks === 'D' && !isNaN(semesterTaken) && semesterTaken >= 7) {
                    isFailure = true;
                }

                if (isFailure) {
                    // Only consider it a "retake" if it's NOT in the passed set
                    if (!passedCodes.has(currentCode)) {
                        failedCodes.add(currentCode);
                    }
                }
            });

            const retakeCodes = failedCodes; // Rename for clarity in the next steps

            // =========================================================================

            // PRIORITY 1: Add courses that must be retaken.
            retakeCodes.forEach((code) => {
                const courseData = courseMap.get(code);
                if (courseData) {
                    const courseSemesterInt = parseInt(courseData.semester_mk, 10);
                    if (isNaN(courseSemesterInt)) return;
                    
                    const isSemesterNotTooHigh = courseSemesterInt <= targetSemesterInt;
                    const isSemesterTypeMatch = (courseSemesterInt % 2 !== 0) === isTargetSemesterOdd;

                    if (isSemesterNotTooHigh && isSemesterTypeMatch) {
                        addCourseToPlan(courseData);
                    }
                }
            });

            // PRIORITY 2: Fill remaining SKS with new mandatory courses.
            const allTakenCodes = new Set([...passedCodes, ...retakeCodes]);

            const newMandatoryCourses = staticAvailableCoursesData
                .filter((course) => {
                    const courseSemesterInt = parseInt(course.semester_mk, 10);
                    if (isNaN(courseSemesterInt)) return false;

                    const isMandatory = course.jenis_mk === 'WAJIB PRODI';
                    const isNew = !allTakenCodes.has(course.kode_mk);
                    
                    const isSemesterNotTooHigh = courseSemesterInt <= targetSemesterInt;
                    const isSemesterTypeMatch = (courseSemesterInt % 2 !== 0) === isTargetSemesterOdd;

                    return isMandatory && isNew && isSemesterTypeMatch && isSemesterNotTooHigh;
                })
                .sort((a, b) => parseInt(a.semester_mk, 10) - parseInt(b.semester_mk, 10));

            newMandatoryCourses.forEach((course) => {
                addCourseToPlan(course);
            });

            setRecommendedCourses(recommendations);
            setAvailableCourses(availableForPicking);

            if (recommendations.length > 0) {
                toast.success('Rekomendasi mata kuliah otomatis telah dibuat.');
            } else {
                toast.info('Tidak ada rekomendasi otomatis yang dapat dibuat sesuai aturan.');
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
        staticAvailableCoursesData,
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
                      ekivalensi: details.ekivalensi
                  }
                : historyItem;
        });

        console.log(merged)
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
