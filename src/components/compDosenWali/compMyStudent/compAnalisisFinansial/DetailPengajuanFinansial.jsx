import React from 'react';
import { FaFileDownload } from 'react-icons/fa';
import StatusAksiDosen from './StatusAksiDosen';

const DetailPengajuanFinansial = ({
    selectedRequest,
    onClose,
    onApprove,
    onReject,
    onDownloadAttachment,
}) => {
    if (!selectedRequest) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="bg-[#951A22] text-white p-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium">Detail Pengajuan</h3>
                    <button
                        onClick={onClose}
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
                            <p className="text-sm text-gray-600">Status</p>
                            <div>
                                <StatusAksiDosen
                                    status={selectedRequest.status}
                                />
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
                        <p className="text-sm text-gray-600">
                            Dokumen Pendukung
                        </p>
                        <div className="bg-gray-50 p-3 rounded space-y-2">
                            {selectedRequest.attachments.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between">
                                    <span>{file}</span>
                                    <button
                                        onClick={() =>
                                            onDownloadAttachment(file)
                                        }
                                        className="text-[#951A22] hover:text-red-700 flex items-center">
                                        <FaFileDownload className="mr-1" />{' '}
                                        Unduh
                                    </button>
                                </div>
                            ))}
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
                                onClick={() => onReject(selectedRequest.id)}
                                className="px-4 border border-[#951A22] rounded hover:bg-red-50">
                                Tolak
                            </button>

                            <button
                                onClick={() => onApprove(selectedRequest.id)}
                                className="px-4 py-2 bg-[#951A22] text-white rounded hover: bg-red-700">
                                Setujui
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailPengajuanFinansial;
