import React from 'react';
import { analyzeDASS21Level } from '../../../../services/dosenWali/myStudent/cekAnalisisPsikologi';

/**
 * Komponen untuk menampilkan detail hasil tes psikologi DASS-21.
 * Component to display the detailed results of a DASS-21 psychology test.
 * @param {object} props - Props komponen.
 * @param {object} props.psychologyData - Data umum hasil tes.
 * @param {object} props.aspectData - Data skor per aspek.
 * @param {string} props.kesimpulan - Kesimpulan dari hasil tes.
 * @param {string} props.saran - Saran berdasarkan hasil tes.
 * @param {string} props.tanggalTes - Tanggal pelaksanaan tes.
 */
export default function PsychologyDetails({
    psychologyData,
    aspectData,
    kesimpulan,
    saran,
    tanggalTes,
}) {
    // Jika data tidak lengkap, jangan render
    // If data is incomplete, do not render
    if (!aspectData || !psychologyData) return null;

    // Definisi aspek-aspek yang diukur dalam DASS-21
    // Definition of the aspects measured in DASS-21
    const aspects = [
        {
            key: 'depression',
            label: 'Depression',
            description:
                'Mengukur tingkat depresi, kesedihan, dan kehilangan minat',
            maxScore: 21,
        },
        {
            key: 'anxiety',
            label: 'Anxiety (Kecemasan)',
            description:
                'Mengukur tingkat kecemasan, ketakutan, dan kekhawatiran',
            maxScore: 21,
        },
        {
            key: 'stress',
            label: 'Stress',
            description:
                'Mengukur tingkat stres, ketegangan, dan tekanan psikologis',
            maxScore: 21,
        },
    ];

    /**
     * Mendapatkan warna progress bar berdasarkan skor dan aspek.
     * Gets the progress bar color based on the score and aspect.
     * @param {number} score - Skor aspek.
     * @param {string} aspect - Nama aspek.
     * @returns {string} - Kelas Tailwind CSS untuk warna.
     */
    const getProgressBarColor = (score, aspect) => {
        const level = analyzeDASS21Level(score, aspect);
        const colorMap = {
            green: 'bg-green-500',
            yellow: 'bg-yellow-500',
            orange: 'bg-orange-500',
            red: 'bg-red-500',
            darkred: 'bg-red-800',
        };
        return colorMap[level.color] || 'bg-gray-500';
    };

    /**
     * Mendapatkan warna badge berdasarkan tingkat keparahan.
     * Gets the badge color based on the severity level.
     * @param {string} level - Nama tingkat (Normal, Ringan, dll).
     * @returns {string} - Kelas Tailwind CSS untuk warna.
     */
    const getLevelBadgeColor = (level) => {
        const colorMap = {
            Normal: 'bg-green-100 text-green-800 border-green-200',
            Ringan: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            Sedang: 'bg-orange-100 text-orange-800 border-orange-200',
            Parah: 'bg-red-100 text-red-800 border-red-200',
            'Sangat Parah': 'bg-red-200 text-red-900 border-red-300',
        };
        return colorMap[level] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <div className="bg-white p-6 rounded-lg border shadow-md">
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                    Detail Hasil DASS-21
                </h3>
                <p className="text-sm text-gray-600">
                    Tanggal Tes: <strong>{tanggalTes}</strong> | Total Skor:{' '}
                    <strong>{psychologyData.aspekPsikologi.totalSkor}</strong> |
                    Klasifikasi:{' '}
                    <strong className="text-green-700">
                        {psychologyData.klasifikasi}
                    </strong>
                </p>
            </div>

            <div className="space-y-6">
                {aspects.map((aspect) => {
                    const score = aspectData[aspect.key];
                    const level = analyzeDASS21Level(score, aspect.key);
                    const percentage = Math.round(
                        (score / aspect.maxScore) * 100
                    );

                    return (
                        <div
                            key={aspect.key}
                            className="border-b border-gray-100 pb-4 last:border-b-0">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-lg">
                                    {aspect.label}
                                </span>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold">
                                        {score}/{aspect.maxScore}
                                    </span>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelBadgeColor(
                                            level.level
                                        )}`}>
                                        {level.level}
                                    </span>
                                </div>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                <div
                                    className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor(
                                        score,
                                        aspect.key
                                    )}`}
                                    style={{ width: `${percentage}%` }}></div>
                            </div>

                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>0</span>
                                <span className="font-medium">
                                    {percentage}%
                                </span>
                                <span>21</span>
                            </div>

                            <p className="text-sm text-gray-700">
                                {aspect.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Kesimpulan dan Saran */}
            {/* Conclusion and Suggestions */}
            <div className="mt-8 space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold mb-2 text-blue-800">
                        Kesimpulan:
                    </h4>
                    <p className="text-gray-700">{kesimpulan}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold mb-2 text-green-800">
                        Saran:
                    </h4>
                    <p className="text-gray-700">{saran}</p>
                </div>
            </div>

            {/* Informasi tentang DASS-21 */}
            {/* Information about DASS-21 */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-2 text-gray-800">
                    Tentang DASS-21:
                </h4>
                <p className="text-sm text-gray-600">
                    DASS-21 (Depression Anxiety Stress Scales) adalah instrumen
                    penilaian psikologi yang terdiri dari 21 pertanyaan untuk
                    mengukur tingkat depresi, kecemasan, dan stres. Setiap aspek
                    dinilai dengan skala 0-21, dimana skor yang lebih tinggi
                    menunjukkan tingkat yang lebih parah.
                </p>
            </div>
        </div>
    );
}
