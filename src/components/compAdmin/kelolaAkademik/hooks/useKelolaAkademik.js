import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllMahasiswa } from '../../../../services/adminServices/kelolaAkademikServices';

export const useKelolaAkademik = () => {
    // State untuk data
    const [mahasiswaList, setMahasiswaList] = useState([]);

    // State untuk loading
    const [loading, setLoading] = useState(false);

    // State untuk search dan pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Load data saat component mount
    useEffect(() => {
        const loadData = async () => {
            await loadMahasiswaList();
        };
        loadData();
    }, []);

    // Load data mahasiswa
    const loadMahasiswaList = async () => {
        setLoading(true);
        try {
            const response = await getAllMahasiswa();
            if (response.success) {
                setMahasiswaList(response.data);
            } else {
                toast.error(response.message || 'Gagal memuat data mahasiswa');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat memuat data mahasiswa');
        } finally {
            setLoading(false);
        }
    };

    // Filter data berdasarkan search
    const getFilteredData = () => {
        if (!searchTerm) return mahasiswaList;

        return mahasiswaList.filter((item) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                item.nim?.toLowerCase().includes(searchLower) ||
                item.name?.toLowerCase().includes(searchLower) ||
                item.detail_kelas?.kelas?.toLowerCase().includes(searchLower) ||
                item.detail_kelas?.angkatan?.toString().includes(searchLower) ||
                item.detail_kelas?.dosen_wali
                    ?.toLowerCase()
                    .includes(searchLower)
            );
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
        loading,
        searchTerm,
        currentPage,
        itemsPerPage,

        // Data
        mahasiswaList,
        currentData,
        filteredData,
        totalPages,
        startIndex,
        endIndex,

        // Actions
        setSearchTerm,
        setCurrentPage,
        loadMahasiswaList,
    };
};
