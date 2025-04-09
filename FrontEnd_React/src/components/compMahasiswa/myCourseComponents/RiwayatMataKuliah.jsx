import React from 'react';
//Importing the data from a mockup json:
import matakuliah from '../../../assets/data/mockupjsonMahasiswa/mockupjsonMyCourse/matakuliah.json';
import riwayatMK from '../../../assets/data/mockupjsonMahasiswa/mockupjsonMyCourse/riwayatmk.json';

const RiwayatMataKuliah = () => {
    //Ngoprek json mk sama rekomendasi:
    const mkRiwayat = riwayatMK
        .map((riwayat) => {
            const mataKuliahDetail = matakuliah.find(
                (mk) => mk.kodeMataKuliah === riwayat.kodeMataKuliah
            );
            return mataKuliahDetail
                ? {
                      ...mataKuliahDetail,
                      kodeMataKuliah: riwayat.kodeMataKuliah,
                      semester: riwayat.semester,
                      nilai: riwayat.nilai,
                  }
                : null;
        })
        .filter((course) => course !== null);

    //Kondisional Warna Row tergantung indeks nilai:
    const getRowStyle = (nilai) => {
        switch (nilai) {
            case 'A':
            case 'A-':
                return 'bg-green-500 text-white';
            case 'D':
            case 'E':
                return 'bg-red-500 text white';
            default:
                return '';
        }
    };
    return (
        <div className="bg-white w-full max-w-[1200px] min-h-[300px] max-h-[450px] p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center space-y-5">
            <h2 className="text-center text-xl font-semibold text-gray-900">
                Riwayat Mata Kuliah
            </h2>
            <div className="w-full h-[calc(100%-70px)] overflow-y-auto overflow-x-auto rounded-lg">
                <table className="w-full border-separate border-spacing-0 text-sm">
                    <thead>
                        <tr className="bg-[#951a22] text-white">
                            {[
                                'Nama Mata Kuliah',
                                'Kode Mata Kuliah',
                                'Jenis',
                                'SKS',
                                'Semester',
                                'Nilai',
                            ].map((header, index) => (
                                <th
                                    key={index}
                                    className="border border-gray-300 p-3 text-center font-bold sticky top-0 z-10 uppercase">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mkRiwayat.map((matkul, index) => (
                            <tr
                                key={index}
                                className={`hover:bg-gray-100 transition duration-200 ${getRowStyle(
                                    matkul.nilai
                                )}`}>
                                <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                    {matkul.namaMataKuliah ||
                                        'Mata Kuliah Tidak Ditemukan'}
                                </td>
                                <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                    {matkul.kodeMataKuliah}
                                </td>
                                <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                    {matkul.jenis || 'Tidak Diketahui'}
                                </td>
                                <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                    {matkul.sks || '-'}
                                </td>
                                <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                    {matkul.semester}
                                </td>
                                <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                    {matkul.nilai}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RiwayatMataKuliah;
