import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import handleBack from '../../../components/handleBack';
import { FileText, X, Download, ExternalLink } from 'lucide-react'; // Import icons
import { getFeedbackDetail } from '../../../services/mahasiswaServices/feedbackService';

/**
 * Komponen untuk menampilkan detail dari satu feedback, termasuk respon dari dosen wali.
 * Component to display the details of a single feedback, including the response from the course advisor.
 */
const MyFeedbackDetails = () => {
    // State untuk data feedback, status loading, dan modal PDF
    // State for feedback data, loading status, and PDF modal
    const [feedbackData, setFeedbackData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [activePdf, setActivePdf] = useState(null);
    const { feedbackId } = useParams();

    /**
     * Fungsi helper untuk mengonversi kode status menjadi teks.
     * Helper function to convert status code to text.
     * @param {number|string} status - Kode status.
     * @returns {string} - Teks status.
     */
    const getStatusDisplay = (status) => {
        // Convert numeric status to string representation
        if (status === 1 || status === '1') {
            return 'Direspon';
        }
        // Add other status mappings as needed
        return status || 'Pending';
    };

    // Effect untuk mengambil detail feedback saat komponen dimuat atau ID berubah
    // Effect to fetch feedback details when the component mounts or the ID changes
    useEffect(() => {
        const fetchFeedbackDetail = async () => {
            try {
                setIsLoading(true);
                const response = await getFeedbackDetail(feedbackId);

                if (response.success) {
                    // Memproses data dari API ke format yang dibutuhkan UI
                    // Processing data from the API into the format needed by the UI
                    const feedback = {
                        feedbackId: response.data.id_keluhan,
                        title: response.data.title_keluhan,
                        details: response.data.detail_keluhan,
                        feedbackDate: response.data.tanggal_keluhan,
                        // Use the helper function to convert status codes
                        status: getStatusDisplay(response.data.status),
                        response: response.data.response
                            ? response.data.response.text
                            : null,
                        responseDate:
                            response.data.response &&
                            response.data.response.date
                                ? response.data.response.date // Sudah diformat di service
                                : null,
                        // Memproses lampiran respon jika ada
                        // Processing response attachments if they exist
                        responseAttachments:
                            response.data.response &&
                            response.data.response.lampiran
                                ? [
                                      {
                                          id: 1,
                                          name: response.data.response.lampiran
                                              .original_name,
                                          type: response.data.response.lampiran
                                              .file_type
                                              ? response.data.response.lampiran.file_type.split(
                                                    '/'
                                                )[1]
                                              : response.data.response.lampiran.original_name
                                                    .split('.')
                                                    .pop(),
                                          url: response.data.response.lampiran
                                              .file_url,
                                      },
                                  ]
                                : [],
                    };

                    setFeedbackData(feedback);
                }
            } catch (error) {
                console.error('Error fetching feedback detail:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (feedbackId) {
            fetchFeedbackDetail();
        }
    }, [feedbackId]);

    // Handler untuk membuka/menutup modal PDF dan mengunduh file
    // Handlers for opening/closing the PDF modal and downloading files
    const handleOpenPdf = (pdf) => {
        setActivePdf(pdf);
        setShowPdfModal(true);
    };

    const handleClosePdf = () => {
        setShowPdfModal(false);
        setActivePdf(null);
    };

    // Add the download handler function
    const handleDownload = (url, filename) => {
        // Create a temporary anchor element to trigger download
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    };

    // Tampilan saat loading
    // Loading view
    if (isLoading) {
        return (
            <div className="bg-[#FAF0E6] min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl w-full flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#951A22]"></div>
                    <p className="mt-4 text-gray-600">
                        Memuat data feedback...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FAF0E6] min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 max-w-2xl w-full">
                {/* Badge Status */}
                {/* Status Badge */}
                <div className="mb-4">
                    <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                            feedbackData?.status === 'Direspon'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {feedbackData?.status}
                    </span>
                </div>

                {/* Bagian Detail Feedback Mahasiswa */}
                {/* Student Feedback Details Section */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-5">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                        {feedbackData?.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-3">
                        <span className="inline-flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            Tanggal: {feedbackData?.feedbackDate}
                        </span>
                    </p>
                    <div className="prose prose-sm sm:prose max-w-none text-gray-700">
                        <p className="leading-relaxed">
                            {feedbackData?.details}
                        </p>
                    </div>

                    {/* Attachments Section */}
                    {feedbackData?.attachments &&
                        feedbackData.attachments.length > 0 && (
                            <div className="mt-4">
                                <p className="font-semibold text-sm mb-2">
                                    Lampiran:
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {feedbackData.attachments.map(
                                        (attachment) => (
                                            <div
                                                key={attachment.id}
                                                className="flex items-center gap-2 p-2 bg-gray-50 border rounded-lg transition-colors hover:bg-gray-100">
                                                {attachment.type === 'docx' ? (
                                                    <FileText
                                                        size={20}
                                                        className="text-blue-600"
                                                    />
                                                ) : attachment.type ===
                                                  'pdf' ? (
                                                    <FileText
                                                        size={20}
                                                        className="text-red-600"
                                                    />
                                                ) : (
                                                    <FileText
                                                        size={20}
                                                        className="text-gray-600"
                                                    />
                                                )}
                                                <span className="text-sm">
                                                    {attachment.name}
                                                </span>
                                                {/* Add download button */}
                                                <button
                                                    onClick={() =>
                                                        handleDownload(
                                                            attachment.url,
                                                            attachment.name
                                                        )
                                                    }
                                                    className="ml-2 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                                                    title="Unduh">
                                                    <Download size={16} />
                                                </button>
                                                {/* Add view button for PDFs */}
                                                {attachment.type === 'pdf' && (
                                                    <button
                                                        onClick={() =>
                                                            handleOpenPdf(
                                                                attachment
                                                            )
                                                        }
                                                        className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                                                        title="Lihat">
                                                        <ExternalLink
                                                            size={16}
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                </div>

                {/* Bagian Respon Dosen Wali (hanya tampil jika ada) */}
                {/* Course Advisor's Response Section (only shown if it exists) */}
                {feedbackData?.response && (
                    <div className="bg-gray-100 rounded-xl p-4 sm:p-6 mb-6">
                        <div className="flex items-center mb-3">
                            <div className="bg-[#951A22] p-2 rounded-full mr-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                                Tanggapan Dosen Wali
                            </h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                            <span className="inline-flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                Tanggal: {feedbackData?.responseDate}
                            </span>
                        </p>
                        <div className="prose prose-sm sm:prose max-w-none text-gray-700">
                            <p className="leading-relaxed">
                                {feedbackData?.response}
                            </p>
                        </div>

                        {/* ADDED: Response Attachments Section */}
                        {feedbackData?.responseAttachments &&
                            feedbackData.responseAttachments.length > 0 && (
                                <div className="mt-4">
                                    <p className="font-semibold text-sm mb-2">
                                        Lampiran Tanggapan:
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {feedbackData.responseAttachments.map(
                                            (attachment) => (
                                                <div
                                                    key={attachment.id}
                                                    className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg transition-colors hover:bg-green-100">
                                                    {attachment.type ===
                                                    'pdf' ? (
                                                        <FileText
                                                            size={20}
                                                            className="text-red-600"
                                                        />
                                                    ) : attachment.type ===
                                                      'docx' ? (
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
                                                    <span className="text-sm text-green-800">
                                                        {attachment.name}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleDownload(
                                                                attachment.url,
                                                                attachment.name
                                                            )
                                                        }
                                                        className="ml-2 p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-200"
                                                        title="Unduh lampiran tanggapan">
                                                        <Download size={16} />
                                                    </button>
                                                    {attachment.type ===
                                                        'pdf' && (
                                                        <button
                                                            onClick={() =>
                                                                handleOpenPdf(
                                                                    attachment
                                                                )
                                                            }
                                                            className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-200"
                                                            title="Lihat lampiran tanggapan">
                                                            <ExternalLink
                                                                size={16}
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                )}

                {/* Tombol Kembali */}
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="flex items-center bg-[#951A22] hover:bg-[#7A1118] text-white px-5 py-2.5 rounded-lg transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    <span>Kembali</span>
                </button>
            </div>

            {/* Modal Penampil PDF */}
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
                                {/* Add download functionality to the button */}
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

                                {/* Fallback for when iframe doesn't work properly */}
                                <div className="hidden">
                                    <p className="text-center py-4">
                                        PDF tidak dapat ditampilkan. Silakan
                                        <a
                                            href={activePdf.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline ml-1">
                                            unduh disini
                                        </a>
                                        .
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyFeedbackDetails;
