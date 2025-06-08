import { getApiUrl, getAuthHeaders } from '../../../config/api';

export const getClassAndStudentList = async () => {
    try {
        // Get dan validasi token:
        const token = localStorage.getItem('token'); // Fixed from localStorage.localStorage
        if (!token) {
            return {
                success: false,
                message: 'No Token Found',
            };
        }

        const response = await fetch(
            getApiUrl('/faculty/courseAdvisor/classesAndStudents'),
            {
                method: 'GET',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();

        // Chek fetch api di data.successnya true atau false?
        if (data.success) {
            return {
                success: true,
                classesList: data.data.classesList,
                studentsList: data.data.studentsList,
                countKelas: data.countKelas,
                countMahasiswa: data.countMahasiswa,
            };
        } else {
            return {
                success: false,
                message:
                    data.message || 'Failed to fetch class and student data',
            };
        }
    } catch (error) {
        console.error('Error fetching class and student data:', error);
        return {
            success: false,
            message: 'An error occurred while fetching data',
            error: error.message,
        };
    }
};

// Get riwayat MK
export const getStudentCourseHistory = async (nim) => {
    try {
        // Get and validate token
        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                message: 'No Token Found',
            };
        }

        const response = await fetch(
            getApiUrl(`/faculty/courseAdvisor/courseHistory?nim=${nim}`),
            {
                method: 'GET',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();

        if (data.success) {

            // Transform the data to match the format expected by the component
            const studentCourseHistory = data.data.map((course, index) => {
                // Create an object with all expected properties with proper defaults
                const transformedCourse = {
                    id: `history_${index}`, // Generate an id for each course history item
                    kodeMataKuliah: course.kode_mata_kuliah || '',
                    namaMataKuliah:
                        course.nama_mata_kuliah || 'Data tidak tersedia',
                    jenis: course.jenis || 'Data tidak tersedia',
                    sks: course.sks || 0,
                    indeks: course.nilai || '-',
                    semester: course.semester || '-',
                };

                return transformedCourse;
            });

            return {
                success: true,
                courseHistory: studentCourseHistory || [],
            };
        } else {
            return {
                success: false,
                message: data.message || 'Failed to fetch course history',
            };
        }
    } catch (error) {
        console.error('Error fetching student course history:', error);
        return {
            success: false,
            message: 'An error occurred while fetching course history',
            error: error.message,
        };
    }
};

// In: ../../services/dosenWali/myCourseAdvisor/myCourseAdvisorService.js

// ... (other service functions like getStudentCourseHistory, getClassAndStudentList)

export const getAvailableCourse = async () => {
    try {
        // Get and validate token
        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                message: 'No Token Found',
            };
        }

        const fetchResponse = await fetch(
            getApiUrl('/faculty/courseAdvisor/mataKuliahAvail'),
            {
                // Assuming API_URL is defined
                method: 'GET',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await fetchResponse.json(); // Parse the JSON response

        if (data.success) {
            // Check the success flag from the parsed data
            // Transform the data to match the format expected by the component
            // Expected: id, kodeMataKuliah, namaMataKuliah, jenis, sks, semester
            const listAvailCourses = data.data.map((course, index) => ({
                // Assuming data.data is the array of courses
                id: `avail_course_${course.kode_mata_kuliah || index}`,
                kode_mk: course.kode_mk,
                nama_mk: course.nama_mk,
                jenis_mk: course.jenis_mk,
                sks_mk: course.sks_mk,
                semester_mk: course.semester,
            }));

            return {
                success: true,
                availableCourses: listAvailCourses || [], // Return under 'availableCourses' key
            };
        } else {
            return {
                success: false,
                message: data.message || 'Failed to fetch available courses',
            };
        }
    } catch (error) {
        console.error('Error fetching available courses data:', error);
        return {
            success: false,
            message: 'An error occurred while fetching available courses data',
            error: error.message,
        };
    }
};

export const sendRecommendedCourses = async (nim, recommendedCourses) => {
    try {
        // Get token dan validasi
        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                message: 'No token found',
            };
        }

        const courseCodes = recommendedCourses.map((course) => course.kode_mk);

        const requestData = {
            nim: nim,
            courseCodes: courseCodes,
        };

        const response = await fetch(
            getApiUrl('/faculty/courseAdvisor/sendRekomendasiMK'),
            {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            }
        );

        const data = await response.json();

        if (data.success) {
            return {
                success: true,
                message: data.message || 'Recommendation Sent Successfully',
                totalSKS: data.totalSKS,
                count: data.count,
            };
        } else {
            return {
                success: false,
                message:
                    data.message || 'Failed to send course recommendations',
            };
        }
    } catch (error) {
        console.error('Error sending course recommendation', error);
        return {
            success: false,
            message: 'An error occured while sending recommendations',
            error: error.message,
        };
    }
};
