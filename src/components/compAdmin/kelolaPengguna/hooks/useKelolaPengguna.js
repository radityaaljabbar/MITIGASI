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
} from '../../../../services/adminServices/kelolaPenggunaService';

export const useKelolaPengguna = () => {
    // State untuk tab yang aktif
    const [activeTab, setActiveTab] = useState('admin');

    // State untuk data
    const [admins, setAdmins] = useState([]);
    const [dosens, setDosens] = useState([]);
    const [mahasiswas, setMahasiswas] = useState([]);
    const [kelasList, setKelasList] = useState([]);

    // State untuk loading
    const [loading, setLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    // State untuk search dan pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Load data saat component mount
    useEffect(() => {
        loadData();
        loadKelasList();
    }, []);

    // Load data berdasarkan tab aktif
    useEffect(() => {
        loadData();
        setCurrentPage(1);
        setSearchTerm('');
    }, [activeTab]);

    // Load data dari API
    const loadData = async () => {
        setLoading(true);
        try {
            let response;
            switch (activeTab) {
                case 'admin':
                    response = await getAllAdmins();
                    if (response.success) {
                        setAdmins(response.data);
                    }
                    break;
                case 'dosen':
                    response = await getAllDosen();
                    if (response.success) {
                        setDosens(response.data);
                    }
                    break;
                case 'mahasiswa':
                    response = await getAllMahasiswa();
                    if (response.success) {
                        setMahasiswas(response.data);
                    }
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

    // Load daftar kelas
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

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Create data
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

    // Update data
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

    // Delete data
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

    // Filter data berdasarkan search
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

        return data.filter((item) => {
            if (activeTab === 'admin') {
                return (
                    item.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.username
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                );
            } else if (activeTab === 'dosen') {
                return (
                    item.nama
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.nip
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.kode?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            } else if (activeTab === 'mahasiswa') {
                return (
                    item.nama
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.nim
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.kelas?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            return false;
        });
    };

    // Pagination
    const filteredData = getFilteredData();
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    return {
        // State
        activeTab,
        loading,
        loadingAction,
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
        setSearchTerm,
        setCurrentPage,
        loadData,
    };
};
