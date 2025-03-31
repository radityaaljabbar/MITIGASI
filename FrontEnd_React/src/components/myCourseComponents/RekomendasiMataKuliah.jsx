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
        <div className="bg-white w-full max-w-[1200px] min-h-[300px] max-h-[450px] p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center space-y-5">
            <h2 className="text-center text-xl font-semibold text-gray-900">
                Mata Kuliah Rekomendasi
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
                        {mkrekomendasi.map((course, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-100 transition duration-200">
                                <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                    {course.namaMataKuliah}
                                </td>
                                <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                    {course.kodeMataKuliah}
                                </td>
                                <td className="p-3 text-gray-700 text-center border-b border-gray-200">
                                    {course.jenis}
                                </td>
                                <td className="p-3 text-gray-700 text-center border-b border-gray-200">
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
