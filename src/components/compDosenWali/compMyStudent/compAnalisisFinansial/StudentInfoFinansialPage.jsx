import React from 'react';

const StudentInfoFinansialPage = ({ studentData }) => {
    // Get financial status with proper fallback
    const financialStatus = studentData?.financialStatus || 'Tidak Diketahui';
    
    // Determine status color based on financial status
    const getStatusColor = (status) => {
        switch (status) {
            case 'Mendapat Bantuan':
                return 'text-green-700 bg-green-100';
            case 'Sedang Diproses':
                return 'text-yellow-700 bg-yellow-100';
            case 'Siaga':
                return 'text-orange-700 bg-orange-100';
            default:
                return 'text-gray-700 bg-gray-100';
        }
    };

    return (
        <div className="bg-orange-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4">Informasi Mahasiswa</h3>
            
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

            {/* Financial Status Section */}
            <div className="border-t pt-4">
                <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-600">Status Finansial:</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(financialStatus)}`}>
                        {financialStatus}
                    </span>
                </div>
                
                {/* Additional financial info if available */}
                {studentData?.lastUpdated && studentData.lastUpdated !== '-' && (
                    <div className="mt-2">
                        <p className="text-xs text-gray-500">
                            Terakhir diperbarui: {studentData.lastUpdated}
                        </p>
                    </div>
                )}

                {/* Summary statistics */}
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