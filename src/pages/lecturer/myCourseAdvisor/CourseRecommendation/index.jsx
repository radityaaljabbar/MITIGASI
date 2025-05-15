import React from 'react';
import { useMyCourseAdvisor } from '../MyCourseAdvisorContext';
import AvailableCourses from './AvailableCourses';
import RecommendedCourses from './RecommendedCourses';

const CourseRecommendation = () => {
    const { resetAvailableCourses, sendRecommendations } = useMyCourseAdvisor();

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">
                    Rekomendasi Mata Kuliah
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={resetAvailableCourses}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 print:hidden">
                        Reset
                    </button>
                    <button
                        onClick={sendRecommendations}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 print:hidden">
                        Kirim Rekomendasi
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available Courses */}
                <AvailableCourses />

                {/* Recommended Courses */}
                <RecommendedCourses />
            </div>
        </div>
    );
};

export default CourseRecommendation;
