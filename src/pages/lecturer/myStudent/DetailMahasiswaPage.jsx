import React, { useState } from 'react';
import NavbarMyStudentDetail from '../../../components/compDosenWali/compMyStudent/NavbarMyStudentDetail';
import AnalisisPsikologi from './AnalisisPsikologi/AnalisisPsikologi';
import BelumMengisi from './AnalisisPsikologi/belumMengisi';
import AnalisisFinansialPage from './AnalisisFinansial/AnalisisFinansialPage';
import AnalisisAkademikPage from './AnalisisAkademik/AnalisisAkademikPage';

/**
 * Komponen halaman utama untuk menampilkan detail seorang mahasiswa.
 * Bertindak sebagai kontainer yang mengelola tab navigasi (Akademik, Psikologi, Finansial).
 * Main page component to display the details of a student.
 * Acts as a container that manages navigation tabs (Academic, Psychology, Financial).
 */
const StudentDetail = () => {
    // State untuk melacak tab yang sedang aktif
    // State to track the currently active tab
    const [activeTab, setActiveTab] = useState('akademik');

    /**
     * Handler yang dipanggil oleh komponen Navbar ketika tab diubah.
     * Handler called by the Navbar component when the tab is changed.
     * @param {string} tabId - ID dari tab yang baru dipilih ('akademik', 'psikologi', 'finansial').
     */
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    /**
     * Merender konten yang sesuai berdasarkan tab yang sedang aktif.
     * Renders the appropriate content based on the currently active tab.
     * @returns {JSX.Element} - Komponen konten untuk tab yang aktif.
     */
    const renderTabContent = () => {
        switch (activeTab) {
            case 'akademik':
                return (
                    <div className="p-3 text-center">
                        <AnalisisAkademikPage />
                    </div>
                );
            case 'psikologi':
                return (
                    <div className="p-3 text-center">
                        <AnalisisPsikologi />
                    </div>
                );
            case 'finansial':
                return (
                    <div className="p-3 text-center">
                        <AnalisisFinansialPage />
                    </div>
                );
            default:
                // Fallback ke tab akademik jika tidak ada yang cocok
                // Fallback to the academic tab if no match is found
                return <div className="p-3 text-center">ANALISIS AKADEMIK</div>;
        }
    };

    return (
        <div className="min-h-screen bg-orange-50">
            {/* Komponen Navbar yang mengontrol state `activeTab` */}
            {/* Navbar component that controls the `activeTab` state */}
            <NavbarMyStudentDetail onTabChange={handleTabChange} />

            {/* Konten yang dirender secara dinamis berdasarkan `activeTab` */}
            {/* Content that is dynamically rendered based on `activeTab` */}
            <div className="mt-0">{renderTabContent()}</div>
        </div>
    );
};

export default StudentDetail;
