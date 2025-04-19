import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    FaFileDownload,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
} from 'react-icons/fa';

const AnalisisFinansial = () => {
    const { nim } = useParams();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const mockStatusFinansial = 'Siaga';

    // Mock data - in a real app, fetch this from your API
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setStudentData({
                name: 'Ahmad Farhan',
                nim: nim || '2210511001',
                semester: 5,
                financialStatus: 'Berisiko',
                lastUpdated: '12 April 2025',
                pendingRequests: [
                    {
                        id: 1,
                        type: 'Keringanan UKT',
                        requestDate: '5 April 2025',
                        status: 'Menunggu Review',
                        reason: 'Kesulitan finansial karena orang tua di-PHK',
                        attachments: ['surat_phk.pdf', 'slip_gaji.pdf'],
                        monthlyIncome: 3500000,
                        monthlyExpenses: 3000000,
                        requestAmount: 4000000,
                    },
                ],
                previousRequests: [
                    {
                        id: 2,
                        type: 'Cicilan UKT',
                        requestDate: '10 Januari 2025',
                        status: 'Disetujui',
                        approvalDate: '15 Januari 2025',
                        reason: 'Keterlambatan gaji orang tua',
                        attachments: ['pernyataan_keterlambatan.pdf'],
                        monthlyIncome: 4500000,
                        monthlyExpenses: 3200000,
                        requestAmount: 9500000,
                        installmentPlan: '3 kali angsuran',
                    },
                    {
                        id: 3,
                        type: 'Keringanan UKT',
                        requestDate: '2 Agustus 2024',
                        status: 'Ditolak',
                        rejectionDate: '10 Agustus 2024',
                        reason: 'Biaya kuliah terlalu tinggi',
                        attachments: ['surat_permohonan.pdf'],
                        monthlyIncome: 5000000,
                        monthlyExpenses: 2800000,
                        requestAmount: 3000000,
                        rejectionReason: 'Tidak memenuhi kriteria bantuan',
                    },
                ],
            });
            setLoading(false);
        }, 1000);
    }, [nim]);

    const handleViewDetail = (request) => {
        setSelectedRequest(request);
        setShowDetailModal(true);
    };

    const handleApproveRequest = (id) => {
        // In a real app, make API call to approve request
        console.log(`Approving request ${id}`);
        setShowDetailModal(false);
    };

    const handleRejectRequest = (id) => {
        // In a real app, make API call to reject request
        console.log(`Rejecting request ${id}`);
        setShowDetailModal(false);
    };

    const handleDownloadAttachment = (filename) => {
        // In a real app, handle file download
        console.log(`Downloading ${filename}`);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Menunggu Review':
                return (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full flex items-center text-xs">
                        <FaExclamationTriangle className="mr-1" /> {status}
                    </span>
                );
            case 'Disetujui':
                return (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center text-xs">
                        <FaCheckCircle className="mr-1" /> {status}
                    </span>
                );
            case 'Ditolak':
                return (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full flex items-center text-xs">
                        <FaTimesCircle className="mr-1" /> {status}
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        {status}
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="bg-red-800 p-4 text-white">
                    <h2 className="text-xl font-bold">
                        Analisis Finansial Mahasiswa
                    </h2>
                    <p className="text-sm opacity-90">
                        Data terakhir diperbarui: {studentData.lastUpdated}
                    </p>
                </div>

                <div className="p-5">
                    <div className="bg-orange-50 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-medium mb-2">
                            Informasi Mahasiswa
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Nama</p>
                                <p className="font-medium">
                                    {studentData.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">NIM</p>
                                <p className="font-medium">{studentData.nim}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Semester
                                </p>
                                <p className="font-medium">
                                    {studentData.semester}
                                </p>
                            </div>
                        </div>
                        <div>
                            <br />
                            Status Finansial: <br />
                            <h4 className="text-lg font-medium mb-2">
                                {mockStatusFinansial}
                            </h4>
                        </div>
                    </div>

                    {/* Pending Requests */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">
                            Pengajuan Menunggu Review
                        </h3>

                        {studentData.pendingRequests.length > 0 ? (
                            <div className="bg-white border rounded-lg divide-y">
                                {studentData.pendingRequests.map((request) => (
                                    <div key={request.id} className="p-4">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium">
                                                        {request.type}
                                                    </p>
                                                    {getStatusBadge(
                                                        request.status
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Diajukan pada{' '}
                                                    {request.requestDate}
                                                </p>
                                                <p className="text-sm mt-1 line-clamp-2">
                                                    {request.reason}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleViewDetail(request)
                                                }
                                                className="px-4 py-2 bg-red-800 text-white text-sm rounded hover:bg-red-700 transition">
                                                Lihat Detail
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
                                Tidak ada pengajuan yang menunggu review
                            </div>
                        )}
                    </div>

                    {/* Previous Requests */}
                    <div>
                        <h3 className="text-lg font-medium mb-3">
                            Riwayat Pengajuan
                        </h3>

                        {studentData.previousRequests.length > 0 ? (
                            <div className="bg-white border rounded-lg divide-y">
                                {studentData.previousRequests.map((request) => (
                                    <div key={request.id} className="p-4">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium">
                                                        {request.type}
                                                    </p>
                                                    {getStatusBadge(
                                                        request.status
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Diajukan pada{' '}
                                                    {request.requestDate}
                                                    {request.status ===
                                                        'Disetujui' &&
                                                        ` • Disetujui pada ${request.approvalDate}`}
                                                    {request.status ===
                                                        'Ditolak' &&
                                                        ` • Ditolak pada ${request.rejectionDate}`}
                                                </p>
                                                <p className="text-sm mt-1 line-clamp-2">
                                                    {request.reason}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleViewDetail(request)
                                                }
                                                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition">
                                                Lihat Detail
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
                                Tidak ada riwayat pengajuan
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                        <div className="bg-red-800 text-white p-4 flex justify-between items-center">
                            <h3 className="text-lg font-medium">
                                Detail Pengajuan
                            </h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-white hover:text-gray-200">
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Jenis Pengajuan
                                    </p>
                                    <p className="font-medium">
                                        {selectedRequest.type}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Tanggal Pengajuan
                                    </p>
                                    <p className="font-medium">
                                        {selectedRequest.requestDate}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Status
                                    </p>
                                    <div>
                                        {getStatusBadge(selectedRequest.status)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Nominal Pengajuan
                                    </p>
                                    <p className="font-medium">
                                        Rp{' '}
                                        {selectedRequest.requestAmount.toLocaleString(
                                            'id-ID'
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-gray-600 mb-1">
                                    Alasan Pengajuan
                                </p>
                                <p className="bg-gray-50 p-3 rounded">
                                    {selectedRequest.reason}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Penghasilan Bulanan
                                    </p>
                                    <p className="font-medium">
                                        Rp{' '}
                                        {selectedRequest.monthlyIncome.toLocaleString(
                                            'id-ID'
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Pengeluaran Bulanan
                                    </p>
                                    <p className="font-medium">
                                        Rp{' '}
                                        {selectedRequest.monthlyExpenses.toLocaleString(
                                            'id-ID'
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-gray-600 mb-1">
                                    Dokumen Pendukung
                                </p>
                                <div className="bg-gray-50 p-3 rounded space-y-2">
                                    {selectedRequest.attachments.map(
                                        (file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between">
                                                <span>{file}</span>
                                                <button
                                                    onClick={() =>
                                                        handleDownloadAttachment(
                                                            file
                                                        )
                                                    }
                                                    className="text-red-800 hover:text-red-700 flex items-center">
                                                    <FaFileDownload className="mr-1" />{' '}
                                                    Unduh
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {selectedRequest.installmentPlan && (
                                <div className="mb-6">
                                    <p className="text-sm text-gray-600 mb-1">
                                        Rencana Cicilan
                                    </p>
                                    <p className="bg-gray-50 p-3 rounded">
                                        {selectedRequest.installmentPlan}
                                    </p>
                                </div>
                            )}

                            {selectedRequest.rejectionReason && (
                                <div className="mb-6">
                                    <p className="text-sm text-gray-600 mb-1">
                                        Alasan Penolakan
                                    </p>
                                    <p className="bg-gray-50 p-3 rounded">
                                        {selectedRequest.rejectionReason}
                                    </p>
                                </div>
                            )}

                            {selectedRequest.status === 'Menunggu Review' && (
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        onClick={() =>
                                            handleRejectRequest(
                                                selectedRequest.id
                                            )
                                        }
                                        className="px-4 py-2 border border-red-800 text-red-800 rounded hover:bg-red-50">
                                        Tolak
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleApproveRequest(
                                                selectedRequest.id
                                            )
                                        }
                                        className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700">
                                        Setujui
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalisisFinansial;
