import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getStudentTAKIPKSKS } from '../../../../services/dosenWali/myStudent/academicMahasiswaService';

// Import separated components
import AnalisisTrendContent from '../../../../components/compDosenWali/compMyStudent/compAnalisisAkademik/AnalisisTrendContent';
import DetailNilaiContent from '../../../../components/compDosenWali/compMyStudent/compAnalisisAkademik/DetailNilaiContent';

const StudentInfoAkademik = ({ studentData }) => {
    const mockStatusAkademik = 'Aman';

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-medium mb-2">Informasi Mahasiswa</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <p className="text-sm text-gray-600">Nama</p>
                    <p className="font-medium">{studentData.name}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-600">NIM</p>
                    <p className="font-medium">{studentData.nim}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-600">Semester</p>
                    <p className="font-medium">{studentData.semester}</p>
                </div>
            </div>
            <div className="mt-2">
                <p className="text-sm text-gray-600">Status Akademik</p>
                <h4 className="font-medium">{mockStatusAkademik}</h4>
            </div>
        </div>
    );
};

const AkademikDashboard = ({ studentData }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                    <p className="text-sm text-gray-600">IPK</p>
                    <h3 className="text-2xl font-bold text-red-800">
                        {studentData.ipk ? studentData.ipk.toFixed(2) : '0.00'}
                    </h3>
                </div>
                <div className="mb-4">
                    <p className="text-sm text-gray-600">SKS Total</p>
                    <h3 className="text-2xl font-bold text-red-800">
                        {studentData.sksTotal || 0}
                    </h3>
                </div>
            </div>

            <hr className="my-6 border-gray-200" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-lg font-medium mb-3">SKS Semester</h4>
                    <div className="space-y-2">
                        {studentData.perSemester &&
                        studentData.perSemester.length > 0 ? (
                            studentData.perSemester.map((sks, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                    <span>Semester {index + 1}</span>
                                    <span className="font-medium">
                                        {sks.sksSemester} SKS
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 text-sm">
                                Tidak ada data semester
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h4 className="text-lg font-medium mb-3">IP Semester</h4>
                    <div className="space-y-2">
                        {studentData.perSemester &&
                        studentData.perSemester.length > 0 ? (
                            studentData.perSemester.map((ip, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                    <span>Semester {index + 1}</span>
                                    <span className="font-medium">
                                        {ip.ipSemester
                                            ? ip.ipSemester.toFixed(2)
                                            : '0.00'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 text-sm">
                                Tidak ada data semester
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <h4 className="text-lg font-medium mb-3">TAK Total</h4>
                <div className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-center">
                        <span>Total Poin</span>
                        <span className="text-xl font-bold text-red-800">
                            {studentData.takTotal || 0} poin
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AnalisisAkademikPage = () => {
    const { nim } = useParams();
    const [activeSubTab, setActiveSubTab] = useState('analisisTrend'); // Default ke Detail Nilai
    const [takValue, setTakValue] = useState(0);
    const [sksValue, setSksValue] = useState(0);
    const [ipkValue, setIpkValue] = useState(0);
    const [namaValue, setnamaValue] = useState('');
    const [kelasValue, setkelasValue] = useState('');
    const [perSemesterValue, setperSemesterValue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTAK = async () => {
            try {
                setLoading(true);
                const response = await getStudentTAKIPKSKS(nim);
                console.log('TAK response:', response);

                if (response.success) {
                    setTakValue(response.data.tak);
                    setSksValue(response.data.sksTotal);
                    setIpkValue(response.data.ipk);
                    setnamaValue(response.data.nama);
                    setkelasValue(response.data.kelas);
                    setperSemesterValue(response.data.perSemester || []);
                } else {
                    setError(response.message || 'Gagal memuat data akademik');
                }
            } catch (error) {
                console.error('Error fetching TAK:', error);
                setError('Terjadi kesalahan saat memuat data');
            } finally {
                setLoading(false);
            }
        };

        if (nim) {
            fetchTAK();
        }
    }, [nim]);

    // mengambil data semester sekarang
    const semuaSemester = perSemesterValue.map((item) => item.semester);

    //? Mock data untuk simulasi
    const mockStudentData = {
        name: namaValue,
        nim: nim,
        semester: semuaSemester.length > 0 ? Math.max(...semuaSemester) + 1 : 1,
        kelas: kelasValue,
        ipk: ipkValue,
        sksTotal: sksValue,
        perSemester: perSemesterValue,
        takTotal: takValue,
    };

    // Function to render content based on active tab
    const renderContent = () => {
        switch (activeSubTab) {
            case 'analisisTrend':
                return <AnalisisTrendContent studentData={mockStudentData} />;
            case 'detailNilai':
                return <DetailNilaiContent nim={nim} />;
            default:
                return <AnalisisTrendContent studentData={mockStudentData} />; // Default to Detail Nilai
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Student Info */}
            <StudentInfoAkademik studentData={mockStudentData} />

            {/* AkademikDashboard - simplified */}
            <AkademikDashboard studentData={mockStudentData} />

            {/* Tab Content Container - Contains both the navbar and content */}
            <div className="bg-white rounded-lg shadow-md">
                {/* Sub Navigation - Only 2 tabs now */}
                <div className="flex justify-center border-b border-gray-200">
                    <button
                        onClick={() => setActiveSubTab('analisisTrend')}
                        className={`px-6 py-3 text-sm font-medium transition-colors ${
                            activeSubTab === 'analisisTrend'
                                ? 'text-red-800 border-b-2 border-red-800'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}>
                        Analisis dan Trend
                    </button>

                    <button
                        onClick={() => setActiveSubTab('detailNilai')}
                        className={`px-6 py-3 text-sm font-medium transition-colors ${
                            activeSubTab === 'detailNilai'
                                ? 'text-red-800 border-b-2 border-red-800'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}>
                        Detail Nilai
                    </button>
                </div>

                {/* Content based on active tab - in the same container */}
                {renderContent()}
            </div>
        </div>
    );
};

export default AnalisisAkademikPage;
