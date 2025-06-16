import React from 'react';

const KelolaPenggunaTabs = ({ activeTab, onTabChange }) => {
    const tabs = [
        { key: 'admin', label: 'Admin', color: 'bg-green-500' },
        { key: 'dosen', label: 'Dosen Wali', color: 'bg-red-500' },
        { key: 'mahasiswa', label: 'Mahasiswa', color: 'bg-blue-500' },
    ];

    return (
        <div className="mb-6">
            <div className="flex space-x-2 bg-white rounded-lg p-2 shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                            activeTab === tab.key
                                ? `${tab.color} text-white shadow-lg transform scale-105`
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default KelolaPenggunaTabs;
