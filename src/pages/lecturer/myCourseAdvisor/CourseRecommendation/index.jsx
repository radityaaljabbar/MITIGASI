import React from 'react';
import { useMyCourseAdvisor } from '../MyCourseAdvisorContext';
import AvailableCourses from './AvailableCourses';
import RecommendedCourses from './RecommendedCourses';

const CourseRecommendation = () => {
    const {
        resetAvailableCourses,
        sendRecommendations,
        hasExistingRecommendations,
        isLoadingRecommendations,
        recommendedCourses,
    } = useMyCourseAdvisor();

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    Rekomendasi Mata Kuliah
                    {hasExistingRecommendations && (
                        <span className="text-sm font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            Rekomendasi Existing
                        </span>
                    )}
                    {!hasExistingRecommendations &&
                        recommendedCourses.length > 0 && (
                            <span className="text-sm font-normal text-green-600 bg-green-50 px-2 py-1 rounded">
                                Rekomendasi Otomatis
                            </span>
                        )}
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={resetAvailableCourses}
                        disabled={isLoadingRecommendations}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 print:hidden disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Reset
                    </button>
                    <button
                        onClick={sendRecommendations}
                        disabled={
                            isLoadingRecommendations ||
                            recommendedCourses.length === 0
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 print:hidden disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {hasExistingRecommendations
                            ? 'Update Rekomendasi'
                            : 'Kirim Rekomendasi'}
                    </button>
                </div>
            </div>

            {isLoadingRecommendations ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Memuat rekomendasi...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Available Courses */}
                    <AvailableCourses />

                    {/* Recommended Courses */}
                    <RecommendedCourses />
                </div>
            )}
        </div>
    );
};

export default CourseRecommendation;
