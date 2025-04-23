import React from 'react';
// Page / Komponen Lain:
import StatusAksiDosen from './StatusAksiDosen';

const StudentFinancialList = ({
    requests,
    title,
    emptyMessage,
    onViewDetail,
    isPending = false,
}) => {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">{title}</h3>

            {requests.length > 0 ? (
                <div className="bg-white border rounded-lg divide-y">
                    {requests.map((request) => (
                        <div key={request.id} className="p-4">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-medium">
                                            {request.type}
                                        </p>
                                        <StatusAksiDosen
                                            status={request.status}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Diajukan pada {request.requestDate}
                                        {request.status === 'Disetujui' &&
                                            ` • Disetujui pada ${request.approvalDate}`}
                                        {request.status === 'Ditolak' &&
                                            ` • Ditolak pada ${request.rejectionDate}`}
                                    </p>
                                    <p className="text-sm mt-1 line-clamp-2">
                                        {request.reason}
                                    </p>
                                </div>
                                <button
                                    onClick={() => onViewDetail(request)}
                                    className={`px-4 py-2 ${
                                        isPending
                                            ? 'bg-red-800 text-white hover:bg-red-700'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    } text-sm rounded transition`}>
                                    Lihat Detail
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
                    {emptyMessage}
                </div>
            )}
        </div>
    );
};

export default StudentFinancialList;
