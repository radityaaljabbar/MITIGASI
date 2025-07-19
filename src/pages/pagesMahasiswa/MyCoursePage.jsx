import React from 'react';
import RekomendasiMataKuliah from '../../components/compMahasiswa/myCourseComponents/RekomendasiMataKuliah';
import RiwayatMataKuliah from '../../components/compMahasiswa/myCourseComponents/RiwayatMataKuliah';

/**
 * Komponen halaman "My Course" yang menggabungkan komponen Rekomendasi dan Riwayat Mata Kuliah.
 * "My Course" page component that combines the Course Recommendation and Course History components.
 */
const MyCoursePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-5 gap-7 w-full">
             {/* Header Halaman */}
            {/* Page Header */}
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    MyCourse
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Lihat riwayat mata kuliah yang telah Anda tempuh dan
                    rekomendasi mata kuliah untuk semester mendatang dari dosen
                    wali Anda.
                </p>
            </div>

            {/* Komponen untuk menampilkan rekomendasi mata kuliah */}
            {/* Component to display course recommendations */}
            <RekomendasiMataKuliah />
            
            {/* Komponen untuk menampilkan riwayat mata kuliah */}
            {/* Component to display course history */}
            <RiwayatMataKuliah />
        </div>
    );
};

export default MyCoursePage;
