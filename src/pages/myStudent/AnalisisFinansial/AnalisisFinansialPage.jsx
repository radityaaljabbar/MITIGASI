import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

//? Import komponen-komponen yang dibutuhkan:
import LoadingAnalisisFinansial from '../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/LoadingAnalisisFinansial';
import StudentInfoFinansialPage from '../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/StudentInfoFinansialPage';
import StudentFinancialList from '../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/StudentFinancialList';
import DetailPengajuanFinansial from '../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/DetailPengajuanFinansial';

//? Service / Data Handler / laader:
import {
    fetchStudentFinancialData,
    approveRequest,
    rejectRequest,
    downloadAttachment,
} from '../../../components/compDosenWali/compMyStudent/compAnalisisFinansial/AnalisisFinansialDataLoader';

const AnalisisFinansial = () => {
    const { nim } = useParams();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchStudentFinancialData(nim);
                setStudentData(data);
            } catch (error) {
                console.error('Error fetching student data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [nim]);

    const handleViewDetail = (request) => {
        setSelectedRequest(request);
        setShowDetailModal(true);
    };

    const handleApproveRequest = async (id) => {
        await approveRequest(id);
        setShowDetailModal(false);
        // In a real app, you would refresh the data here
    };

    const handleRejectRequest = async (id) => {
        await rejectRequest(id);
        setShowDetailModal(false);
        // In a real app, you would refresh the data here
    };

    const handleDownloadAttachment = async (filename) => {
        await downloadAttachment(filename);
    };

    if (loading) {
        return <LoadingAnalisisFinansial />;
    }

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="bg-red-800 p-4 text-white">
                    <h2 className="text-xl font-bold">
                        Analisis Finansial Mahasiswa
                    </h2>
                    <p className="text-sm opacity-90">
                        Data terakhir diperbarui: {studentData.lastUpdated}
                    </p>
                </div>

                <div className="p-5">
                    <StudentInfoFinansialPage studentData={studentData} />

                    <StudentFinancialList
                        requests={studentData.pendingRequests}
                        title="Pengajuan Menunggu Review"
                        emptyMessage="Tidak ada pengajuan yang menunggu review"
                        onViewDetail={handleViewDetail}
                        isPending={true}
                    />

                    <StudentFinancialList
                        requests={studentData.previousRequests}
                        title="Riwayat Pengajuan"
                        emptyMessage="Tidak ada riwayat pengajuan"
                        onViewDetail={handleViewDetail}
                        isPending={false}
                    />
                </div>
            </div>

            {showDetailModal && (
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
