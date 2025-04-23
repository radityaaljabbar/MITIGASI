// File: src/components/AnalisisPsikologi/StudentInfo.jsx
import React from 'react';

export default function StudentInfo({ student }) {
  if (!student) return null;
  
  return (
    <div className="bg-[#FAF0E6] p-6 rounded-lg lg:col-span-2 border">
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
  );
}