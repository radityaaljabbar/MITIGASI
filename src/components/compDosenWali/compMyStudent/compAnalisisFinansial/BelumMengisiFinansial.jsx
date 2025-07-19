import React from 'react';
import { AlertCircle } from 'lucide-react'; // Import the AlertCircle icon

/**
 * Komponen yang ditampilkan ketika mahasiswa belum memiliki riwayat pengajuan finansial.
 * Component displayed when a student has no history of financial aid applications.
 * @param {object} props - Props komponen.
 * @param {string} props.studentName - Nama mahasiswa.
 */
const BelumMengisiFinansial = ({ studentName }) => {
    return (
        // Kontainer utama dengan styling untuk menarik perhatian
        // Main container with styling to draw attention
        <div className="p-8 rounded-lg border-2 shadow-md flex flex-col items-center text-center">
            {/* Ikon peringatan */}
            {/* Warning icon */}
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
