import React, { useState, useEffect } from 'react';

//Import berkas-berkas query:
import { getStudentTAK } from '../../services/mahasiswaServices/myProgress_TAKService';
//? Import Component
import ChartContainer from '../../components/compMahasiswa/myProgressComponents/ChartContainer';
import IPSemesterCard from '../../components/compMahasiswa/myProgressComponents/IPSemesterCard';
import IpkSksTakCard from '../../components/compMahasiswa/myProgressComponents/IpkSksTakCard';
import KlasifikasiAkademikCard from '../../components/compMahasiswa/myProgressComponents/KlasifikasiAkademikCard';
//? Import mockup json:
import mockupDataSemester from '../../assets/data/mockupjsonMahasiswa/mockupjsonMyProgress/mockupDataSemester.json';
import mockupDataKehadiran from '../../assets/data/mockupjsonMahasiswa/mockupjsonMyProgress/mockupDataKehadiran.json';

const MyProgress = () => {
    const [takValue, setTakValue] = useState(0);

    // Fetch data from the query file using useEffect
    useEffect(() => {
        const fetchTAK = async () => {
            try {
                const response = await getStudentTAK();
                if (response.success) {
                    setTakValue(response.data);
                }
            } catch (error) {
                console.error('Error fetching TAK:', error);
            }
        };

        fetchTAK();
    }, []);

    //mockup IPK, SKS, TAK:
    const muIPK = 3.92;
    const muSKS = 144;
    const muStatusAca = 'Excelent';

    return (
        <div className="w-full p-[min(25px,6%)]">
            {/* Judul Halaman */}
            <div className="mb-5">
                <h1 className="text-2xl mb-2">Academic Overview</h1>
            </div>

            {/* Card IP Semester */}
            <div className="mb-5 p-[min(0.8em, 12%)]">
                <IPSemesterCard dataSemester={mockupDataSemester} />
            </div>

            {/* Cards untuk IPK, SKS, dan TAK */}
            <div className="flex flex-wrap justify-evenly gap-3 mb-8 p-[min(0.83m,12%)]">
                {/* Manggil komponen kotak IPK, SKS, TAK */}
                <IpkSksTakCard title="IPK" value={muIPK} />
                <IpkSksTakCard title="SKS" value={muSKS} />
                <IpkSksTakCard title="TAK" value={takValue} />
            </div>

            {/* Bagian judul laporan dan grafik */}
            <div className="mb-5">
                <h1 className="text-2xl mb-2">Reports and Graphs</h1>
            </div>

            {/* Card Graphs */}
            <div className="mb-5 p-[min(0.8em,12%)]">
                <div className="rounded-lg p-3 min-h-[120px] flex flex-wrap justify-evenly items-center gap-5">
                    <ChartContainer
                        id="IPSemesterChart"
                        data={mockupDataSemester}
                        type="semester"
                    />

                    <ChartContainer
                        id="attendanceChart"
                        data={mockupDataKehadiran}
                        type="attendance"
                    />
                </div>
            </div>

            {/* Card status klasifikasi akademik */}
            <div className="mb-5 p-[min(0.8em,12%)]">
                <KlasifikasiAkademikCard status={muStatusAca} />
            </div>
        </div>
    );
};

export default MyProgress;
