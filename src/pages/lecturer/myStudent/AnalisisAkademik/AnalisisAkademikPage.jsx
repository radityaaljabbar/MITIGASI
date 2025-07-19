import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getStudentTAKIPKSKS } from '../../../../services/dosenWali/myStudent/academicMahasiswaService';
import AnalisisTrendContent from '../../../../components/compDosenWali/compMyStudent/compAnalisisAkademik/AnalisisTrendContent';
import DetailNilaiContent from '../../../../components/compDosenWali/compMyStudent/compAnalisisAkademik/DetailNilaiContent';

/**
 * Fungsi helper untuk mendapatkan style visual berdasarkan status akademik.
 * Helper function to get visual styling based on academic status.
 * @param {string} status - Status akademik ('aman', 'siaga', 'bermasalah').
 * @returns {object} - Objek berisi kelas-kelas CSS dan ikon.
 */
const getStatusStyle = (status) => {
    const normalizedStatus = status?.toLowerCase();
    
    switch (normalizedStatus) {
        case 'aman':
            return {
                bgColor: 'bg-green-100',
                textColor: 'text-green-800',
                borderColor: 'border-green-200',
                icon: '✓',
                iconBg: 'bg-green-500'
            };
        case 'siaga':
            return {
                bgColor: 'bg-orange-100',
                textColor: 'text-orange-800',
                borderColor: 'border-orange-200',
                icon: '⚠',
                iconBg: 'bg-orange-500'
            };
        case 'bermasalah':
            return {
                bgColor: 'bg-red-100',
                textColor: 'text-red-800',
                borderColor: 'border-red-200',
                icon: '!',
                iconBg: 'bg-red-500'
            };
        default:
            return {
                bgColor: 'bg-gray-100',
                textColor: 'text-gray-800',
                borderColor: 'border-gray-200',
                icon: '?',
                iconBg: 'bg-gray-500'
            };
    }
};

/**
 * Komponen untuk menampilkan kartu informasi dasar mahasiswa.
 * Component to display the basic student information card.
 * @param {object} props - Props.
 * @param {object} props.studentData - Data mahasiswa.
 */
const StudentInfoAkademik = ({ studentData }) => {
    const statusStyle = getStatusStyle(studentData.klasifikasi);

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
            <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Status Akademik</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full border-2 ${statusStyle.bgColor} ${statusStyle.borderColor} transition-all duration-200 hover:shadow-md`}>
                    <div className={`w-3 h-3 rounded-full ${statusStyle.iconBg} mr-3 flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{statusStyle.icon}</span>
                    </div>
                    <h4 className={`font-semibold text-sm uppercase tracking-wide ${statusStyle.textColor}`}>
                        {studentData.klasifikasi || 'Tidak Diketahui'}
                    </h4>
                </div>
            </div>
        </div>
    );
};

/**
 * Komponen untuk menampilkan dashboard ringkasan akademik (IPK, SKS, TAK, dll).
 * Component to display the academic summary dashboard (GPA, SKS, TAK, etc.).
 * @param {object} props - Props.
 * @param {object} props.studentData - Data mahasiswa.
 */
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
                    <p className="text-sm text-gray-600">SKS Lulus</p>
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

/**
 * Komponen halaman utama untuk analisis akademik seorang mahasiswa.
 * Main page component for a student's academic analysis.
 */
const AnalisisAkademikPage = () => {
    // Mengambil NIM dari parameter URL.
    // Getting the NIM from the URL parameters.
    const { nim } = useParams();
    // State untuk mengontrol tab yang aktif (analisis trend atau detail nilai).
    // State to control the active tab (trend analysis or grade details).
    const [activeSubTab, setActiveSubTab] = useState('analisisTrend');
    // State untuk menyimpan data-data akademik mahasiswa.
    // State to store the student's academic data.
    const [sksValue, setSksValue] = useState(0);
    const [takValue, setTakValue] = useState(0);
    const [ipkValue, setIpkValue] = useState(0);
    const [namaValue, setnamaValue] = useState('');
    const [kelasValue, setkelasValue] = useState('');
    const [klasfikasiValue, setklasfikasiValue] = useState(0);
    const [perSemesterValue, setperSemesterValue] = useState([]);
    // State untuk loading dan error.
    // State for loading and errors.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect untuk mengambil data akademik saat komponen dimuat atau NIM berubah.
    // useEffect to fetch academic data when the component mounts or the NIM changes.
    useEffect(() => {
        const fetchTAK = async () => {
            try {
                setLoading(true);
                const response = await getStudentTAKIPKSKS(nim);

                if (response.success) {
                    setTakValue(response.data.tak);
                    setSksValue(response.data.sksTotal);
                    setIpkValue(response.data.ipk);
                    setnamaValue(response.data.nama);
                    setkelasValue(response.data.kelas);
                    setklasfikasiValue(response.data.klas_akademik);
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

    // Mengambil semester terakhir dari data.
    // Getting the latest semester from the data.
    const semuaSemester = perSemesterValue.map((item) => item.semester);

    // Membuat objek data mahasiswa dari state yang sudah di-fetch.
    // Creating the student data object from the fetched state.
    const mockStudentData = {
        name: namaValue,
        nim: nim,
        semester: semuaSemester.length > 0 ? Math.max(...semuaSemester) + 1 : 1,
        kelas: kelasValue,
        ipk: ipkValue,
        sksTotal: sksValue,
        perSemester: perSemesterValue,
        takTotal: takValue,
        klasifikasi : klasfikasiValue
    };

    /**
     * Merender konten sub-tab yang aktif.
     * Renders the content of the active sub-tab.
     * @returns {JSX.Element} - Komponen yang akan dirender.
     */
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

    // Tampilan saat loading.
    // View during loading.
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
                </div>
            </div>
        );
    }

    // Tampilan saat error.
    // View on error.
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
            {/* Kartu Informasi Mahasiswa */}
            {/* Student Information Card */}
            <StudentInfoAkademik studentData={mockStudentData} />

            {/* Dashboard Akademik */}
            {/* Academic Dashboard */}
            <AkademikDashboard studentData={mockStudentData} />

            {/* Kontainer untuk Konten dengan Tab */}
            {/* Container for Tabbed Content */}
            <div className="bg-white rounded-lg shadow-md">
                {/* Navigasi Sub-Tab */}
                {/* Sub-Tab Navigation */}
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

                {/* Konten yang dirender berdasarkan tab aktif */}
                {/* Content rendered based on the active tab */}
                {renderContent()}
            </div>
        </div>
    );
};

export default AnalisisAkademikPage;
