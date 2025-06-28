// src/components/compAdmin/logAktivitas/hooks/useLogAktivitas.js
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllLogs } from '../../../../services/adminServices/logService';

export const useLogAktivitas = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State untuk filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(''); // 'all', 'success', 'fail'

    // State untuk pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    // State untuk tanggal
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        loadLogs();
    }, []);

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

    // Fungsi untuk mengubah state tanggal
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1); // Kembali ke halaman pertama saat filter berubah
    };
    
    // Fungsi untuk mereset semua filter
    const resetFilters = () => {
        setSearchTerm('');
        setFilterStatus('');
        setDateRange({ startDate: '', endDate: '' });
        setCurrentPage(1);
    };

    const refreshLogs = () => {
        loadLogs();
        toast.info("Memuat ulang data log...");
    };

    // Logika filter
    const filteredData = logs.filter(log => {
        const searchMatch = searchTerm === '' ||
            log.admin_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.endpoint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.target_entity?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // 2. Filter Status
        const statusMatch = filterStatus === '' || log.status === filterStatus;
        
        // 3. Filter Tanggal
        const logDateStr = log.log_time.substring(0, 10)

        let dateMatch = true; // Anggap cocok secara default

        // Cek apakah tanggal log lebih besar atau sama dengan tanggal mulai
        if (dateRange.startDate && logDateStr < dateRange.startDate) {
            dateMatch = false;
        }

        // Cek apakah tanggal log lebih kecil atau sama dengan tanggal selesai
        if (dateRange.endDate && logDateStr > dateRange.endDate) {
            dateMatch = false;
        }

        return searchMatch && statusMatch && dateMatch;

    });

    // Logika pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

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