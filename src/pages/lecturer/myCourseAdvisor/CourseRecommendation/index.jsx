import React from 'react';
import { useMyCourseAdvisor } from '../MyCourseAdvisorContext';
import AvailableCourses from './AvailableCourses';
import RecommendedCourses from './RecommendedCourses';

/**
 * Komponen utama yang mengatur tata letak halaman rekomendasi mata kuliah.
 * Menampilkan daftar mata kuliah tersedia dan daftar mata kuliah yang direkomendasikan secara berdampingan.
 * Main component that manages the layout of the course recommendation page.
 * It displays the available courses list and the recommended courses list side-by-side.
 */
const CourseRecommendation = () => {
    // Mengambil state dan fungsi yang dibutuhkan dari konteks MyCourseAdvisor
    // Fetching the necessary state and functions from the MyCourseAdvisor context
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
                    {/* Badge untuk menandakan tipe rekomendasi (existing atau otomatis) */}
                    {/* Badge to indicate the type of recommendation (existing or automatic) */}
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
                {/* Tombol Aksi: Reset dan Kirim/Update Rekomendasi */}
                {/* Action Buttons: Reset and Send/Update Recommendations */}
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

            {/* Tampilan kondisional saat data sedang dimuat */}
            {/* Conditional display while data is loading */}
            {isLoadingRecommendations ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Memuat rekomendasi...</p>
                </div>
            ) : (
                // Layout grid untuk menampilkan dua komponen utama
                // Grid layout to display the two main components
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Komponen Mata Kuliah Tersedia */}
                    {/* Available Courses Component */}
                    <AvailableCourses />

                    {/* Komponen Mata Kuliah Direkomendasikan */}
                    {/* Recommended Courses Component */}
                    <RecommendedCourses />
                </div>
            )}
        </div>
    );
};

export default CourseRecommendation;
