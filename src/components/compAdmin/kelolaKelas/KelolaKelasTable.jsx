import React from 'react';

const KelolaKelasTable = ({
    currentData,
    filteredData,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    endIndex,
    itemsPerPage,
    loading,
    onEdit,
    onDelete,
    onAdd,
    getDosenNameByCode,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header actions */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Daftar Semua Kelas
                    </h2>

                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari kelas, tahun, atau dosen..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                        />
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                <button
                    onClick={onAdd}
                    className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:scale-105 bg-blue-500 hover:bg-blue-600">
                    <span className="mr-2">+</span>
                    Tambah Kelas Baru
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Tahun Angkatan
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Kode Kelas
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Nama Dosen Wali
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Kode Dosen
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentData.map((item) => (
                                    <tr
                                        key={item.id_kelas}
                                        className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.tahun_angkatan}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="font-medium text-blue-600">
                                                {item.kode_kelas}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.nama_dosen ? (
                                                <span className="text-gray-900">
                                                    {item.nama_dosen}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic">
                                                    Belum Ditentukan
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.kode_dosen ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                                    {item.kode_dosen}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                                    title="Edit Dosen Wali">
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        onDelete(item)
                                                    }
                                                    className="text-red-600 hover:text-red-800 font-medium hover:underline"
                                                    title="Hapus Kelas">
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-700">
                                Menampilkan {startIndex + 1} -{' '}
                                {Math.min(endIndex, filteredData.length)} dari{' '}
                                {filteredData.length} data
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(prev - 1, 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                    Sebelumnya
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                                            currentPage === i + 1
                                                ? 'text-white bg-blue-500'
                                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}>
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(prev + 1, totalPages)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    )}

                    {filteredData.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg">
                                {searchTerm
                                    ? 'Tidak ada data yang sesuai dengan pencarian'
                                    : 'Belum ada data kelas'}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default KelolaKelasTable;
