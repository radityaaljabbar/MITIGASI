import React from 'react';
import { Link } from 'react-router';

const MyWellness_Tested = ({ dataPsikologi }) => {
    const handlePrint = () => {
        window.print();
    };

    // If no userData is passed, you might want to handle this case
    if (!dataPsikologi) {
        return (
            <div className="p-6 w-full flex flex-col gap-6 text-sm">
                <p>No user data available.</p>
            </div>
        );
    }

    return (
        <div className="p-6 w-full flex flex-col gap-6 text-sm">
            <div className="w-full max-w-[900px] mx-auto p-6 bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex flex-col gap-5">
                <h1 className="text-[clamp(1.5rem,4vw,1.8rem)] font-bold text-[#222] leading-[1.2]">
                    Evaluasi Kondisi Psikologis Mahasiswa
                </h1>
                <p className="text-[clamp(0.9rem,2.5vw,1rem)] text-[#444] leading-[1.5] max-w-[700px]">
                    Evaluasi kondisi psikologis Anda untuk membantu meningkatkan
                    kesejahteraan dan performa akademik. Jawablah
                    pertanyaan-pertanyaan dengan jujur untuk mendapatkan hasil
                    yang optimal.
                </p>
            </div>

            <div className="w-full max-w-[900px] mx-auto bg-white p-6 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex flex-col gap-5">
                <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] text-[#333] mb-[0.3rem]">
                    Hasil Evaluasi Psikologis Anda
                </h2>
                <p className="text-[clamp(0.85rem,2vw,0.95rem)] text-[#444] leading-[1.5] w-full p-[0.6rem] bg-[#f9f9f9] rounded-md border-l-[3px] border-l-[#951A22]">
                    <b>Ringkasan: {dataPsikologi.summary}</b>
                </p>
                <p className="text-[clamp(0.85rem,2vw,0.95rem)] text-[#444] leading-[1.5] w-full p-[0.6rem] bg-[#f9f9f9] rounded-md border-l-[3px] border-l-[#951A22]">
                    <b>Saran: {dataPsikologi.suggestions}</b>
                </p>
                <p className="text-[clamp(0.85rem,2vw,0.95rem)] text-[#444] leading-[1.5] w-full p-[0.6rem] bg-[#f9f9f9] rounded-md border-l-[3px] border-l-[#951A22]">
                    <b>Tanggal Tes: {dataPsikologi.testDate}</b>
                </p>
                <div className="flex flex-wrap gap-[0.8rem] mt-[0.8rem]">
                    <Link to="/stu/my-wellness/psi-test">
                        <button className="bg-[#951A22] text-white py-3 px-6 rounded-lg cursor-pointer font-medium relative overflow-hidden transition-all duration-300 ease-in-out hover:bg-[#7a1118] hover:translate-y-[-2px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
                            <span className="relative z-[1]">
                                Mulai Evaluasi Baru
                            </span>
                        </button>
                    </Link>

                    <button
                        onClick={handlePrint}
                        className="bg-[#951A22] text-white py-3 px-6 rounded-lg cursor-pointer font-medium relative overflow-hidden transition-all duration-300 ease-in-out hover:bg-[#7a1118] hover:translate-y-[-2px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
                        <span className="relative z-[1]">Cetak</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyWellness_Tested;
