import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    getAllKelas,
    getDosenList,
    createKelas,
    updateKelas,
    deleteKelas,
} from '../../../../services/adminServices/kelolaKelasService';

export const useKelolaKelas = () => {
    // State untuk data
    const [kelasList, setKelasList] = useState([]);
    const [dosenList, setDosenList] = useState([]);

    // State untuk loading
    const [loading, setLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    // State untuk search dan pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Load data saat component mount
    useEffect(() => {
        loadAllData();
    }, []);

    // Load semua data
    const loadAllData = async () => {
        await Promise.all([loadKelasList(), loadDosenList()]);
    };

    // Load data kelas
    const loadKelasList = async () => {
        setLoading(true);
        try {
            const response = await getAllKelas();
            if (response.success) {
                setKelasList(response.data);
            } else {
                toast.error(response.message || 'Gagal memuat data kelas');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat memuat data kelas');
        } finally {
            setLoading(false);
        }
    };

    // Load daftar dosen
    const loadDosenList = async () => {
        try {
            const response = await getDosenList();
            if (response.success) {
                setDosenList(response.data);
            } else {
                console.error('Failed to load dosen list:', response.message);
            }
        } catch (error) {
            console.error('Error loading dosen list:', error);
        }
    };

    // Create kelas baru
    const handleCreate = async (formData) => {
        setLoadingAction(true);
        try {
            const response = await createKelas(formData);

            if (response.success) {
                toast.success(response.message);
                loadKelasList();
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

    // Update kelas (hanya dosen wali)
    const handleUpdate = async (id, formData) => {
        setLoadingAction(true);
        try {
            const response = await updateKelas(id, formData);

            if (response.success) {
                toast.success(response.message);
                loadKelasList();
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

    // Delete kelas
    const handleDelete = async (id) => {
        setLoadingAction(true);
        try {
            const response = await deleteKelas(id);

            if (response.success) {
                toast.success(response.message);
                loadKelasList();
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

    // Filter data berdasarkan search
    const getFilteredData = () => {
        if (!searchTerm) return kelasList;

        return kelasList.filter((item) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                item.kode_kelas?.toLowerCase().includes(searchLower) ||
                item.tahun_angkatan?.toString().includes(searchLower) ||
                item.nama_dosen?.toLowerCase().includes(searchLower) ||
                item.kode_dosen?.toLowerCase().includes(searchLower)
            );
        });
    };

    // Get dosen name by code
    const getDosenNameByCode = (kodeDosenParam) => {
        if (!kodeDosenParam) return 'Belum Ditentukan';
        const dosen = dosenList.find((d) => d.kode === kodeDosenParam);
        return dosen ? dosen.nama : 'Belum Ditentukan';
    };

    // Pagination
    const filteredData = getFilteredData();
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    return {
        // State
        loading,
        loadingAction,
        searchTerm,
        currentPage,
        itemsPerPage,

        // Data
        kelasList,
        dosenList,
        currentData,
        filteredData,
        totalPages,
        startIndex,
        endIndex,

        // Actions
        handleCreate,
        handleUpdate,
        handleDelete,
        setSearchTerm,
        setCurrentPage,
        loadKelasList,
        getDosenNameByCode,
    };
};
