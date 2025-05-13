import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getStudentTAKIPKSKS } from '../../../../services/dosenWali/myStudent/academicMahasiswaService';


const StudentInfoAkademik = ({ studentData }) => {
    const [student, setStudentValue] = useState(0);


    const mockStatusAkademik = 'Aman';
    //? Componen di page: Informasi Mahasiswa
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
                <div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">NIM</p>
                        <p className="font-medium">{studentData.nim}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">Nama</p>
                        <p className="font-medium">{studentData.name}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">Kelas</p>
                        <p className="font-medium">{studentData.kelas}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">Program Studi</p>
                        <p className="font-medium">
                            {studentData.programStudi}
                        </p>
                    </div>
                </div>
                <div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">IPK</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {studentData.ipk.toFixed(2)}
                        </h3>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">SKS Total</p>
                        <h3 className="text-2xl font-bold text-red-800">
                            {studentData.sksTotal}
                        </h3>
                    </div>
                </div>
            </div>

            <hr className="my-6 border-gray-200" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-lg font-medium mb-3">
                        SKS per Tingkat
                    </h4>
                    <div className="space-y-2">
                        {studentData.sksTingkat.map((sks, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                <span>Tingkat {index + 1}</span>
                                <span className="font-medium">{sks} SKS</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="text-lg font-medium mb-3">IP per Tingkat</h4>
                    <div className="space-y-2">
                        {studentData.ipTingkat.map((ip, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                <span>Tingkat {index + 1}</span>
                                <span className="font-medium">{ip}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <h4 className="text-lg font-medium mb-3">TAK Total</h4>
                <div className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-center">
                        <span>Total Poin</span>
                        <span className="text-xl font-bold text-red-800">
                            {studentData.takTotal} poin
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Content components for each tab
const AnalisisTrendContent = () => (
    <div className="p-4">
        <h3 className="text-lg font-medium mb-4">
            Analisis dan Trend Akademik
        </h3>
        <p>Konten analisis trend akademik akan ditampilkan di sini...</p>
        {/* Add your content here */}
    </div>
);

const DetailNilaiContent = () => (
    <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Detail Nilai Akademik</h3>
        <p>Detail nilai mahasiswa akan ditampilkan di sini...</p>
        {/* Add your content here */}
    </div>
);

const RiwayatMKContent = () => (
    <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Riwayat Mata Kuliah</h3>
        <p>
            Riwayat mata kuliah yang telah diambil akan ditampilkan di sini...
        </p>
        {/* Add your content here */}
    </div>
);

const AnalisisAkademikPage = () => {
    const { nim } = useParams();
    const [activeSubTab, setActiveSubTab] = useState('analisisTrend');
    const [takValue, setTakValue] = useState(0);
    const [sksValue, setSksValue] = useState(0);
    const [ipkValue, setIpkValue] = useState(0);
    const [namaValue, setnamaValue] = useState(0);
    const [kelasValue, setkelasValue] = useState(0);

    useEffect(() => {
        const fetchTAK = async () => {
            try {
                const response = await getStudentTAKIPKSKS(nim);
                console.log(response)
                if (response.success) {
                    setTakValue(response.data.tak);
                    setSksValue(response.data.sksTotal);
                    setIpkValue(response.data.ipk);
                    setnamaValue(response.data.nama);
                    setkelasValue(response.data.kelas);
                }
            } catch (error) {
                console.error('Error fetching TAK:', error);
            }
        };

        fetchTAK();
    }, []);

    //? Mock data untuk simulasi
    const mockStudentData = {
        name: namaValue,
        nim: nim || '1234567890',
        semester: 5,
        kelas: kelasValue,
        programStudi: 'Teknik Komputer',
        ipk: ipkValue,
        sksTotal: sksValue,
        sksTingkat: [36, 40, 32, 0],
        ipTingkat: [3.7, 3.85, 3.92, 0],
        takTotal: takValue,
    };

    // Function to render content based on active tab
    const renderContent = () => {
        switch (activeSubTab) {
            case 'analisisTrend':
                return <AnalisisTrendContent />;
            case 'detailNilai':
                return <DetailNilaiContent />;
            case 'riwayatMK':
                return <RiwayatMKContent />;
            default:
                return <AnalisisTrendContent />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Student Info */}
            <StudentInfoAkademik studentData={mockStudentData} />

            {/* AkademikDashboard - simplified */}
            <AkademikDashboard studentData={mockStudentData} />

            {/* Tab Content Container - Contains both the navbar and content */}
            <div className="bg-white rounded-lg shadow-md">
                {/* Sub Navigation - Centered with proper tab indication */}
                <div className="flex justify-center border-b border-gray-200">
                    <button
                        onClick={() => setActiveSubTab('analisisTrend')}
                        className={`px-6 py-3 text-sm font-medium ${
                            activeSubTab === 'analisisTrend'
                                ? 'text-red-800 border-b-2 border-red-800'
                                : 'text-gray-500'
                        }`}>
                        Analisis dan Trend
                    </button>

                    <button
                        onClick={() => setActiveSubTab('detailNilai')}
                        className={`px-6 py-3 text-sm font-medium ${
                            activeSubTab === 'detailNilai'
                                ? 'text-red-800 border-b-2 border-red-800'
                                : 'text-gray-500'
                        }`}>
                        Detail Nilai
                    </button>

                    <button
                        onClick={() => setActiveSubTab('riwayatMK')}
                        className={`px-6 py-3 text-sm font-medium ${
                            activeSubTab === 'riwayatMK'
                                ? 'text-red-800 border-b-2 border-red-800'
                                : 'text-gray-500'
                        }`}>
                        Riwayat MK
                    </button>
                </div>

                {/* Content based on active tab - in the same container */}
                {renderContent()}
            </div>
        </div>
    );
};

export default AnalisisAkademikPage;
