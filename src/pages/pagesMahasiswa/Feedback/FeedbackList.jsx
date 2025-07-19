import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import getStatusColor from '../../../components/statusColor';
import { getFeedbackList } from '../../../services/mahasiswaServices/feedbackService';

/**
 * Komponen untuk menampilkan daftar feedback yang telah dikirim oleh mahasiswa.
 * Component to display a list of feedback submitted by the student.
 */
const MyFeedback = () => {
    // State untuk menyimpan daftar feedback, status loading, dan pesan error
    // State to store the feedback list, loading status, and error message
    const [feedbackList, setFeedbackList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    /**
     * Fungsi helper untuk mengonversi kode status (misal: angka) menjadi teks yang bisa ditampilkan.
     * Helper function to convert a status code (e.g., a number) into displayable text.
     * @param {number|string} status - Kode status dari API.
     * @returns {string} - Teks status.
     */
    const getStatusDisplay = (status) => {
        // Mengonversi status numerik ke representasi string
        // Converting numeric status to string representation
        if (status === 1 || status === '1') {
            return 'Direspon';
        }
        // Menambahkan pemetaan status lain jika diperlukan
        // Add other status mappings as needed
        return status || 'Pending';
    };

    /**
     * Fungsi helper untuk mendapatkan kelas warna CSS berdasarkan status feedback.
     * Helper function to get the CSS color class based on the feedback status.
     * @param {number|string} status - Kode status dari API.
     * @returns {string} - Kelas Tailwind CSS.
     */
    const getStatusColorClass = (status) => {
        const displayStatus = getStatusDisplay(status);

        switch (displayStatus) {
            case 'Direspon':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                // Fallback ke helper umum jika ada, atau default ke abu-abu
                // Fallback to a common helper if available, or default to gray
                return (
                    getStatusColor(displayStatus) || 'bg-gray-100 text-gray-800'
                );
        }
    };

    // Effect untuk mengambil data feedback saat komponen dimuat
    // Effect to fetch feedback data when the component mounts
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setIsLoading(true);
                const response = await getFeedbackList();

                if (response.success) {
                    setFeedbackList(response.data || []);
                    setError('');
                } else {
                    setError(
                        response.message || 'Failed to fetch feedback list'
                    );
                    setFeedbackList([]);
                }
            } catch (error) {
                console.error('Error fetching feedback:', error);
                setError('Terjadi kesalahan saat mengambil data feedback');
                setFeedbackList([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    return (
        <div className="bg-[#FAF0E6] min-h-screen flex flex-col items-center p-4 sm:p-6">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4 sm:p-6 mt-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Daftar Feedback
                </h1>

                {/* Tombol untuk membuat feedback baru */}
                {/* Button to create new feedback */}
                <Link
                    to="new-feedback"
                    className="flex items-center gap-2 bg-[#951A22] hover:bg-[#7A1118] text-white font-medium py-2 px-4 rounded transition-all duration-200 mb-6 shadow-sm hover:shadow">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>Buat Feedback Baru</span>
                </Link>

                {/* Render kondisional berdasarkan status (loading, error, atau data) */}
                {/* Conditional rendering based on status (loading, error, or data) */}
                {isLoading ? (
                    // Tampilan saat loading
                    // Loading view
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#951A22]"></div>
                    </div>
                ) : error ? (
                    // Tampilan saat terjadi error
                    // Error view
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                        {error}
                    </div>
                ) : (
                    // Tampilan daftar feedback
                    // Feedback list view
                    <ul className="space-y-3">
                        {feedbackList.length > 0 ? (
                            feedbackList.map((feedback) => (
                                <li
                                    key={
                                        feedback.id_keluhan ||
                                        feedback.feedbackId
                                    }
                                    className="border-l-4 border-[#951A22] bg-white p-4 rounded shadow-sm hover:-translate-x-1.5 transition-transform duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <div className="flex flex-col w-full sm:w-auto">
                                        <span className="font-medium text-gray-800 mb-1 sm:mb-0">
                                            {feedback.title_keluhan ||
                                                feedback.title}
                                        </span>
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm mt-2 sm:mt-0">
                                            <span className="text-gray-500">
                                                {/* Menggunakan tanggal yang sudah diformat dari service */}
                                                {/* Using the pre-formatted date from the service */}
                                                {feedback.tanggal_keluhan ||
                                                    feedback.feedbackDate}
                                            </span>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusColorClass(
                                                    feedback.status
                                                )}`}>
                                                {getStatusDisplay(
                                                    feedback.status
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        to={`${
                                            feedback.id_keluhan ||
                                            feedback.feedbackId
                                        }`}
                                        className="bg-[#951A22] hover:bg-[#7A1118] text-white text-sm py-2 px-4 rounded transition-colors duration-200 mt-2 sm:mt-0 w-full sm:w-auto">
                                        Lihat Detail
                                    </Link>
                                </li>
                            ))
                        ) : (
                            // Tampilan jika tidak ada feedback
                            // View if there is no feedback
                            <div className="flex flex-col items-center justify-center py-12">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 text-gray-300 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <p className="text-gray-500 text-lg">
                                    Belum ada feedback
                                </p>
                                <p className="text-gray-400 mt-2">
                                    Klik tombol "Buat Feedback Baru" untuk
                                    memulai
                                </p>
                            </div>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MyFeedback;
