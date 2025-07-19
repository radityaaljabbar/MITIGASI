import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router';
import { getReliefList } from '../../../services/mahasiswaServices/myFinanceService';

/**
 * Komponen untuk menampilkan riwayat pengajuan keringanan biaya kuliah.
 * Component to display the history of tuition fee relief applications.
 */
const TuitionReliefHistory = () => {
    // State untuk daftar pengajuan, status loading, modal, dan filter
    // State for application list, loading status, modal, and filter
    const [reliefList, setReliefList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    // Mengambil data riwayat saat komponen dimuat
    // Fetching history data when the component mounts
    useEffect(() => {
        const fetchRelief = async () => {
            try {
                setIsLoading(true);
                const response = await getReliefList();

                if (response.success) {
                    setReliefList(response.data || []);
                } else {
                    setError(response.message || 'Failed to fetch Relief list');
                    setReliefList([]);
                }
            } catch (error) {
                console.error('Error fetching Relief:', error);
                setError('Terjadi kesalahan saat mengambil data Relief');
                setReliefList([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRelief();
    }, []);

    // Handler untuk membuka dan menutup modal detail
    // Handlers for opening and closing the detail modal
    const handleViewDetail = (application) => {
        setSelectedApplication(application);
        setShowDetailModal(true);
    };
    const closeDetailModal = () => {
        setShowDetailModal(false);
    };

    // Fungsi-fungsi helper untuk format tampilan (badge status, tanggal, mata uang)
    // Helper functions for display formatting (status badge, date, currency)
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Menunggu Review':
                return (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Menunggu Review
                    </span>
                );
            case 'Disetujui':
                return (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Disetujui
                    </span>
                );
            case 'Ditolak':
                return (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Ditolak
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Menerapkan filter status pada daftar pengajuan
    // Applying the status filter to the application list
    const filteredApplications = reliefList.filter((app) => {
        if (filterStatus === 'all') return true;
        return app.status_pengajuan === filterStatus;
    });

    return (
        <div className="min-h-screen bg-[#FAF0E6] py-6 px-4 sm:px-6 lg:px-8">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className="max-w-6xl mx-auto">
                {/* Header Halaman */}
                {/* Page Header */}
                <div className="bg-[#951A22] rounded-t-lg shadow-md py-6 px-8">
                    <h1 className="text-white text-3xl font-bold text-center">
                        Riwayat Pengajuan Keringanan Biaya Kuliah
                    </h1>
                </div>

                {/* Konten Utama */}
                {/* Main Content */}
                <div className="bg-white rounded-b-lg shadow-md py-6 px-8">
                    {/* Filter dan Tombol Aksi */}
                    {/* Filter and Action Buttons */}
                    <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
                        <div>
                            <label
                                htmlFor="filterStatus"
                                className="block text-sm font-medium text-gray-700 mb-1">
                                Filter Status:
                            </label>
                            <select
                                id="filterStatus"
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value)
                                }
                                className="rounded-md border-gray-300 shadow-sm focus:border-[#951A22] focus:ring focus:ring-[#951A22] focus:ring-opacity-50">
                                <option value="all">Semua Status</option>
                                <option value="Menunggu">Menunggu</option>
                                <option value="Disetujui">Disetujui</option>
                                <option value="Ditolak">Ditolak</option>
                            </select>
                        </div>

                        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#951A22] hover:bg-[#7a1118] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#951A22]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="-ml-1 mr-2 h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            <Link to="/student/my-finance/application">
                                Buat Pengajuan Baru
                            </Link>
                        </button>
                    </div>

                    {/* Render kondisional: Loading, Data Kosong, atau Tabel */}
                    {/* Conditional Rendering: Loading, Empty Data, or Table */}
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
                    ) : reliefList.length === 0 ? (
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
                                Belum Ada Pengajuan
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Anda belum pernah melakukan pengajuan keringanan
                                biaya kuliah.
                            </p>
                        </div>
                    ) : filteredApplications.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-gray-900">
                                Tidak Ada Pengajuan{' '}
                                {filterStatus !== 'all' &&
                                    `dengan Status "${
                                        filterStatus === 'Menunggu'
                                            ? 'Menunggu'
                                            : filterStatus === 'Disetujui'
                                            ? 'Disetujui'
                                            : 'Ditolak'
                                    }"`}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Coba pilih filter status yang berbeda.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal Pengajuan
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jenis Keringanan
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jumlah
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredApplications.map((application) => (
                                        <tr
                                            key={application.id}
                                            className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(
                                                    application.tanggal_dibuat
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {application.jenis_keringanan}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {application.jenis_keringanan ===
                                                'Pembebasan Biaya Penuh'
                                                    ? 'Pembebasan Penuh'
                                                    : formatCurrency(
                                                          application.jumlah_diajukan
                                                      )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(
                                                    application.status_pengajuan
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        handleViewDetail(
                                                            application
                                                        )
                                                    }
                                                    className="text-[#951A22] hover:text-[#7a1118]">
                                                    Lihat Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detail Pengajuan */}
            {/* Application Detail Modal */}
            {showDetailModal && selectedApplication && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                            Detail Pengajuan
                                        </h3>

                                        <div className="border-t border-gray-200 py-3">
                                            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Tanggal Pengajuan
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {formatDate(
                                                            selectedApplication.tanggal_dibuat
                                                        )}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Jenis Keringanan
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {
                                                            selectedApplication.jenis_keringanan
                                                        }
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Kategori Alasan
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {
                                                            selectedApplication.jenis_keringanan
                                                        }
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Jumlah Pengajuan
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {selectedApplication.jenis_keringanan ===
                                                        'Pembebasan Biaya Penuh'
                                                            ? 'Pembebasan Penuh'
                                                            : formatCurrency(
                                                                  selectedApplication.jumlah_diajukan
                                                              )}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Alasan Pengajuan
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                                        {
                                                            selectedApplication.detail_alasan
                                                        }
                                                    </dd>
                                                </div>
                                                {selectedApplication.lampiran && (
                                                    <div className="sm:col-span-2">
                                                        <dt className="text-sm font-medium text-gray-500">
                                                            Lampiran
                                                        </dt>
                                                        <dd className="mt-1">
                                                            <div className="flex items-center gap-2 p-2 bg-gray-50 border rounded-lg">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-5 w-5 text-gray-600"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                    />
                                                                </svg>
                                                                <span className="text-sm text-gray-700 flex-grow">
                                                                    {selectedApplication
                                                                        .lampiran
                                                                        .originalName ||
                                                                        'Dokumen Pendukung'}
                                                                </span>
                                                                <a
                                                                    href={
                                                                        selectedApplication
                                                                            .lampiran
                                                                            .url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#951A22] hover:text-[#7a1118] text-sm">
                                                                    lihat
                                                                </a>
                                                            </div>
                                                        </dd>
                                                    </div>
                                                )}
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={closeDetailModal}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#951A22] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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

export default TuitionReliefHistory;
