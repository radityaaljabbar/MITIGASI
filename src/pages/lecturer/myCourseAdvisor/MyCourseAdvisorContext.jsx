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
} from '../../../services/dosenWali/myCourseAdvisor/myCourseAdvisorService';

// Create context
const MyCourseAdvisorContext = createContext();

// Maximum SKS allowed
const MAX_SKS = 24;

export const MyCourseAdvisorProvider = ({ children }) => {
    // State for API data
    const [classesList, setClassesList] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // General loading for initial data
    const [isLoadingHistory, setIsLoadingHistory] = useState(false); // Specific loading for course history
    const [isLoadingCourses, setIsLoadingCourses] = useState(false); // Loading state for available courses

    // Selection state variables
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(''); // This will be the 'nim' for the service
    const [selectedSemester, setSelectedSemester] = useState('');

    // Course data state
    const [availableCourses, setAvailableCourses] = useState([]); // Initialize as empty array
    const [staticAvailableCoursesData, setStaticAvailableCoursesData] =
        useState([]); // To store initial fetch
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const [studentCourseHistory, setStudentCourseHistory] = useState([]); // This will store the result from your service
    const [mergedCourseHistory, setMergedCourseHistory] = useState([]); // This is displayed in the table
    const [sksLimitExceeded, setSksLimitExceeded] = useState(false);

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

        // Fetch available courses
        const fetchAvailableCourses = async () => {
            setIsLoadingCourses(true);
            try {
                const result = await getAvailableCourse();
                if (result.success) {
                    setAvailableCourses(result.availableCourses);
                    setStaticAvailableCoursesData(result.availableCourses);
                } else {
                    toast.error(
                        result.message || 'Failed to fetch available courses'
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
        fetchAvailableCourses();
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

    // Filter students based on selected class - memoized to avoid recalculation
    const filteredStudents = useMemo(() => {
        return selectedClass
            ? studentsList.filter(
                  (student) => student.classId === selectedClass
              )
            : [];
    }, [selectedClass, studentsList]);

    // Merge course history with available courses data to get complete information
    useEffect(() => {
        if (!selectedStudent || studentCourseHistory.length === 0) {
            setMergedCourseHistory([]);
            return;
        }

        const merged = studentCourseHistory.map((historyItem) => {
            // Find additional/canonical course details from staticAvailableCoursesData
            const courseDetails = staticAvailableCoursesData.find(
                (course) => course.kodeMataKuliah === historyItem.kodeMataKuliah
            );

            if (courseDetails) {
                // Merge, giving preference to courseDetails for some fields if needed
                return {
                    ...historyItem, // Base data from API
                    id:
                        historyItem.id ||
                        `history_${courseDetails.kodeMataKuliah}`, // Ensure ID, prefer API's generated one
                    namaMataKuliah:
                        courseDetails.namaMataKuliah ||
                        historyItem.namaMataKuliah, // Prefer static data's name if available
                    sks: courseDetails.sks || historyItem.sks, // Prefer static data's SKS
                    jenis: courseDetails.jenis || historyItem.jenis, // Prefer static data's type
                    tingkat: courseDetails.semester || historyItem.tingkat, // Prefer static data's semester for tingkat
                };
            } else {
                // If not found in static data, use the history item as is from the API
                return historyItem;
            }
        });

        setMergedCourseHistory(merged);
    }, [selectedStudent, studentCourseHistory, staticAvailableCoursesData]);

    // Handler functions
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

    // Kirim rekomendasi
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

    const wouldExceedSKSLimit = (courseSKS) => {
        return totalRecommendedSKS + courseSKS > MAX_SKS;
    };

    const filteredAvailableCourses = useMemo(() => {
        if (!selectedSemester) {
            return availableCourses;
        }
        return availableCourses.filter((course) => {
            // Check semester field names
            const courseSemester = course.semester_mk;
            // Convert both to strings for consistent comparison
            return String(courseSemester) === String(selectedSemester);
        });
    }, [availableCourses, selectedSemester]);

    // Values to provide in context
    const contextValue = {
        // States
        classesList,
        studentsList,
        isLoading,
        isLoadingHistory,
        isLoadingCourses,
        selectedClass,
        selectedStudent,
        selectedSemester,
        availableCourses,
        staticAvailableCoursesData,
        recommendedCourses,
        studentCourseHistory,
        mergedCourseHistory,
        sksLimitExceeded,
        totalRecommendedSKS,
        filteredStudents,
        filteredAvailableCourses,
        MAX_SKS,

        // Functions
        setSelectedClass,
        setSelectedStudent,
        setSelectedSemester,
        handleClassChange,
        handleStudentChange,
        handleSemesterChange,
        addCourse,
        removeCourse,
        resetAvailableCourses,
        sendRecommendations,
        wouldExceedSKSLimit,
    };

    return (
        <MyCourseAdvisorContext.Provider value={contextValue}>
            {children}
        </MyCourseAdvisorContext.Provider>
    );
};

// Custom hook to use the context
export const useMyCourseAdvisor = () => {
    const context = useContext(MyCourseAdvisorContext);
    if (!context) {
        throw new Error(
            'useMyCourseAdvisor must be used within a MyCourseAdvisorProvider'
        );
    }
    return context;
};
