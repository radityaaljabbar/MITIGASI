import React from 'react';

/**
 * Komponen untuk menampilkan informasi dasar dan ringkasan finansial mahasiswa.
 * Component to display basic and financial summary information of a student.
 * @param {object} props - Props komponen.
 * @param {object} props.studentData - Data mahasiswa.
 */
const StudentInfoFinansialPage = ({ studentData }) => {
    return (
        <div className="bg-orange-50 p-4 rounded-lg mb-6 border">
            <h3 className="text-lg font-medium mb-4">Informasi Mahasiswa</h3>
            
            {/* Grid Informasi Dasar */}
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-600">Nama</p>
                    <p className="font-medium">{studentData?.name || 'Tidak Diketahui'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">NIM</p>
                    <p className="font-medium">{studentData?.nim || '-'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Semester</p>
                    <p className="font-medium">{studentData?.semester || 'Tidak Diketahui'}</p>
                </div>
            </div>

            {/* Bagian Status Finansial */}
            {/* Financial Status Section */}
            <div className="border-t pt-4">
                {/* Informasi waktu pembaruan data */}
                {/* Data last updated information */}
                {studentData?.lastUpdated && studentData.lastUpdated !== '-' && (
                    <div className="mt-2">
                        <p className="text-xs text-gray-500">
                            Terakhir diperbarui: {studentData.lastUpdated} WIB
                        </p>
                    </div>
                )}

                {/* Statistik ringkasan pengajuan */}
                {/* Request summary statistics */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border">
                        <p className="text-xs text-gray-600">Total Pengajuan Pending</p>
                        <p className="text-lg font-semibold text-yellow-600">
                            {studentData?.pendingRequests?.length || 0}
                        </p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                        <p className="text-xs text-gray-600">Total Riwayat Pengajuan</p>
                        <p className="text-lg font-semibold text-blue-600">
                            {studentData?.previousRequests?.length || 0}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentInfoFinansialPage;