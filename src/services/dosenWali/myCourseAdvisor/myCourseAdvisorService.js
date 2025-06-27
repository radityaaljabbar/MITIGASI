import { getApiUrl, getAuthHeaders } from '../../../config/api';

export const getClassAndStudentList = async () => {
    try {
        // Get dan validasi token:
        const token = localStorage.getItem('token');
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
                    jenis_semester: course.jenis_semester,
                    tahun_ajaran: course.tahun_ajaran,
                    sks: course.sks || 0,
                    indeks: course.nilai || '-',
                    semester: course.semester || '-',
                    ekivalensi: course.ekivalensi,
                    angkatan: course.angkatan,
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
                jenis_semester: course.jenis_semester,
                ekivalensi: course.ekivalensi,
                kurikulum: course.kurikulum,
                kelompok_keahlian: course.kelompok_keahlian,
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

export const sendRecommendedCourses = async (
    nim,
    recommendedCourses,
    targetSemester
) => {
    try {
        // Get token dan validasi
        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                message: 'No token found',
            };
        }

        // Mengambil 'kodeMataKuliah' dari setiap objek di array 'recommendedCourses'
        const courseCodes = recommendedCourses.map(
            (course) => course.kodeMataKuliah
        );

        const requestData = {
            nim: nim,
            courseCodes: courseCodes,
            targetSemester: targetSemester,
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

export const getLastIPSemester = async (nim) => {
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
            getApiUrl(`/faculty/courseAdvisor/getLastIPSemester?nim=${nim}`),
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
            return {
                success: true,
                maxSKS: data.data.maxSKS, // Cuma return maxSKS aja
            };
        } else {
            return {
                success: false,
                message: data.message || 'Failed to fetch IP semester data',
            };
        }
    } catch (error) {
        console.error('Error fetching IP semester data:', error);
        return {
            success: false,
            message: 'An error occurred while fetching IP semester data',
            error: error.message,
        };
    }
};

export const getRecommendedMK = async (nim, targetSemester) => {
    try {
        // Ambil dan validasi token
        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                message: 'No Token Found',
            };
        }

        const response = await fetch(
            getApiUrl(`/faculty/courseAdvisor/getRecommendedMK?nim=${nim}`),
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
            // Filter berdasarkan targetSemester jika ada
            let recommendations = data.data || [];

            if (targetSemester) {
                recommendations = recommendations.filter(
                    (course) =>
                        course.semester_mahasiswa === parseInt(targetSemester)
                );
            }

            // Transform format data
            const transformedRecommendations = recommendations.map(
                (course) => ({
                    id: `rec_${course.kode_mk}`,
                    kodeMataKuliah: course.kode_mk,
                    namaMataKuliah: course.nama_mk,
                    sks: course.sks_mk,
                    jenis: course.jenis_mk,
                    semester_mk: course.semester_mahasiswa,
                    tanggalDibuat: course.tanggal_dibuat,
                    totalSKS: course.total_sks,
                })
            );

            return {
                success: true,
                recommendations: transformedRecommendations,
                totalRecommendations: transformedRecommendations.length,
                message: data.message,
            };
        } else {
            return {
                success: false,
                message: data.message || 'Failed to fetch recommendations',
                recommendations: [],
            };
        }
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return {
            success: false,
            message: 'An error occurred while fetching recommendations',
            error: error.message,
            recommendations: [],
        };
    }
};

export const getStudentNIMSKS = async (nim) => {
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
            getApiUrl(`/faculty/getStudentNIMSKS?nim=${nim}`),
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
            return {
                success: true,
                studentData: {
                    nim: data.data.nim,
                    sksLulus: data.data.sksLulus,
                },
            };
        } else {
            return {
                success: false,
                message: data.message || 'Failed to fetch student SKS data',
            };
        }
    } catch (error) {
        console.error('Error fetching student SKS data:', error);
        return {
            success: false,
            message: 'An error occurred while fetching student SKS data',
            error: error.message,
        };
    }
};
