import React from 'react';

export default function StrengthsAreas() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 rounded-md">
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h4 className="font-semibold mb-4">Aspek Positif</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Kepribadian yang kuat (85%)</li>
          <li>Penyesuaian diri yang baik (80%)</li>
          <li>Motivasi di atas rata-rata (70%)</li>
          <li>Tingkat kecemasan rendah (40%)</li>
        </ul>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h4 className="font-semibold mb-4">Area Pengembangan</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Peningkatan motivasi belajar</li>
          <li>Pengembangan keterampilan manajemen waktu</li>
          <li>Eksplorasi potensi kepemimpinan</li>
        </ul>
      </div>
    </div>
  );
}