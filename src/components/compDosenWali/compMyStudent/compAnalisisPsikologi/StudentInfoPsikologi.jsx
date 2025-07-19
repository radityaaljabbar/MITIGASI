import React from 'react';

/**
 * Komponen untuk menampilkan informasi ringkas mahasiswa terkait psikologi.
 * Component to display concise student information related to psychology.
 * @param {object} props - Props komponen.
 * @param {object} props.student - Data mahasiswa.
 */
export default function StudentInfo({ student }) {
    // Jika tidak ada data mahasiswa, jangan render
    // If there is no student data, do not render
    if (!student) return null;

    /**
     * Mendapatkan warna badge berdasarkan status.
     * Gets the badge color based on the status.
     * @param {string} status - Status mahasiswa.
     * @returns {string} - Kelas Tailwind CSS untuk warna.
     */
    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'aman':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'siaga':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'bermasalah':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="bg-[#FAF0E6] p-6 rounded-lg lg:col-span-2 border">
            <h3 className="text-lg font-medium mb-4">Informasi Mahasiswa</h3>
            {/* Grid untuk informasi dasar */}
            {/* Grid for basic information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <p className="text-sm text-gray-600">Nama</p>
                    <p className="font-medium">{student.name}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">NIM</p>
                    <p className="font-medium">{student.nim}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Semester</p>
                    <p className="font-medium">{student.semester}</p>
                </div>
            </div>

            {/* Informasi status */}
            {/* Status information */}
            <div className="mt-4 pt-4 border-t border-amber-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ">
                    <div>
                        <p className="text-sm text-gray-600 mb-1 font-medium">
                            Status Psikologi:
                        </p>
                        <span
                            className={`inline-flex px-3 py-1 rounded-full font-medium border uppercase tracking-wide ${getStatusBadgeColor(
                                student.statusPsikologi
                            )}`}>
                            {student.statusPsikologi}
                        </span>
                    </div>

                    {/* Menampilkan tanggal tes terakhir jika ada */}
                    {/* Displaying the last test date if available */}
                    {student.tanggalTes && (
                        <div className="mt-2 sm:mt-0">
                            <p className="text-sm text-gray-600 mb-1">
                                Tanggal Tes Terakhir:
                            </p>
                            <p className="text-sm font-medium text-gray-800">
                                {student.tanggalTes}
                            </p>
                        </div>
                    )}

                    {/* Menampilkan status kuesioner jika ada */}
                    {/* Displaying the questionnaire status if available */}
                    {student.statusKuesioner && (
                        <div className="mt-2 sm:mt-0 ">
                            <p className="text-sm text-gray-600 mb-1">
                                Status Kuesioner:
                            </p>
                            <span
                                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(
                                    student.statusKuesioner
                                )}`}>
                                {student.statusKuesioner}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
