import React from 'react';
//Importing the data from a mockup json:
import matakuliah from '../../assets/data/mockupjsonMyCourse/matakuliah.json';
import riwayatMK from '../../assets/data/mockupjsonMyCourse/riwayatmk.json';

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
        <div className="bg-white w-full max-w-[1200px] min-h-[300px] max-h-[450px] p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center space-y-4">
            {/* Judul Tabel */}
            <h2 className="w-auto max-w-full text-center text-2xl font-bold tracking-tight text-gray-800">
                Riwayat Mata Kuliah
            </h2>

            <div className="w-full h-[calc(100%-70px)] overflow-y-auto overflow-x-auto relative rounded-lg">
                {/* Tabel */}
                <table className="w-full border-separate border-spacing-0">
                    <thead>
                        <tr>
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
                                    className="bg-gradient-to-r from-[#951A22] to-[#7A1520] text-white p-3 text-sm font-semibold first:rounded-tl-lg last:rounded-tr-lg sticky top-0 z-10 border-b border-opacity-10">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {mkRiwayat.map((matkul, index) => (
                            <tr
                                key={index}
                                className={`hover:bg-gray-50 transition-colors duration-200 ${getRowStyle(
                                    matkul.nilai
                                )}`}>
                                <td className="px-3 py-3 text-sm text-gray-700 text-center border-b border-gray-100">
                                    {matkul.namaMataKuliah ||
                                        'Mata Kuliah Tidak Ditemukan'}
                                </td>

                                <td className="px-3 py-3 text-sm text-gray-700 text-center border-b border-gray-100">
                                    {matkul.kodeMataKuliah}
                                </td>

                                <td className="px-3 py-3 text-sm text-gray-700 text-center border-b border-gray-100">
                                    {matkul.jenis || 'Tidak Diketahui'}
                                </td>

                                <td className="px-3 py-3 text-sm text-gray-700 text-center border-b border-gray-100">
                                    {matkul.sks || '-'}
                                </td>

                                <td className="px-3 py-3 text-sm text-gray-700 text-center border-b border-gray-100">
                                    {matkul.semester}
                                </td>

                                <td className="px-3 py-3 text-sm text-gray-700 text-center border-b border-gray-100">
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
