import React, { useRef } from 'react';
import {
    MyCourseAdvisorProvider,
    useMyCourseAdvisor,
} from './MyCourseAdvisorContext';
import ClassStudentSelector from './ClassStudentSelector';
import CourseHistory from './CourseHistory';
import CourseRecommendation from './CourseRecommendation';

/**
 * Komponen internal yang menggunakan data dari MyCourseAdvisorContext.
 * Komponen ini bertanggung jawab untuk merender UI utama halaman rekomendasi mata kuliah.
 * This is the inner component that uses data from the MyCourseAdvisorContext.
 * It is responsible for rendering the main UI of the course recommendation page.
 */
const MyCourseAdvisorContent = () => {
    // Mengambil state yang diperlukan dari konteks
    // Fetching the necessary state from the context
    const { isLoading, selectedStudent, targetSemester } = useMyCourseAdvisor();
    // Ref untuk komponen yang mungkin akan digunakan untuk fungsionalitas cetak atau lainnya
    // Ref for the component which might be used for printing or other functionalities
    const componentRef = useRef();

    return (
        <div className="p-6 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Rekomendasi Mata Kuliah</h1>

            {/* Komponen pemilih kelas dan mahasiswa hanya ditampilkan setelah loading selesai */}
            {/* The class and student selector component is only displayed after loading is complete */}
            {!isLoading && <ClassStudentSelector />}

            {/* Konten utama (riwayat dan rekomendasi) ditampilkan hanya jika semua pilihan sudah lengkap */}
            {/* The main content (history and recommendations) is displayed only if all selections are complete */}
            {!isLoading && selectedStudent && targetSemester && (
                <div ref={componentRef}>
                    {/* Komponen Riwayat Mata Kuliah Mahasiswa */}
                    {/* Student's Course History Component */}
                    <CourseHistory />

                    {/* Komponen Rekomendasi Mata Kuliah */}
                    {/* Course Recommendation Component */}
                    <CourseRecommendation />
                </div>
            )}

            {/* Pesan ditampilkan jika ada pilihan yang belum lengkap */}
            {/* A message is displayed if any selection is incomplete */}
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

/**
 * Komponen luar (wrapper) yang menyediakan MyCourseAdvisorContext kepada anak-anaknya.
 * Ini memastikan bahwa MyCourseAdvisorContent dan semua komponen di dalamnya memiliki akses ke state dan fungsi yang dibagikan.
 * This is the outer (wrapper) component that provides the MyCourseAdvisorContext to its children.
 * It ensures that MyCourseAdvisorContent and all components within it have access to the shared state and functions.
 */
const MyCourseAdvisor = () => {
    return (
        <MyCourseAdvisorProvider>
            <MyCourseAdvisorContent />
        </MyCourseAdvisorProvider>
    );
};

export default MyCourseAdvisor;
