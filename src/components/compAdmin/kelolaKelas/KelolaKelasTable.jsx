import React from 'react';

/**
 * Komponen KelolaKelasTable
 * Component KelolaKelasTable
 * @desc    Komponen presentasional untuk menampilkan data kelas dalam bentuk tabel, lengkap dengan pencarian dan paginasi.
 *          A presentational component to display class data in a table, complete with search and pagination.
 * @props   {array} currentData - Data untuk halaman saat ini. / Data for the current page.
 * @props   {array} filteredData - Total data setelah difilter. / Total data after filtering.
 * @props   {string} searchTerm - Kata kunci pencarian. / Search keyword.
 * @props   {function} setSearchTerm - Fungsi untuk mengubah searchTerm. / Function to change searchTerm.
 * @props   {number} currentPage - Halaman aktif. / Active page.
 * @props   {function} setCurrentPage - Fungsi untuk mengubah halaman. / Function to change the page.
 * @props   {number} totalPages - Total halaman paginasi. / Total pagination pages.
 * @props   {number} startIndex - Indeks awal data. / Start index of data.
 * @props   {number} endIndex - Indeks akhir data. / End index of data.
 * @props   {boolean} loading - Status loading. / Loading status.
 * @props   {function} onEdit - Fungsi yang dipanggil saat tombol edit diklik. / Function called on edit button click.
 * @props   {function} onDelete - Fungsi yang dipanggil saat tombol hapus diklik. / Function called on delete button click.
 * @props   {function} onAdd - Fungsi yang dipanggil saat tombol tambah diklik. / Function called on add button click.
 */
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
    loading,
    onEdit,
    onDelete,
    onAdd,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header tabel: Judul, Pencarian, Tombol Tambah */}
            {/* Table header: Title, Search, Add Button */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Daftar Semua Kelas
                    </h2>

                    {/* Input Pencarian */}
                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari kelas, tahun, atau dosen..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset ke halaman 1 saat mencari / Reset to page 1 when searching
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

                {/* Tombol Tambah Kelas Baru */}
                {/* Add New Class Button */}
                <button
                    onClick={onAdd}
                    className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:scale-105 bg-blue-500 hover:bg-blue-600">
                    <span className="mr-2">+</span>
                    Tambah Kelas Baru
                </button>
            </div>

            {/* Konten Tabel atau Indikator Loading */}
            {/* Table Content or Loading Indicator */}
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
                                {/* Render setiap baris data / Render each data row */}
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
                                            {/* Tampilkan nama dosen atau pesan default / Show lecturer name or default message */}
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
                                            {/* Tampilkan kode dosen atau pesan default / Show lecturer code or default message */}
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
                                            {/* Tombol Aksi per baris / Action buttons per row */}
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

                    {/* Kontrol Paginasi */}
                    {/* Pagination Controls */}
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
                                {/* Render tombol nomor halaman / Render page number buttons */}
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

                    {/* Pesan jika tidak ada data / Message if no data */}
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