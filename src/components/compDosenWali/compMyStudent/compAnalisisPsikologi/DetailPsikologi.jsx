// File: src/components/AnalisisPsikologi/PsychologyDetails.jsx
import React from 'react';

export default function PsychologyDetails({ aspectData, rekomendasi }) {
  if (!aspectData) return null;
  
  const aspects = [
    { key: 'kepribadian', label: 'Kepribadian', description: 'Menunjukkan kepribadian yang stabil dan matang' },
    { key: 'motivasi', label: 'Motivasi', description: 'Memiliki dorongan internal yang baik untuk mencapai tujuan' },
    { key: 'kecemasan', label: 'Kecemasan', description: 'Tingkat kecemasan rendah, mampu mengelola emosi dengan baik' },
    { key: 'stres', label: 'Stres', description: 'Tingkat stres rendah, menunjukkan kemampuan coping yang baik' },
    { key: 'penyesuaianDiri', label: 'Penyesuaian Diri', description: 'Kemampuan adaptasi yang sangat baik terhadap lingkungan baru' },
  ];
  
  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Detail Aspek Psikologi</h3>
      
      <div className="space-y-4">
        {aspects.map((aspect) => (
          <div key={aspect.key}>
            <div className="flex justify-between mb-1">
              <span className="font-medium">{aspect.label}</span>
              <span>{aspectData[aspect.key]}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-red-800 h-2.5 rounded-full" 
                style={{ width: `${aspectData[aspect.key]}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{aspect.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h4 className="font-semibold mb-2 text-amber-800">Rekomendasi:</h4>
          <p className="text-gray-700">{rekomendasi}</p>
        </div>
      </div>
    </div>
  );
}