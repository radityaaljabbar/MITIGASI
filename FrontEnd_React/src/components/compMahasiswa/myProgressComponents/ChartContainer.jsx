import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartContainer = ({ id, data, type }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        // Hapus chart yang sudah ada sebelumnya jka sudah pernah dibuat.
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Buat chart baru berdasarkan jenis data:
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (type === 'semester') {
                // Untuk chart IP Semester
                chartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.map((item) => item.semester + 'Semester'),
                        datasets: [
                            {
                                label: 'Semester GPA',
                                data: data.map((item) => item.gpa),
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162,235,1)',
                                borderWidth: 2,
                                tension: 0.1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: false,
                                min: 2.5,
                                max: 4.0,
                            },
                        },
                    },
                });
            } else if (type === 'attendance') {
                // Untuk chart kehadiran
                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.map((item) => item.month),
                        datasets: [
                            {
                                label: 'Attendance (%)',
                                data: data.map((item) => item.attendance),
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: false,
                                min: 80,
                                max: 100,
                            },
                        },
                    },
                });
            }
        }
        // Cleanup Function:
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, type]);
    return (
        <div className="bg-white shadow-md p-3 rounded-lg w-full max-w-[600px] h-fit flex items-center justify-center">
            <canvas
                ref={chartRef}
                id={id}
                className="w-full !h-auto max-h-[320px]"></canvas>
        </div>
    );
};

export default ChartContainer;
