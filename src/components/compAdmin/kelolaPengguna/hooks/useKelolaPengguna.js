import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAllDosen,
    createDosen,
    updateDosen,
    deleteDosen,
    getAllMahasiswa,
    createMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
    getAllKelas,
    bulkCreateMahasiswa,
} from '../../../../services/adminServices/kelolaPenggunaService';

/**
 * Custom Hook untuk mengelola state dan logika halaman Kelola Pengguna.
 * Custom Hook to manage state and logic for the User Management page.
 */
export const useKelolaPengguna = () => {
    // State untuk tab yang aktif (admin, dosen, mahasiswa)
    // State for the active tab (admin, dosen, mahasiswa)
    const [activeTab, setActiveTab] = useState('admin');

    // State untuk menyimpan data dari API
    // State to store data from the API
    const [admins, setAdmins] = useState([]);
    const [dosens, setDosens] = useState([]);
    const [mahasiswas, setMahasiswas] = useState([]);
    const [kelasList, setKelasList] = useState([]);

    // State untuk status loading (memuat data tabel & aksi)
    // State for loading status (loading table data & actions)
    const [loading, setLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    // State untuk fungsionalitas pencarian dan paginasi
    // State for search and pagination functionality
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // State untuk status import data massal
    // State for bulk import status
    const [bulkImporting, setBulkImporting] = useState(false);

    // Effect untuk memuat data saat komponen pertama kali dimuat
    // Effect to load data when the component first mounts
    useEffect(() => {
        loadData();
        loadKelasList();
    }, []);

    // Effect untuk memuat ulang data saat tab aktif berubah
    // Effect to reload data when the active tab changes
    useEffect(() => {
        loadData();
        setCurrentPage(1); // Reset ke halaman pertama
        setSearchTerm(''); // Reset pencarian
    }, [activeTab]);

    /**
     * Memuat data pengguna (admin/dosen/mahasiswa) berdasarkan tab aktif.
     * Loads user data (admin/dosen/mahasiswa) based on the active tab.
     */
    const loadData = async () => {
        setLoading(true);
        try {
            let response;
            switch (activeTab) {
                case 'admin':
                    response = await getAllAdmins();
                    if (response.success) setAdmins(response.data);
                    break;
                case 'dosen':
                    response = await getAllDosen();
                    if (response.success) setDosens(response.data);
                    break;
                case 'mahasiswa':
                    response = await getAllMahasiswa();
                    if (response.success) setMahasiswas(response.data);
                    break;
            }
            if (!response.success) {
                toast.error(response.message || 'Gagal memuat data');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat memuat data');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Memuat daftar kelas untuk dropdown pada form mahasiswa.
     * Loads the list of classes for the dropdown in the student form.
     */
    const loadKelasList = async () => {
        try {
            const response = await getAllKelas();
            if (response.success) {
                setKelasList(response.data);
            }
        } catch (error) {
            console.error('Error loading kelas list:', error);
        }
    };

    /**
     * Menangani perubahan tab aktif.
     * Handles changing the active tab.
     * @param {string} tab - Kunci tab yang dipilih ('admin', 'dosen', 'mahasiswa').
     */
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    /**
     * Menangani pembuatan data pengguna baru.
     * Handles the creation of new user data.
     * @param {object} formData - Data dari form.
     * @returns {boolean} - True jika berhasil, false jika gagal.
     */
    const handleCreate = async (formData) => {
        setLoadingAction(true);
        try {
            let response;
            if (activeTab === 'admin') {
                if (!formData.password) {
                    toast.error('Password wajib diisi untuk admin baru');
                    return false;
                }
                response = await createAdmin(formData);
            } else if (activeTab === 'dosen') {
                response = await createDosen(formData);
            } else if (activeTab === 'mahasiswa') {
                response = await createMahasiswa(formData);
            }

            if (response.success) {
                toast.success(response.message);
                loadData();
                return true;
            } else {
                toast.error(response.message || 'Terjadi kesalahan');
                return false;
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat menyimpan data');
            return false;
        } finally {
            setLoadingAction(false);
        }
    };

    /**
     * Menangani pembaruan data pengguna yang ada.
     * Handles updating existing user data.
     * @param {string|number} id - ID pengguna yang akan diupdate.
     * @param {object} formData - Data baru dari form.
     * @returns {boolean} - True jika berhasil, false jika gagal.
     */
    const handleUpdate = async (id, formData) => {
        setLoadingAction(true);
        try {
            let response;
            if (activeTab === 'admin') {
                response = await updateAdmin(id, formData);
            } else if (activeTab === 'dosen') {
                response = await updateDosen(id, formData);
            } else if (activeTab === 'mahasiswa') {
                response = await updateMahasiswa(id, formData);
            }

            if (response.success) {
                toast.success(response.message);
                loadData();
                return true;
            } else {
                toast.error(response.message || 'Terjadi kesalahan');
                return false;
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat memperbarui data');
            return false;
        } finally {
            setLoadingAction(false);
        }
    };

    /**
     * Menangani penghapusan data pengguna.
     * Handles deleting user data.
     * @param {string|number} id - ID pengguna yang akan dihapus.
     * @returns {boolean} - True jika berhasil, false jika gagal.
     */
    const handleDelete = async (id) => {
        setLoadingAction(true);
        try {
            let response;
            if (activeTab === 'admin') {
                response = await deleteAdmin(id);
            } else if (activeTab === 'dosen') {
                response = await deleteDosen(id);
            } else if (activeTab === 'mahasiswa') {
                response = await deleteMahasiswa(id);
            }

            if (response.success) {
                toast.success(response.message);
                loadData();
                return true;
            } else {
                toast.error(response.message || 'Gagal menghapus data');
                return false;
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat menghapus data');
            return false;
        } finally {
            setLoadingAction(false);
        }
    };

    /**
     * Menangani import data mahasiswa secara massal dari file CSV.
     * Handles bulk import of student data from a CSV file.
     * @param {File} file - File CSV yang akan diimport.
     * @returns {object|null} - Objek hasil import atau null jika gagal.
     */
    const handleBulkImport = async (file) => {
        setBulkImporting(true);
        try {
            const response = await bulkCreateMahasiswa(file);
            if (response.success) {
                toast.success(response.message);
                loadData();
                return response.data;
            } else {
                toast.error(response.message || 'Gagal import data');
                return null;
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat import data');
            return null;
        } finally {
            setBulkImporting(false);
        }
    };

    /**
     * Menyaring data berdasarkan searchTerm.
     * Filters data based on the searchTerm.
     * @returns {Array} - Data yang sudah difilter.
     */
    const getFilteredData = () => {
        let data = [];
        switch (activeTab) {
            case 'admin':
                data = admins;
                break;
            case 'dosen':
                data = dosens;
                break;
            case 'mahasiswa':
                data = mahasiswas;
                break;
        }

        if (!searchTerm) return data;

        // Logika filter untuk setiap tab
        // Filter logic for each tab
        return data.filter((item) => {
            if (activeTab === 'admin') {
                return (
                    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.username?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            } else if (activeTab === 'dosen') {
                return (
                    item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.nip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.kode?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            } else if (activeTab === 'mahasiswa') {
                return (
                    item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.nim?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.kelas?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            return false;
        });
    };

    // Logika untuk paginasi data yang sudah difilter
    // Logic for paginating the filtered data
    const filteredData = getFilteredData();
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    // Mengembalikan semua state dan fungsi handler untuk digunakan di komponen
    // Returns all state and handler functions for use in the component
    return {
        // State
        activeTab,
        loading,
        loadingAction,
        bulkImporting,
        searchTerm,
        currentPage,
        itemsPerPage,
        kelasList,

        // Data
        currentData,
        filteredData,
        totalPages,
        startIndex,
        endIndex,

        // Actions
        handleTabChange,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleBulkImport,
        setSearchTerm,
        setCurrentPage,
        loadData,
    };
};