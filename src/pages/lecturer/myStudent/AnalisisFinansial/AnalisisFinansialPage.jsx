import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingAnalisisFinansial from '../../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/LoadingAnalisisFinansial';
import StudentInfoFinansialPage from '../../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/StudentInfoFinansialPage';
import StudentFinancialList from '../../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/StudentFinancialList';
import DetailPengajuanFinansial from '../../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/DetailPengajuanFinansial';
import BelumMengisiFinansial from '../../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/BelumMengisiFinansial';
import handleBack from '../../../../components/handleBack';
// Mengimpor fungsi-fungsi service/loader data
// Importing service/data loader functions
import {
    fetchStudentFinancialData,
    approveRequest,
    rejectRequest,
    downloadAttachment,
} from '../../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/AnalisisFinansialDataLoader';

/**
 * Komponen halaman utama untuk analisis finansial seorang mahasiswa.
 * Main page component for a student's financial analysis.
 */
const AnalisisFinansial = () => {
    // Mengambil NIM dari parameter URL
    // Getting the NIM from the URL parameters
    const { nim } = useParams();
    // State untuk data mahasiswa, loading, modal, dan error
    // State for student data, loading, modal, and errors
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    /**
     * Fungsi untuk memuat data finansial mahasiswa dari server.
     * Function to load student's financial data from the server.
     * @param {boolean} showRefreshingIndicator - Menampilkan indikator refresh kecil.
     */
    const loadStudentData = async (showRefreshingIndicator = false) => {
        if (!nim) {
            setError('NIM tidak ditemukan');
            setLoading(false);
            return;
        }

        try {
            if (showRefreshingIndicator) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);
            
            const data = await fetchStudentFinancialData(nim);
            
            setStudentData(data);
        } catch (error) {
            console.error('Error fetching student data:', error);
            
            setError(error.message || 'Gagal memuat data mahasiswa');
            
            // Mengatur struktur data default untuk mencegah error pada UI
            // Setting a default data structure to prevent UI errors
            setStudentData({
                name: 'Data Tidak Ditemukan',
                nim: nim || '-',
                semester: '-',
                financialStatus: '-',
                lastUpdated: '-',
                pendingRequests: [],
                previousRequests: [],
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Pemuatan data awal saat komponen dimuat
    // Initial data load when the component mounts
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (isMounted) {
                await loadStudentData();
            }
        };

        loadData();

        // Fungsi cleanup untuk mencegah update state pada komponen yang sudah unmounted
        // Cleanup function to prevent state updates on an unmounted component
        return () => {
            isMounted = false;
        };
    }, [nim]);

    /**
     * Menangani aksi untuk melihat detail pengajuan.
     * Handles the action to view request details.
     * @param {object} request - Objek data pengajuan.
     */
    const handleViewDetail = (request) => {
        setSelectedRequest(request);
        setShowDetailModal(true);
    };

    /**
     * Menangani aksi menyetujui pengajuan.
     * Handles the action to approve a request.
     * @param {string|number} id - ID pengajuan.
     */
    const handleApproveRequest = async (id) => {
        try {
            await approveRequest(id);
            // Close modal
            setShowDetailModal(false);
            setSelectedRequest(null);
            await loadStudentData(true); // Muat ulang data setelah aksi
            
        } catch (error) {
            console.error('Error approving request:', error);
            // Error message is already shown by the approveRequest function
            // Keep modal open so user can try again if needed
        }
    };

    /**
     * Menangani aksi menolak pengajuan.
     * Handles the action to reject a request.
     * @param {string|number} id - ID pengajuan.
     */
    const handleRejectRequest = async (id) => {
        try {
            await rejectRequest(id);
            setShowDetailModal(false);
            setSelectedRequest(null);
            await loadStudentData(true); // Muat ulang data setelah aksi
            
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

    /**
     * Menangani aksi mengunduh lampiran.
     * Handles the action to download an attachment.
     * @param {string} filename - Nama file.
     */
    const handleDownloadAttachment = async (filename) => {
        try {
            await downloadAttachment(filename);
        } catch (error) {
            console.error('Error downloading attachment:', error);
        }
    };

    // Tampilan loading awal.
    // Initial loading view.
    if (loading) {
        return (
            <div className="p-4 max-w-6xl mx-auto">
                <LoadingAnalisisFinansial />
            </div>
        );
    }

    // Tampilan jika terjadi error fatal saat memuat data awal.
    // View for a fatal error during initial data load.
    if (error && (!studentData || studentData.name === 'Data Tidak Ditemukan')) {
        return (
            <div className="p-4 max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-red-800 p-4 text-white">
                        <button
                            onClick={handleBack}
                            className="text-white hover:underline flex items-center mb-2">
                            &lt; Kembali ke Daftar Mahasiswa
                        </button>
                        <p className="text-sm opacity-90">Error memuat data</p>
                    </div>
                    <div className="p-6">
                        <div className="text-center text-red-600">
                            <p className="text-lg font-medium mb-2">
                                Gagal memuat data mahasiswa dengan NIM: {nim}
                            </p>
                            <p className="text-sm mb-4">{error}</p>
                            <button
                                onClick={() => loadStudentData()}
                                className="px-4 py-2 bg-[#951A22] text-white rounded hover:bg-red-800">
                                Coba Lagi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Memeriksa apakah mahasiswa memiliki data finansial (pending atau riwayat).
    // Checking if the student has any financial data (pending or history).
    const hasFinancialData =
        studentData &&
        ((studentData.pendingRequests && studentData.pendingRequests.length > 0) ||
            (studentData.previousRequests && studentData.previousRequests.length > 0));

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="bg-red-800 p-4 text-white">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handleBack}
                            className="text-white hover:underline flex items-center">
                            &lt; Kembali ke Daftar Mahasiswa
                        </button>
                        {refreshing && (
                            <div className="flex items-center text-sm">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Memperbarui data...
                            </div>
                        )}
                    </div>
                    <p className="text-sm opacity-90 mt-2">
                        {hasFinancialData
                            ? `Data terakhir diperbarui: ${studentData.lastUpdated}`
                            : 'Belum ada data pengajuan'}
                    </p>
                </div>

                <div className="p-5">
                    {hasFinancialData ? (
                        <>
                            {/* Menampilkan informasi mahasiswa */}
                            {/* Displaying student information */}
                            <StudentInfoFinansialPage
                                studentData={studentData}
                            />

                            {/* Menampilkan daftar pengajuan yang sedang menunggu */}
                            {/* Displaying the list of pending requests */}
                            <StudentFinancialList
                                requests={studentData.pendingRequests || []}
                                title="Pengajuan Menunggu Review"
                                emptyMessage="Tidak ada pengajuan yang menunggu review"
                                onViewDetail={handleViewDetail}
                                isPending={true}
                            />

                            {/* Menampilkan daftar riwayat pengajuan */}
                            {/* Displaying the list of request history */}
                            <StudentFinancialList
                                requests={studentData.previousRequests || []}
                                title="Riwayat Pengajuan"
                                emptyMessage="Tidak ada riwayat pengajuan"
                                onViewDetail={handleViewDetail}
                                isPending={false}
                            />
                        </>
                    ) : (
                        // Menampilkan komponen jika belum ada data finansial
                        // Displaying a component if there is no financial data yet
                        <BelumMengisiFinansial studentName={studentData.nama} />
                    )}
                </div>
            </div>

            {/* Modal untuk detail pengajuan */}
            {/* Modal for request details */}
            {showDetailModal && selectedRequest && (
                <DetailPengajuanFinansial
                    selectedRequest={selectedRequest}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedRequest(null);
                    }}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                    onDownloadAttachment={handleDownloadAttachment}
                />
            )}
        </div>
    );
};

export default AnalisisFinansial;