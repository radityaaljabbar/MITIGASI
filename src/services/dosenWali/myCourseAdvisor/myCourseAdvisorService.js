const API_URL = 'http://localhost:5000/api/faculty/courseAdvisor';

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

        const response = await fetch(`${API_URL}/classesAndStudents`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('API Response:', data);

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

        const response = await fetch(`${API_URL}/courseHistory?nim=${nim}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('Course History API Response:', data);

        if (data.success) {
            // Transform the data to match the format expected by the component
            const listAvailCourses = data.data.map((course, index) => ({
                id: `history_${index}`, // Generate an id for each course history item
                kodeMataKuliah: course.kode_mk,
                namaMataKuliah: course.nama_mk,
                jenis: course.jenis_mk,
                sks: course.sks_mk,
                tingkat: course.tingkat, // Using semester as tingkat
                jenis_semester: course.jenis_semester,
                semester: course.semester,
            }));

            return {
                success: true,
                courseHistory: listAvailCourses || [],
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

        const fetchResponse = await fetch(`${API_URL}/mataKuliahAvail`, {
            // Assuming API_URL is defined
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await fetchResponse.json(); // Parse the JSON response

        if (data.success) {
            // Check the success flag from the parsed data
            // Transform the data to match the format expected by the component
            // Expected: id, kodeMataKuliah, namaMataKuliah, jenis, sks, semester
            const transformedCourses = data.data.map((course, index) => ({
                // Assuming data.data is the array of courses
                id: `avail_course_${course.kode_mata_kuliah || index}`, // Generate a unique id
                kodeMataKuliah: course.kode_mk,
                namaMataKuliah: course.nama_mk,
                jenis: course.jenis_mk,
                sks: course.sks_mk,
                semester: course.semester, // This is used for filtering
            }));

            return {
                success: true,
                availableCourses: transformedCourses || [], // Return under 'availableCourses' key
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
