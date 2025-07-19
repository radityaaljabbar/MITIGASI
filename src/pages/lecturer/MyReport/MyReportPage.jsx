import React, { useState, useEffect } from 'react';
import StudentListView from './StudentListView';
import StudentDetailView from './StudentDetailView';
import { getFeedbackList } from '../../../services/dosenWali/myReport/listFeedbackMahasiswaService';

/**
 * Komponen halaman utama untuk fitur "My Report" dari Dosen Wali.
 * Mengelola tampilan antara daftar mahasiswa (StudentListView) dan detail mahasiswa (StudentDetailView).
 * Main page component for the "My Report" feature for Course Advisors.
 * Manages the view between the student list (StudentListView) and student detail (StudentDetailView).
 */
function MyReportPage() {
    // State untuk menyimpan data mahasiswa yang sedang dipilih untuk dilihat detailnya.
    // State to store the student data currently selected for detail view.
    const [selectedStudent, setSelectedStudent] = useState(null);
    // State untuk menyimpan daftar semua feedback dari mahasiswa.
    // State to store the list of all feedback from students.
    const [feedbackData, setFeedbackData] = useState([]);
    // State untuk mengelola status loading saat pengambilan data.
    // State to manage the loading status during data fetching.
    const [isLoading, setIsLoading] = useState(true);
    // State untuk menyimpan pesan error jika terjadi kegagalan.
    // State to store an error message in case of failure.
    const [error, setError] = useState(null);

    // useEffect untuk mengambil data feedback saat komponen pertama kali dimuat.
    // useEffect to fetch feedback data when the component first mounts.
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Memanggil fungsi service untuk mendapatkan daftar feedback.
                // Calling the service function to get the feedback list.
                const result = await getFeedbackList();

                if (result.success) {
                    setFeedbackData(result.data);
                } else {
                    // Melemparkan error jika response dari service tidak sukses.
                    // Throwing an error if the response from the service is not successful.
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
    }, []); // Array dependensi kosong agar hanya berjalan sekali.

    /**
     * Menangani aksi ketika dosen memilih untuk melihat detail .
     * Handles the action when a lecturer chooses to view a detail.
     * @param {object} student - Objek data mahasiswa yang dipilih.
     */
    const handleViewDetail = (student) => {
        setSelectedStudent(student);
    };

    /**
     * Menangani aksi untuk kembali dari tampilan detail ke daftar mahasiswa.
     * Handles the action to go back from the detail view to the student list.
     */
    const handleBack = () => {
        setSelectedStudent(null);
    };

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
                My Report Page
            </h1>

            {/* Render bersyarat: tampilkan detail jika mahasiswa dipilih, jika tidak, tampilkan daftar. */}
            {/* Conditional rendering: show details if a student is selected, otherwise show the list. */}
            {selectedStudent ? (
                <StudentDetailView
                    student={selectedStudent}
                    onBack={handleBack}
                />
            ) : (
                <>
                    {/* Menampilkan indikator loading, pesan error, atau daftar mahasiswa. */}
                    {/* Displaying a loading indicator, error message, or the student list. */}
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
