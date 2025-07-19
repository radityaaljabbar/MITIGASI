import React, { useState, useEffect } from 'react';
import { Download, AlertCircle, FileText, History } from 'lucide-react';
import { useParams } from 'react-router-dom';
import handleBack from '../../../../components/handleBack';
// Mengimpor komponen-komponen anak
// Importing child components
import StudentInfo from '../../../../components/compDosenWali/compMyStudent/compAnalisisPsikologi/StudentInfoPsikologi';
import PsychologyChart from '../../../../components/compDosenWali/compMyStudent/compAnalisisPsikologi/ChartPsikologi';
import StrengthsAreas from '../../../../components/compDosenWali/compMyStudent/compAnalisisPsikologi/StrengthArea';
import PsychologyDetails from '../../../../components/compDosenWali/compMyStudent/compAnalisisPsikologi/DetailPsikologi';
import PsychologyHistoryTimeline from '../../../../components/compDosenWali/compMyStudent/compAnalisisPsikologi/PsychologyHistoryTimeline';
// Mengimpor fungsi-fungsi service dan utilitas
// Importing service and utility functions
import {
    getAnalisisPsikologi,
    transformPsychologyData,
    transformAllPsychologyData,
    getChartDataFromDASS21,
    compareTestResults,
} from '../../../../services/dosenWali/myStudent/cekAnalisisPsikologi';

/**
 * Komponen halaman utama untuk menampilkan detail analisis psikologi mahasiswa.
 * Mengelola state untuk data, tab, loading, dan error.
 * Main page component to display a student's psychology analysis details.
 * Manages state for data, tabs, loading, and errors.
 */
export default function AnalisaPsikologiDetailPage() {
    // Mengambil NIM dari parameter URL
    // Getting the NIM from the URL parameters
    const { nim } = useParams();
    // State untuk data mahasiswa dan hasil psikologi
    // State for student data and psychology results
    const [student, setStudent] = useState(null);
    const [psychologyData, setPsychologyData] = useState(null); // Data yang ditampilkan saat ini
    const [allPsychologyData, setAllPsychologyData] = useState([]); // Semua riwayat data
    // State untuk loading, error, dan status kuesioner
    // State for loading, errors, and questionnaire status
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasFilledQuestionnaire, setHasFilledQuestionnaire] = useState(false);

    // State untuk mengelola tab (Hasil Terkini vs Riwayat) dan item riwayat yang dipilih
    // State to manage tabs (Latest Result vs. History) and the selected history item
    const [activeTab, setActiveTab] = useState('latest');
    const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(0);
    const [comparisonData, setComparisonData] = useState(null);

    // useEffect untuk mengambil semua data saat komponen dimuat atau NIM berubah
    // useEffect to fetch all data when the component mounts or the NIM changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getAnalisisPsikologi(nim);

                if (!response.success) {
                    setError(response.message);
                    setHasFilledQuestionnaire(false);
                    setStudent(null);
                    return;
                }

                if (!response.data || response.data.length === 0) {
                    setHasFilledQuestionnaire(false);
                    setStudent(null);
                    setPsychologyData(null);
                    return;
                }

                // Mentransformasi semua data untuk riwayat
                // Transforming all data for the history
                const allTransformed = transformAllPsychologyData(response);
                setAllPsychologyData(allTransformed);

                // Mengambil data terbaru (item pertama setelah diurutkan)
                // Getting the latest data (the first item after sorting)
                const latestData = allTransformed[0];

                if (latestData) {
                    setHasFilledQuestionnaire(true);
                    setPsychologyData(latestData);

                    const studentData = {
                        id: latestData.id,
                        name: latestData.nama,
                        nim: latestData.nim,
                        semester: latestData.currentSemester,
                        statusPsikologi: latestData.statusPsikologi,
                        tanggalTes: latestData.tanggalTes,
                    };

                    setStudent(studentData);

                    // Jika ada lebih dari satu riwayat, bandingkan dengan yang sebelumnya
                    // If there is more than one history entry, compare it with the previous one
                    if (allTransformed.length > 1) {
                        const comparison = compareTestResults(
                            allTransformed[0],
                            allTransformed[1]
                        );
                        setComparisonData(comparison);
                    }
                }
            } catch (err) {
                console.error('Error fetching psychology data:', err);
                setError(err.message);
                setHasFilledQuestionnaire(false);
                setStudent(null);
            } finally {
                setLoading(false);
            }
        };

        if (nim) {
            fetchData();
        }
    }, [nim]);

    /**
     * Menangani pemilihan item dari timeline riwayat.
     * Handles the selection of an item from the history timeline.
     * @param {number} index - Indeks item riwayat yang dipilih.
     */
    const handleSelectHistoryTest = (index) => {
        setSelectedHistoryIndex(index);
        setPsychologyData(allPsychologyData[index]);

        // Memperbarui info mahasiswa agar sesuai dengan data tes yang dipilih
        // Updating student info to match the selected test data
        if (student && allPsychologyData[index]) {
            setStudent({
                ...student,
                tanggalTes: allPsychologyData[index].tanggalTes,
                statusPsikologi: allPsychologyData[index].statusPsikologi,
            });
        }
    };

    /**
     * Mendapatkan data yang sudah diformat untuk komponen chart.
     * Gets the formatted data for the chart component.
     * @returns {Array} - Data untuk chart.
     */
    const getChartData = () => {
        if (!psychologyData) return [];
        return getChartDataFromDASS21(psychologyData);
    };

    // Tampilan loading, error, dan konten utama
    // Loading, error, and main content views
    if (loading) {
        return (
            <div className="min-h-screen py-8">
                <div className="bg-white container mx-auto max-w-6xl px-4 py-8 shadow-md rounded-xl">
                    <div className="flex justify-center items-center h-64">
                        <p className="text-xl text-gray-500">
                            Memuat data mahasiswa...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen py-8">
                <div className="bg-white container mx-auto max-w-6xl px-4 py-8 shadow-md rounded-xl">
                    <div className="mb-6">
                        <button
                            onClick={handleBack}
                            className="text-red-800 hover:underline flex items-center">
                            &lt; Kembali ke Daftar Mahasiswa
                        </button>
                    </div>
                    <div className="flex flex-col justify-center items-center h-64">
                        <AlertCircle size={64} className="text-red-500 mb-4" />
                        <p className="text-xl text-red-500 mb-2">
                            Error memuat data
                        </p>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="bg-white container mx-auto max-w-6xl px-4 py-8 shadow-md rounded-xl">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <button
                            onClick={handleBack}
                            className="text-red-800 hover:underline flex items-center">
                            &lt; Kembali ke Daftar Mahasiswa
                        </button>
                    </div>
                </div>

                {hasFilledQuestionnaire && student ? (
                    // Tampilan jika mahasiswa sudah mengisi kuesioner
                    // View if the student has filled out the questionnaire
                    <div className="space-y-6">
                        {/* Informasi tentang mahasiswa */}
                        {/* Student Information */}
                        <StudentInfo student={student} />
                        <div className="border-b border-gray-200">
                            {/* Navigasi Tab */}
                            {/* Tab Navigation */}
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => {
                                        setActiveTab('latest');
                                        setPsychologyData(allPsychologyData[0]);
                                    }}
                                    className={`
                                        py-2 px-1 border-b-2 font-medium text-sm flex items-center
                                        ${
                                            activeTab === 'latest'
                                                ? 'border-[#951A22] text-[#951A22]'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                    `}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Hasil Terkini
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`
                                        py-2 px-1 border-b-2 font-medium text-sm flex items-center
                                        ${
                                            activeTab === 'history'
                                                ? 'border-[#951A22] text-[#951A22]'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                    `}>
                                    <History className="h-4 w-4 mr-2" />
                                    Riwayat
                                    {allPsychologyData.length > 0 && (
                                        <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                            {allPsychologyData.length}
                                        </span>
                                    )}
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="mt-6">
                            {activeTab === 'latest' ? (
                                // Konten Tab Hasil Terkini
                                // Latest Result Tab Content
                                <div className="space-y-6">
                                    {/* Comparison Alert if exists */}
                                    {comparisonData &&
                                        allPsychologyData.length > 1 && (
                                            <div
                                                className={`p-4 rounded-lg border ${
                                                    comparisonData.overallTrend ===
                                                    'improving'
                                                        ? 'bg-green-50 border-green-200'
                                                        : comparisonData.overallTrend ===
                                                          'worsening'
                                                        ? 'bg-red-50 border-red-200'
                                                        : 'bg-gray-50 border-gray-200'
                                                }`}>
                                                <h4 className="font-semibold mb-2">
                                                    Perbandingan dengan Tes
                                                    Sebelumnya
                                                </h4>
                                                {comparisonData.improvements
                                                    .length > 0 && (
                                                    <div className="mb-2">
                                                        <p className="text-sm font-medium text-green-700">
                                                            Perbaikan:
                                                        </p>
                                                        <ul className="list-disc list-inside text-sm text-green-600">
                                                            {comparisonData.improvements.map(
                                                                (item, idx) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }>
                                                                        {item}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                                {comparisonData.concerns
                                                    .length > 0 && (
                                                    <div>
                                                        <p className="text-sm font-medium text-red-700">
                                                            Perlu Perhatian:
                                                        </p>
                                                        <ul className="list-disc list-inside text-sm text-red-600">
                                                            {comparisonData.concerns.map(
                                                                (item, idx) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }>
                                                                        {item}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    <PsychologyChart data={getChartData()} />
                                    <StrengthsAreas
                                        psychologyData={psychologyData}
                                    />
                                    <PsychologyDetails
                                        psychologyData={psychologyData}
                                        aspectData={
                                            psychologyData.aspekPsikologi
                                        }
                                        kesimpulan={psychologyData.kesimpulan}
                                        saran={psychologyData.saran}
                                        tanggalTes={psychologyData.tanggalTes}
                                    />
                                </div>
                            ) : (
                                // Konten Tab Riwayat
                                // History Tab Content
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-1">
                                        <PsychologyHistoryTimeline
                                            historyData={allPsychologyData}
                                            selectedIndex={selectedHistoryIndex}
                                            onSelectTest={
                                                handleSelectHistoryTest
                                            }
                                            showComparison={true}
                                        />
                                    </div>
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <p className="text-sm text-blue-800">
                                                <strong>
                                                    Melihat Hasil Evaluasi #
                                                    {psychologyData.testNumber}
                                                </strong>{' '}
                                                -{psychologyData.tanggalTes}
                                            </p>
                                        </div>
                                        <PsychologyChart
                                            data={getChartData()}
                                        />
                                        <PsychologyDetails
                                            psychologyData={psychologyData}
                                            aspectData={
                                                psychologyData.aspekPsikologi
                                            }
                                            kesimpulan={
                                                psychologyData.kesimpulan
                                            }
                                            saran={psychologyData.saran}
                                            tanggalTes={
                                                psychologyData.tanggalTes
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Tampilan jika mahasiswa belum mengisi kuesioner
                    // View if the student has not filled out the questionnaire
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="p-8 rounded-lg border-2 shadow-md flex flex-col items-center text-center">
                            <div className="bg-amber-100 p-4 rounded-full mb-4">
                                <AlertCircle
                                    size={64}
                                    className="text-amber-600"
                                />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4">
                                Kuesioner Psikologi Belum Diisi
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-lg">
                                Mahasiswa dengan NIM <strong>{nim}</strong>{' '}
                                belum mengisi kuesioner evaluasi psikologi
                                DASS-21. Hasil analisis psikologi akan tersedia
                                setelah mahasiswa menyelesaikan pengisian
                                kuesioner.
                            </p>
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 max-w-lg">
                                <p className="text-blue-800 text-sm">
                                    <strong>DASS-21</strong> adalah instrumen
                                    penilaian psikologi yang mengukur tingkat
                                    depresi, kecemasan, dan stres pada
                                    mahasiswa.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
