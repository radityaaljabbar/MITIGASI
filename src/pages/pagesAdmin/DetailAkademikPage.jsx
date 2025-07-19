import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

// Mengimpor komponen-komponen yang dibutuhkan
// Importing necessary components
import DetailAkademikTabs from '../../components/compAdmin/kelolaAkademik/DetailAkademikTabs';
import NilaiMataKuliahTab from '../../components/compAdmin/kelolaAkademik/NilaiMataKuliahTab';
import DataPrestasiTab from '../../components/compAdmin/kelolaAkademik/DataPrestasiTab';
import IPSemesterTab from '../../components/compAdmin/kelolaAkademik/IPSemesterTab';

/**
 * Komponen halaman untuk menampilkan detail data akademik seorang mahasiswa.
 * Page component for displaying the academic details of a student.
 */
const DetailAkademikPage = () => {
    // Mengambil NIM dari parameter URL
    // Getting the NIM from the URL parameters
    const { nim } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // State untuk melacak tab yang aktif
    // State to track the active tab
    const [activeTab, setActiveTab] = useState('nilai');

    // Mengambil data mahasiswa dari `location.state` (dikirim dari halaman sebelumnya)
    // atau membuat objek default jika halaman diakses langsung
    // Getting student data from `location.state` (sent from the previous page)
    // or creating a default object if the page is accessed directly
    const mahasiswaData = location.state?.mahasiswaData || {
        nim: nim,
        name: 'Mahasiswa',
        detail_kelas: {},
        status: 'aktif',
    };

    /**
     * Menangani perubahan tab.
     * Handles tab changes.
     * @param {string} tabKey - Kunci tab yang baru dipilih.
     */
    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
    };

    /**
     * Menangani klik tombol kembali.
     * Handles the back button click.
     */
    const handleBack = () => {
        navigate('/admin/kelolaAkademik');
    };

    /**
     * Merender konten tab yang sesuai.
     * Renders the appropriate tab content.
     * @returns {JSX.Element} - Komponen konten tab.
     */
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
            {/* Breadcrumb dan Tombol Kembali */}
            {/* Breadcrumb and Back Button */}
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

            {/* Komponen Header dengan Info Mahasiswa dan Tabs */}
            {/* Header Component with Student Info and Tabs */}
            <DetailAkademikTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                mahasiswaData={mahasiswaData}
            />

            {/* Konten Tab */}
            {/* Tab Content */}
            <div className="mt-6">{renderTabContent()}</div>
        </div>
    );
};

export default DetailAkademikPage;
