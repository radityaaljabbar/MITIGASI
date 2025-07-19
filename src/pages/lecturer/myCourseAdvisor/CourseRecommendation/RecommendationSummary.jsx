import React from 'react';
import { useMyCourseAdvisor } from '../MyCourseAdvisorContext';

/**
 * Komponen untuk menampilkan ringkasan dari mata kuliah yang direkomendasikan.
 * Menampilkan semester tujuan, total mata kuliah, dan total SKS.
 * Component to display a summary of the recommended courses.
 * It shows the target semester, total courses, and total SKS.
 */
const RecommendationSummary = () => {
    // Mengambil data yang dibutuhkan dari konteks MyCourseAdvisor
    // Fetching the required data from the MyCourseAdvisor context
    const { recommendedCourses, totalRecommendedSKS, maxSKS, targetSemester } =
        useMyCourseAdvisor();

    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2">Ringkasan</h4>
            {/* Menampilkan semester tujuan jika sudah dipilih */}
            {/* Displaying the target semester if it has been selected */}
            {targetSemester && (
                <div className="flex justify-between mb-1">
                    <span>Semester Tujuan:</span>
                    <span className="font-medium text-[#951A22]">
                        Semester {targetSemester}
                    </span>
                </div>
            )}
            {/* Menampilkan total mata kuliah yang direkomendasikan */}
            {/* Displaying the total number of recommended courses */}
            <div className="flex justify-between">
                <span>Total Mata Kuliah:</span>
                <span className="font-medium">{recommendedCourses.length}</span>
            </div>
            {/* Menampilkan total SKS yang direkomendasikan dibandingkan dengan batas maksimum */}
            {/* Displaying the total recommended SKS compared to the maximum limit */}
            <div className="flex justify-between mt-1">
                <span>Total SKS:</span>
                <span
                    // Memberikan warna merah jika total SKS melebihi batas
                    // Applying red color if the total SKS exceeds the limit
                    className={`font-medium ${
                        totalRecommendedSKS >= maxSKS ? 'text-red-600' : ''
                    }`}>
                    {totalRecommendedSKS} / {maxSKS}
                </span>
            </div>
        </div>
    );
};

export default RecommendationSummary;
