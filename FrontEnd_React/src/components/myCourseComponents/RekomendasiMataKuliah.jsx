import React from 'react';
//Import file mockup json:
import matakuliah from '../../assets/data/mockupjsonMyCourse/matakuliah.json';
import rekomendasiMK from '../../assets/data/mockupjsonMyCourse/rekomendasimk.json';

const RekomendasiMataKuliah = () => {
    //Ngoprek json mk sama rekomendasi:
    const mkrekomendasi = rekomendasiMK
        .map((rekomendasi) => {
            const mataKuliahDetail = matakuliah.find(
                (matkul) => matkul.kodeMataKuliah === rekomendasi.kodeMataKuliah
            );

            return mataKuliahDetail
                ? {
                      ...mataKuliahDetail,
                      kodeMataKuliah: rekomendasi.kodeMataKuliah,
                  }
                : null;
        })
        .filter((course) => course !== null);

    return (
        <div className="bg-[#FFFFFF] w-full max-w-[1200px] min-h-[300px] max-h-[450px] p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-center gap-2.5">
            <h2 className="w-auto max-w-full text-center text-xl font-semibold my-2.5 text-gray-700">
                Mata Kuliah Rekomendasi
            </h2>

            <div className="w-full h-[calc(100%-50px)] overflow-y-auto overflow-x-auto relative rounded-md">
                <table className="w-full border-collapse">
                    {/* Header tabel rekomendasi MK */}
                    <thead>
                        <tr>
                            {[
                                'Nama Mata Kuliah',
                                'Kode Mata Kuliah',
                                'Jenis',
                                'SKS',
                            ].map((header, index) => (
                                <th
                                    key={index}
                                    className="border border-gray-300 p-2.5 text-center whitespace-nowrap text-sm bg-[#951a22] text-white font-bold sticky top-0 z-10">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {/* Badan / isi tabel rekomendasi MK */}
                    <tbody>
                        {mkrekomendasi.map((course, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="border-y border-gray-300 p-2.5 text-center whitespace-nowrap text-sm">
                                    {course.namaMataKuliah}
                                </td>

                                <td className="border-y border-gray-300 p-2.5 text-center whitespace-nowrap text-sm">
                                    {course.kodeMataKuliah}
                                </td>

                                <td className="border-y border-gray-300 p-2.5 text-center whitespace-nowrap text-sm">
                                    {course.jenis}
                                </td>

                                <td className="border-y border-gray-300 p-2.5 text-center whitespace-nowrap text-sm">
                                    {course.sks}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RekomendasiMataKuliah;
