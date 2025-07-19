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
    sendResponse,
} from '../../../services/dosenWali/myReport/listFeedbackMahasiswaService';

/**
 * Komponen untuk menampilkan detail feedback dari seorang mahasiswa.
 * Dosen dapat melihat detail keluhan, lampiran, dan mengirimkan tanggapan.
 * Component to display the details of a feedback from a student.
 * The lecturer can view complaint details, attachments, and send a response.
 * @param {object} props - Props komponen.
 * @param {object} props.student - Data dasar mahasiswa yang dipilih.
 * @param {function} props.onBack - Callback untuk kembali ke daftar mahasiswa.
 */
const StudentDetailView = ({ student, onBack }) => {
    // State untuk input teks tanggapan.
    // State for the response text input.
    const [responseText, setResponseText] = useState('');
    // State untuk status loading dan error.
    // State for loading and error status.
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // State untuk menyimpan detail lengkap feedback mahasiswa.
    // State to store the full details of the student's feedback.
    const [studentDetail, setStudentDetail] = useState(student);
    // State untuk menyimpan data tanggapan dari dosen.
    // State to store the response data from the lecturer.
    const [responseData, setResponseData] = useState(null);
    // State untuk status pengiriman tanggapan.
    // State for the submission status of the response.
    const [isSubmitting, setIsSubmitting] = useState(false);
    // State untuk mengontrol modal PDF.
    // State to control the PDF modal.
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [activePdf, setActivePdf] = useState(null);
    // State untuk memicu pembaruan data.
    // State to trigger a data refresh.
    const [refreshKey, setRefreshKey] = useState(0);
    // State untuk file yang akan dilampirkan.
    // State for the file to be attached.
    const [selectedFile, setSelectedFile] = useState(null);
    // Ref untuk input file yang tersembunyi.
    // Ref for the hidden file input.
    const [fileInputRef] = useState(React.createRef());

    // Fungsi untuk memuat ulang data, dibungkus useCallback untuk optimasi.
    // Function to reload data, wrapped in useCallback for optimization.
    const refreshData = useCallback(() => {
        setRefreshKey((prevKey) => prevKey + 1);
    }, []);

    // Fungsi-fungsi untuk menangani pemilihan dan penghapusan file.
    // Functions to handle file selection and removal.
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Ukuran file maksimal 5MB');
                return;
            }

            // Validate file type
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'image/jpeg',
                'image/png',
            ];

            if (!allowedTypes.includes(file.type)) {
                toast.error(
                    'Tipe file tidak didukung. Hanya PDF, DOC, DOCX, XLS, XLSX, JPG, dan PNG yang diizinkan.'
                );
                return;
            }

            setSelectedFile(file);
            toast.success(`File "${file.name}" berhasil dipilih`);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.info('File dihapus');
    };

    const handlePaperclipClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // useEffect untuk mengambil detail feedback (termasuk lampiran mahasiswa).
    // useEffect to fetch feedback details (including student's attachment).
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
                                // Only update feedback-specific fields, don't spread everything
                                name: detailResponse.data.name,
                                nim: detailResponse.data.nim,
                                kelas: detailResponse.data.kelas,
                                title: detailResponse.data.title,
                                details: detailResponse.data.details,
                                feedbackDate: detailResponse.data.feedbackDate,
                                feedbackId: detailResponse.data.feedbackId,
                                lampiranMahasiswa: detailResponse.data.lampiran,
                                // Keep existing status if already set
                                status:
                                    prev.status || detailResponse.data.status,
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

    // useEffect untuk mengambil tanggapan dosen yang sudah ada.
    // useEffect to fetch the existing lecturer's response.
    useEffect(() => {
        const fetchDosenResponse = async () => {
            if (student.feedbackId) {
                try {
                    const response = await getFeedbackResponse(
                        student.feedbackId
                    );

                    if (response.success && response.data) {
                        const newResponseData = {
                            ...response.data,
                            lampiranResponse: response.data.lampiran,
                            lampiran: undefined,
                        };
                        setResponseData(newResponseData);
                        setResponseText(response.data.responseText);

                        setStudentDetail((prev) => {
                            const updated = {
                                ...prev,
                                status:
                                    response.data.status || 'Sudah Direspon',
                            };
                            return updated;
                        });
                    }
                } catch (error) {
                    console.error('❌ Error fetching dosen response:', error);
                }
            }
        };

        fetchDosenResponse();
    }, [student.feedbackId, refreshKey, student.status]);

    /**
     * Menangani pengiriman tanggapan baru dari dosen.
     * Handles the submission of a new response from the lecturer.
     */
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
                status_keluhan: 1, // 1 artinya "Sudah Direspon"
            };

            // Call sendResponse with file parameter
            const result = await sendResponse(responsePayload, selectedFile);

            // Always assume success if we don't get an explicit error message
            if (result.success !== false) {
                // Logika setelah berhasil mengirim.
                // Logic after successful submission.
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
                    lampiranResponse: selectedFile
                        ? {
                              original_name: selectedFile.name,
                              file_size: selectedFile.size,
                              file_type: selectedFile.type,
                              file_url: result.data?.lampiran?.url || '#',
                          }
                        : null,
                    lampiran: undefined,
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

                // Clear form
                setResponseText('');
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                // Show success message
                const successMessage = selectedFile
                    ? 'Tanggapan dengan lampiran berhasil dikirim'
                    : 'Tanggapan berhasil dikirim';
                toast.success(successMessage);

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

    // Fungsi-fungsi untuk modal PDF dan unduh file.
    // Functions for the PDF modal and file download.
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

    // Tampilan loading.
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow p-4 md:p-6 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Tampilan error.
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
            {/* Header dengan tombol kembali dan status */}
            {/* Header with back button and status */}
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

            {/* Konten detail */}
            {/* Detail content */}
            <div className="p-4 md:p-6 space-y-6">
                {/* Kartu info mahasiswa */}
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

                {/* Isi keluhan/feedback */}
                {/* Complaint/feedback content */}
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

                {/* Lampiran dari mahasiswa */}
                {/* Attachment from student */}
                {studentDetail.lampiranMahasiswa && (
                    <div className="space-y-3">
                        <p className="font-semibold text-sm">
                            Lampiran Mahasiswa:
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 p-2 bg-gray-50 border rounded-lg transition-colors hover:bg-gray-100">
                                {studentDetail.lampiranMahasiswa.file_type?.includes(
                                    'pdf'
                                ) ? (
                                    <FileText
                                        size={20}
                                        className="text-red-600"
                                    />
                                ) : studentDetail.lampiranMahasiswa.file_type?.includes(
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
                                    {
                                        studentDetail.lampiranMahasiswa
                                            .original_name
                                    }
                                </span>
                                <button
                                    onClick={() =>
                                        handleDownload(
                                            studentDetail.lampiranMahasiswa
                                                .file_url,
                                            studentDetail.lampiranMahasiswa
                                                .original_name
                                        )
                                    }
                                    className="ml-2 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                                    title="Unduh lampiran mahasiswa">
                                    <Download size={16} />
                                </button>
                                {studentDetail.lampiranMahasiswa.file_type?.includes(
                                    'pdf'
                                ) && (
                                    <button
                                        onClick={() =>
                                            handleOpenPdf({
                                                name: studentDetail
                                                    .lampiranMahasiswa
                                                    .original_name,
                                                url: studentDetail
                                                    .lampiranMahasiswa.file_url,
                                            })
                                        }
                                        className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                                        title="Lihat lampiran mahasiswa">
                                        <ExternalLink size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Bagian tanggapan dosen */}
                {/* Lecturer response section */}
                <div className="border-t pt-4">
                    <h4 className="font-semibold text-base mb-3">
                        Tanggapan Dosen Wali:
                    </h4>

                    {/* Menampilkan tanggapan yang sudah ada atau form input baru */}
                    {/* Displaying existing response or a new input form */}
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
                            <p className="text-sm text-gray-700 mb-3">
                                {responseData.responseText}
                            </p>

                            {/* Response attachment display */}
                            {responseData.lampiranResponse && (
                                <div className="border-t border-green-200 pt-3">
                                    <p className="font-medium text-sm text-green-800 mb-2">
                                        Lampiran Tanggapan:
                                    </p>
                                    <div className="flex items-center gap-2 p-2 bg-green-100 border border-green-200 rounded-lg">
                                        {responseData.lampiranResponse.file_type?.includes(
                                            'pdf'
                                        ) ? (
                                            <FileText
                                                size={20}
                                                className="text-red-600"
                                            />
                                        ) : responseData.lampiranResponse.file_type?.includes(
                                              'word'
                                          ) ? (
                                            <FileText
                                                size={20}
                                                className="text-blue-600"
                                            />
                                        ) : responseData.lampiranResponse.file_type?.includes(
                                              'image'
                                          ) ? (
                                            <FileText
                                                size={20}
                                                className="text-green-600"
                                            />
                                        ) : (
                                            <FileText
                                                size={20}
                                                className="text-gray-600"
                                            />
                                        )}
                                        <span className="text-sm text-green-800">
                                            {
                                                responseData.lampiranResponse
                                                    .original_name
                                            }
                                        </span>
                                        <span className="text-xs text-green-600">
                                            (
                                            {formatFileSize(
                                                responseData.lampiranResponse
                                                    .file_size
                                            )}
                                            )
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleDownload(
                                                    responseData
                                                        .lampiranResponse
                                                        .file_url,
                                                    responseData
                                                        .lampiranResponse
                                                        .original_name
                                                )
                                            }
                                            className="ml-auto p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-200"
                                            title="Unduh lampiran tanggapan">
                                            <Download size={16} />
                                        </button>
                                        {responseData.lampiranResponse.file_type?.includes(
                                            'pdf'
                                        ) && (
                                            <button
                                                onClick={() =>
                                                    handleOpenPdf({
                                                        name: responseData
                                                            .lampiranResponse
                                                            .original_name,
                                                        url: responseData
                                                            .lampiranResponse
                                                            .file_url,
                                                    })
                                                }
                                                className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-200"
                                                title="Lihat lampiran tanggapan">
                                                <ExternalLink size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg mb-4 text-center">
                            <p className="text-sm text-yellow-800">
                                Anda belum memberikan tanggapan
                            </p>
                        </div>
                    )}

                    {/* Input untuk tanggapan baru */}
                    {/* Input for new response */}
                    <div className="mt-4 space-y-2">
                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                            className="hidden"
                        />

                        {/* File preview */}
                        {selectedFile && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Paperclip
                                            size={16}
                                            className="text-blue-600"
                                        />
                                        <span className="text-sm font-medium text-blue-800">
                                            {selectedFile.name}
                                        </span>
                                        <span className="text-xs text-blue-600">
                                            ({formatFileSize(selectedFile.size)}
                                            )
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleRemoveFile}
                                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                                        title="Hapus file">
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex">
                            <textarea
                                placeholder="Tulis tanggapan Anda disini..."
                                className="w-full p-3 border border-gray-300 rounded-l-xl text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none resize-none"
                                rows="4"
                                value={responseText}
                                onChange={(e) =>
                                    setResponseText(e.target.value)
                                }
                            />
                            <div className="flex flex-col border-t border-r border-b border-gray-300 rounded-r-xl">
                                <button
                                    onClick={handlePaperclipClick}
                                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                    title="Lampirkan file">
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
                                    } transition-colors`}
                                    title="Kirim tanggapan">
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

            {/* Modal untuk menampilkan PDF */}
            {/* Modal for displaying PDF */}
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
