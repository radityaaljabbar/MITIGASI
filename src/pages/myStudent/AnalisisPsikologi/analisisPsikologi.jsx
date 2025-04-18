import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, User } from 'lucide-react';
import handleBack from '../../../components/handleBack';

export default function AnalisaPsikologiDetailPage() {
  const [student, setStudent] = useState(null);
  
  // Data dummy untuk mahasiswa yang ditampilkan
  useEffect(() => {
    // Simulasi data mahasiswa yang mungkin didapat dari API
    const studentData = {
      id: 1,
      name: "Budi Santoso",
      nim: "18021001",
      jurusan: "Psikologi",
      semester: 5,
      tahunMasuk: "2021",
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
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Header & Export Button */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <button onClick={handleBack} className="text-red-800 hover:underline flex items-center">
              &lt; Kembali ke Daftar Mahasiswa
            </button>
          </div>
          
          <button className="flex items-center bg-green-700 text-white px-4 py-2 rounded-lg">
            <Download size={18} className="mr-2" />
            Export Laporan
          </button>
        </div>
        
        {student ? (
          <div className="grid grid-rows-1 gap-8">
            {/* Informasi Mahasiswa */}
            <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
              <div className="flex flex-col items-center mb-2">
                <h3 className="text-xl font-bold">{student.name}</h3>
                <p className="text-gray-600">NIM: {student.nim}</p>
              </div>
              
              <div className="divide-y">
                <div className="py-3">
                  <p className="text-gray-500 text-sm">Semester</p>
                  <p className="font-medium">{student.semester}</p>
                </div>
                <div className="py-3">
                  <p className="text-gray-500 text-sm">Tahun Masuk</p>
                  <p className="font-medium">{student.tahunMasuk}</p>
                </div>
              </div>
              
            </div>
            
            {/* Grafik & Analisis */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4">Profil Psikologi</h3>
                
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getChartData()}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="nilai" fill="#9f1239" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold mb-4">Aspek Positif</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Kepribadian yang kuat (85%)</li>
                    <li>Penyesuaian diri yang baik (80%)</li>
                    <li>Motivasi di atas rata-rata (70%)</li>
                    <li>Tingkat kecemasan rendah (40%)</li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold mb-4">Area Pengembangan</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Peningkatan motivasi belajar</li>
                    <li>Pengembangan keterampilan manajemen waktu</li>
                    <li>Eksplorasi potensi kepemimpinan</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Detail Aspek Psikologi</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Kepribadian</span>
                      <span>{student.aspekPsikologi.kepribadian}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-800 h-2.5 rounded-full" style={{ width: `${student.aspekPsikologi.kepribadian}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Menunjukkan kepribadian yang stabil dan matang</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Motivasi</span>
                      <span>{student.aspekPsikologi.motivasi}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-800 h-2.5 rounded-full" style={{ width: `${student.aspekPsikologi.motivasi}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Memiliki dorongan internal yang baik untuk mencapai tujuan</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Kecemasan</span>
                      <span>{student.aspekPsikologi.kecemasan}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-800 h-2.5 rounded-full" style={{ width: `${student.aspekPsikologi.kecemasan}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Tingkat kecemasan rendah, mampu mengelola emosi dengan baik</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Stres</span>
                      <span>{student.aspekPsikologi.stres}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-800 h-2.5 rounded-full" style={{ width: `${student.aspekPsikologi.stres}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Tingkat stres rendah, menunjukkan kemampuan coping yang baik</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Penyesuaian Diri</span>
                      <span>{student.aspekPsikologi.penyesuaianDiri}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-800 h-2.5 rounded-full" style={{ width: `${student.aspekPsikologi.penyesuaianDiri}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Kemampuan adaptasi yang sangat baik terhadap lingkungan baru</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h4 className="font-semibold mb-2 text-amber-800">Rekomendasi:</h4>
                    <p className="text-gray-700">{student.rekomendasi}</p>
                  </div>
                </div>
              </div>
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