import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

//? Import komponen-komponen yang dibutuhkan:
import LoadingAnalisisFinansial from '../../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/LoadingAnalisisFinansial';
import StudentInfoFinansialPage from '../../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/StudentInfoFinansialPage';
import StudentFinancialList from '../../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/StudentFinancialList';
import DetailPengajuanFinansial from '../../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/DetailPengajuanFinansial';
import BelumMengisiFinansial from '../../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/BelumMengisiFinansial';
import handleBack from '../../../../components/handleBack';

//? Service / Data Handler / loader:
import {
    fetchStudentFinancialData,
    approveRequest,
    rejectRequest,
    downloadAttachment,
} from '../../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/AnalisisFinansialDataLoader';

// New component for displaying "no data" state
const NoFinancialDataNotice = ({ studentName }) => (
    <BelumMengisiFinansial studentName={studentName} />
);

const AnalisisFinansial = () => {
    const { nim } = useParams();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (!nim) {
                if (isMounted) {
                    setError('NIM tidak ditemukan');
                    setLoading(false);
                }
                return;
            }

            try {
                if (isMounted) {
                    setLoading(true);
                    setError(null);
                }
                
                console.log('Loading financial data for NIM:', nim);
                
                const data = await fetchStudentFinancialData(nim);
                console.log('Received student data:', data);
                
                if (isMounted) {
                    setStudentData(data);
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
                
                if (isMounted) {
                    setError(error.message || 'Gagal memuat data mahasiswa');
                    
                    // Set empty default data structure to prevent errors
                    setStudentData({
                        name: 'Data Tidak Ditemukan',
                        nim: nim || '-',
                        semester: '-',
                        financialStatus: '-',
                        lastUpdated: '-',
                        pendingRequests: [],
                        previousRequests: [],
                    });
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadData();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [nim]);

    const handleViewDetail = (request) => {
        console.log('Viewing detail for request:', request);
        setSelectedRequest(request);
        setShowDetailModal(true);
    };

    const handleApproveRequest = async (id) => {
        try {
            await approveRequest(id);
            setShowDetailModal(false);
            // Refresh the data after approval
            const refreshedData = await fetchStudentFinancialData(nim);
            setStudentData(refreshedData);
        } catch (error) {
            console.error('Error approving request:', error);
        }
    };

    const handleRejectRequest = async (id) => {
        try {
            await rejectRequest(id);
            setShowDetailModal(false);
            // Refresh the data after rejection
            const refreshedData = await fetchStudentFinancialData(nim);
            setStudentData(refreshedData);
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

    const handleDownloadAttachment = async (filename) => {
        try {
            await downloadAttachment(filename);
        } catch (error) {
            console.error('Error downloading attachment:', error);
        }
    };

    // Early return for loading state
    if (loading) {
        return (
            <div className="p-4 max-w-6xl mx-auto">
                <LoadingAnalisisFinansial />
            </div>
        );
    }

    // Early return for error state
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
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Check if the student has any financial requests (pending or previous)
    const hasFinancialData =
        studentData &&
        ((studentData.pendingRequests && studentData.pendingRequests.length > 0) ||
            (studentData.previousRequests && studentData.previousRequests.length > 0));

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="bg-red-800 p-4 text-white">
                    <button
                        onClick={handleBack}
                        className="text-white hover:underline flex items-center">
                        &lt; Kembali ke Daftar Mahasiswa
                    </button>
                    <p className="text-sm opacity-90">
                        {hasFinancialData
                            ? `Data terakhir diperbarui: ${studentData.lastUpdated}`
                            : 'Belum ada data pengajuan'}
                    </p>
                </div>

                <div className="p-5">
                    {hasFinancialData ? (
                        <>
                            {/* Student info is always shown */}
                            <StudentInfoFinansialPage
                                studentData={studentData}
                            />

                            <StudentFinancialList
                                requests={studentData.pendingRequests || []}
                                title="Pengajuan Menunggu Review"
                                emptyMessage="Tidak ada pengajuan yang menunggu review"
                                onViewDetail={handleViewDetail}
                                isPending={true}
                            />

                            <StudentFinancialList
                                requests={studentData.previousRequests || []}
                                title="Riwayat Pengajuan"
                                emptyMessage="Tidak ada riwayat pengajuan"
                                onViewDetail={handleViewDetail}
                                isPending={false}
                            />
                        </>
                    ) : (
                        <NoFinancialDataNotice studentName={studentData?.name || 'Mahasiswa'} />
                    )}
                </div>
            </div>

            {showDetailModal && selectedRequest && (
                <DetailPengajuanFinansial
                    selectedRequest={selectedRequest}
                    onClose={() => setShowDetailModal(false)}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                    onDownloadAttachment={handleDownloadAttachment}
                />
            )}
        </div>
    );
};

export default AnalisisFinansial;