import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import handleBack from '../../../components/handleBack';
import {
    submitFeedback,
    isValidFileType,
    getAllowedFileExtensions,
} from '../../../services/mahasiswaServices/feedbackService';
import { toast } from 'react-toastify';

/**
 * Komponen form untuk membuat feedback baru.
 * Form component for creating new feedback.
 */
const FeedbackForm = () => {
    const navigate = useNavigate();
    // State untuk data form, file, status, dan pesan
    // State for form data, file, status, and messages
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef(null);

    // Helper function to get file extension
    const getFileExtension = (filename) => {
        return filename
            .slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
            .toLowerCase();
    };

    /**
     * Menangani pemilihan file, termasuk validasi tipe file.
     * Handles file selection, including file type validation.
     * @param {React.ChangeEvent<HTMLInputElement>} e - Event dari input file.
     */
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            return;
        }

        // Validasi tipe file menggunakan service
        // Validate file type using the service
        if (!isValidFileType(selectedFile)) {
            setError(
                `Format file tidak didukung. Hanya ${getAllowedFileExtensions()} yang diperbolehkan.`
            );
            e.target.value = null; // Reset file input
            return;
        }

        // Clear any previous errors
        setError('');

        // Set the file
        setFile(selectedFile);
        setFileName(selectedFile.name);
    };

    /**
     * Menangani proses submit form.
     * Handles the form submission process.
     * @param {React.FormEvent} e - Event form.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi form sebelum submit
        // Validate form before submission
        if (!content.trim()) {
            setError('Isi feedback tidak boleh kosong');
            return;
        }

        // Final validation of file if one is selected
        if (file && !isValidFileType(file)) {
            setError(
                `Format file tidak didukung. Hanya ${getAllowedFileExtensions()} yang diperbolehkan.`
            );
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            // Memanggil service untuk mengirim feedback
            // Calling the service to submit feedback
            const response = await submitFeedback(
                title.trim() || 'Feedback Tanpa Judul', // Default title if empty
                content,
                file
            );

            setSuccessMessage('Feedback berhasil dikirim!');
            toast.success('Feedback berhasil dikirim!');

            // Reset form setelah berhasil
            // Reset form after success
            setTitle('');
            setContent('');
            setFile(null);
            setFileName('');

            // Arahkan kembali ke daftar feedback setelah jeda singkat
            // Redirect back to the feedback list after a short delay
            setTimeout(() => {
                navigate('/student/my-feedback');
            }, 2000);
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            setError(
                error.message || 'Gagal mengirim feedback. Silakan coba lagi.'
            );
            toast.error(
                error.message || 'Gagal mengirim feedback. Silakan coba lagi.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Menangani klik tombol kembali.
     * Handles the back button click.
     * @param {React.MouseEvent} e - Event klik.
     */
    const handleBackClick = (e) => {
        e.preventDefault();
        handleBack();
    };

    /**
     * Menghapus file yang sudah dipilih.
     * Removes the selected file.
     */
    const removeFile = () => {
        setFile(null);
        setFileName('');
        // Mereset elemen input file
        // Resetting the file input element
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 bg-[#FAF0E6] h-screen overflow-auto">
            <div className="bg-white shadow-md rounded-xl p-4 md:p-8 w-full max-w-3xl mx-auto transition-all duration-300">
                {/* Pesan Sukses */}
                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        {successMessage}
                    </div>
                )}

                {/* Pesan Error */}
                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form className="flex flex-col" onSubmit={handleSubmit}>
                    {/* Input Judul */}
                    {/* Title Input */}
                    <label
                        htmlFor="feedback-title"
                        className="font-semibold mb-2 text-gray-800">
                        Judul (Opsional)
                    </label>
                    <input
                        type="text"
                        id="feedback-title"
                        placeholder="Judul Feedback"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 mb-6 border border-gray-200 rounded-lg focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/10 font-sans transition-all duration-300"
                    />

                    {/* Input Konten Feedback */}
                    {/* Feedback Content Input */}
                    <label
                        htmlFor="feedback-content"
                        className="font-semibold mb-2 text-gray-800">
                        Feedback Anda <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="feedback-content"
                        placeholder="Tulis feedback Anda di sini"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="w-full px-3 mb-6 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-40"
                    />

                    {/* Unggah Dokumen */}
                    {/* Document Upload */}
                    <label
                        htmlFor="supportDocument"
                        className="font-semibold mb-2 text-gray-800">
                        Unggah Dokumen Pendukung (Opsional)
                    </label>

                    <div className="mb-1 text-sm text-gray-500">
                        Format yang didukung: {getAllowedFileExtensions()}
                    </div>

                    {fileName ? (
                        <div className="mb-6 p-3 border border-gray-300 rounded-lg flex justify-between items-center">
                            <span className="text-sm truncate max-w-[80%]">
                                {fileName}
                            </span>
                            <button
                                type="button"
                                onClick={removeFile}
                                className="text-red-500 hover:text-red-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <input
                            type="file"
                            id="supportDocument"
                            name="supportDocument"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                            className="w-full px-3 py-2 mb-6 border-2 border-dashed border-gray-300 
                                        rounded-md file:mr-4 file:rounded-md file:border-0
                                        file:bg-[#951A22] file:text-white file:px-4 file:py-2
                                        hover:file:bg-[#7a1118] transition duration-300"
                        />
                    )}

                    {/* Tombol Aksi */}
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mt-2 justify-start sm:flex-row flex-col">
                        <button
                            type="button"
                            onClick={handleBackClick}
                            disabled={isSubmitting}
                            className="flex items-center bg-[#951A22] hover:bg-[#7A1118] text-white px-5 py-2.5 rounded-lg transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
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

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center bg-[#951A22] hover:bg-[#7A1118] text-white px-5 py-2.5 rounded-lg transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Mengirim...</span>
                                </>
                            ) : (
                                <span>Kirim Feedback</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackForm;
