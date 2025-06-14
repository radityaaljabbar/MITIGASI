import React from 'react';
import { useMyCourseAdvisor } from '../../../pages/lecturer/myCourseAdvisor/MyCourseAdvisorContext';

const StudentInfoBox = () => {
    const { studentSKSData, selectedStudent } = useMyCourseAdvisor();

    // Don't show if no student selected or no data
    if (!selectedStudent || !studentSKSData) {
        return null;
    }

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                    <span className="text-sm font-medium text-blue-900">
                        Informasi Mahasiswa
                    </span>
                </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">NIM:</span>
                    <span className="text-sm font-semibold text-gray-900">
                        {studentSKSData.nim}
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">SKS Lulus:</span>
                    <span className="text-sm font-semibold text-gray-900">
                        {studentSKSData.sksLulus} SKS
                    </span>
                    <div className="relative group">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-400 cursor-help"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                            Total SKS yang telah berhasil diselesaikan oleh
                            mahasiswa
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentInfoBox;
