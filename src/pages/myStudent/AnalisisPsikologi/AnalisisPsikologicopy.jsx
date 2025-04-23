// File: src/pages/AnalisisPsikologi/DetailPage.jsx
import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import handleBack from '../../../components/handleBack';
import StudentInfo from '../../../components/compDosenWali/compMyStudent/compAnalisisPsikologi/StudentInfoPsikologi';
import PsychologyChart from '../../../components/compDosenWali/compMyStudent/compAnalisisPsikologi/ChartPsikologi';
import StrengthsAreas from '../../../components/compDosenWali/compMyStudent/compAnalisisPsikologi/StrengthArea';
import PsychologyDetails from '../../../components/compDosenWali/compMyStudent/compAnalisisPsikologi/DetailPsikologi';

export default function AnalisaPsikologiDetailPage() {
  const [student, setStudent] = useState(null);
  
  // Data dummy untuk mahasiswa yang ditampilkan
  useEffect(() => {
    // Simulasi data mahasiswa yang mungkin didapat dari API
    const studentData = {
      id: 1,
      name: "Budi Santoso",
      nim: "18021001",
      semester: 5,
      statusPsikologi: "Aman",
      aspekPsikologi: {
        kepribadian: 85,
        motivasi: 70,
        kecemasan: 40,
        stres: 35,
        penyesuaianDiri: 80
      },
      rekomendasi: "Mahasiswa memiliki kepribadian yang kuat dan penyesuaian diri yang baik. Disarankan untuk meningkatkan motivasi belajar dengan mengikuti kegiatan pengembangan diri. Berdasarkan hasil tes psikologi, mahasiswa memiliki potensi kepemimpinan yang baik, namun perlu pengembangan dalam keterampilan manajemen waktu.",
      riwayatKonseling: [
        { tanggal: "12 Maret 2025", topik: "Manajemen Stres Akademik" },
        { tanggal: "25 Januari 2025", topik: "Perencanaan Karir" }
      ]
    };
    
    setStudent(studentData);
  }, []);

  // Transform data untuk chart
  const getChartData = () => {
    if (!student) return [];
    
    return [
      { name: 'Kepribadian', nilai: student.aspekPsikologi.kepribadian },
      { name: 'Motivasi', nilai: student.aspekPsikologi.motivasi },
      { name: 'Kecemasan', nilai: student.aspekPsikologi.kecemasan },
      { name: 'Stres', nilai: student.aspekPsikologi.stres },
      { name: 'Penyesuaian Diri', nilai: student.aspekPsikologi.penyesuaianDiri },
    ];
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      {/* Main Content */}
      <div className="bg-white container mx-auto max-w-6xl px-4 py-8 flex-grow shadow-md rounded-xl">
        {/* Header & Export Button */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <button onClick={handleBack} className="text-red-800 hover:underline flex items-center">
              &lt; Kembali ke Daftar Mahasiswa
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mt-2 justify-start sm:flex-row flex-col">
              <button className="flex items-center bg-red-800 text-white px-4 py-2 rounded-lg">
                Lihat Detail
              </button>

              <button className="flex items-center bg-green-700 text-white px-4 py-2 rounded-lg">
                <Download size={18} className="mr-2" />
                Export Laporan
              </button>
          </div>

        
        </div>
        
        {student ? (
          <div className="grid grid-rows-1 gap-8">
            {/* Informasi Mahasiswa */}
            <StudentInfo student={student} />
            
            {/* Grafik & Analisis */}
            <div className="lg:col-span-2 ">
              <PsychologyChart data={getChartData()} />
              <StrengthsAreas />
              <PsychologyDetails 
                aspectData={student.aspekPsikologi} 
                rekomendasi={student.rekomendasi} 
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">Memuat data mahasiswa...</p>
          </div>
        )}
      </div>
    </div>
  );
}