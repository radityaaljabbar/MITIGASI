import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import handleBack from '../../../../components/handleBack';

/**
 * Komponen placeholder yang ditampilkan ketika dosen mencoba melihat detail analisis psikologi
 * dari mahasiswa yang belum mengisi kuesioner.
 * A placeholder component displayed when a lecturer tries to view the psychology analysis details
 * of a student who has not yet filled out the questionnaire.
 */
export default function AnalisaPsikologiDetailPage() {
  // State untuk menyimpan data mahasiswa.
  // State to store student data.
  const [student, setStudent] = useState(null);
  const [hasFilledQuestionnaire, setHasFilledQuestionnaire] = useState(false);
  
  // useEffect(() => {
  //   const studentData = {
  //     id: 1,
  //     name: "Budi Santoso",
  //     nim: "18021001",
  //     semester: 5,
  //     statusPsikologi: "Aman",
  //     statusKuesioner: "Belum Mengisi"
  //   };
    
  //   setStudent(studentData);
  //   setHasFilledQuestionnaire(false); // Status belum mengisi kuesioner
  // }, []);

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      {/* Konten Utama */}
      {/* Main Content */}
      <div className="bg-white container mx-auto max-w-6xl px-4 py-8 flex-grow shadow-md rounded-xl">
        {/* Header dengan tombol kembali */}
        {/* Header with a back button */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <button onClick={handleBack} className="text-red-800 hover:underline flex items-center">
              &lt; Kembali ke Daftar Mahasiswa
            </button>
          </div>
        </div>
        
        {student ? (
          <div className="grid grid-rows-1 gap-8">
            {/* Kartu Informasi Mahasiswa */}
            {/* Student Information Card */}
            <div className="bg-[#FAF0E6] p-6 rounded-lg lg:col-span-2 border">
                <h3 className="text-lg font-medium mb-2">
                    Informasi Mahasiswa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Nama</p>
                        <p className="font-medium">
                            {student.name}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">NIM</p>
                        <p className="font-medium">{student.nim}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">
                            Semester
                        </p>
                        <p className="font-medium">
                            {student.semester}
                        </p>
                    </div>
                </div>
                <div>
                    <br />
                    Status Finansial: <br />
                    <h4 className="text-lg font-medium mb-2">
                        {student.statusPsikologi}
                    </h4>
                </div>
            </div>

            {/* Peringatan bahwa kuesioner belum diisi */}
            {/* Warning that the questionnaire has not been filled out */}
            <div className="lg:col-span-2">
              <div className="p-8 rounded-lg border-2 shadow-md flex flex-col items-center text-center">
                <div className="bg-amber-100 p-4 rounded-full mb-4">
                  <AlertCircle size={64} className="text-amber-600" />
                </div>
                
                <h3 className="text-2xl font-semibold mb-4">Kuesioner Psikologi Belum Diisi</h3>
                
                <p className="text-gray-600 mb-6 max-w-lg">
                  Mahasiswa ini belum mengisi kuesioner evaluasi psikologi. Hasil analisis psikologi akan 
                  tersedia setelah mahasiswa menyelesaikan pengisian kuesioner.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Tampilan loading sederhana
          // Simple loading display
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">Memuat data mahasiswa...</p>
          </div>
        )}
      </div>
    </div>
  );
}