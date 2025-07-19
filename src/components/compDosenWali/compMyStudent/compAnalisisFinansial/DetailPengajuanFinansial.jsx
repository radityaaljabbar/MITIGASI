import React, { useState } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import { FileText, Download, ExternalLink, X } from 'lucide-react';
import StatusAksiDosen from './StatusAksiDosen';

/**
 * Komponen modal untuk menampilkan detail pengajuan finansial dan memberikan aksi (setuju/tolak).
 * Modal component to display financial request details and provide actions (approve/reject).
 * @param {object} props - Props komponen.
 * @param {object} props.selectedRequest - Data pengajuan yang dipilih.
 * @param {function} props.onClose - Fungsi untuk menutup modal.
 * @param {function} props.onApprove - Fungsi untuk menyetujui pengajuan.
 * @param {function} props.onReject - Fungsi untuk menolak pengajuan.
 */
const DetailPengajuanFinansial = ({
    selectedRequest,
    onClose,
    onApprove,
    onReject,
}) => {
    // State untuk mengelola status pemrosesan dan modal PDF
    // State to manage processing status and the PDF modal
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingAction, setProcessingAction] = useState('');
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [activePdf, setActivePdf] = useState(null);

    if (!selectedRequest) return null;

    // Handle approve action
    const handleApprove = async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        setProcessingAction('approve');

        try {
            await onApprove(selectedRequest.id);
            // Modal will be closed by parent component after successful operation
        } catch (error) {
            console.error('Error in approve handler:', error);
        } finally {
            setIsProcessing(false);
            setProcessingAction('');
        }
    };

    // Menangani aksi buka modal PDF
    // Handle opening the PDF modal
    const handleOpenPdf = (pdf) => {
        setActivePdf(pdf);
        setShowPdfModal(true);
    };

    // Menangani aksi tutup modal PDF
    // Handle closing the PDF modal
    const handleClosePdf = () => {
        setShowPdfModal(false);
        setActivePdf(null);
    };

    // Menangani aksi unduh file
    // Handle file download action
    const handleDownload = (url, filename) => {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                {/* Header Modal */}
                {/* Modal Header */}
                <div className="bg-[#951A22] text-white p-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium">Detail Pengajuan</h3>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200">
                        ✕
                    </button>
                </div>
                {/* Konten Modal */}
                {/* Modal Content */}
                <div className="p-6">
                    {/* Detail-detail pengajuan */}
                    {/* Request details */}
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
                                {selectedRequest.requestDate} WIB
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
                                Penghasilan Bulanan Orang Tua
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

                    {/* Tampil jika ada rencana cicilan */}
                    {/* Display if installment plan exists */}
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

                    {/* Tampil jika pengajuan ditolak */}
                    {/* Display if the request was rejected */}
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

                    {/* Bagian lampiran dokumen */}
                    {/* Document attachment section */}
                    {selectedRequest.lampiran && (
                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-2">
                                Lampiran Dokumen
                            </p>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 border rounded-lg transition-colors hover:bg-gray-100">
                                <FileText size={20} className="text-red-600" />
                                <span className="text-sm text-gray-700 flex-grow">
                                    {selectedRequest.lampiran.originalName}
                                </span>
                                <button
                                    onClick={() =>
                                        handleDownload(
                                            selectedRequest.lampiran.url,
                                            selectedRequest.lampiran
                                                .originalName
                                        )
                                    }
                                    className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                                    title="Unduh">
                                    <Download size={16} />
                                </button>
                                <button
                                    onClick={() =>
                                        handleOpenPdf({
                                            name: selectedRequest.lampiran
                                                .originalName,
                                            url: selectedRequest.lampiran.url,
                                        })
                                    }
                                    className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                                    title="Lihat">
                                    <ExternalLink size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tombol aksi untuk dosen, hanya muncul jika status "Menunggu Review" */}
                    {/* Action buttons for the lecturer, only appear if status is "Menunggu Review" */}
                    {selectedRequest.status === 'Menunggu Review' && (
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => onReject(selectedRequest.id)}
                                className="px-4 border border-[#951A22] rounded hover:bg-red-50">
                                Tolak
                            </button>

                            <button
                                onClick={() => onApprove(selectedRequest.id)}
                                className="px-4 py-2 bg-[#951A22] text-white rounded hover:">
                                Setujui
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal untuk menampilkan PDF */}
            {/* Modal to display PDF */}
            {showPdfModal && activePdf && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full h-5/6 flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-semibold text-lg">
                                {activePdf.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                                <button
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                    title="Unduh"
                                    onClick={() =>
                                        handleDownload(
                                            activePdf.url,
                                            activePdf.name
                                        )
                                    }>
                                    <Download size={20} />
                                </button>
                                <button
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                    title="Buka di tab baru"
                                    onClick={() =>
                                        window.open(activePdf.url, '_blank')
                                    }>
                                    <ExternalLink size={20} />
                                </button>
                                <button
                                    onClick={handleClosePdf}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                    title="Tutup">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden p-4">
                            <div className="w-full h-full">
                                <iframe
                                    src={`${activePdf.url}#toolbar=0&navpanes=0`}
                                    title={activePdf.name}
                                    className="w-full h-full border-0 rounded">
                                    Your browser does not support PDFs. Please
                                    download the PDF to view it.
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailPengajuanFinansial;
