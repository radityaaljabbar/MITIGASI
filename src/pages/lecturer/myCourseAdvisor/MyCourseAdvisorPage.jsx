import React, { useRef } from 'react';
import {
    MyCourseAdvisorProvider,
    useMyCourseAdvisor,
} from './MyCourseAdvisorContext';
import ClassStudentSelector from './ClassStudentSelector';
import CourseHistory from './CourseHistory';
import CourseRecommendation from './CourseRecommendation';

// This is the inner component that uses the context
const MyCourseAdvisorContent = () => {
    const { isLoading, selectedStudent, targetSemester } = useMyCourseAdvisor();
    const componentRef = useRef();

    return (
        <div className="p-6 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Rekomendasi Mata Kuliah</h1>

            {/* Selection Controls */}
            {!isLoading && <ClassStudentSelector />}

            {/* Show content only if ALL selections are complete AND initial data has loaded */}
            {!isLoading && selectedStudent && targetSemester && (
                <div ref={componentRef}>
                    {/* Course History */}
                    <CourseHistory />

                    {/* Recommendation Section */}
                    <CourseRecommendation />
                </div>
            )}

            {/* Show message if ANY selection is incomplete AND initial data has loaded */}
            {!isLoading && (!selectedStudent || !targetSemester) && (
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600">
                        Silahkan pilih kelas, mahasiswa, dan semester tujuan
                        terlebih dahulu untuk melihat riwayat dan membuat
                        rekomendasi mata kuliah
                    </p>
                </div>
            )}
        </div>
    );
};

// This is the outer component that provides the context
const MyCourseAdvisor = () => {
    return (
        <MyCourseAdvisorProvider>
            <MyCourseAdvisorContent />
        </MyCourseAdvisorProvider>
    );
};

export default MyCourseAdvisor;
