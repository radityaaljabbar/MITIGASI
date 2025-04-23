import React from 'react';
import { AlertCircle } from 'lucide-react'; // Import the AlertCircle icon

const BelumMengisiFinansial = ({ studentName }) => {
    return (
        <div className="p-8 rounded-lg border-2 shadow-md flex flex-col items-center text-center">
            <div className="bg-amber-100 p-4 rounded-full mb-4">
                <AlertCircle size={64} className="text-amber-600" />
            </div>

            <h3 className="text-2xl font-semibold mb-4">
                Belum Ada Pengajuan Bantuan Finansial
            </h3>

            <p className="text-gray-600 mb-6 max-w-lg">
                Mahasiswa {studentName || 'ini'} belum mengajukan bantuan
                finansial apapun. Data analisis finansial akan tersedia setelah
                mahasiswa melakukan pengajuan bantuan.
            </p>
        </div>
    );
};

export default BelumMengisiFinansial;
