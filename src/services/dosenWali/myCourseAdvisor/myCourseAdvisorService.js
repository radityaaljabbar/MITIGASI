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
            const transformedCourseHistory = data.data.map((course, index) => ({
                id: `history_${index}`, // Generate an id for each course history item
                kodeMataKuliah: course.kode_mata_kuliah,
                namaMataKuliah: course.nama_mata_kuliah,
                jenis: course.jenis,
                sks: course.sks,
                indeks: course.nilai.trim(), // Trim whitespace from grade
                tingkat: course.semester, // Using semester as tingkat
                tahunAjaran: course.tahun_ajaran,
            }));

            return {
                success: true,
                courseHistory: transformedCourseHistory || [],
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
