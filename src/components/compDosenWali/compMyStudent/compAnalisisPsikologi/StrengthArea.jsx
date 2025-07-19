import React from 'react';
import { analyzeDASS21Level } from '../../../../services/dosenWali/myStudent/cekAnalisisPsikologi';

/**
 * Komponen untuk menampilkan aspek positif dan area pengembangan berdasarkan data psikologi.
 * Component to display positive aspects and development areas based on psychology data.
 * @param {object} props - Props komponen.
 * @param {object} props.psychologyData - Data psikologi mahasiswa.
 */
export default function StrengthsAreas({ psychologyData }) {
    // Jika data tidak lengkap, jangan render
    // If data is incomplete, do not render
    if (!psychologyData || !psychologyData.aspekPsikologi) {
        return null;
    }

    const { depression, anxiety, stress } = psychologyData.aspekPsikologi;

    // Menganalisis tingkat keparahan untuk setiap aspek
    // Analyzing the severity level for each aspect
    const depressionLevel = analyzeDASS21Level(depression, 'depression');
    const anxietyLevel = analyzeDASS21Level(anxiety, 'anxiety');
    const stressLevel = analyzeDASS21Level(stress, 'stress');

    // Mengelompokkan hasil ke dalam aspek positif dan area pengembangan
    // Grouping results into positive aspects and development areas
    const positiveAspects = [];
    const developmentAreas = [];

    // Logika untuk depresi
    // Logic for depression
    if (
        depressionLevel.level === 'Normal' ||
        depressionLevel.level === 'Ringan'
    ) {
        positiveAspects.push(
            `Tingkat Depresi ${depressionLevel.level} (${depression}/21)`
        );
    } else {
        developmentAreas.push(
            `Pengelolaan Depresi - Level ${depressionLevel.level} (${depression}/21)`
        );
    }

    // Logika untuk kecemasan
    // Logic for anxiety
    if (anxietyLevel.level === 'Normal' || anxietyLevel.level === 'Ringan') {
        positiveAspects.push(
            `Tingkat Kecemasan ${anxietyLevel.level} (${anxiety}/21)`
        );
    } else {
        developmentAreas.push(
            `Pengelolaan Kecemasan - Level ${anxietyLevel.level} (${anxiety}/21)`
        );
    }

    // Logika untuk stres
    // Logic for stress
    if (stressLevel.level === 'Normal' || stressLevel.level === 'Ringan') {
        positiveAspects.push(
            `Tingkat Stres ${stressLevel.level} (${stress}/21)`
        );
    } else {
        developmentAreas.push(
            `Pengelolaan Stres - Level ${stressLevel.level} (${stress}/21)`
        );
    }

    // Menambahkan rekomendasi umum berdasarkan klasifikasi keseluruhan
    // Adding general recommendations based on overall classification
    if (psychologyData.klasifikasi === 'Aman') {
        positiveAspects.push('Kondisi psikologis secara keseluruhan baik');
    }

    // Pesan default jika tidak ada area pengembangan yang spesifik
    // Default message if there are no specific development areas
    if (developmentAreas.length === 0) {
        developmentAreas.push('Pertahankan kondisi psikologis yang baik');
        developmentAreas.push(
            'Lakukan aktivitas preventif untuk kesehatan mental'
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 rounded-md">
            {/* Kartu Aspek Positif */}
            {/* Positive Aspects Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <h4 className="font-semibold mb-4 text-green-700">
                    Aspek Positif
                </h4>
                {positiveAspects.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                        {positiveAspects.map((aspect, index) => (
                            <li key={index} className="text-sm text-gray-700">
                                {aspect}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 italic">
                        Perlu perhatian khusus pada semua aspek psikologis
                    </p>
                )}
            </div>

            {/* Development Areas Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <h4 className="font-semibold mb-4 text-orange-700">
                    Area Pengembangan
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                    {developmentAreas.map((area, index) => (
                        <li key={index} className="text-sm text-gray-700">
                            {area}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
