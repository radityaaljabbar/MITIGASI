import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

// Import komponen
import DetailAkademikTabs from '../../components/compAdmin/kelolaAkademik/DetailAkademikTabs';
import NilaiMataKuliahTab from '../../components/compAdmin/kelolaAkademik/NilaiMataKuliahTab';
import DataPrestasiTab from '../../components/compAdmin/kelolaAkademik/DataPrestasiTab';
import IPSemesterTab from '../../components/compAdmin/kelolaAkademik/IPSemesterTab';

const DetailAkademikPage = () => {
    const { nim } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // State untuk active tab
    const [activeTab, setActiveTab] = useState('nilai');

    // Get mahasiswa data from location state or create default
    const mahasiswaData = location.state?.mahasiswaData || {
        nim: nim,
        name: 'Mahasiswa',
        detail_kelas: {},
        status: 'aktif',
    };

    // Handle tab change
    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
    };

    // Handle back button
    const handleBack = () => {
        navigate('/admin/kelolaAkademik');
    };

    // Render tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'nilai':
                return <NilaiMataKuliahTab mahasiswaData={mahasiswaData} />;
            case 'prestasi':
                return <DataPrestasiTab mahasiswaData={mahasiswaData} />;
            case 'semester':
                return <IPSemesterTab mahasiswaData={mahasiswaData} />;
            default:
                return <NilaiMataKuliahTab mahasiswaData={mahasiswaData} />;
        }
    };

    return (
        <div className="p-6 bg-[#FAF0E6] min-h-screen">
            {/* Breadcrumb & Back Button */}
            <div className="mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                    <button
                        onClick={handleBack}
                        className="text-blue-600 hover:text-blue-800 font-medium">
                        Kelola Akademik
                    </button>
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                    <span className="text-gray-800 font-medium">
                        Detail Akademik - {mahasiswaData.name}
                    </span>
                </div>

                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 mb-4">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    <span>Kembali ke Daftar Mahasiswa</span>
                </button>
            </div>

            {/* Header with Student Info & Tabs */}
            <DetailAkademikTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                mahasiswaData={mahasiswaData}
            />

            {/* Tab Content */}
            <div className="mt-6">{renderTabContent()}</div>
        </div>
    );
};

export default DetailAkademikPage;
