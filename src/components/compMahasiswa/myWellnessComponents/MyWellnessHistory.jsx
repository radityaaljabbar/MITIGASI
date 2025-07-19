import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPsiResult } from '../../../services/mahasiswaServices/myWellnessService';

/**
 * Komponen halaman untuk menampilkan daftar riwayat evaluasi psikologis mahasiswa.
 * Page component to display the history list of a student's psychological evaluations.
 */
const MyWellnessHistory = () => {
    // State untuk menyimpan daftar riwayat, status loading, dan pesan error
    // State to store the history list, loading status, and error messages
    const [historyList, setHistoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    // State untuk modal detail hasil evaluasi
    // State for the evaluation result detail modal
    const [selectedResult, setSelectedResult] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Effect untuk mengambil data riwayat saat komponen dimuat
    // Effect to fetch history data when the component mounts
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                const response = await getPsiResult();

                if (response.success) {
                    // Mengurutkan data berdasarkan tanggal (terbaru di atas)
                    // Sorting data by date (newest first)
                    const sortedData = (response.data || []).sort(
                        (a, b) =>
                            new Date(b.tanggalTes) - new Date(a.tanggalTes)
                    );
                    setHistoryList(sortedData);
                    setError('');
                } else {
                    setError(response.message || 'Failed to fetch history');
                    setHistoryList([]);
                }
            } catch (error) {
                console.error('Error fetching history:', error);
                setError('Terjadi kesalahan saat mengambil data riwayat');
                setHistoryList([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    /**
     * Menangani pembukaan modal detail.
     * Handles opening the detail modal.
     * @param {object} result - Data hasil tes yang dipilih.
     */
    const handleViewDetail = (result) => {
        setSelectedResult(result);
        setShowDetailModal(true);
    };

    /**
     * Menangani penutupan modal detail.
     * Handles closing the detail modal.
     */
    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedResult(null);
    };

    /**
     * Memformat string tanggal menjadi format lokal yang mudah dibaca.
     * Formats a date string into an easy-to-read local format.
     * @param {string} dateString - String tanggal dari API.
     * @returns {string} - Tanggal yang sudah diformat.
     */
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

     /**
     * Mendapatkan kelas warna untuk badge klasifikasi.
     * Gets the color class for the classification badge.
     * @param {string} klasifikasi - Status klasifikasi.
     * @returns {string} - Kelas Tailwind CSS.
     */
    const getKlasifikasiColor = (klasifikasi) => {
        const lowerKlasifikasi = klasifikasi?.toLowerCase();
        switch (lowerKlasifikasi) {
            case 'aman':
                return 'bg-green-100 text-green-800';
            case 'sedang':
                return 'bg-yellow-100 text-yellow-800';
            case 'tinggi':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    /**
     * Memotong teks jika terlalu panjang dan menambahkan elipsis.
     * Truncates text if it's too long and adds an ellipsis.
     * @param {string} text - Teks asli.
     * @param {number} maxLength - Panjang maksimum teks.
     * @returns {string} - Teks yang sudah dipotong.
     */
    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength
            ? text.substring(0, maxLength) + '...'
            : text;
    };

    return (
        <div className="min-h-screen bg-[#FAF0E6] py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Halaman */}
                {/* Page Header */}
                <div className="bg-[#951A22] rounded-t-lg shadow-md py-6 px-8">
                    <h1 className="text-white text-3xl font-bold text-center">
                        Riwayat Evaluasi Psikologis
                    </h1>
                </div>

                {/* Konten Halaman */}
                {/* Page Content */}
                <div className="bg-white rounded-b-lg shadow-md py-6 px-8">
                    {/* Tombol Kembali */}
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            to="/student/my-wellness"
                            className="inline-flex items-center text-[#951A22] hover:text-[#7a1118]">
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
                            Kembali
                        </Link>
                    </div>

                    {/* Kotak Informasi Skoring */}
                    {/* Scoring Information Box */}
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h3 className="font-semibold text-amber-900 mb-2 flex items-center">
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
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Informasi Skoring
                        </h3>
                        <div className="text-sm text-amber-800 space-y-1">
                            <p>
                                • <strong>Skor Total (0-100):</strong> Semakin
                                tinggi semakin baik. Menunjukkan kondisi
                                psikologis secara keseluruhan.
                            </p>
                            <p>
                                •{' '}
                                <strong>
                                    Skor per Domain (Depresi, Kecemasan, Stres):
                                </strong>{' '}
                                Semakin rendah semakin baik. Skor tinggi
                                mengindikasikan masalah pada domain tersebut.
                            </p>
                        </div>
                    </div>

                    {/* Tampilan Error */}
                    {/* Error Display */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                     {/* Tampilan Loading */}
                    {/* Loading State */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <svg
                                className="animate-spin h-8 w-8 text-[#951A22]"
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
                        </div>
                    ) : historyList.length === 0 ? (
                        // Tampilan jika tidak ada riwayat (Empty State)
                        // Display if there is no history (Empty State)
                        <div className="text-center py-12">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mx-auto h-12 w-12 text-gray-400"
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
                            <h3 className="mt-2 text-lg font-medium text-gray-900">
                                Belum Ada Riwayat
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Anda belum pernah melakukan evaluasi psikologis.
                            </p>
                            <div className="mt-6">
                                <Link
                                    to="/student/my-wellness/psi-test"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#951A22] hover:bg-[#7a1118]">
                                    Mulai Evaluasi Pertama
                                </Link>
                            </div>
                        </div>
                    ) : (
                        // Tampilan daftar riwayat
                        // History list display
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {historyList.map((result, index) => (
                                <div
                                    key={result.idHasil}
                                    className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Evaluasi #
                                                {historyList.length - index}
                                            </h3>
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getKlasifikasiColor(
                                                    result.klasifikasi
                                                )}`}>
                                                {result.klasifikasi}
                                            </span>
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <p className="text-gray-500">
                                                    Tanggal Tes:
                                                </p>
                                                <p className="font-medium">
                                                    {formatDate(
                                                        result.tanggalTes
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-gray-500">
                                                    Total Skor:
                                                </p>
                                                <p className="font-medium">
                                                    {result.total_skor}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-gray-500">
                                                    Kesimpulan:
                                                </p>
                                                <p className="text-gray-700 italic">
                                                    {truncateText(
                                                        result.kesimpulan,
                                                        80
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleViewDetail(result)
                                            }
                                            className="mt-4 w-full bg-[#951A22] text-white py-2 px-4 rounded hover:bg-[#7a1118] transition duration-200">
                                            Lihat Detail
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detail */}
            {/* Detail Modal */}
            {showDetailModal && selectedResult && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Latar belakang modal */}
                        {/* Modal backdrop */}
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true">
                            &#8203;
                        </span>

                        {/* Konten modal */}
                        {/* Modal content */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                            Detail Evaluasi Psikologis
                                        </h3>

                                        <div className="border-t border-gray-200 py-3">
                                            <dl className="space-y-4">
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Tanggal Tes
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {formatDate(
                                                            selectedResult.tanggalTes
                                                        )}
                                                    </dd>
                                                </div>

                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Klasifikasi
                                                    </dt>
                                                    <dd className="mt-1">
                                                        <span
                                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getKlasifikasiColor(
                                                                selectedResult.klasifikasi
                                                            )}`}>
                                                            {
                                                                selectedResult.klasifikasi
                                                            }
                                                        </span>
                                                    </dd>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">
                                                            Skor Depresi
                                                        </dt>
                                                        <dd className="mt-1 text-sm font-semibold text-gray-900">
                                                            {
                                                                selectedResult.skor_depression
                                                            }
                                                            {selectedResult.skor_depression >
                                                                10 && (
                                                                <span className="text-xs text-red-600 block">
                                                                    (Tinggi)
                                                                </span>
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">
                                                            Skor Kecemasan
                                                        </dt>
                                                        <dd className="mt-1 text-sm font-semibold text-gray-900">
                                                            {
                                                                selectedResult.skor_anxiety
                                                            }
                                                            {selectedResult.skor_anxiety >
                                                                8 && (
                                                                <span className="text-xs text-red-600 block">
                                                                    (Tinggi)
                                                                </span>
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">
                                                            Skor Stres
                                                        </dt>
                                                        <dd className="mt-1 text-sm font-semibold text-gray-900">
                                                            {
                                                                selectedResult.skor_stress
                                                            }
                                                            {selectedResult.skor_stress >
                                                                14 && (
                                                                <span className="text-xs text-red-600 block">
                                                                    (Tinggi)
                                                                </span>
                                                            )}
                                                        </dd>
                                                    </div>
                                                </div>

                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Total Skor
                                                    </dt>
                                                    <dd className="mt-1 text-lg font-bold text-[#951A22]">
                                                        {
                                                            selectedResult.total_skor
                                                        }
                                                        /100
                                                        <span className="text-xs font-normal text-gray-500 ml-2">
                                                            (semakin tinggi
                                                            semakin baik)
                                                        </span>
                                                    </dd>
                                                </div>

                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Kesimpulan
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                                                        {
                                                            selectedResult.kesimpulan
                                                        }
                                                    </dd>
                                                </div>

                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Saran
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 bg-blue-50 p-3 rounded">
                                                        {selectedResult.saran}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={closeDetailModal}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#951A22] text-base font-medium text-white hover:bg-[#7a1118] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#951A22] sm:ml-3 sm:w-auto sm:text-sm">
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyWellnessHistory;
