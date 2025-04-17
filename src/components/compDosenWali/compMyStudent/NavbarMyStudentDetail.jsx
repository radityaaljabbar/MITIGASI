import React, { useState } from 'react';

const StudentDetailNavbar = ({ onTabChange }) => {
    const [activeTab, setActiveTab] = useState('akademik');

    const tabs = [
        { id: 'akademik', name: 'ANALISIS AKADEMIK' },
        { id: 'psikologi', name: 'ANALISIS PSIKOLOGI' },
        { id: 'finansial', name: 'ANALISIS FINANSIAL' },
    ];

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        onTabChange(tabId);
    };

    return (
        <div className="flex justify-center w-full">
            <div className="flex bg-[#951A22] rounded-b-lg p-1 mx-auto w-full md:w-3/4">
                <div className="flex justify-between w-full">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex-1 mx-1 text-center ${
                                activeTab === tab.id
                                    ? 'bg-white text-[#951A22] shadow-sm'
                                    : 'text-white hover:text-gray-200'
                            }`}
                            onClick={() => handleTabClick(tab.id)}>
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDetailNavbar;
