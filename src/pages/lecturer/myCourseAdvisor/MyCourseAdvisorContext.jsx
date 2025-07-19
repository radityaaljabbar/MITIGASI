import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useMemo,
} from 'react';
import { toast } from 'react-toastify';

// Mengimpor semua fungsi layanan (service) yang dibutuhkan dari satu file
// Importing all necessary service functions from a single file
import {
    getClassAndStudentList,
    getStudentCourseHistory,
    getAvailableCourse,
    sendRecommendedCourses,
    getLastIPSemester,
    getRecommendedMK,
    getStudentNIMSKS,
} from '../../../services/dosenWali/myCourseAdvisor/myCourseAdvisorService';

// Membuat React Context untuk berbagi state dan fungsi antar komponen
// Creating a React Context to share state and functions between components
const MyCourseAdvisorContext = createContext();

// Nilai default untuk SKS maksimum, akan diperbarui berdasarkan IP mahasiswa
// Default value for maximum SKS, will be updated based on the student's GPA
const DEFAULT_MAX_SKS = 24;

/**
 * Provider untuk MyCourseAdvisorContext.
 * Komponen ini akan membungkus bagian dari web yang memerlukan akses ke state rekomendasi mata kuliah.
 * Provider for the MyCourseAdvisorContext.
 * This component will wrap parts of the application that need access to the course recommendation state.
 */
export const MyCourseAdvisorProvider = ({ children }) => {
    // === DEKLARASI STATE ===
    // === STATE DECLARATIONS ===
    const [classesList, setClassesList] = useState([]); // Daftar kelas
    const [studentsList, setStudentsList] = useState([]); // Daftar semua mahasiswa
    const [isLoading, setIsLoading] = useState(true); // Status loading data awal (kelas, mahasiswa, MK)
    const [isLoadingHistory, setIsLoadingHistory] = useState(false); // Status loading riwayat MK mahasiswa
    const [isLoadingCourses, setIsLoadingCourses] = useState(false); // Status loading MK tersedia (tidak terpakai saat ini)
    const [selectedClass, setSelectedClass] = useState(''); // Kelas yang dipilih di dropdown
    const [selectedStudent, setSelectedStudent] = useState(''); // Mahasiswa yang dipilih di dropdown
    const [selectedSemester, setSelectedSemester] = useState(''); // Filter semester untuk MK tersedia
    const [targetSemester, setTargetSemester] = useState(''); // Semester tujuan untuk rekomendasi
    const [maxSKS, setMaxSKS] = useState(DEFAULT_MAX_SKS); // Batas SKS yang boleh diambil
    const [availableCourses, setAvailableCourses] = useState([]); // Daftar MK yang tersedia untuk direkomendasikan
    const [staticAvailableCoursesData, setStaticAvailableCoursesData] = useState([]); // Salinan asli data MK tersedia
    const [recommendedCourses, setRecommendedCourses] = useState([]); // Daftar MK yang direkomendasikan
    const [studentCourseHistory, setStudentCourseHistory] = useState([]); // Riwayat MK mahasiswa dari API
    const [mergedCourseHistory, setMergedCourseHistory] = useState([]); // Riwayat MK yang sudah digabung dengan detail MK
    const [sksLimitExceeded, setSksLimitExceeded] = useState(false); // Flag jika SKS terlampaui
    const [hasExistingRecommendations, setHasExistingRecommendations] = useState(false); // Flag jika sudah ada rekomendasi di DB
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false); // Status loading saat mengambil/membuat rekomendasi
    const [studentSKSData, setStudentSKSData] = useState(null); // Data SKS dan NIM mahasiswa
    const [initialDataFetched, setInitialDataFetched] = useState(false); // Flag untuk memastikan data awal hanya di-fetch sekali

    // Menghitung total SKS dari mata kuliah yang direkomendasikan
    // Calculating the total SKS from the recommended courses
    const [toastShown, setToastShown] = useState(false);

    const totalRecommendedSKS = recommendedCourses.reduce(
        (total, course) => total + course.sks,
        0
    );

    // Effect untuk mengambil data awal (kelas, mahasiswa, daftar MK) saat komponen pertama kali dimuat
    // Effect to fetch initial data (classes, students, course list) when the component first mounts
    useEffect(() => {
        // Mencegah eksekusi berulang jika data sudah diambil
        // Prevents re-execution if data has already been fetched
        if (initialDataFetched) return;

        const fetchInitialData = async () => {
            setIsLoading(true);

            try {
                // Mengambil data kelas/mahasiswa dan data MK secara paralel untuk efisiensi
                // Fetching class/student data and course data in parallel for efficiency
                const [classStudentResult, courseResult] = await Promise.all([
                    getClassAndStudentList(),
                    getAvailableCourse(),
                ]);

                // Memproses hasil data kelas dan mahasiswa
                // Processing the result of class and student data
                if (classStudentResult.success) {
                    const classesList = classStudentResult.classesList || [];
                    const studentsList = classStudentResult.studentsList || [];

                    // Memformat daftar kelas
                    const formattedClasses = classesList.map(
                        (className, index) => ({
                            id: `class_${index}`,
                            name: className,
                        })
                    );

                    // Membuat pemetaan nama kelas ke ID untuk mahasiswa
                    const classNameToIdMap = {};
                    formattedClasses.forEach((cls) => {
                        classNameToIdMap[cls.name] = cls.id;
                    });

                    // Memformat daftar mahasiswa
                    const formattedStudents = studentsList.map((student) => ({
                        id: student.id,
                        name: student.name,
                        classId: classNameToIdMap[student.class] || null,
                        peminatan: student.peminatan, // Menyimpan peminatan mahasiswa
                    }));

                    setClassesList(formattedClasses);
                    setStudentsList(formattedStudents);

                } else {
                    setClassesList([]);
                    setStudentsList([]);
                    toast.error(
                        classStudentResult.message ||
                            'Failed to fetch class/student data'
                    );
                }

                // Memproses hasil data mata kuliah
                // Processing the result of course data
                if (courseResult.success) {
                    const availableCourses =
                        courseResult.availableCourses || [];
                    const coursesWithId = availableCourses.map((c, i) => ({
                        ...c,
                        id: c.id || `course_${i}`,
                    }));
                    setAvailableCourses(coursesWithId);
                    setStaticAvailableCoursesData(coursesWithId); // Simpan salinan asli
                } else {
                    setAvailableCourses([]);
                    setStaticAvailableCoursesData([]);
                    toast.error(
                        courseResult.message ||
                            'Matakuliah Tidak Tersedia'
                    );
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
                toast.error('An error occurred while fetching data');
                // Reset state jika terjadi error
                setClassesList([]);
                setStudentsList([]);
                setAvailableCourses([]);
                setStaticAvailableCoursesData([]);
            } finally {
                setIsLoading(false);
                setInitialDataFetched(true); // Tandai bahwa data awal sudah diambil
            }
        };

        fetchInitialData();
    }, [initialDataFetched]); // Only depend on the flag / Hanya bergantung pada flag `initialDataFetched`

    // Separate terpisah untuk menampilkan toast info setelah data dimuat
    // Separate effect for showing an info toast after data is loaded
    useEffect(() => {
        // Hanya tampilkan toast jika data sudah dimuat, tidak sedang loading, dan toast belum pernah ditampilkan
        // Only show the toast if data is loaded, not currently loading, and the toast hasn't been shown yet
        if (!isLoading && initialDataFetched && !toastShown) {
            if (classesList.length === 0 && studentsList.length === 0) {
                toast.info(
                    'Tidak ada data kelas dan mahasiswa yang ditemukan untuk dosen ini.'
                );
                setToastShown(true);
            } else if (classesList.length === 0) {
                toast.info(
                    'Tidak ada data kelas yang ditemukan untuk dosen ini.'
                );
                setToastShown(true);
            } else if (studentsList.length === 0) {
                toast.info(
                    'Tidak ada data mahasiswa yang ditemukan untuk dosen ini.'
                );
                setToastShown(true);
            }
        }
    }, [
        isLoading,
        initialDataFetched,
        classesList.length,
        studentsList.length,
        toastShown,
    ]);

    // Efek untuk mengambil data spesifik mahasiswa (IP, riwayat, SKS) saat mahasiswa dipilih
    // Effect to fetch specific student data (GPA, history, SKS) when a student is selected
    useEffect(() => {
        if (!selectedStudent) {
            // Reset state jika tidak ada mahasiswa yang dipilih
            setMaxSKS(DEFAULT_MAX_SKS);
            setStudentCourseHistory([]);
            setStudentSKSData(null);
            return;
        }

        const fetchStudentData = async () => {
            // Mengambil semua data mahasiswa secara paralel
            // Fetching all student data in parallel
            const [ipResult, historyResult, sksResult] =
                await Promise.allSettled([
                    getLastIPSemester(selectedStudent),
                    getStudentCourseHistory(selectedStudent),
                    getStudentNIMSKS(selectedStudent),
                ]);

            // Memproses hasil IP untuk menentukan batas SKS
            // Processing the GPA result to determine the SKS limit
            if (ipResult.status === 'fulfilled' && ipResult.value.success) {
                setMaxSKS(ipResult.value.maxSKS);
                if (ipResult.value.maxSKS < DEFAULT_MAX_SKS) {
                    toast.info(
                        `Batas SKS mahasiswa adalah ${ipResult.value.maxSKS} karena IP semester lalu di bawah 3.00.`
                    );
                }
            } else {
                setMaxSKS(DEFAULT_MAX_SKS);
                toast.warn(
                    'Data IP tidak ditemukan, menggunakan batas SKS default (24)'
                );
            }

            // Memproses hasil riwayat mata kuliah
            // Processing the course history result
            setIsLoadingHistory(true);
            if (
                historyResult.status === 'fulfilled' &&
                historyResult.value.success
            ) {
                setStudentCourseHistory(
                    historyResult.value.courseHistory || []
                );
                if (historyResult.value.message) {
                    toast.warn(historyResult.value.message);
                }
            } else {
                setStudentCourseHistory([]);
                if (historyResult.status === 'rejected') {
                    toast.error('Gagal memuat riwayat mata kuliah');
                }
            }
            setIsLoadingHistory(false);

            // Memproses hasil data SKS
            // Processing the SKS data result
            if (sksResult.status === 'fulfilled' && sksResult.value.success) {
                // Find student details from the main list to get their specialization
                const studentInfo = studentsList.find(
                    (s) => s.id === selectedStudent
                );

                // Menggabungkan data SKS dengan info peminatan
                // Combining SKS data with specialization info
                const combinedData = {
                    ...sksResult.value.studentData, // Contains nim and sksLulus
                    peminatan: studentInfo ? studentInfo.peminatan : null,
                };

                setStudentSKSData(combinedData);
            } else {
                setStudentSKSData(null);
                // Don't show error toast as this is supplementary info
            }
        };

        fetchStudentData();
    }, [selectedStudent, studentsList]);

    // Main effect untuk memproses dan membuat rekomendasi mata kuliah
    // Main effect for processing and creating course recommendations
    useEffect(() => {
        // Keluar lebih awal jika kondisi prasyarat tidak terpenuhi
        // Early return if prerequisite conditions are not met
        if (
            !selectedStudent ||
            !targetSemester ||
            isLoadingHistory ||
            isLoadingCourses ||
            !staticAvailableCoursesData ||
            staticAvailableCoursesData.length === 0 ||
            !Array.isArray(studentCourseHistory)
        ) {
            if (!selectedStudent || !targetSemester) {
                setRecommendedCourses([]);
                setAvailableCourses([...(staticAvailableCoursesData || [])]);
                setHasExistingRecommendations(false);
            }
            return;
        }

        const courseMap = new Map(
            staticAvailableCoursesData.map((c) => [c.kode_mk, c])
        );
        const equivalenceMap = new Map();
        staticAvailableCoursesData.forEach((c) => {
            if (c.ekivalensi) {
                equivalenceMap.set(c.ekivalensi, c.kode_mk);
            }
        });

        // Fungsi untuk mencari kode MK terbaru dari kode MK lama (ekivalensi)
        // Function to find the latest course code from an old (equivalent) course code
        const getCurrentCode = (historyCode) => {
            return equivalenceMap.get(historyCode) || historyCode;
        };

        /**
         * Mengambil rekomendasi yang sudah ada dari DB atau membuat rekomendasi otomatis.
         * Fetches existing recommendations from the DB or generates automatic recommendations.
         */
        const fetchAndProcessRecommendations = async () => {
            setIsLoadingRecommendations(true);
            try {
                // Cek apakah ada rekomendasi yang sudah disimpan di DB
                // Check if there are recommendations already saved in the DB
                const existingRec = await getRecommendedMK(
                    selectedStudent,
                    targetSemester
                );
                if (
                    existingRec.success &&
                    existingRec.recommendations &&
                    existingRec.recommendations.length > 0
                ) {
                    // Jika ada, gunakan rekomendasi tersebut
                    // If yes, use those recommendations
                    const recsFromStaticData = existingRec.recommendations
                        .map((rec) => courseMap.get(rec.kodeMataKuliah))
                        .filter(Boolean) // Filter out any courses that might no longer exist
                        .map((course) => ({
                            id: course.id,
                            kodeMataKuliah: course.kode_mk,
                            namaMataKuliah: course.nama_mk,
                            sks: course.sks_mk,
                            jenis: course.jenis_mk,
                            semester_mk: course.semester_mk,
                        }));

                    setRecommendedCourses(recsFromStaticData);
                    setHasExistingRecommendations(true);

                    // Update daftar MK tersedia dengan menghapus yang sudah direkomendasikan
                    const recommendedIds = new Set(
                        recsFromStaticData.map((r) => r.kodeMataKuliah)
                    );
                    const updatedAvailable = staticAvailableCoursesData.filter(
                        (course) => !recommendedIds.has(course.kode_mk)
                    );
                    setAvailableCourses(updatedAvailable);
                    toast.info(
                        `Menampilkan ${recsFromStaticData.length} rekomendasi yang sudah ada.`
                    );
                } else {
                    // Jika tidak ada, buat rekomendasi baru secara otomatis
                    // If not, generate new recommendations automatically
                    setHasExistingRecommendations(false);
                    generateAutoRecommendations();
                }
            } catch (error) {
                console.error(
                    'Error fetching existing recommendations:',
                    error
                );
                generateAutoRecommendations(); // Fallback ke pembuatan otomatis jika fetch gagal
            } finally {
                setIsLoadingRecommendations(false);
            }
        };

        /**
         * Logika untuk membuat rekomendasi mata kuliah secara otomatis berdasarkan aturan.
         * Logic to automatically generate course recommendations based on rules.
         */
        const generateAutoRecommendations = () => {
            // Get student details to find their specialization
            const studentDetails = studentsList.find(
                (s) => s.id === selectedStudent
            );
            const studentPeminatan = studentDetails
                ? studentDetails.peminatan
                : null;

            let recommendations = [];
            let currentSKS = 0;
            let availableForPicking = [...staticAvailableCoursesData];
            let newlyRecommendedElectiveCount = 0;

            const targetSemesterInt = parseInt(targetSemester, 10);
            if (isNaN(targetSemesterInt)) return;

            const isTargetSemesterOdd = targetSemesterInt % 2 !== 0;

            const addCourseToPlan = (course) => {
                // Check by course code (kode_mk) to prevent duplicates
                if (
                    recommendations.some(
                        (r) => r.kodeMataKuliah === course.kode_mk
                    )
                ) {
                    return false; // Already in the list, drop this one
                }

                if (currentSKS + course.sks_mk <= maxSKS) {
                    recommendations.push({
                        id: course.id,
                        kodeMataKuliah: course.kode_mk,
                        namaMataKuliah: course.nama_mk,
                        sks: course.sks_mk,
                        jenis: course.jenis_mk,
                        semester_mk: course.semester_mk,
                        jenis_semester: course.jenis_semester,
                        tahun_ajaran: course.tahun_ajaran,
                    });
                    currentSKS += course.sks_mk;
                    availableForPicking = availableForPicking.filter(
                        (c) => c.id !== course.id
                    );
                    return true;
                }
                return false;
            };

            const passedCodes = new Set();
            const failedCodes = new Set();
            const allPassingGrades = ['A', 'B', 'C', 'AB', 'BC'];

            // First pass: find all courses that have at least one passing grade
            if (
                Array.isArray(studentCourseHistory) &&
                studentCourseHistory.length > 0
            ) {
                studentCourseHistory.forEach((h) => {
                    if (!h || !h.kodeMataKuliah) return; // Skip invalid entries

                    const currentCode = getCurrentCode(h.kodeMataKuliah);
                    const indeks = h.indeks?.trim().toUpperCase();
                    const semesterTaken = parseInt(h.semester, 10);

                    // A, B, C, AB, BC always count as a pass.
                    if (allPassingGrades.includes(indeks)) {
                        passedCodes.add(currentCode);
                    }
                    // Grade 'D' is a pass ONLY if taken in semester 6 or below.
                    else if (
                        indeks === 'D' &&
                        !isNaN(semesterTaken) &&
                        semesterTaken < 7
                    ) {
                        passedCodes.add(currentCode);
                    }
                });
            }

            // Second pass: find all failed courses, but only add them if they were never passed
            if (
                Array.isArray(studentCourseHistory) &&
                studentCourseHistory.length > 0
            ) {
                studentCourseHistory.forEach((h) => {
                    if (!h || !h.kodeMataKuliah) return; // Skip invalid entries

                    const currentCode = getCurrentCode(h.kodeMataKuliah);
                    const indeks = h.indeks?.trim().toUpperCase();
                    const semesterTaken = parseInt(h.semester, 10);

                    let isFailure = false;

                    // E or T is always a failure.
                    if (['E', 'T'].includes(indeks)) {
                        isFailure = true;
                    }
                    // Grade 'D' is a failure if taken in semester 7 or above.
                    else if (
                        indeks === 'D' &&
                        !isNaN(semesterTaken) &&
                        semesterTaken >= 7
                    ) {
                        isFailure = true;
                    }

                    if (isFailure) {
                        // Only consider it a "retake" if it's NOT in the passed set
                        if (!passedCodes.has(currentCode)) {
                            failedCodes.add(currentCode);
                        }
                    }
                });
            }

            // Calculate how many elective courses have already been passed.
            let passedElectiveCount = 0;
            passedCodes.forEach((kode_mk) => {
                const courseDetails = courseMap.get(kode_mk);
                if (courseDetails && courseDetails.jenis_mk === 'PILIHAN') {
                    passedElectiveCount++;
                }
            });

            const retakeCodes = failedCodes;

            // PRIORITY 1: Add courses that must be retaken.
            retakeCodes.forEach((code) => {
                const courseData = courseMap.get(code);
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

            // PRIORITY 2: Fill remaining SKS with new mandatory courses.
            const allTakenCodes = new Set([...passedCodes, ...retakeCodes]);

            const newMandatoryCourses = staticAvailableCoursesData
                .filter((course) => {
                    const courseSemesterInt = parseInt(course.semester_mk, 10);
                    if (isNaN(courseSemesterInt)) return false;

                    const isMandatory = course.jenis_mk === 'WAJIB PRODI';
                    const isNew = !allTakenCodes.has(course.kode_mk);

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

            // PRIORITY 3: Add new elective courses based on specialization.
            if (studentPeminatan) {
                // If student HAS a specialization, ONLY add electives that match it.
                const specializationCourses = staticAvailableCoursesData
                    .filter((course) => {
                        const courseSemesterInt = parseInt(
                            course.semester_mk,
                            10
                        );
                        if (isNaN(courseSemesterInt)) return false;

                        const isSpecializationElective =
                            course.jenis_mk === 'PILIHAN' &&
                            course.kelompok_keahlian === studentPeminatan;
                        const isNew = !allTakenCodes.has(course.kode_mk);
                        const isSemesterNotTooHigh =
                            courseSemesterInt <= targetSemesterInt;
                        
                        // Semester Rule Logic
                        const isSemesterTypeMatch =
                            (courseSemesterInt % 2 !== 0) === isTargetSemesterOdd;
                        // Exception for elective courses in semester 8
                        const semesterRuleSatisfied = isSemesterTypeMatch || (isSpecializationElective && targetSemesterInt === 8);

                        return (
                            isSpecializationElective &&
                            isNew &&
                            semesterRuleSatisfied &&
                            isSemesterNotTooHigh
                        );
                    })
                    .sort(
                        (a, b) =>
                            parseInt(a.semester_mk, 10) -
                            parseInt(b.semester_mk, 10)
                    );

                specializationCourses.forEach((course) => {
                    // Check the CUMULATIVE elective limit
                    if (
                        passedElectiveCount + newlyRecommendedElectiveCount <
                        5
                    ) {
                        const wasAdded = addCourseToPlan(course);
                        if (wasAdded) {
                            newlyRecommendedElectiveCount++;
                        }
                    }
                });
            } else {
                // If student has NO specialization, add any available elective.
                const allElectiveCourses = staticAvailableCoursesData
                    .filter((course) => {
                        const courseSemesterInt = parseInt(
                            course.semester_mk,
                            10
                        );
                        if (isNaN(courseSemesterInt)) return false;

                        const isElective = course.jenis_mk === 'PILIHAN';
                        const isNew = !allTakenCodes.has(course.kode_mk);
                        const isSemesterNotTooHigh =
                            courseSemesterInt <= targetSemesterInt;

                        const isSemesterTypeMatch =
                            (courseSemesterInt % 2 !== 0) === isTargetSemesterOdd;
                        const semesterRuleSatisfied = isSemesterTypeMatch || (isElective && targetSemesterInt === 8);

                        return (
                            isElective &&
                            isNew &&
                            semesterRuleSatisfied &&
                            isSemesterNotTooHigh
                        );
                    })
                    .sort(
                        (a, b) =>
                            parseInt(a.semester_mk, 10) -
                            parseInt(b.semester_mk, 10)
                    );

                allElectiveCourses.forEach((course) => {
                    // Check the elective limit before adding
                     if (
                        passedElectiveCount + newlyRecommendedElectiveCount <
                        5
                    ) {
                        const wasAdded = addCourseToPlan(course);
                        if (wasAdded) {
                            newlyRecommendedElectiveCount++;
                        }
                    }
                });
            }

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
        staticAvailableCoursesData,
    ]);

    // Effect untuk menggabungkan data riwayat MK dengan detail MK dari data statis
    // Effect to merge course history data with course details from static data
    useEffect(() => {
        if (
            !Array.isArray(studentCourseHistory) ||
            studentCourseHistory.length === 0
        ) {
            setMergedCourseHistory([]);
            return;
        }

        if (
            !Array.isArray(staticAvailableCoursesData) ||
            staticAvailableCoursesData.length === 0
        ) {
            setMergedCourseHistory([]);
            return;
        }

        const merged = studentCourseHistory
            .map((historyItem) => {
                if (!historyItem) return historyItem; // Skip null/undefined items

                const details = staticAvailableCoursesData.find(
                    (c) => c && c.nama_mk === historyItem.namaMataKuliah
                );
                return details
                    ? {
                          ...historyItem,
                          id: historyItem.id || `hist_${details.id}`,
                          kodeMataKuliah: historyItem.kodeMataKuliah,
                          namaMataKuliah: details.nama_mk,
                          sks: details.sks_mk,
                          jenis: details.jenis_mk,
                          ekivalensi: details.ekivalensi,
                      }
                    : historyItem;
            })
            .filter(Boolean); // Remove any null/undefined items

        setMergedCourseHistory(merged);
    }, [studentCourseHistory, staticAvailableCoursesData]);

    // Menggunakan useMemo untuk memfilter daftar mahasiswa, hanya berjalan jika dependensi berubah
    // Using useMemo to filter the student list, only runs when dependencies change
    const filteredStudents = useMemo(() => {
        if (!selectedClass || !Array.isArray(studentsList)) return [];
        return studentsList.filter((s) => s && s.classId === selectedClass);
    }, [selectedClass, studentsList]);

    // Menggunakan useMemo untuk memfilter daftar MK tersedia
    // Using useMemo to filter the available courses list
    const filteredAvailableCourses = useMemo(() => {
        if (!Array.isArray(availableCourses)) return [];
        if (!selectedSemester) return availableCourses;
        return availableCourses.filter(
            (c) => c && String(c.semester_mk) === String(selectedSemester)
        );
    }, [availableCourses, selectedSemester]);

    // === FUNGSI-FUNGSI HELPER DAN HANDLER ===
    // === HELPER AND HANDLER FUNCTIONS ===
    const resetFormStates = () => {
        setSelectedStudent('');
        setTargetSemester('');
        setRecommendedCourses([]);
        setAvailableCourses([...(staticAvailableCoursesData || [])]);
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
        setAvailableCourses([...(staticAvailableCoursesData || [])]);
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
        const courseToAddBack = Array.isArray(staticAvailableCoursesData)
            ? staticAvailableCoursesData.find((c) => c && c.id === course.id)
            : null;
        if (
            courseToAddBack &&
            Array.isArray(availableCourses) &&
            !availableCourses.some((c) => c && c.id === courseToAddBack.id)
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
        setAvailableCourses([...(staticAvailableCoursesData || [])]);
        setSksLimitExceeded(false);
    };

    /**
     * Mengirimkan rekomendasi yang sudah final ke server.
     * Sends the final recommendations to the server.
     */
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

    /**
     * Memeriksa apakah penambahan SKS akan melebihi batas.
     * Checks if adding SKS will exceed the limit.
     * @param {number} courseSKS - SKS dari mata kuliah yang akan ditambahkan.
     * @returns {boolean}
     */
    const wouldExceedSKSLimit = (courseSKS) =>
        totalRecommendedSKS + courseSKS > maxSKS;

    // Nilai yang akan disediakan oleh Context Provider
    // The value that will be provided by the Context Provider
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
        studentSKSData,
    };

    return (
        <MyCourseAdvisorContext.Provider value={contextValue}>
            {children}
        </MyCourseAdvisorContext.Provider>
    );
};

/**
 * Custom hook untuk memudahkan penggunaan MyCourseAdvisorContext.
 * Custom hook to simplify the use of MyCourseAdvisorContext.
 * @returns {object} - Nilai dari konteks.
 */
export function useMyCourseAdvisor() {
    const context = useContext(MyCourseAdvisorContext);
    if (!context) {
        throw new Error(
            'useMyCourseAdvisor must be used within a MyCourseAdvisorProvider'
        );
    }
    return context;
}