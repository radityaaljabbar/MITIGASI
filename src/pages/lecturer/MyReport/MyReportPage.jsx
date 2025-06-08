import React, { useState, useEffect } from 'react';
import StudentListView from './StudentListView';
import StudentDetailView from './StudentDetailView';
import { getFeedbackList } from '../../../services/dosenWali/myReport/listFeedbackMahasiswaService';

function MyReportPage() {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [feedbackData, setFeedbackData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use the service function instead of direct API call
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const result = await getFeedbackList();

                if (result.success) {
                    setFeedbackData(result.data);
                } else {
                    throw new Error(
                        result.message || 'Failed to fetch feedback data'
                    );
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleViewDetail = (student) => {
        setSelectedStudent(student);
    };

    const handleBack = () => {
        setSelectedStudent(null);
    };

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
                My Report Page
            </h1>

            {selectedStudent ? (
                <StudentDetailView
                    student={selectedStudent}
                    onBack={handleBack}
                />
            ) : (
                <>
                    {isLoading ? (
                        <div className="bg-white rounded-xl shadow p-4 md:p-6 flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-xl shadow p-4 md:p-6">
                            <div className="text-center p-4 text-red-600">
                                <p className="font-medium">Error: {error}</p>
                                <button
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    onClick={() => window.location.reload()}>
                                    Coba Lagi
                                </button>
                            </div>
                        </div>
                    ) : (
                        <StudentListView
                            onViewDetail={handleViewDetail}
                            students={feedbackData}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default MyReportPage;
