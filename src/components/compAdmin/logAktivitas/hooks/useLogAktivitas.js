// src/components/compAdmin/logAktivitas/hooks/useLogAktivitas.js
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllLogs } from '../../../../services/adminServices/logService';

/**
 * Custom Hook untuk mengelola state dan logika halaman Log Aktivitas.
 * Custom Hook to manage state and logic for the Activity Log page.
 */
export const useLogAktivitas = () => {
    // State untuk menyimpan semua data log dari API
    // State to store all log data from the API
    const [logs, setLogs] = useState([]);
    // State untuk status loading data
    // State for data loading status
    const [loading, setLoading] = useState(false);
    
    // State untuk fungsionalitas filter
    // State for filter functionality
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(''); // 'all', 'success', 'fail'

    // State untuk fungsionalitas paginasi
    // State for pagination functionality
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    // State untuk filter rentang tanggal
    // State for date range filter
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: '',
    });

    // Effect untuk memuat data log saat komponen pertama kali dimuat
    // Effect to load log data when the component first mounts
    useEffect(() => {
        loadLogs();
    }, []);

    /**
     * Memuat data log dari server melalui service.
     * Loads log data from the server via the service.
     */
    const loadLogs = async () => {
        setLoading(true);
        try {
            const response = await getAllLogs();
            if (response.success) {
                setLogs(response.data);
            } else {
                toast.error(response.message || 'Gagal memuat data log.');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat memuat log aktivitas.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Menangani perubahan pada input tanggal.
     * Handles changes in the date inputs.
     * @param {React.ChangeEvent<HTMLInputElement>} e - Event dari input.
     */
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1); // Kembali ke halaman pertama saat filter berubah / Go back to the first page when the filter changes
    };
    
    /**
     * Mengatur ulang semua filter ke nilai default.
     * Resets all filters to their default values.
     */
    const resetFilters = () => {
        setSearchTerm('');
        setFilterStatus('');
        setDateRange({ startDate: '', endDate: '' });
        setCurrentPage(1);
    };

    /**
     * Memuat ulang data log dari server.
     * Reloads log data from the server.
     */
    const refreshLogs = () => {
        loadLogs();
        toast.info("Memuat ulang data log...");
    };

    // Logika untuk menyaring data log berdasarkan semua filter yang aktif
    // Logic for filtering log data based on all active filters
    const filteredData = logs.filter(log => {
        // 1. Filter Pencarian Teks
        // 1. Text Search Filter
        const searchMatch = searchTerm === '' ||
            log.admin_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.endpoint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.target_entity?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // 2. Filter Status (Success/Fail)
        // 2. Status Filter (Success/Fail)
        const statusMatch = filterStatus === '' || log.status === filterStatus;
        
        // 3. Filter Rentang Tanggal
        // 3. Date Range Filter
        const logDateStr = log.log_time.substring(0, 10); // Ambil YYYY-MM-DD dari timestamp / Get YYYY-MM-DD from timestamp

        let dateMatch = true; // Anggap cocok secara default / Assume it matches by default

        // Cek apakah tanggal log lebih besar atau sama dengan tanggal mulai
        // Check if the log date is greater than or equal to the start date
        if (dateRange.startDate && logDateStr < dateRange.startDate) {
            dateMatch = false;
        }

        // Cek apakah tanggal log lebih kecil atau sama dengan tanggal selesai
        // Check if the log date is less than or equal to the end date
        if (dateRange.endDate && logDateStr > dateRange.endDate) {
            dateMatch = false;
        }

        return searchMatch && statusMatch && dateMatch;

    });

    // Logika untuk paginasi data yang sudah difilter
    // Logic for paginating the filtered data
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    // Mengembalikan semua state dan fungsi handler untuk digunakan di komponen
    // Returns all state and handler functions for use in the component
    return {
        loading,
        searchTerm,
        setSearchTerm,
        filterStatus,
        setFilterStatus,
        currentData,
        filteredData,
        totalPages,
        currentPage,
        setCurrentPage,
        startIndex,
        endIndex,
        refreshLogs,
        dateRange,          
        handleDateChange,  
        resetFilters,      
    };
};