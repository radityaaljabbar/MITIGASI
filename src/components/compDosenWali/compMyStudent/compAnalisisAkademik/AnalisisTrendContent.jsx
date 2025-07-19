import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * Komponen untuk menampilkan analisis tren akademik mahasiswa menggunakan grafik.
 * Component to display a student's academic trend analysis using charts.
 * @param {object} props - Props komponen.
 * @param {object} props.studentData - Data akademik mahasiswa.
 */
const AnalisisTrendContent = ({ studentData }) => {
    // Refs untuk elemen canvas dan instance chart
    // Refs for canvas elements and chart instances
    const ipkChartRef = useRef(null);
    const sksChartRef = useRef(null);
    const ipkChartInstance = useRef(null);
    const sksChartInstance = useRef(null);

    // Mempersiapkan data per semester dari props
    // Preparing per-semester data from props
    const semesterData = studentData?.perSemester || [];

    // Efek untuk membuat dan membersihkan chart saat data berubah
    // Effect to create and clean up charts when data changes
    useEffect(() => {
        // Hapus instance chart yang ada sebelum membuat yang baru
        // Destroy existing chart instances before creating new ones
        if (ipkChartInstance.current) {
            ipkChartInstance.current.destroy();
        }
        if (sksChartInstance.current) {
            sksChartInstance.current.destroy();
        }

        // Membuat Grafik Tren IPK
        // Create IPK Trend Chart
        if (ipkChartRef.current && semesterData.length > 0) {
            const ctx = ipkChartRef.current.getContext('2d');

            ipkChartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: semesterData.map(
                        (_, index) => `Semester ${index + 1}`
                    ),
                    datasets: [
                        {
                            label: 'IP Semester',
                            data: semesterData.map(
                                (item) => item.ipSemester || 0
                            ),
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointRadius: 6,
                            pointHoverRadius: 8,
                        },
                        {
                            label: 'Target IPK (3.0)',
                            data: Array(semesterData.length).fill(3.0),
                            backgroundColor: 'transparent',
                            borderColor: 'rgba(239, 68, 68, 0.7)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            fill: false,
                            pointRadius: 0,
                            pointHoverRadius: 0,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                    size: 12,
                                    weight: '500',
                                },
                            },
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 1,
                            cornerRadius: 8,
                            displayColors: false,
                        },
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false,
                            },
                            ticks: {
                                font: {
                                    size: 11,
                                    weight: '500',
                                },
                                color: '#6b7280',
                            },
                        },
                        y: {
                            beginAtZero: true,
                            max: 4.0,
                            grid: {
                                color: 'rgba(107, 114, 128, 0.1)',
                            },
                            ticks: {
                                font: {
                                    size: 11,
                                    weight: '500',
                                },
                                color: '#6b7280',
                                stepSize: 0.25,
                            },
                        },
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                },
            });
        }

        // Membuat Grafik Progres SKS
        // Create SKS Progress Chart
        if (sksChartRef.current && semesterData.length > 0) {
            const ctx = sksChartRef.current.getContext('2d');

            // Menghitung SKS kumulatif
            // Calculating cumulative SKS
            let cumulativeSks = 0;
            const cumulativeSksData = semesterData.map((item) => {
                cumulativeSks += item.sksSemester || 0;
                return cumulativeSks;
            });

            sksChartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: semesterData.map((_, index) => `Sem ${index + 1}`),
                    datasets: [
                        {
                            label: 'SKS Per Semester',
                            data: semesterData.map(
                                (item) => item.sksSemester || 0
                            ),
                            backgroundColor: 'rgba(16, 185, 129, 0.7)',
                            borderColor: 'rgba(16, 185, 129, 1)',
                            borderWidth: 1,
                            borderRadius: 4,
                            borderSkipped: false,
                        },
                        {
                            label: 'Kumulatif SKS',
                            data: cumulativeSksData,
                            type: 'line',
                            backgroundColor: 'transparent',
                            borderColor: 'rgba(245, 158, 11, 1)',
                            borderWidth: 3,
                            fill: false,
                            tension: 0.1,
                            pointBackgroundColor: 'rgba(245, 158, 11, 1)',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointRadius: 5,
                            yAxisID: 'y1',
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                    size: 12,
                                    weight: '500',
                                },
                            },
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            borderColor: 'rgba(16, 185, 129, 1)',
                            borderWidth: 1,
                            cornerRadius: 8,
                        },
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false,
                            },
                            ticks: {
                                font: {
                                    size: 11,
                                    weight: '500',
                                },
                                color: '#6b7280',
                            },
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(107, 114, 128, 0.1)',
                            },
                            ticks: {
                                font: {
                                    size: 11,
                                    weight: '500',
                                },
                                color: '#6b7280',
                            },
                            title: {
                                display: true,
                                text: 'SKS Per Semester',
                                color: '#374151',
                                font: {
                                    size: 12,
                                    weight: '600',
                                },
                            },
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            beginAtZero: true,
                            grid: {
                                drawOnChartArea: false,
                            },
                            ticks: {
                                font: {
                                    size: 11,
                                    weight: '500',
                                },
                                color: '#6b7280',
                            },
                            title: {
                                display: true,
                                text: 'Kumulatif SKS',
                                color: '#374151',
                                font: {
                                    size: 12,
                                    weight: '600',
                                },
                            },
                        },
                    },
                },
            });
        }

        // Fungsi cleanup untuk menghapus chart saat komponen unmount
        // Cleanup function to destroy charts on component unmount
        return () => {
            if (ipkChartInstance.current) {
                ipkChartInstance.current.destroy();
            }
            if (sksChartInstance.current) {
                sksChartInstance.current.destroy();
            }
        };
    }, [semesterData]);

    // Menghitung statistik ringkas
    // Calculating summary statistics
    const currentIPK = studentData?.ipk || 0;
    const totalSKS = studentData?.sksTotal || 0;
    const averageIPPerSemester =
        semesterData.length > 0
            ? semesterData.reduce(
                  (sum, item) => sum + (item.ipSemester || 0),
                  0
              ) / semesterData.length
            : 0;

    const trend =
        semesterData.length >= 2
            ? (semesterData[semesterData.length - 1]?.ipSemester || 0) -
              (semesterData[semesterData.length - 2]?.ipSemester || 0)
            : 0;

    // Tampilan jika tidak ada data semester
    // Display if there is no semester data        
    if (!semesterData || semesterData.length === 0) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Tidak Ada Data Semester
                    </h3>
                    <p className="text-gray-500">
                        Data analisis trend akan muncul setelah mahasiswa
                        memiliki riwayat akademik.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header Halaman */}
            {/* Header */}
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Analisis dan Trend Akademik
                </h3>
                <p className="text-gray-600">
                    Visualisasi perkembangan akademik mahasiswa per semester
                </p>
            </div>

            {/* Kartu Statistik */}
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">
                                IPK Saat Ini
                            </p>
                            <p className="text-2xl font-bold">
                                {currentIPK.toFixed(2)}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">SKS Lulus</p>
                            <p className="text-2xl font-bold">{totalSKS}</p>
                        </div>
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">
                                Rata-rata IP
                            </p>
                            <p className="text-2xl font-bold">
                                {averageIPPerSemester.toFixed(2)}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div
                    className={`bg-gradient-to-r ${
                        trend >= 0
                            ? 'from-emerald-500 to-emerald-600'
                            : 'from-red-500 to-red-600'
                    } rounded-xl p-4 text-white`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p
                                className={`${
                                    trend >= 0
                                        ? 'text-emerald-100'
                                        : 'text-red-100'
                                } text-sm`}>
                                Trend
                            </p>
                            <p className="text-2xl font-bold">
                                {trend >= 0 ? '+' : ''}
                                {trend.toFixed(2)}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d={
                                        trend >= 0
                                            ? 'M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z'
                                            : 'M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z'
                                    }
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grafik */}
            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Grafik Tren IPK */}
                {/* IPK Trend Chart */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            Trend IP Semester
                        </h4>
                        <p className="text-sm text-gray-600">
                            Perkembangan Indeks Prestasi per semester
                        </p>
                    </div>
                    <div className="h-80">
                        <canvas ref={ipkChartRef}></canvas>
                    </div>
                </div>

                {/* Grafik Progres SKS */}
                {/* SKS Progress Chart */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            Progress SKS
                        </h4>
                        <p className="text-sm text-gray-600">
                            SKS per semester dan kumulatif SKS
                        </p>
                    </div>
                    <div className="h-80">
                        <canvas ref={sksChartRef}></canvas>
                    </div>
                </div>
            </div>

            {/* Insight Performa Akademik */}
            {/* Academic Performance Insights */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Insight Performa Akademik
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div
                                className={`w-2 h-2 rounded-full mt-2 ${
                                    currentIPK >= 3.5
                                        ? 'bg-green-500'
                                        : currentIPK >= 3.0
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                }`}></div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    Status IPK
                                </p>
                                <p className="text-sm text-gray-600">
                                    {currentIPK >= 3.5
                                        ? 'Sangat Baik - IPK di atas 3.5'
                                        : currentIPK >= 3.0
                                        ? 'Baik - IPK di atas standar minimum'
                                        : 'Perlu Perbaikan - IPK di bawah 3.0'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div
                                className={`w-2 h-2 rounded-full mt-2 ${
                                    trend > 0.1
                                        ? 'bg-green-500'
                                        : trend < -0.1
                                        ? 'bg-red-500'
                                        : 'bg-yellow-500'
                                }`}></div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    Trend Performa
                                </p>
                                <p className="text-sm text-gray-600">
                                    {trend > 0.1
                                        ? 'Meningkat - Performa akademik membaik'
                                        : trend < -0.1
                                        ? 'Menurun - Perlu perhatian khusus'
                                        : 'Stabil - Performa konsisten'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div
                                className={`w-2 h-2 rounded-full mt-2 ${
                                    totalSKS >= 144
                                        ? 'bg-green-500'
                                        : totalSKS >= 80
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                }`}></div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    Progress Kelulusan
                                </p>
                                <p className="text-sm text-gray-600">
                                    {totalSKS >= 144
                                        ? 'Siap Lulus - SKS mencukupi'
                                        : totalSKS >= 80
                                        ? 'Semester Akhir - Persiapan kelulusan'
                                        : 'Masih Proses - Lanjutkan semester berikutnya'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div
                                className={`w-2 h-2 rounded-full mt-2 ${
                                    averageIPPerSemester >= 3.25
                                        ? 'bg-green-500'
                                        : averageIPPerSemester >= 2.75
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                }`}></div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    Konsistensi
                                </p>
                                <p className="text-sm text-gray-600">
                                    {averageIPPerSemester >= 3.25
                                        ? 'Sangat Konsisten - Rata-rata IP tinggi'
                                        : averageIPPerSemester >= 2.75
                                        ? 'Cukup Konsisten - Performa stabil'
                                        : 'Perlu Peningkatan - Fokus pada konsistensi'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalisisTrendContent;
