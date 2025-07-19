// Custom Hook untuk Kelola Akademik - Mengelola state dan fungsi untuk manajemen data mahasiswa
// Custom Hook for Academic Management - Managing state and functions for student data management
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllMahasiswa } from '../../../../services/adminServices/kelolaAkademikServices';

export const useKelolaAkademik = () => {
    // State untuk menyimpan data mahasiswa
    // State to store student data
    const [mahasiswaList, setMahasiswaList] = useState([]);

    // State untuk indikator loading saat fetching data
    // State for loading indicator during data fetching
    const [loading, setLoading] = useState(false);

    // State untuk pencarian dan paginasi
    // State for search and pagination
    const [searchTerm, setSearchTerm] = useState(''); // Term pencarian / Search term
    const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini / Current page
    const itemsPerPage = 10; // Jumlah item per halaman / Items per page

    // Effect untuk memuat data saat component pertama kali di-mount
    // Effect to load data when component first mounts
    useEffect(() => {
        const loadData = async () => {
            await loadMahasiswaList();
        };
        loadData();
    }, []);

 
    // Mengambil semua data mahasiswa dari API
    // Fetch all student data from API
    const loadMahasiswaList = async () => {
        setLoading(true); // Set loading state menjadi true
        try {
            const response = await getAllMahasiswa();
            
            // Cek apakah response berhasil
            // Check if response is successful
            if (response.success) {
                setMahasiswaList(response.data);
            } else {
                // Tampilkan pesan error jika gagal
                // Show error message if failed
                toast.error(response.message || 'Gagal memuat data mahasiswa');
            }
        } catch (error) {
            // Handle error saat API call
            // Handle error during API call
            toast.error('Terjadi kesalahan saat memuat data mahasiswa');
        } finally {
            setLoading(false); // Set loading state kembali ke false
        }
    };

     // Filter data mahasiswa berdasarkan search term
     // Filter student data based on search term
    const getFilteredData = () => {
        // Jika tidak ada search term, return semua data
        // If no search term, return all data
        if (!searchTerm) return mahasiswaList;

        // Filter data berdasarkan multiple fields
        // Filter data based on multiple fields
        return mahasiswaList.filter((item) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                // Pencarian berdasarkan NIM
                // Search by NIM
                item.nim?.toLowerCase().includes(searchLower) ||
                // Pencarian berdasarkan nama mahasiswa
                // Search by student name
                item.name?.toLowerCase().includes(searchLower) ||
                // Pencarian berdasarkan kelas
                // Search by class
                item.detail_kelas?.kelas?.toLowerCase().includes(searchLower) ||
                // Pencarian berdasarkan angkatan
                // Search by graduation year
                item.detail_kelas?.angkatan?.toString().includes(searchLower) ||
                // Pencarian berdasarkan dosen wali
                // Search by academic advisor
                item.detail_kelas?.dosen_wali
                    ?.toLowerCase()
                    .includes(searchLower)
            );
        });
    };

    // Logic untuk pagination - menghitung halaman dan slice data
    // Pagination logic - calculating pages and slicing data
    const filteredData = getFilteredData(); // Data yang sudah difilter
    const totalPages = Math.ceil(filteredData.length / itemsPerPage); // Total halaman
    const startIndex = (currentPage - 1) * itemsPerPage; // Index awal data
    const endIndex = startIndex + itemsPerPage; // Index akhir data
    const currentData = filteredData.slice(startIndex, endIndex); // Data untuk halaman saat ini

    // Return semua state dan fungsi yang diperlukan oleh component
    // Return all states and functions needed by component
    return {
        // State untuk UI component
        // State for UI component
        loading,
        searchTerm,
        currentPage,
        itemsPerPage,

        // Data yang sudah diproses
        // Processed data
        mahasiswaList, // Data asli mahasiswa / Original student data
        currentData, // Data untuk halaman saat ini / Data for current page
        filteredData, // Data yang sudah difilter / Filtered data
        totalPages, // Total halaman / Total pages
        startIndex, // Index awal / Start index
        endIndex, // Index akhir / End index

        // Fungsi untuk mengubah state
        // Functions to change state
        setSearchTerm, // Fungsi untuk set search term
        setCurrentPage, // Fungsi untuk set current page
        loadMahasiswaList, // Fungsi untuk reload data mahasiswa
    };
};