import { useState, useEffect } from 'react';
import {
    getAllKurikulum,
    getMataKuliahByKurikulum,
    getMataKuliahById,
    createNewMataKuliah,
    updateMataKuliah,
    deleteMataKuliah,
    getEkuivalensiOptions,
} from '../../../../services/adminServices/kelolaKurikulumServices';
import { toast } from 'react-toastify';

const useKelolaKurikulum = () => {
    // State untuk data
    const [kurikulumList, setKurikulumList] = useState([]);
    const [selectedKurikulum, setSelectedKurikulum] = useState('');
    const [mataKuliahList, setMataKuliahList] = useState([]);
    const [ekuivalensiOptions, setEkuivalensiOptions] = useState([]);

    // State untuk search dan filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [filterJenisMk, setFilterJenisMk] = useState('');

    // State untuk modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' atau 'edit'
    const [selectedMataKuliah, setSelectedMataKuliah] = useState(null);
    const [mataKuliahToDelete, setMataKuliahToDelete] = useState(null);

    // State untuk loading
    const [loading, setLoading] = useState({
        kurikulum: false,
        mataKuliah: false,
        submit: false,
        delete: false,
        ekuivalensi: false,
    });

    // Fetch daftar kurikulum saat component mount
    useEffect(() => {
        fetchKurikulumList();
    }, []);

    // Fetch mata kuliah ketika kurikulum dipilih
    useEffect(() => {
        if (selectedKurikulum) {
            fetchMataKuliahList(selectedKurikulum);
        }
    }, [selectedKurikulum]);

    // Fetch ekuivalensi options saat component mount
    useEffect(() => {
        fetchEkuivalensiOptions();
    }, []);

    // Fungsi fetch kurikulum
    const fetchKurikulumList = async () => {
        setLoading((prev) => ({ ...prev, kurikulum: true }));
        try {
            const response = await getAllKurikulum();
            if (response.success) {
                setKurikulumList(response.data);
                // Set kurikulum pertama sebagai default
                if (response.data.length > 0) {
                    setSelectedKurikulum(response.data[0]);
                }
            } else {
                toast.error(
                    response.message || 'Gagal mengambil data kurikulum'
                );
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat mengambil data kurikulum');
        } finally {
            setLoading((prev) => ({ ...prev, kurikulum: false }));
        }
    };

    // Fungsi fetch mata kuliah
    const fetchMataKuliahList = async (kurikulum) => {
        setLoading((prev) => ({ ...prev, mataKuliah: true }));
        try {
            const response = await getMataKuliahByKurikulum(kurikulum);
            if (response.success) {
                setMataKuliahList(response.data);
            } else {
                toast.error(
                    response.message || 'Gagal mengambil data mata kuliah'
                );
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat mengambil data mata kuliah');
        } finally {
            setLoading((prev) => ({ ...prev, mataKuliah: false }));
        }
    };

    // Fungsi fetch ekuivalensi options
    const fetchEkuivalensiOptions = async () => {
        setLoading((prev) => ({ ...prev, ekuivalensi: true }));
        try {
            const response = await getEkuivalensiOptions();
            if (response.success) {
                setEkuivalensiOptions(response.data);
            }
        } catch (error) {
            console.error('Error fetching ekuivalensi options:', error);
        } finally {
            setLoading((prev) => ({ ...prev, ekuivalensi: false }));
        }
    };

    // Fungsi buka modal tambah
    const handleOpenAddModal = () => {
        setModalMode('add');
        setSelectedMataKuliah(null);
        setIsModalOpen(true);
    };

    // Fungsi buka modal edit
    const handleOpenEditModal = async (mataKuliah) => {
        setModalMode('edit');
        setSelectedMataKuliah(mataKuliah);
        setIsModalOpen(true);
    };

    // Fungsi tutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMataKuliah(null);
    };

    // Fungsi submit form (tambah/edit)
    const handleSubmit = async (formData) => {
        setLoading((prev) => ({ ...prev, submit: true }));
        try {
            let response;
            if (modalMode === 'add') {
                response = await createNewMataKuliah(formData);
            } else {
                response = await updateMataKuliah(
                    selectedMataKuliah.id_mk,
                    formData
                );
            }

            if (response.success) {
                toast.success(
                    response.message ||
                        `Mata kuliah berhasil ${
                            modalMode === 'add' ? 'ditambahkan' : 'diperbarui'
                        }`
                );
                handleCloseModal();
                // Refresh data
                fetchMataKuliahList(selectedKurikulum);
                // Refresh kurikulum list jika ada kurikulum baru
                if (
                    modalMode === 'add' &&
                    !kurikulumList.includes(formData.kurikulum)
                ) {
                    fetchKurikulumList();
                }
            } else {
                toast.error(
                    response.message ||
                        `Gagal ${
                            modalMode === 'add' ? 'menambahkan' : 'memperbarui'
                        } mata kuliah`
                );
            }
        } catch (error) {
            toast.error(
                `Terjadi kesalahan saat ${
                    modalMode === 'add' ? 'menambahkan' : 'memperbarui'
                } mata kuliah`
            );
        } finally {
            setLoading((prev) => ({ ...prev, submit: false }));
        }
    };

    // Fungsi buka modal konfirmasi hapus
    const handleOpenDeleteModal = (mataKuliah) => {
        setMataKuliahToDelete(mataKuliah);
        setIsDeleteModalOpen(true);
    };

    // Fungsi tutup modal konfirmasi hapus
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setMataKuliahToDelete(null);
    };

    // Fungsi hapus mata kuliah
    const handleDelete = async () => {
        if (!mataKuliahToDelete) return;

        setLoading((prev) => ({ ...prev, delete: true }));
        try {
            const response = await deleteMataKuliah(mataKuliahToDelete.id_mk);
            if (response.success) {
                toast.success(
                    response.message || 'Mata kuliah berhasil dihapus'
                );
                handleCloseDeleteModal();
                // Refresh data
                fetchMataKuliahList(selectedKurikulum);
            } else {
                toast.error(response.message || 'Gagal menghapus mata kuliah');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat menghapus mata kuliah');
        } finally {
            setLoading((prev) => ({ ...prev, delete: false }));
        }
    };

    // Filter mata kuliah berdasarkan search dan filter
    const filteredMataKuliah = mataKuliahList.filter((mk) => {
        // Search filter
        const searchMatch =
            searchTerm === '' ||
            mk.kode_mk.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mk.nama_mk.toLowerCase().includes(searchTerm.toLowerCase());

        // Semester filter
        const semesterMatch =
            filterSemester === '' || mk.semester.toString() === filterSemester;

        // Jenis MK filter
        const jenisMkMatch =
            filterJenisMk === '' || mk.jenis_mk === filterJenisMk;

        return searchMatch && semesterMatch && jenisMkMatch;
    });

    return {
        // Data
        kurikulumList,
        selectedKurikulum,
        setSelectedKurikulum,
        mataKuliahList,
        filteredMataKuliah,
        ekuivalensiOptions,

        // Search dan Filter
        searchTerm,
        setSearchTerm,
        filterSemester,
        setFilterSemester,
        filterJenisMk,
        setFilterJenisMk,

        // Modal state
        isModalOpen,
        isDeleteModalOpen,
        modalMode,
        selectedMataKuliah,
        mataKuliahToDelete,

        // Loading state
        loading,

        // Functions
        handleOpenAddModal,
        handleOpenEditModal,
        handleCloseModal,
        handleSubmit,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleDelete,
    };
};

export default useKelolaKurikulum;
