import React from 'react';
import { analyzeDASS21Level } from '../../../../services/dosenWali/myStudent/cekAnalisisPsikologi';

export default function StrengthsAreas({ psychologyData }) {
    if (!psychologyData || !psychologyData.aspekPsikologi) {
        return null;
    }

    const { depression, anxiety, stress } = psychologyData.aspekPsikologi;

    // Analyze each aspect
    const depressionLevel = analyzeDASS21Level(depression, 'depression');
    const anxietyLevel = analyzeDASS21Level(anxiety, 'anxiety');
    const stressLevel = analyzeDASS21Level(stress, 'stress');

    // Determine positive aspects (Normal or Mild levels)
    const positiveAspects = [];
    const developmentAreas = [];

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

    if (anxietyLevel.level === 'Normal' || anxietyLevel.level === 'Ringan') {
        positiveAspects.push(
            `Tingkat Kecemasan ${anxietyLevel.level} (${anxiety}/21)`
        );
    } else {
        developmentAreas.push(
            `Pengelolaan Kecemasan - Level ${anxietyLevel.level} (${anxiety}/21)`
        );
    }

    if (stressLevel.level === 'Normal' || stressLevel.level === 'Ringan') {
        positiveAspects.push(
            `Tingkat Stres ${stressLevel.level} (${stress}/21)`
        );
    } else {
        developmentAreas.push(
            `Pengelolaan Stres - Level ${stressLevel.level} (${stress}/21)`
        );
    }

    // Add general recommendations based on overall condition
    if (psychologyData.klasifikasi === 'Aman') {
        positiveAspects.push('Kondisi psikologis secara keseluruhan baik');
    }

    if (developmentAreas.length === 0) {
        developmentAreas.push('Pertahankan kondisi psikologis yang baik');
        developmentAreas.push(
            'Lakukan aktivitas preventif untuk kesehatan mental'
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 rounded-md">
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
