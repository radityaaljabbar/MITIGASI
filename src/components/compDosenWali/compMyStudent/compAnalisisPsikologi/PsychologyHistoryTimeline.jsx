import React from 'react';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Komponen untuk menampilkan riwayat tes psikologi dalam format timeline.
 * Component to display psychology test history in a timeline format.
 * @param {object} props - Props komponen.
 * @param {Array} props.historyData - Data riwayat tes.
 * @param {number} props.selectedIndex - Indeks tes yang sedang dipilih.
 * @param {function} props.onSelectTest - Fungsi untuk memilih tes dari timeline.
 * @param {boolean} props.showComparison - Menampilkan perbandingan dengan tes sebelumnya.
 */
export default function PsychologyHistoryTimeline({
    historyData,
    selectedIndex,
    onSelectTest,
    showComparison = false,
}) {
    // Jika tidak ada data, jangan render komponen
    // If there is no data, do not render the component
    if (!historyData || historyData.length === 0) return null;

    /**
     * Mendapatkan warna untuk badge klasifikasi.
     * Gets the color for the classification badge.
     * @param {string} klasifikasi - Status klasifikasi ('aman', 'sedang', 'tinggi').
     * @returns {string} - Kelas Tailwind CSS untuk warna.
     */
    const getKlasifikasiColor = (klasifikasi) => {
        const lowerKlasifikasi = klasifikasi?.toLowerCase();
        switch (lowerKlasifikasi) {
            case 'aman':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'sedang':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'tinggi':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    /**
     * Mendapatkan ikon tren berdasarkan perbandingan skor total dengan tes sebelumnya.
     * Gets the trend icon based on the total score comparison with the previous test.
     * @param {object} current - Data tes saat ini.
     * @param {object} previous - Data tes sebelumnya.
     * @returns {JSX.Element|null} - Ikon tren.
     */
    const getTrendIcon = (current, previous) => {
        if (!previous) return null;

        const change =
            current.aspekPsikologi.totalSkor -
            previous.aspekPsikologi.totalSkor;
        if (change < -5)
            return <TrendingDown className="h-4 w-4 text-green-600" />;
        if (change > 5) return <TrendingUp className="h-4 w-4 text-red-600" />;
        return <Minus className="h-4 w-4 text-gray-400" />;
    };

    return (
        <div className="bg-white p-6 rounded-lg border shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-[#951A22]" />
                Riwayat Evaluasi Psikologi
            </h3>

            <div className="relative">
                {/* Garis vertikal timeline */}
                {/* Vertical timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                {/* Item-item pada timeline */}
                {/* Timeline items */}
                <div className="space-y-6">
                    {historyData.map((item, index) => {
                        const isSelected = selectedIndex === index;
                        const isLatest = index === 0;
                        const previousItem =
                            index < historyData.length - 1
                                ? historyData[index + 1]
                                : null;

                        return (
                            <div
                                key={item.id}
                                className={`relative flex items-start cursor-pointer transition-all`}
                                onClick={() => onSelectTest(index)}>
                                {/* Titik pada timeline */}
                                {/* Timeline dot */}
                                <div
                                    className={`
                                    absolute left-5 w-6 h-6 rounded-full border-4 
                                    ${
                                        isSelected
                                            ? 'bg-[#951A22] border-white shadow-lg'
                                            : 'bg-white border-gray-400'
                                    }
                                    ${isLatest ? 'animate-pulse' : ''}
                                `}></div>

                                {/* Kartu konten */}
                                {/* Content card */}
                                <div
                                    className={`
                                    ml-16 p-4 rounded-lg border transition-all w-full
                                    ${
                                        isSelected
                                            ? 'border-[#951A22] shadow-md bg-red-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }
                                    ${
                                        isLatest
                                            ? 'border-l-4 border-l-[#951A22]'
                                            : ''
                                    }
                                `}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                Evaluasi #{item.testNumber}
                                                {isLatest && (
                                                    <span className="ml-2 text-xs bg-[#951A22] text-white px-2 py-0.5 rounded">
                                                        Terbaru
                                                    </span>
                                                )}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {item.tanggalTes}
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {showComparison &&
                                                getTrendIcon(
                                                    item,
                                                    previousItem
                                                )}
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full border ${getKlasifikasiColor(
                                                    item.klasifikasi
                                                )}`}>
                                                {item.klasifikasi}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Ringkasan skor DASS-21 */}
                                    {/* DASS-21 score summary */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Depression:
                                            </span>
                                            <span className="font-medium">
                                                {item.aspekPsikologi.depression}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Anxiety:
                                            </span>
                                            <span className="font-medium">
                                                {item.aspekPsikologi.anxiety}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Stress:
                                            </span>
                                            <span className="font-medium">
                                                {item.aspekPsikologi.stress}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Total:
                                            </span>
                                            <span className="font-medium">
                                                {item.aspekPsikologi.totalSkor}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Ringkasan perbandingan jika diaktifkan */}
                                    {/* Comparison summary if enabled */}
                                    {showComparison && previousItem && (
                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                            <ComparisonSummary
                                                current={item}
                                                previous={previousItem}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/**
 * Komponen kecil untuk menampilkan ringkasan perbandingan.
 * Small component to display a comparison summary.
 * @param {object} props - Props komponen.
 * @param {object} props.current - Data tes saat ini.
 * @param {object} props.previous - Data tes sebelumnya.
 */
function ComparisonSummary({ current, previous }) {
    const totalChange =
        current.aspekPsikologi.totalSkor - previous.aspekPsikologi.totalSkor;
    // Untuk DASS-21, skor total yang lebih rendah lebih baik
    // For DASS-21, higher total score is better
    const isImproved = totalChange > 0; 
    return (
        <div className="text-xs text-gray-600">
            <span>Perubahan dari tes sebelumnya: </span>
            <span
                className={`font-medium ${
                    isImproved ? 'text-green-600' : 'text-red-600'
                }`}>
                {isImproved ? '+' : ''}
                {totalChange} poin
            </span>
        </div>
    );
}
