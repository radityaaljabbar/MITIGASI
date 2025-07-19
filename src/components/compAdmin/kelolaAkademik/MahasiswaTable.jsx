import React from 'react';
import { useNavigate } from 'react-router-dom';



const MahasiswaTable = ({
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
}) => {
    // Hook dari react-router-dom untuk navigasi
    // Hook from react-router-dom for navigation
    const navigate = useNavigate();

    /**
     * @desc    Menangani klik pada tombol detail, mengarahkan ke halaman detail mahasiswa.
     *          Handles the click on the detail button, navigating to the student detail page.
     * @param   {object} mahasiswa - Objek data mahasiswa yang diklik. / The clicked student's data object.
     */
    const handleDetailClick = (mahasiswa) => {
        // Navigasi ke rute detail dengan mengirimkan data mahasiswa melalui state
        // Navigate to the detail route, passing student data via state
        navigate(`/admin/kelolaAkademik/detail/${mahasiswa.nim}`, {
            state: { mahasiswaData: mahasiswa },
        });
    };

    /**
     * @desc    Mengembalikan kelas CSS untuk badge status berdasarkan nilainya ('aktif' atau lainnya).
     *          Returns a CSS class for the status badge based on its value ('aktif' or other).
     */
    const getStatusBadge = (status) => {
        return status === 'aktif'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header tabel termasuk judul dan input pencarian */}
            {/* Table header including title and search input */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Daftar Mahasiswa
                    </h2>

                    {/* Input Pencarian */}
                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari NIM, nama, atau kelas..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset ke halaman 1 setiap kali pencarian berubah
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

                <div className="text-sm text-gray-600">
                    Total: {filteredData.length} mahasiswa
                </div>
            </div>

            {/* Konten Tabel */}
            {/* Table Content */}
            {loading ? (
                // Tampilan loading
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
                                        NIM
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Nama Mahasiswa
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Kelas
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Angkatan
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Dosen Wali
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Mapping data mahasiswa ke baris tabel */}
                                {/* Mapping student data to table rows */}
                                {currentData.map((mahasiswa) => (
                                    <tr
                                        key={mahasiswa.nim}
                                        className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="font-medium text-blue-600">
                                                {mahasiswa.nim}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="font-medium">
                                                {mahasiswa.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                                {mahasiswa.detail_kelas
                                                    ?.kelas || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {mahasiswa.detail_kelas?.angkatan ||
                                                '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {mahasiswa.detail_kelas
                                                ?.dosen_wali ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                                    {
                                                        mahasiswa.detail_kelas
                                                            .dosen_wali
                                                    }
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic">
                                                    Belum ditentukan
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                                                    mahasiswa.status
                                                )}`}>
                                                {mahasiswa.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {/* Tombol untuk melihat detail */}
                                            {/* Button to view details */}
                                            <button
                                                onClick={() =>
                                                    handleDetailClick(mahasiswa)
                                                }
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                                <span>Lihat Detail</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Kontrol Paginasi: Ditampilkan jika total halaman lebih dari 1 */}
                    {/* Pagination Controls: Displayed if total pages > 1 */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            {/* Info jumlah data yang ditampilkan */}
                            {/* Info on the number of data displayed */}
                            <div className="text-sm text-gray-700">
                                Menampilkan {startIndex + 1} -{' '}
                                {Math.min(endIndex, filteredData.length)} dari{' '}
                                {filteredData.length} data
                            </div>

                            {/* Tombol Paginasi */}
                            {/* Pagination Buttons */}
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="...">
                                    Sebelumnya
                                </button>

                                {/* Mapping nomor halaman */}
                                {/* Mapping page numbers */}
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

                    {/* Tampilan Kosong: Ditampilkan jika tidak ada data sama sekali atau hasil pencarian kosong */}
                    {/* Empty State: Displayed if there is no data at all or the search result is empty */}
                    {filteredData.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg">
                                {searchTerm
                                    ? 'Tidak ada data yang sesuai dengan pencarian'
                                    : 'Belum ada data mahasiswa'}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MahasiswaTable;
