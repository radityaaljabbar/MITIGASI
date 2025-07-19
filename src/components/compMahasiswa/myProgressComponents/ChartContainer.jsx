import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * Komponen kontainer yang dapat digunakan kembali untuk merender grafik menggunakan Chart.js.
 * A reusable container component for rendering charts using Chart.js.
 * @param {object} props - Props komponen.
 * @param {string} props.id - ID unik untuk elemen canvas.
 * @param {Array} props.data - Data yang akan divisualisasikan.
 * @param {string} props.type - Jenis grafik ('semester' atau 'attendance').
 */
const ChartContainer = ({ id, data, type }) => {
    // Ref untuk elemen canvas dan instance chart
    // Refs for the canvas element and the chart instance
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    // Effect untuk membuat, memperbarui, dan menghapus chart
    // Effect to create, update, and destroy the chart
    useEffect(() => {
        // Hapus chart yang sudah ada sebelumnya untuk mencegah memory leak
        // Destroy the previous chart instance to prevent memory leaks
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Buat chart baru berdasarkan jenis data yang diberikan
        // Create a new chart based on the provided data type
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (type === 'semester') {
                // Grafik campuran: Bar untuk IP Semester dan Line untuk tren
                // Mixed Chart: Bar for Semester GPA and Line for the trend
                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.map((item) => `Semester ${item.semester}`),
                        datasets: [
                            {
                                type: 'bar',
                                label: 'IP Semester',
                                data: data.map((item) => item.ipSemester),
                                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                                borderColor: 'rgb(99, 102, 241)',
                                borderWidth: 1,
                                borderRadius: 6,
                                borderSkipped: false,
                                order: 2,
                            },
                            {
                                type: 'line',
                                label: 'Trend',
                                data: data.map((item) => item.ipSemester),
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                borderColor: 'rgb(239, 68, 68)',
                                borderWidth: 2,
                                tension: 0.3,
                                fill: false,
                                pointBackgroundColor: 'rgb(239, 68, 68)',
                                pointBorderColor: 'white',
                                pointBorderWidth: 2,
                                pointRadius: 4,
                                pointHoverRadius: 6,
                                pointHoverBackgroundColor: 'rgb(239, 68, 68)',
                                pointHoverBorderColor: 'white',
                                pointHoverBorderWidth: 2,
                                order: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            intersect: false,
                            mode: 'index',
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                                align: 'end',
                                labels: {
                                    usePointStyle: true,
                                    pointStyle: 'circle',
                                    font: {
                                        size: 11,
                                        weight: '500',
                                    },
                                    color: 'rgb(107, 114, 128)',
                                    padding: 15,
                                },
                            },
                            tooltip: {
                                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                titleColor: 'white',
                                bodyColor: 'white',
                                borderColor: 'rgb(99, 102, 241)',
                                borderWidth: 1,
                                cornerRadius: 8,
                                padding: 12,
                                displayColors: false,
                                titleFont: {
                                    size: 14,
                                    weight: '600',
                                },
                                bodyFont: {
                                    size: 13,
                                },
                            },
                        },
                        scales: {
                            x: {
                                border: {
                                    display: false,
                                },
                                grid: {
                                    display: false,
                                },
                                ticks: {
                                    color: 'rgb(107, 114, 128)',
                                    font: {
                                        size: 12,
                                        weight: '500',
                                    },
                                    padding: 10,
                                },
                            },
                            y: {
                                beginAtZero: true,
                                max: 4.0,
                                border: {
                                    display: false,
                                },
                                grid: {
                                    color: 'rgba(229, 231, 235, 0.8)',
                                    drawBorder: false,
                                },
                                ticks: {
                                    color: 'rgb(107, 114, 128)',
                                    font: {
                                        size: 12,
                                        weight: '500',
                                    },
                                    padding: 10,
                                    stepSize: 0.5,
                                },
                            },
                        },
                    },
                });
            } else if (type === 'attendance') {
                // Grafik Bar sederhana untuk kehadiran
                // Simple Bar chart for attendance
                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.map((item) => item.month),
                        datasets: [
                            {
                                label: 'Kehadiran (%)',
                                data: data.map((item) => item.attendance),
                                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                                borderColor: 'rgb(34, 197, 94)',
                                borderWidth: 0,
                                borderRadius: 6,
                                borderSkipped: false,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                titleColor: 'white',
                                bodyColor: 'white',
                                borderColor: 'rgb(34, 197, 94)',
                                borderWidth: 1,
                                cornerRadius: 8,
                                padding: 12,
                                displayColors: false,
                                titleFont: {
                                    size: 14,
                                    weight: '600',
                                },
                                bodyFont: {
                                    size: 13,
                                },
                            },
                        },
                        scales: {
                            x: {
                                border: {
                                    display: false,
                                },
                                grid: {
                                    display: false,
                                },
                                ticks: {
                                    color: 'rgb(107, 114, 128)',
                                    font: {
                                        size: 12,
                                        weight: '500',
                                    },
                                    padding: 10,
                                },
                            },
                            y: {
                                beginAtZero: false,
                                min: 80,
                                max: 100,
                                border: {
                                    display: false,
                                },
                                grid: {
                                    color: 'rgba(229, 231, 235, 0.8)',
                                    drawBorder: false,
                                },
                                ticks: {
                                    color: 'rgb(107, 114, 128)',
                                    font: {
                                        size: 12,
                                        weight: '500',
                                    },
                                    padding: 10,
                                },
                            },
                        },
                    },
                });
            }
        }
        // Fungsi cleanup: Dijalankan saat komponen unmount atau data berubah
        // Cleanup Function: Runs when the component unmounts or data changes
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, type]); // Dependensi: chart akan dibuat ulang jika data atau tipe berubah

    // Menentukan judul chart secara dinamis
    // Dynamically determining the chart title
    const chartTitle =
        type === 'semester' ? 'Perkembangan IP Semester' : 'Tingkat Kehadiran';

    return (
        <div className="bg-white border border-gray-100 shadow-lg rounded-2xl p-6 w-full max-w-[600px] h-fit">
            {/* Header dengan judul dan indikator */}
            {/* Header with title and indicator */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {chartTitle}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {type === 'semester'
                            ? 'Bar chart dengan trend line untuk melihat pola'
                            : 'Persentase kehadiran bulanan'}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-xs font-medium text-gray-600">
                        {type === 'semester' ? 'IP Semester' : 'Kehadiran'}
                    </span>
                </div>
            </div>

            {/* Kontainer untuk elemen canvas chart */}
            {/* Container for the chart canvas element */}
            <div className="relative h-[280px] w-full">
                <canvas
                    ref={chartRef}
                    id={id}
                    className="w-full h-full"></canvas>
            </div>
        </div>
    );
};

export default ChartContainer;