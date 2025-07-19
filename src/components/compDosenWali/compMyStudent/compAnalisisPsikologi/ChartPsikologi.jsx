import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

/**
 * Komponen untuk menampilkan grafik batang profil psikologi DASS-21.
 * Component to display a DASS-21 psychology profile bar chart.
 * @param {object} props - Props komponen.
 * @param {Array} props.data - Data yang akan ditampilkan di chart.
 */
export default function PsychologyChart({ data }) {
    // Jika tidak ada data, jangan render komponen
    // If there is no data, do not render the component
    if (!data || data.length === 0) return null;

    /**
     * Komponen kustom untuk tooltip pada chart.
     * Custom component for the chart's tooltip.
     * @param {object} props - Props dari Recharts.
     */
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                    <p className="font-semibold">{label}</p>
                    <p className="text-red-800">Skor: {data.nilai} / 21</p>
                    <p className="text-sm text-gray-600">
                        Persentase: {Math.round((data.nilai / 21) * 100)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    /**
     * Fungsi untuk mendapatkan warna bar berdasarkan skor dan jenis aspek.
     * Function to get the bar color based on the score and aspect type.
     * @param {object} entry - Data item (termasuk nama dan nilai).
     * @returns {string} - Kode warna heksadesimal.
     */
    const getBarColor = (entry) => {
        const score = entry.nilai;
        const aspect = entry.name.toLowerCase();

        let ranges;
        // Rentang skor untuk setiap aspek DASS-21
        // Score ranges for each DASS-21 aspect
        if (aspect === 'depression') {
            ranges = [
                { min: 0, max: 4, color: '#22c55e' }, // Normal - Green
                { min: 5, max: 6, color: '#eab308' }, // Ringan - Yellow
                { min: 7, max: 10, color: '#f97316' }, // Sedang - Orange
                { min: 11, max: 13, color: '#ef4444' }, // Parah - Red
                { min: 14, max: 21, color: '#991b1b' }, // Sangat Parah - Dark Red
            ];
        } else if (aspect === 'anxiety') {
            ranges = [
                { min: 0, max: 3, color: '#22c55e' },
                { min: 4, max: 5, color: '#eab308' },
                { min: 6, max: 7, color: '#f97316' },
                { min: 8, max: 9, color: '#ef4444' },
                { min: 10, max: 21, color: '#991b1b' },
            ];
        } else {
            // Aspek 'stress'
            // 'stress' aspect
            ranges = [
                { min: 0, max: 7, color: '#22c55e' },
                { min: 8, max: 9, color: '#eab308' },
                { min: 10, max: 12, color: '#f97316' },
                { min: 13, max: 16, color: '#ef4444' },
                { min: 17, max: 21, color: '#991b1b' },
            ];
        }

        const range = ranges.find((r) => score >= r.min && score <= r.max);
        return range ? range.color : '#9f1239';
    };

    // Transformasi data untuk menambahkan properti 'fill' (warna) ke setiap item
    // Transforming data to add a 'fill' (color) property to each item
    const dataWithColors = data.map((item) => ({
        ...item,
        fill: getBarColor(item),
    }));

    return (
        <div className="p-6 rounded-lg mb-6 border-2 shadow-md">
            <h3 className="text-xl font-semibold mb-4">
                Profil Psikologi - DASS-21
            </h3>

            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                    <strong>DASS-21</strong> mengukur tingkat Depression,
                    Anxiety, dan Stress dengan skala 0-21 untuk setiap aspek.
                </p>
            </div>

            <div className="h-80 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={dataWithColors}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            interval={0}
                        />
                        <YAxis
                            domain={[0, 21]}
                            tick={{ fontSize: 12 }}
                            label={{
                                value: 'Skor',
                                angle: -90,
                                position: 'insideLeft',
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            dataKey="nilai"
                            name="Skor DASS-21"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legenda untuk tingkat keparahan */}
            {/* Legend for severity levels */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                    <span>Normal</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                    <span>Ringan</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                    <span>Sedang</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                    <span>Parah</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-800 rounded mr-2"></div>
                    <span>Sangat Parah</span>
                </div>
            </div>
        </div>
    );
}
