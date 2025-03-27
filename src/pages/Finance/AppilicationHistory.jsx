import React, { useState, useEffect } from 'react';
import {ArrowLeft } from 'lucide-react';
import handleBack from '../../components/handleBack';

// Simulated API call with loading state
const fetchHistoryData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    date: '15 Maret 2024',
                    summary: 'Kuesioner Keuangan Triwulan I',
                    pdfLink: '#'
                },
                {
                    date: '15 Juni 2024',
                    summary: 'Kuesioner Keuangan Triwulan II',
                    pdfLink: '#'
                },
                {
                    date: '15 April 2024',
                    summary: 'Kuesioner Keuangan Triwulan III',
                    pdfLink: '#'
                },
            ]);
        }, 1000);
    });
};

const FinanceHistoryPage = () => {
    const [historyData, setHistoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const data = await fetchHistoryData();
                setHistoryData(data);
            } catch (error) {
                console.error('Failed to fetch history data', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div className="bg-[#FAF0E6] min-h-screen flex flex-col items-center p-4 sm:p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Riwayat Pengisian Kuesioner</h1>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#951A22]"></div>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Berikut adalah daftar riwayat pengisian kuesioner keuangan Anda. 
                            Klik pada tombol PDF untuk melihat detail lengkap dari setiap pengisian.
                        </p>

                        <div className="mb-6">
                            <p className="font-semibold text-gray-700 mb-4">
                                Total pengisian: {historyData.length} kali
                            </p>

                            {historyData.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-500 text-lg">Belum ada riwayat kuesioner</p>
                                    <p className="text-gray-400 mt-2">Silakan isi kuesioner terlebih dahulu</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                                        <thead className="bg-[#951A22] text-white">
                                            <tr>
                                                <th className="p-3 text-left">Tanggal Pengisian</th>
                                                <th className="p-3 text-left">Ringkasan</th>
                                                <th className="p-3 text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {historyData.map((item, index) => (
                                                <tr 
                                                    key={index} 
                                                    className="border-l-4 border-[#951A22] bg-white p-4 rounded shadow-sm hover:translate-x-1 transition-transform duration-200"
                                                >
                                                    <td className="p-3">{item.date}</td>
                                                    <td className="p-3">{item.summary}</td>
                                                    <td className="p-3 text-center">
                                                        <a 
                                                            href={item.pdfLink} 
                                                            className="bg-[#951A22] hover:bg-[#7A1118] text-white text-sm py-2 px-4 rounded transition-colors duration-200"
                                                        >
                                                            PDF
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={handleBack}
                            className="flex items-center justify-center 
                            bg-[#951A22] text-white px-4 py-2 
                            rounded-lg hover:bg-[#7a1118] 
                            transition-all duration-200 
                            hover:-translate-y-1 hover:shadow-lg"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Kembali
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FinanceHistoryPage;