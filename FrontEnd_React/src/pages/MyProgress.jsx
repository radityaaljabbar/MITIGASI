import React from 'react';
//? Import Component
import ChartContainer from '../components/myProgressComponents/ChartContainer';
import IPSemesterCard from '../components/myProgressComponents/IPSemesterCard';
import IpkSksTakCard from '../components/myProgressComponents/IpkSksTakCard';
import KlasifikasiAkademikCard from '../components/myProgressComponents/KlasifikasiAkademikCard';
//? Import mockup json:
import mockupDataSemester from '../assets/data/mockupjsonMyProgress/mockupDataSemester.json';
import mockupDataKehadiran from '../assets/data/mockupjsonMyProgress/mockupDataKehadiran.json';
import { Chart } from 'chart.js';

const MyProgress = () => {
    console.log(mockupDataKehadiran);
    console.log(mockupDataSemester);
    //mockup IPK, SKS, TAK:
    const muIPK = 3.92;
    const muSKS = 144;
    const muTAK = 120;
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
                <IpkSksTakCard title="TAK" value={muTAK} />
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
                        type="semester"
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
