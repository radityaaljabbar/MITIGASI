import React from 'react';
import { useMyCourseAdvisor } from '../MyCourseAdvisorContext';

const RecommendationSummary = () => {
    const { recommendedCourses, totalRecommendedSKS, MAX_SKS } =
        useMyCourseAdvisor();

    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2">Ringkasan</h4>
            <div className="flex justify-between">
                <span>Total Mata Kuliah:</span>
                <span className="font-medium">{recommendedCourses.length}</span>
            </div>
            <div className="flex justify-between mt-1">
                <span>Total SKS:</span>
                <span
                    className={`font-medium ${
                        totalRecommendedSKS >= MAX_SKS ? 'text-red-600' : ''
                    }`}>
                    {totalRecommendedSKS} / {MAX_SKS}
                </span>
            </div>
        </div>
    );
};

export default RecommendationSummary;
