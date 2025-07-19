import React from 'react';

/**
 * Komponen Card sederhana untuk menampilkan status klasifikasi akademik mahasiswa.
 * A simple card component to display a student's academic classification status.
 * @param {object} props - Props komponen.
 * @param {string} props.status - Status klasifikasi (misal: "Aman").
 */
const KlasifikasiAkademikCard = ({ status }) => {
    return (
        <div className="bg-white shadow-md p-3 rounded-lg text-center text-base">
            <h3 className="text-lg">Klasifikasi Akademik</h3>
            <p>
                {/* Menampilkan status dengan styling khusus */}
                {/* Displaying the status with special styling */}
                <span className="text-green-600 font-bold capitalize-text">
                    {status}
                </span>
            </p>
        </div>
    );
};

export default KlasifikasiAkademikCard;