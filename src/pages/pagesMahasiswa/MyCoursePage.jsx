import React from 'react';
import RekomendasiMataKuliah from '../../components/compMahasiswa/myCourseComponents/RekomendasiMataKuliah';
import RiwayatMataKuliah from '../../components/compMahasiswa/myCourseComponents/RiwayatMataKuliah';

const MyCoursePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-5 gap-7 w-full">
            {/* Page Header */}
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Mata Kuliah Saya
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Lihat riwayat mata kuliah yang telah Anda tempuh dan
                    rekomendasi mata kuliah untuk semester mendatang dari dosen
                    wali Anda.
                </p>
            </div>

            <RekomendasiMataKuliah />
            <RiwayatMataKuliah />
        </div>
    );
};

export default MyCoursePage;
