import React from 'react';

export default function StudentInfo({ student }) {
  if (!student) return null;
  
  return (
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
                    Status Psikologi: <br />
                    <h4 className="text-lg font-medium mb-2">
                        {student.statusPsikologi}
                    </h4>
                </div>
            </div>
  );
}