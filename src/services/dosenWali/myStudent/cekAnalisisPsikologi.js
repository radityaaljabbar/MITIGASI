// src/services/cekAnalisisPsikologi.js
//? Service untuk mengambil data analisis psikologi mahasiswa dari backend

import { getApiUrl, getAuthHeaders } from '../../../config/api';

/**
 * Mengambil data analisis psikologi seorang mahasiswa berdasarkan NIM.
 * Fetches psychology analysis data for a student by NIM.
 * @param {string} nim - Nomor Induk Mahasiswa.
 * @returns {Promise<Object>} - Respons data dari backend.
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

        // Fetch ke API:
        const response = await fetch(
            getApiUrl(`/faculty/analisisPsikologi/${nim}`),
            {
                method: 'GET',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
            }
        );

        // Penanganan error berdasarkan status code HTTP
        // Error handling based on HTTP status code
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

        // Mengembalikan data apa adanya karena sudah memiliki struktur 'success'
        // Returning the data as-is since it already has the 'success' structure
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
 * Mengubah data dari backend menjadi format yang dibutuhkan oleh komponen frontend.
 * Transforms data from the backend into the format required by the frontend components.
 * @param {Object} backendData - Data dari backend.
 * @returns {Object} - Data yang sudah ditransformasi.
 */
export const transformPsychologyData = (backendData) => {
    if (!backendData || !backendData.data || backendData.data.length === 0) {
        return null;
    }

    const result = backendData.data[0]; // Ambil data pertama

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
 * Menyiapkan data untuk visualisasi chart DASS-21.
 * Prepares data for DASS-21 chart visualization.
 * @param {Object} transformedData - Data yang sudah ditransformasi.
 * @returns {Array} - Array data yang siap digunakan oleh chart.
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
 * Menganalisis dan mengkategorikan tingkat keparahan skor DASS-21.
 * Analyzes and categorizes the severity level of a DASS-21 score.
 * @param {number} score - Skor aspek.
 * @param {string} aspect - Jenis aspek (depression, anxiety, stress).
 * @returns {Object} - Objek berisi level dan warna.
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

/**
 * Mengubah semua data riwayat psikologi untuk tampilan histori.
 * Transforms all psychology history data for the history view.
 * @param {Object} backendData - Data dari backend.
 * @returns {Array} - Array data yang sudah ditransformasi.
 */
export const transformAllPsychologyData = (backendData) => {
    if (!backendData || !backendData.data || backendData.data.length === 0) {
        return [];
    }

    return backendData.data.map((result, index) => ({
        id: result.idHasil,
        nim: result.nim,
        nama: result.nama,
        kelas: result.kelas,
        currentSemester: result.current_semester,
        hasData: true,
        statusPsikologi: result.klasifikasi,
        tanggalTes: new Date(result.tanggalTes).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }),
        tanggalTesRaw: result.tanggalTes, // For sorting
        aspekPsikologi: {
            depression: result.skor_depression,
            anxiety: result.skor_anxiety,
            stress: result.skor_stress,
            totalSkor: result.total_skor,
        },
        kesimpulan: result.kesimpulan,
        saran: result.saran,
        klasifikasi: result.klasifikasi,
        testNumber: backendData.data.length - index, // Test number (1 = oldest)
    }));
};

/**
 * Membandingkan dua hasil tes psikologi untuk melihat tren.
 * Compares two psychology test results to identify trends.
 * @param {Object} current - Data tes saat ini.
 * @param {Object} previous - Data tes sebelumnya.
 * @returns {Object} - Objek hasil perbandingan.
 */
export const compareTestResults = (current, previous) => {
    if (!current || !previous) return null;

    const aspects = ['depression', 'anxiety', 'stress'];
    const comparison = {
        changes: {},
        improvements: [],
        concerns: [],
        overallTrend: 'stable',
    };

    aspects.forEach((aspect) => {
        const currentScore = current.aspekPsikologi[aspect];
        const previousScore = previous.aspekPsikologi[aspect];
        const change = currentScore - previousScore;

        comparison.changes[aspect] = {
            current: currentScore,
            previous: previousScore,
            change: change,
            percentage:
                previousScore > 0
                    ? Math.round((change / previousScore) * 100)
                    : 0,
            improved: change < 0, // Lower is better for DASS-21
        };

        if (change < -2) {
            comparison.improvements.push(
                `${aspect} menurun ${Math.abs(change)} poin (membaik)`
            );
        } else if (change > 2) {
            comparison.concerns.push(
                `${aspect} meningkat ${change} poin (perlu perhatian)`
            );
        }
    });

    // Overall trend
    const totalChange =
        current.aspekPsikologi.totalSkor - previous.aspekPsikologi.totalSkor;
    if (totalChange < -5) {
        comparison.overallTrend = 'improving';
    } else if (totalChange > 5) {
        comparison.overallTrend = 'worsening';
    }

    return comparison;
};
