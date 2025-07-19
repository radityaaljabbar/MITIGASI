import React, { useState, useEffect } from 'react';

// Mengimpor layanan untuk mengambil data mahasiswa
// Importing services to fetch student data
import { getStudentTAK } from '../../services/mahasiswaServices/myProgress_takSksIpkService';
// Mengimpor komponen-komponen UI
// Importing UI components
import ChartContainer from '../../components/compMahasiswa/myProgressComponents/ChartContainer';
import IPSemesterCard from '../../components/compMahasiswa/myProgressComponents/IPSemesterCard';
import IpkSksTakCard from '../../components/compMahasiswa/myProgressComponents/IpkSksTakCard';
import KlasifikasiAkademikCard from '../../components/compMahasiswa/myProgressComponents/KlasifikasiAkademikCard';

/**
 * Komponen halaman "My Progress" untuk mahasiswa, menampilkan ringkasan akademik.
 * "My Progress" page component for students, displaying an academic summary.
 */
const MyProgress = () => {
    // State untuk menyimpan data akademik mahasiswa
    // State to store the student's academic data
    const [takValue, setTakValue] = useState(0);
    const [sksValue, setSksValue] = useState(0);
    const [ipkValue, setIpkValue] = useState(0);
    const [ipsValue, setIpsValue] = useState([]);
    const [klasifikasiValue, setKlasifikasiValue] = useState(0);

    // Effect untuk mengambil data dari API saat komponen pertama kali dimuat
    // Effect to fetch data from the API when the component first mounts
    useEffect(() => {
        const fetchTAK = async () => {
            try {
                const response = await getStudentTAK();
                if (response.success) {
                    setTakValue(response.data.tak);
                    setSksValue(response.data.sksTotal);
                    setIpkValue(response.data.ipk);
                    setIpsValue(response.data.ips);
                    setKlasifikasiValue(response.data.klasifikasi);
                }
            } catch (error) {
                console.error('Error fetching TAK:', error);
            }
        };

        fetchTAK();
    }, []); // Dependensi kosong, hanya berjalan sekali

    return (
        <div className="w-full p-[min(25px,6%)]">
            {/* Judul Halaman */}
            {/* Page Title */}
            <div className="mb-5">
                <h1 className="text-2xl mb-2">Academic Overview</h1>
            </div>

            {/* Kartu IP Semester */}
            {/* Semester GPA Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <IPSemesterCard dataSemester={ipsValue} />
            </div>
            {/* Kartu ringkasan untuk IPK, SKS, dan TAK */}
            {/* Summary cards for GPA, SKS, and TAK */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Memanggil komponen kartu dengan props yang sesuai */}
                {/* Calling the card component with appropriate props */}
                <IpkSksTakCard title="IPK" value={ipkValue.toFixed(2)} />
                <IpkSksTakCard title="SKS" value={sksValue} />
                <IpkSksTakCard title="TAK" value={takValue} />
            </div>

            {/* Judul bagian laporan dan grafik */}
            {/* Title for the reports and graphs section */}
            <div className="mb-5">
                <h1 className="text-2xl mb-2">Reports and Graphs</h1>
            </div>

            {/* Kontainer untuk grafik */}
            {/* Container for the charts */}
            <div className="mb-5 p-[min(0.8em,12%)]">
                <div className="rounded-lg p-3 min-h-[120px] flex flex-wrap justify-evenly items-center gap-5">
                    <ChartContainer
                        id="IPSemesterChart"
                        data={ipsValue}
                        type="semester"
                    />
                </div>
            </div>

            {/* Kartu status klasifikasi akademik */}
            {/* Academic classification status card */}
            <div className="mb-5 p-[min(0.8em,12%)]">
                <KlasifikasiAkademikCard status={klasifikasiValue} />
            </div>
        </div>
    );
};

export default MyProgress;