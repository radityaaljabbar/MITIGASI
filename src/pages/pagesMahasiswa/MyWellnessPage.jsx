import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Komponen halaman utama untuk fitur "Kesehatan Mental Saya" (MyWellness).
 * Halaman ini memberikan pengantar dan pilihan untuk memulai evaluasi baru atau melihat riwayat.
 * Main page component for the "My Wellness" feature.
 * This page provides an introduction and options to start a new evaluation or view history.
 */
const MyWellnessPage = () => {
    return (
        <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 sm:p-8 lg:p-10 text-center space-y-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#951A22] border-b-2 border-gray-100 pb-4 w-full">
                    Kesehatan Mental Saya
                </h1>

                <div className="space-y-5">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                        Evaluasi Kondisi Psikologis Anda
                    </h2>

                    <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
                        Evaluasi kondisi psikologis Anda menggunakan instrumen
                        DASS-21 (Depression, Anxiety, Stress Scales). Kami akan
                        membantu Anda memahami kondisi mental Anda dan
                        memberikan saran yang sesuai.
                    </p>

                    {/* Kotak informasi penting tentang DASS-21 */}
                    {/* Important information box about DASS-21 */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left max-w-lg mx-auto">
                        <p className="text-xs sm:text-sm text-blue-800">
                            <strong>Penting:</strong> DASS-21 bukanlah alat
                            diagnosis klinis dan tidak dapat mendiagnosis
                            depresi, kecemasan, atau stres. Evaluasi ini hanya
                            memberikan indikasi apakah masalah-masalah tersebut
                            memiliki dampak signifikan terhadap kehidupan Anda
                            saat ini.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
                        {/* Tombol untuk memulai evaluasi baru */}
                        {/* Button to start a new evaluation */}
                        <Link
                            to="/student/my-wellness/psi-test"
                            className="w-full sm:w-auto px-6 py-3 bg-[#951A22] text-white rounded-lg 
                                     hover:bg-[#7a1118] transition-all duration-300 
                                     transform hover:-translate-y-1 hover:shadow-lg
                                     focus:outline-none focus:ring-2 focus:ring-[#951A22] focus:ring-opacity-50">
                            Mulai Evaluasi
                        </Link>

                        {/* Tombol untuk melihat riwayat evaluasi */}
                        {/* Button to view evaluation history */}
                        <Link
                            to="/student/my-wellness/history"
                            className="w-full sm:w-auto px-6 py-3 border-2 border-[#951A22] text-[#951A22] 
                                     rounded-lg hover:bg-[#951A22] hover:text-white 
                                     transition-all duration-300 
                                     transform hover:-translate-y-1 hover:shadow-lg
                                     focus:outline-none focus:ring-2 focus:ring-[#951A22] focus:ring-opacity-50">
                            Lihat Riwayat
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyWellnessPage;
