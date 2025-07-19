import { getApiUrl, getAuthHeaders } from '../../../config/api';

/**
 * Mengambil daftar kelas dan mahasiswa yang berada di bawah perwalian dosen yang sedang login.
 * Fetches the list of classes and students under the advisory of the currently logged-in lecturer.
 * @returns {Promise<object>} - Hasil dari panggilan API yang berisi daftar kelas dan mahasiswa.
 */
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

        // Memeriksa flag `success` dari respons API
        // Checking the `success` flag from the API response
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

/**
 * Mengambil riwayat mata kuliah seorang mahasiswa berdasarkan NIM.
 * Fetches the course history of a student by their NIM.
 * @param {string} nim - NIM mahasiswa.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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
            // Mengubah format data dari backend agar sesuai dengan yang diharapkan oleh komponen frontend
            // Transforming the data format from the backend to match what the frontend component expects
            const studentCourseHistory = data.data.map((course, index) => {
                // Create an object with all expected properties with proper defaults
                const transformedCourse = {
                    id: `history_${index}`, // Membuat ID unik untuk setiap item riwayat
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

/**
 * Mengambil daftar semua mata kuliah yang tersedia untuk direkomendasikan.
 * Fetches a list of all available courses to be recommended.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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
            // Mengubah format data agar sesuai dengan yang diharapkan komponen
            // Transforming data to match the format expected by the component
            const listAvailCourses = data.data.map((course, index) => ({
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

/**
 * Mengirimkan rekomendasi mata kuliah untuk seorang mahasiswa ke server.
 * Sends course recommendations for a student to the server.
 * @param {string} nim - NIM mahasiswa.
 * @param {Array<object>} recommendedCourses - Daftar mata kuliah yang direkomendasikan.
 * @param {string|number} targetSemester - Semester target untuk rekomendasi.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

        // Mengekstrak hanya kode mata kuliah dari objek
        // Extracting only the course codes from the objects
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

/**
 * Mengambil IP semester terakhir seorang mahasiswa untuk menentukan batas SKS.
 * Fetches a student's last semester GPA to determine the SKS limit.
 * @param {string} nim - NIM mahasiswa.
 * @returns {Promise<object>} - Hasil dari panggilan API, hanya berisi maxSKS.
 */
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

/**
 * Mengambil daftar mata kuliah yang sudah direkomendasikan untuk seorang mahasiswa.
 * Fetches the list of courses that have already been recommended for a student.
 * @param {string} nim - NIM mahasiswa.
 * @param {string|number} targetSemester - (Opsional) Filter berdasarkan semester.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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

/**
 * Mengambil data SKS lulus seorang mahasiswa.
 * Fetches a student's completed SKS data.
 * @param {string} nim - NIM mahasiswa.
 * @returns {Promise<object>} - Hasil dari panggilan API.
 */
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
