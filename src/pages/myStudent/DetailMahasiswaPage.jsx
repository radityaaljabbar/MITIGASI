import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import NavbarMyStudentDetail from '../../components/compDosenWali/compMyStudent/NavbarMyStudentDetail';

const StudentDetail = () => {
    const { nim } = useParams();

    const [activeTab, setActiveTab] = useState('akademik');

    // Handler untuk perubahan tab
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    // Render konten berdasarkan tab aktif
    const renderTabContent = () => {
        switch (activeTab) {
            //? Ini nanti diganti ke komponen2 yang diperlukan:
            case 'akademik':
                return (
                    <div className="p-8 text-center text-2xl">
                        {nim} <br />
                        ANALISIS AKADEMIK
                    </div>
                );
            case 'psikologi':
                return (
                    <div className="p-8 text-center text-2xl">
                        ANALISIS PSIKOLOGI
                    </div>
                );
            case 'finansial':
                return (
                    <div className="p-8 text-center text-2xl">
                        ANALISIS FINANSIAL
                    </div>
                );
            default:
                return (
                    <div className="p-8 text-center text-2xl">
                        ANALISIS AKADEMIK
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-orange-50">
            {/* Navbar */}
            <NavbarMyStudentDetail onTabChange={handleTabChange} />

            {/* Content */}
            <div className="mt-0">{renderTabContent()}</div>
        </div>
    );
};

export default StudentDetail;
