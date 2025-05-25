// src/services/cekAnalisisPsikologi.js

/**
 * Service untuk mengambil data analisis psikologi mahasiswa dari backend
 */

const BASE_URL = 'http://localhost:5000/api/faculty';

/**
 * Fetch data analisis psikologi berdasarkan NIM
 * @param {string} nim - Nomor Induk Mahasiswa
 * @returns {Promise<Object>} Response data dari backend
 */
export const getAnalisisPsikologi = async (nim) => {
    try {
        // Get token dari localStorage user
        const token = localStorage.getItem('token');

        if (!token) {
            return {
                success: false,
                message: 'No Token Found',
                data: [],
            };
        }

        console.log('Fetching psychology data for NIM:', nim);
        console.log('API URL:', `${BASE_URL}/analisisPsikologi/${nim}`);

        // Fetch ke API:
        const response = await fetch(`${BASE_URL}/analisisPsikologi/${nim}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Response status:', response.status);

        // Check if response is ok
        if (!response.ok) {
            if (response.status === 401) {
                return {
                    success: false,
                    message: 'Unauthorized: Please login again',
                    data: [],
                };
            } else if (response.status === 404) {
                return {
                    success: false,
                    message:
                        'Data analisis psikologi tidak ditemukan untuk NIM ini',
                    data: [],
                };
            } else if (response.status === 403) {
                return {
                    success: false,
                    message: 'Forbidden: Anda tidak memiliki akses ke data ini',
                    data: [],
                };
            } else {
                return {
                    success: false,
                    message: `HTTP error! status: ${response.status}`,
                    data: [],
                };
            }
        }

        const data = await response.json();

        // Return the data as-is since it already has the success structure
        return data;
    } catch (error) {
        console.error('Error fetching analisis psikologi:', error);
        return {
            success: false,
            message: error.message || 'Gagal mengambil data analisis psikologi',
            data: [],
        };
    }
};

/**
 * Transform data dari backend ke format yang dibutuhkan frontend
 * @param {Object} backendData - Data dari backend
 * @returns {Object} Data yang sudah ditransform
 */
export const transformPsychologyData = (backendData) => {
    if (!backendData || !backendData.data || backendData.data.length === 0) {
        return null;
    }

    const result = backendData.data[0]; // Ambil data pertama

    console.log('Raw backend result:', result); // Debug log
    console.log('Current semester from backend:', result.current_semester); // Debug log

    return {
        id: result.idHasil,
        nim: result.nim,
        nama: result.nama, // Student name from JOIN
        kelas: result.kelas, // Student class from JOIN
        currentSemester: result.current_semester, // Calculated current semester
        hasData: true,
        statusPsikologi: result.klasifikasi,
        tanggalTes: new Date(result.tanggalTes).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }),
        aspekPsikologi: {
            depression: result.skor_depression,
            anxiety: result.skor_anxiety,
            stress: result.skor_stress,
            totalSkor: result.total_skor,
        },
        kesimpulan: result.kesimpulan,
        saran: result.saran,
        klasifikasi: result.klasifikasi,
    };
};

/**
 * Get chart data untuk DASS-21 visualization
 * @param {Object} transformedData - Data yang sudah ditransform
 * @returns {Array} Data untuk chart
 */
export const getChartDataFromDASS21 = (transformedData) => {
    if (!transformedData || !transformedData.aspekPsikologi) {
        return [];
    }

    const { depression, anxiety, stress } = transformedData.aspekPsikologi;

    return [
        { name: 'Depression', nilai: depression, maxValue: 21 },
        { name: 'Anxiety', nilai: anxiety, maxValue: 21 },
        { name: 'Stress', nilai: stress, maxValue: 21 },
    ];
};

/**
 * Analisis tingkat berdasarkan skor DASS-21
 * @param {number} score - Skor aspek
 * @param {string} aspect - Jenis aspek (depression, anxiety, stress)
 * @returns {Object} Level dan deskripsi
 */
export const analyzeDASS21Level = (score, aspect) => {
    const ranges = {
        depression: [
            { min: 0, max: 4, level: 'Normal', color: 'green' },
            { min: 5, max: 6, level: 'Ringan', color: 'yellow' },
            { min: 7, max: 10, level: 'Sedang', color: 'orange' },
            { min: 11, max: 13, level: 'Parah', color: 'red' },
            { min: 14, max: 21, level: 'Sangat Parah', color: 'darkred' },
        ],
        anxiety: [
            { min: 0, max: 3, level: 'Normal', color: 'green' },
            { min: 4, max: 5, level: 'Ringan', color: 'yellow' },
            { min: 6, max: 7, level: 'Sedang', color: 'orange' },
            { min: 8, max: 9, level: 'Parah', color: 'red' },
            { min: 10, max: 21, level: 'Sangat Parah', color: 'darkred' },
        ],
        stress: [
            { min: 0, max: 7, level: 'Normal', color: 'green' },
            { min: 8, max: 9, level: 'Ringan', color: 'yellow' },
            { min: 10, max: 12, level: 'Sedang', color: 'orange' },
            { min: 13, max: 16, level: 'Parah', color: 'red' },
            { min: 17, max: 21, level: 'Sangat Parah', color: 'darkred' },
        ],
    };

    const aspectRanges = ranges[aspect.toLowerCase()] || ranges.stress;
    const range = aspectRanges.find((r) => score >= r.min && score <= r.max);

    return range || { level: 'Unknown', color: 'gray' };
};
