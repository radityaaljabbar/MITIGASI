import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    getAllKelas,
    getDosenList,
    createKelas,
    updateKelas,
    deleteKelas,
} from '../../../../services/adminServices/kelolaKelasService';

/**
 * Custom hook `useKelolaKelas`
 * @desc    Mengelola semua logika, state, dan interaksi API untuk halaman Kelola Kelas.
 *          Manages all logic, state, and API interactions for the Manage Classes page.
 * @returns {object} - State dan fungsi yang diperlukan oleh komponen UI.
 *          Returns an object containing state and functions needed by the UI component.
 */
export const useKelolaKelas = () => {
    // State untuk menampung data dari API
    // State to hold data from the API
    const [kelasList, setKelasList] = useState([]); // Daftar semua kelas / List of all classes
    const [dosenList, setDosenList] = useState([]); // Daftar semua dosen untuk dropdown / List of all lecturers for the dropdown

    // State untuk mengelola status loading UI
    // State to manage UI loading status
    const [loading, setLoading] = useState(false); // Loading untuk data tabel utama / Loading for the main table data
    const [loadingAction, setLoadingAction] = useState(false); // Loading untuk aksi (simpan, update, hapus) / Loading for actions (save, update, delete)

    // State untuk fungsionalitas pencarian dan paginasi
    // State for search and pagination functionality
    const [searchTerm, setSearchTerm] = useState(''); // Kata kunci pencarian / Search keyword
    const [currentPage, setCurrentPage] = useState(1); // Halaman aktif saat ini / Current active page
    const itemsPerPage = 10; // Jumlah item per halaman / Number of items per page

    // Effect untuk memuat semua data yang diperlukan saat hook pertama kali digunakan
    // Effect to load all necessary data when the hook is first used
    useEffect(() => {
        loadAllData();
    }, []);

    /**
     * @desc    Memuat data kelas dan data dosen secara paralel.
     *          Loads class data and lecturer data in parallel.
     */
    const loadAllData = async () => {
        setLoading(true);
        await Promise.all([loadKelasList(), loadDosenList()]);
        setLoading(false);
    };

    /**
     * @desc    Mengambil daftar semua kelas dari API.
     *          Fetches the list of all classes from the API.
     */
    const loadKelasList = async () => {
        try {
            const response = await getAllKelas();
            if (response.success) {
                setKelasList(response.data);
            } else {
                toast.error(response.message || 'Gagal memuat data kelas');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat memuat data kelas');
        }
    };

    /**
     * @desc    Mengambil daftar semua dosen dari API.
     *          Fetches the list of all lecturers from the API.
     */
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

    /**
     * @desc    Menangani pembuatan kelas baru melalui API.
     *          Handles the creation of a new class via the API.
     * @param   {object} formData - Data kelas baru dari form. / New class data from the form.
     * @returns {boolean} - True jika berhasil, false jika gagal. / True on success, false on failure.
     */
    const handleCreate = async (formData) => {
        setLoadingAction(true);
        try {
            const response = await createKelas(formData);
            if (response.success) {
                toast.success(response.message);
                await loadKelasList(); // Muat ulang data setelah berhasil / Reload data on success
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
     * @desc    Menangani pembaruan data kelas (dosen wali) melalui API.
     *          Handles updating class data (homeroom lecturer) via the API.
     * @param   {number} id - ID kelas yang akan diupdate. / ID of the class to be updated.
     * @param   {object} formData - Data baru untuk kelas. / New data for the class.
     * @returns {boolean} - True jika berhasil, false jika gagal. / True on success, false on failure.
     */
    const handleUpdate = async (id, formData) => {
        setLoadingAction(true);
        try {
            const response = await updateKelas(id, formData);
            if (response.success) {
                toast.success(response.message);
                await loadKelasList(); // Muat ulang data setelah berhasil / Reload data on success
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
     * @desc    Menangani penghapusan kelas melalui API.
     *          Handles deleting a class via the API.
     * @param   {number} id - ID kelas yang akan dihapus. / ID of the class to be deleted.
     * @returns {boolean} - True jika berhasil, false jika gagal. / True on success, false on failure.
     */
    const handleDelete = async (id) => {
        setLoadingAction(true);
        try {
            const response = await deleteKelas(id);
            if (response.success) {
                toast.success(response.message);
                await loadKelasList(); // Muat ulang data setelah berhasil / Reload data on success
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
     * @desc    Memfilter data kelas berdasarkan kata kunci pencarian.
     *          Filters class data based on the search keyword.
     * @returns {array} - Daftar kelas yang sudah difilter. / Filtered list of classes.
     */
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

    /**
     * @desc    Mencari dan mengembalikan nama dosen berdasarkan kode dosen.
     *          Finds and returns the lecturer's name based on their code.
     * @param   {string} kodeDosenParam - Kode dosen yang dicari. / The lecturer code to search for.
     * @returns {string} - Nama dosen atau pesan default. / The lecturer's name or a default message.
     */
    const getDosenNameByCode = (kodeDosenParam) => {
        if (!kodeDosenParam) return 'Belum Ditentukan';
        const dosen = dosenList.find((d) => d.kode === kodeDosenParam);
        return dosen ? dosen.nama : 'Belum Ditentukan';
    };

    // Logika untuk paginasi data
    // Logic for data pagination
    const filteredData = getFilteredData();
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    // Mengembalikan semua state dan fungsi yang akan digunakan oleh komponen
    // Returns all states and functions to be used by the component
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