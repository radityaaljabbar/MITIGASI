import React, { useState, useEffect } from 'react';
import { Download, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import handleBack from '../../../../components/handleBack';
import StudentInfo from '../../../../components/compDosenWali/compMyStudent/compAnalisisPsikologi/StudentInfoPsikologi';
import PsychologyChart from '../../../../components/compDosenWali/compMyStudent/compAnalisisPsikologi/ChartPsikologi';
import StrengthsAreas from '../../../../components/compDosenWali/compMyStudent/compAnalisisPsikologi/StrengthArea';
import PsychologyDetails from '../../../../components/compDosenWali/compMyStudent/compAnalisisPsikologi/DetailPsikologi';
import {
    getAnalisisPsikologi,
    transformPsychologyData,
    getChartDataFromDASS21,
} from '../../../../services/dosenWali/myStudent/cekAnalisisPsikologi';

export default function AnalisaPsikologiDetailPage() {
    const { nim } = useParams(); // Assuming you're using React Router
    const [student, setStudent] = useState(null);
    const [psychologyData, setPsychologyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasFilledQuestionnaire, setHasFilledQuestionnaire] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get psychology data from backend
                const response = await getAnalisisPsikologi(nim);

                // Add debug logs
                console.log('Response from API:', response);

                // Check if request was successful
                if (!response.success) {
                    setError(response.message);
                    setHasFilledQuestionnaire(false);
                    setStudent({
                        id: 1,
                        name: 'Budi Santoso',
                        nim: nim,
                        semester: 5,
                        statusPsikologi: 'Data Tidak Tersedia',
                        statusKuesioner: response.message.includes('Token')
                            ? 'Unauthorized'
                            : 'Error',
                    });
                    return;
                }

                const transformedData = transformPsychologyData(response);

                // Add debug logs
                console.log('Transformed data:', transformedData);
                console.log(
                    'transformedData.currentSemester:',
                    transformedData?.currentSemester
                );

                if (transformedData) {
                    // Student has filled questionnaire
                    setHasFilledQuestionnaire(true);
                    setPsychologyData(transformedData);

                    // Add debug log
                    console.log(
                        'About to set student with semester:',
                        transformedData.currentSemester
                    );

                    const studentData = {
                        id: transformedData.id,
                        name: transformedData.nama,
                        nim: transformedData.nim,
                        semester: transformedData.currentSemester,
                        statusPsikologi: transformedData.statusPsikologi,
                        tanggalTes: transformedData.tanggalTes,
                    };

                    console.log('Setting student data:', studentData);

                    // Set student info using data from backend
                    setStudent(studentData);
                } else {
                    // Student hasn't filled questionnaire
                    console.log('No transformed data, setting default student');
                    setHasFilledQuestionnaire(false);
                    setStudent({
                        id: 1,
                        name: 'Student Name',
                        nim: nim,
                        semester: 5,
                        statusPsikologi: 'Belum Dianalisis',
                        statusKuesioner: 'Belum Mengisi',
                    });
                }
            } catch (err) {
                console.error('Error fetching psychology data:', err);
                setError(err.message);
                setHasFilledQuestionnaire(false);
                // Set default student data for error case
                setStudent({
                    id: 1,
                    name: 'Budi Santoso',
                    nim: nim,
                    semester: 5,
                    statusPsikologi: 'Data Tidak Tersedia',
                    statusKuesioner: 'Error',
                });
            } finally {
                setLoading(false);
            }
        };

        if (nim) {
            fetchData();
        }
    }, [nim]);

    // Transform data untuk chart
    const getChartData = () => {
        if (!psychologyData) return [];
        return getChartDataFromDASS21(psychologyData);
    };

    const handleExportReport = () => {
        // Implement export functionality
        console.log('Exporting report for NIM:', nim);
        // You can implement PDF generation or other export logic here
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-amber-50">
                <div className="bg-white container mx-auto max-w-6xl px-4 py-8 flex-grow shadow-md rounded-xl">
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
            <div className="flex flex-col min-h-screen bg-amber-50">
                <div className="bg-white container mx-auto max-w-6xl px-4 py-8 flex-grow shadow-md rounded-xl">
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
        <div className="flex flex-col min-h-screen bg-amber-50">
            {/* Main Content */}
            <div className="bg-white container mx-auto max-w-6xl px-4 py-8 flex-grow shadow-md rounded-xl">
                {/* Header & Export Button */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <button
                            onClick={handleBack}
                            className="text-red-800 hover:underline flex items-center">
                            &lt; Kembali ke Daftar Mahasiswa
                        </button>
                    </div>

                    {hasFilledQuestionnaire && (
                        <div className="flex flex-wrap gap-4 mt-2 justify-start sm:flex-row flex-col">
                            <button className="flex items-center bg-red-800 text-white px-4 py-2 rounded-lg">
                                Lihat Detail
                            </button>

                            <button
                                onClick={handleExportReport}
                                className="flex items-center bg-green-700 text-white px-4 py-2 rounded-lg">
                                <Download size={18} className="mr-2" />
                                Export Laporan
                            </button>
                        </div>
                    )}
                </div>

                {student ? (
                    <div className="grid grid-rows-1 gap-8">
                        {/* Informasi Mahasiswa */}
                        <StudentInfo student={student} />

                        {hasFilledQuestionnaire ? (
                            /* Grafik & Analisis - DASS-21 Results */
                            <div className="lg:col-span-2">
                                <PsychologyChart data={getChartData()} />
                                <StrengthsAreas
                                    psychologyData={psychologyData}
                                />
                                <PsychologyDetails
                                    psychologyData={psychologyData}
                                    aspectData={psychologyData.aspekPsikologi}
                                    kesimpulan={psychologyData.kesimpulan}
                                    saran={psychologyData.saran}
                                    tanggalTes={psychologyData.tanggalTes}
                                />
                            </div>
                        ) : (
                            /* Status Kuesioner Belum Diisi */
                            <div className="lg:col-span-2">
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
                                        Mahasiswa ini belum mengisi kuesioner
                                        evaluasi psikologi DASS-21. Hasil
                                        analisis psikologi akan tersedia setelah
                                        mahasiswa menyelesaikan pengisian
                                        kuesioner.
                                    </p>

                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 max-w-lg">
                                        <p className="text-blue-800 text-sm">
                                            <strong>DASS-21</strong> adalah
                                            instrumen penilaian psikologi yang
                                            mengukur tingkat depresi, kecemasan,
                                            dan stres pada mahasiswa.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-xl text-gray-500">
                            Data mahasiswa tidak ditemukan
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
