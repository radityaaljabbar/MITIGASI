import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

// Import komponen (kita akan buat ini selanjutnya)
import LogTable from '../../components/compAdmin/logAktivitas/LogTable';

// Import custom hook (kita akan buat ini selanjutnya)
import { useLogAktivitas } from '../../components/compAdmin/logAktivitas/hooks/useLogAktivitas';

const LogAktivitasPage = () => {
    const {
        // State
        loading,
        searchTerm,
        filterStatus,
        dateRange,
        
        // Data
        currentData,
        filteredData,
        totalPages,
        currentPage,
        startIndex,
        endIndex,

        // Actions
        setSearchTerm,
        setFilterStatus,
        handleDateChange, 
        resetFilters,     
        setCurrentPage,
        refreshLogs,
    } = useLogAktivitas();

    return (
        <div className="p-6 bg-[#FAF0E6] min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Log Aktivitas Admin
                    </h1>
                    <p className="text-gray-600">
                        Catatan semua aktivitas yang dilakukan oleh admin di sistem.
                    </p>
                </div>
                <button
                    onClick={refreshLogs}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                >
                    <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
                    <span>Refresh Data</span>
                </button>
            </div>
            
            {/* Table dan Filter */}
            <LogTable
                currentData={currentData}
                filteredData={filteredData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                dateRange={dateRange} // <-- Teruskan prop
                handleDateChange={handleDateChange} // <-- Teruskan prop
                resetFilters={resetFilters} 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                loading={loading}
            />
        </div>
    );
};

export default LogAktivitasPage;