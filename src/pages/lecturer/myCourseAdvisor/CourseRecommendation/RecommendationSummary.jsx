import React from 'react';
import { useMyCourseAdvisor } from '../MyCourseAdvisorContext';

const RecommendationSummary = () => {
    const { recommendedCourses, totalRecommendedSKS, maxSKS, targetSemester } =
        useMyCourseAdvisor();

    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2">Ringkasan</h4>
            {targetSemester && (
                <div className="flex justify-between mb-1">
                    <span>Semester Tujuan:</span>
                    <span className="font-medium text-[#951A22]">
                        Semester {targetSemester}
                    </span>
                </div>
            )}
            <div className="flex justify-between">
                <span>Total Mata Kuliah:</span>
                <span className="font-medium">{recommendedCourses.length}</span>
            </div>
            <div className="flex justify-between mt-1">
                <span>Total SKS:</span>
                <span
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
