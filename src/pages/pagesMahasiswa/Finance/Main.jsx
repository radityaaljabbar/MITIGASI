import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Komponen halaman utama untuk fitur "Keuangan Saya".
 * Menampilkan pilihan untuk membuat pengajuan baru atau melihat riwayat.
 * Main page component for the "My Finance" feature.
 * Displays options to create a new application or view history.
 */
const MyFinanceMain = () => {
  return (
    <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 sm:p-8 lg:p-10 text-center space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#951A22] border-b-2 border-gray-100 pb-4 w-full">
          Keuangan Saya
        </h1>
        
        <div className="space-y-5">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Dapatkan Dukungan Finansial Anda!
          </h2>
          
          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
            Evaluasi kondisi keuangan Anda dengan mengisi kuesioner ini. 
            Kami akan membantu Anda menemukan solusi dan dukungan finansial yang sesuai dengan kebutuhan Anda.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
            {/* Tombol untuk membuat pengajuan baru */}
            {/* Button to create a new application */}
            <Link 
                to = 'application'
                className="w-full sm:w-auto px-6 py-3 bg-[#951A22] text-white rounded-lg 
                         hover:bg-[#7a1118] transition-all duration-300 
                         transform hover:-translate-y-1 hover:shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-[#951A22] focus:ring-opacity-50"
            >
              Buat Pengajuan
            </Link>
            
            {/* Tombol untuk melihat riwayat pengajuan */}
            {/* Button to view application history */}
            <Link 
                to = 'application-history'
                className="w-full sm:w-auto px-6 py-3 border-2 border-[#951A22] text-[#951A22] 
                         rounded-lg hover:bg-[#951A22] hover:text-white 
                         transition-all duration-300 
                         transform hover:-translate-y-1 hover:shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-[#951A22] focus:ring-opacity-50"
            >
              Lihat History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyFinanceMain;