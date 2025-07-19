import React from 'react';

/**
 * Komponen KelolaKurikulumTable
 * @desc
 *   Komponen presentasional untuk menampilkan data mata kuliah dalam sebuah tabel.
 *   A presentational component to display course data in a table.
 * @props
 *   Props yang diperlukan untuk menampilkan data dan menangani aksi.
 *   Props needed to display data and handle actions.
 */
const KelolaKurikulumTable = ({
    mataKuliahList,
    loading,
    onEdit,
    onDelete,
}) => {
    /**
     * @desc
     *   Fungsi helper untuk mendapatkan kelas CSS badge berdasarkan jenis mata kuliah.
     *   Helper function to get a badge CSS class based on the course type.
     */
    const getJenisBadge = (jenisMk) => {
        const badges = {
            'WAJIB PRODI': 'bg-blue-100 text-blue-800',
            PILIHAN: 'bg-green-100 text-green-800',
            'WAJIB UNIVERSITAS': 'bg-purple-100 text-purple-800',
        };
        return badges[jenisMk] || 'bg-gray-100 text-gray-800';
    };

    // Tampilkan indikator loading jika data sedang diambil.
    // Display a loading indicator if data is being fetched.
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16a085]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <i className="fas fa-code mr-1"></i>Kode MK
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <i className="fas fa-book mr-1"></i>Nama Mata
                                Kuliah
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <i className="fas fa-credit-card mr-1"></i>SKS
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <i className="fas fa-calendar mr-1"></i>Semester
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <i className="fas fa-layer-group mr-1"></i>
                                Kelompok Keahlian
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <i className="fas fa-exchange-alt mr-1"></i>
                                Ekuivalensi
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <i className="fas fa-cog mr-1"></i>Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* Tampilkan pesan jika tidak ada data, atau render baris tabel. */}
                        {/* Show a message if there is no data, or render table rows. */}
                        {mataKuliahList.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-8 text-center text-gray-500">
                                    <i className="fas fa-inbox text-4xl mb-2 text-gray-300"></i>
                                    <p>Tidak ada data untuk kurikulum ini.</p>
                                </td>
                            </tr>
                        ) : (
                            mataKuliahList.map((mk) => (
                                <tr
                                    key={mk.id_mk}
                                    className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {mk.kode_mk}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 font-medium">
                                            {mk.nama_mk}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJenisBadge(
                                                    mk.jenis_mk
                                                )}`}>
                                                {mk.jenis_mk}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {mk.sks_mk} SKS
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            Semester {mk.semester}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {mk.kelompok_keahlian ? (
                                            <span
                                             className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 max-w-xs truncate"
                                             title={mk.kelompok_keahlian}
                                            >
                                                {mk.kelompok_keahlian}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic text-sm">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {mk.ekuivalensi_info ? (
                                                <div>
                                                    <div>
                                                        {
                                                            mk.ekuivalensi_info
                                                                .nama
                                                        }
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        (
                                                        {
                                                            mk.ekuivalensi_info
                                                                .kode
                                                        }
                                                        ) - Kurikulum{' '}
                                                        {
                                                            mk.ekuivalensi_info
                                                                .kurikulum
                                                        }
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">
                                                    Tidak ada
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {/* Tombol aksi untuk setiap baris. */}
                                        {/* Action buttons for each row. */}
                                        <button
                                            onClick={() => onEdit(mk)}
                                            className="text-[#16a085] hover:text-[#16a085]/80 mr-3 transition-colors">
                                            <i className="fas fa-edit mr-1"></i>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(mk)}
                                            className="text-red-500 hover:text-red-600 transition-colors">
                                            <i className="fas fa-trash mr-1"></i>
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default KelolaKurikulumTable;
