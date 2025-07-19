// src/components/compAdmin/logAktivitas/LogTable.jsx
import React from 'react';

/**
 * Komponen untuk menampilkan tabel data log aktivitas beserta kontrol filter.
 * Component to display the activity log data table along with filter controls.
 * @param {object} props - Props komponen yang diterima dari hook useLogAktivitas.
 */
const LogTable = ({
    currentData, filteredData, searchTerm, setSearchTerm,
    filterStatus, setFilterStatus, currentPage, setCurrentPage,
    totalPages, startIndex, endIndex, loading,
    dateRange, handleDateChange, resetFilters
}) => {
    
    /**
     * Mendapatkan kelas CSS untuk badge status berdasarkan status log.
     * Gets the CSS class for the status badge based on the log status.
     * @param {string} status - Status log ('success' atau 'fail').
     * @returns {string} - Kelas Tailwind CSS.
     */
    const getStatusBadge = (status) => {
        return status === 'success'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    // Cek apakah ada filter yang sedang aktif untuk menampilkan tombol reset
    // Check if any filter is active to display the reset button
    const isFilterActive = searchTerm || filterStatus || dateRange.startDate || dateRange.endDate;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Kontrol Filter (Pencarian, Status, Tanggal) */}
            {/* Filter Controls (Search, Status, Date) */}
            <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Filter Pencarian Teks */}
                    {/* Text Search Filter */}
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Cari</label>
                        <input
                            type="text"
                            placeholder="Username, aksi..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        <svg
                            className="absolute left-3 top-1/2  w-4 h-4 text-gray-400"
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
                        <i className="fas fa-search absolute left-3 top-9 transform -translate-y-1/2 text-gray-400"></i>
                    </div>

                    {/* Filter Status */}
                    {/* Status Filter */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Semua Status</option>
                            <option value="success">Success</option>
                            <option value="fail">Fail</option>
                        </select>
                    </div>

                    {/* Filter Tanggal Mulai */}
                    {/* Start Date Filter */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Dari Tanggal</label>
                        <input
                            type="date"
                            name="startDate"
                            value={dateRange.startDate}
                            onChange={handleDateChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    {/* Filter Tanggal Selesai */}
                    {/* End Date Filter */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Sampai Tanggal</label>
                        <input
                            type="date"
                            name="endDate"
                            value={dateRange.endDate}
                            onChange={handleDateChange}
                            min={dateRange.startDate} // Cegah memilih tanggal sebelum tanggal mulai / Prevent selecting a date before the start date
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                {/* Tombol Reset Filter */}
                {/* Reset Filter Button */}
                 {isFilterActive && (
                    <div className="flex justify-end">
                        <button
                            onClick={resetFilters}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            <i className="fas fa-times-circle mr-1"></i>
                            Reset Semua Filter
                        </button>
                    </div>
                )}
            </div>

            {/* Tabel Data Log */}
            {/* Log Data Table */}
            {loading ? (
                // Tampilan saat loading
                // View during loading
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Waktu</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admin</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Target</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentData.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(log.log_time).toLocaleString('id-ID', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.admin_username}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{log.action}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.target_entity || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(log.status)}`}>
                                                {log.status}
                                            </span>
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
                                Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredData.length)} dari {filteredData.length} log
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Sebelumnya
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* Pesan jika tidak ada data */}
                    {/* Message if no data is available */}
                    {filteredData.length === 0 && !loading && (
                        <div className="text-center py-12 text-gray-500">
                            Tidak ada log yang ditemukan.
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default LogTable;