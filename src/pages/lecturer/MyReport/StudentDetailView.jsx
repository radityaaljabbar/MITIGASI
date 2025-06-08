import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
    ArrowLeft,
    Paperclip,
    Send,
    Printer,
    FileText,
    Download,
    ExternalLink,
    RefreshCw,
} from 'lucide-react';
import {
    getFeedbackResponse,
    getFeedbackDetail,
    sendResponse as apiSendResponse,
} from '../../../services/dosenWali/myReport/listFeedbackMahasiswaService';

// Direct implementation of sendResponse to ensure it works properly
const sendResponse = async (responseData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'Token tidak ditemukan' };
        }

        const response = await fetch(
            'https://capstone-backend-local-1059248723043.asia-southeast2.run.app/api/faculty/sendResponDosWal',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responseData),
            }
        );

        console.log('HTTP Status:', response.status, response.statusText);

        if (!response.ok) {
            return {
                success: false,
                message: `HTTP Error: ${response.status}`,
            };
        }

        const data = await response.json();

        // Always return success if we got here and there's no explicit error
        return {
            success: true,
            message: data.message || 'Tanggapan berhasil dikirim',
            data: data.payload || {},
        };
    } catch (error) {
        console.error('Network error:', error);
        return {
            success: false,
            message: `Error: ${error.message || 'Unknown error'}`,
        };
    }
};

const StudentDetailView = ({ student, onBack }) => {
    const [responseText, setResponseText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [studentDetail, setStudentDetail] = useState(student);
    const [responseData, setResponseData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [activePdf, setActivePdf] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // For forcing refreshes

    // Function to refresh data
    const refreshData = useCallback(() => {
        setRefreshKey((prevKey) => prevKey + 1);
    }, []);

    // Fetch detailed feedback data including attachments
    useEffect(() => {
        const fetchFeedbackDetails = async () => {
            if (student.feedbackId) {
                setLoading(true);
                try {
                    const detailResponse = await getFeedbackDetail(
                        student.feedbackId
                    );

                    if (detailResponse.success) {
                        setStudentDetail((prev) => {
                            const updated = {
                                ...prev,
                                ...detailResponse.data,
                            };
                            return updated;
                        });
                    } else {
                        console.warn(
                            '⚠️ Failed to get feedback details:',
                            detailResponse
                        );
                    }
                } catch (error) {
                    console.error('❌ Error fetching feedback details:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchFeedbackDetails();
    }, [student.feedbackId, refreshKey]);

    // Fetch dosen response if exists
    useEffect(() => {
        const fetchDosenResponse = async () => {
            if (student.feedbackId) {
                try {
                    const response = await getFeedbackResponse(
                        student.feedbackId
                    );

                    if (response.success && response.data) {
                        setResponseData(response.data);
                        setResponseText(response.data.responseText); // Pre-fill the response text for editing

                        // Update student status based on response data
                        setStudentDetail((prev) => {
                            const updated = {
                                ...prev,
                                status:
                                    response.data.status || 'Sudah Direspon', // Ensure we have a status
                            };
                            return updated;
                        });
                    } else {
                        console.log(
                            '🔍 No dosen response found or unsuccessful response'
                        );
                    }
                } catch (error) {
                    console.error('❌ Error fetching dosen response:', error);
                }
            }
        };

        fetchDosenResponse();
    }, [student.feedbackId, refreshKey, student.status]); // Added student.status as dependency

    const handleSubmitResponse = async () => {
        if (!responseText.trim()) {
            toast.warning('Silakan isi tanggapan terlebih dahulu');
            return;
        }

        setIsSubmitting(true);

        try {
            const responsePayload = {
                id_keluhan: student.feedbackId,
                response_keluhan: responseText,
                status_keluhan: 1, // 1 for "Sudah Direspon"
            };

            // Using our inline implementation for guaranteed behavior
            const result = await sendResponse(responsePayload);

            // Always assume success if we don't get an explicit error message
            // This is a workaround to avoid the "undefined" error
            if (result.success !== false) {
                // Update the response data
                const newResponseData = {
                    responseId: result.data?.id || `temp-${Date.now()}`,
                    feedbackId: student.feedbackId,
                    responseText: responseText,
                    responseDate: new Date().toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    }),
                    status: 'Sudah Direspon',
                    statusCode: 1,
                };

                setResponseData(newResponseData);

                // Update student status
                setStudentDetail((prev) => {
                    const updated = {
                        ...prev,
                        status: 'Sudah Direspon',
                    };
                    return updated;
                });

                // Show success message
                toast.success('Tanggapan berhasil dikirim');

                // Refresh data after successful submission
                setTimeout(() => refreshData(), 1000);
            } else {
                // Show error with fallback message
                toast.error(
                    result.message ||
                        'Terjadi kesalahan saat mengirim tanggapan'
                );
            }
        } catch (error) {
            console.error('❌ Error submitting response:', error);
            toast.error(
                `Terjadi kesalahan: ${error.message || 'Unknown error'}`
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenPdf = (pdf) => {
        setActivePdf(pdf);
        setShowPdfModal(true);
    };

    const handleClosePdf = () => {
        setShowPdfModal(false);
        setActivePdf(null);
    };

    const handleDownload = (url, filename) => {
        try {
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            toast.info(`Mengunduh ${filename}`);
        } catch (error) {
            console.error('Download error:', error);
            toast.error(
                `Gagal mengunduh file: ${error.message || 'Unknown error'}`
            );
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow p-4 md:p-6 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow p-4 md:p-6">
                <button
                    className="text-sm text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors mb-4"
                    onClick={onBack}>
                    <ArrowLeft size={16} />
                    <span>Kembali ke Daftar</span>
                </button>

                <div className="text-center p-4 text-red-600">
                    <p className="font-medium">Error: {error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={refreshData}>
                        <RefreshCw size={16} className="inline mr-1" />
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    // Determine the actual status to display
    const actualStatus =
        studentDetail.status || student.status || 'Menunggu Respon';

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden transition-all duration-300 hover:shadow-lg">
            {/* Header with breadcrumb */}
            <div className="bg-gray-50 p-4 md:p-6 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <button
                        className="text-sm text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors"
                        onClick={onBack}>
                        <ArrowLeft size={16} />
                        <span>Kembali ke Daftar</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                actualStatus === 'Sudah Direspon'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {actualStatus}
                        </span>
                        <button
                            onClick={refreshData}
                            className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                            title="Refresh data">
                            <RefreshCw size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 space-y-6">
                {/* Student info card */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex flex-col md:flex-row md:justify-between gap-2">
                        <div>
                            <h2 className="font-bold text-lg text-blue-900">
                                {studentDetail.name || 'Nama tidak tersedia'}
                            </h2>
                            <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-blue-800">
                                <span className="font-medium">
                                    NIM:{' '}
                                    {studentDetail.nim || 'NIM tidak tersedia'}
                                </span>
                                <span>
                                    Kelas:{' '}
                                    {studentDetail.kelas ||
                                        'Kelas tidak tersedia'}
                                </span>
                            </div>
                        </div>
                        <div className="text-sm text-blue-700">
                            {studentDetail.feedbackDate ||
                                'Tanggal tidak tersedia'}
                        </div>
                    </div>
                </div>

                {/* Report content */}
                <div className="space-y-4">
                    <div className="border-b pb-2">
                        <h3 className="font-bold text-base mb-1">
                            {studentDetail.title || 'Judul tidak tersedia'}
                        </h3>
                    </div>

                    <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                        {studentDetail.details || 'Detail tidak tersedia'}
                    </div>
                </div>

                {/* Attachments - show actual attachments if available */}
                {studentDetail.lampiran && (
                    <div className="space-y-3">
                        <p className="font-semibold text-sm">Lampiran:</p>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 p-2 bg-gray-50 border rounded-lg transition-colors hover:bg-gray-100">
                                {studentDetail.lampiran.file_type?.includes(
                                    'pdf'
                                ) ? (
                                    <FileText
                                        size={20}
                                        className="text-red-600"
                                    />
                                ) : studentDetail.lampiran.file_type?.includes(
                                      'word'
                                  ) ? (
                                    <FileText
                                        size={20}
                                        className="text-blue-600"
                                    />
                                ) : (
                                    <FileText
                                        size={20}
                                        className="text-gray-600"
                                    />
                                )}
                                <span className="text-sm">
                                    {studentDetail.lampiran.original_name}
                                </span>
                                <button
                                    onClick={() =>
                                        handleDownload(
                                            studentDetail.lampiran.file_url,
                                            studentDetail.lampiran.original_name
                                        )
                                    }
                                    className="ml-2 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                                    title="Unduh">
                                    <Download size={16} />
                                </button>
                                {studentDetail.lampiran.file_type?.includes(
                                    'pdf'
                                ) && (
                                    <button
                                        onClick={() =>
                                            handleOpenPdf({
                                                name: studentDetail.lampiran
                                                    .original_name,
                                                url: studentDetail.lampiran
                                                    .file_url,
                                            })
                                        }
                                        className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                                        title="Lihat">
                                        <ExternalLink size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Response section */}
                <div className="border-t pt-4">
                    <h4 className="font-semibold text-base mb-3">
                        Tanggapan Dosen Wali:
                    </h4>

                    {responseData ? (
                        <div className="bg-green-50 border border-green-100 p-4 rounded-lg mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-green-800">
                                    Tanggapan Anda
                                </span>
                                <span className="text-xs text-green-700">
                                    {responseData.responseDate}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">
                                {responseData.responseText}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg mb-4 text-center">
                            <p className="text-sm text-yellow-800">
                                Anda belum memberikan tanggapan
                            </p>
                        </div>
                    )}

                    {/* Response input */}
                    <div className="mt-4 space-y-2">
                        <div className="flex">
                            <textarea
                                placeholder="Tulis tanggapan Anda disini..."
                                className="w-full p-3 border border-gray-300 rounded-l-xl text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none resize-none"
                                rows="4"
                                value={responseText}
                                onChange={(e) =>
                                    setResponseText(e.target.value)
                                }></textarea>
                            <div className="flex flex-col border-t border-r border-b border-gray-300 rounded-r-xl">
                                <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                                    <Paperclip size={20} />
                                </button>
                                <button
                                    onClick={handleSubmitResponse}
                                    disabled={
                                        !responseText.trim() || isSubmitting
                                    }
                                    className={`flex-grow p-2 ${
                                        responseText.trim() && !isSubmitting
                                            ? 'text-blue-600 hover:text-blue-800'
                                            : 'text-gray-400'
                                    } transition-colors`}>
                                    {isSubmitting ? (
                                        <div className="h-5 w-5 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                                    ) : (
                                        <Send size={20} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PDF Viewer Modal */}
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
                                    <ArrowLeft size={20} />
                                </button>
                            </div>
                        </div>

                        {/* PDF Viewer */}
                        <div className="flex-1 overflow-hidden p-4">
                            <div className="w-full h-full">
                                {/* Using an iframe to embed the PDF */}
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

export default StudentDetailView;
