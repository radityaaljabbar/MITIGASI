import { useState, useEffect } from 'react';
import {
    getAllKurikulum,
    getMataKuliahByKurikulum,
    getMataKuliahById,
    createNewMataKuliah,
    updateMataKuliah,
    deleteMataKuliah,
    getEkuivalensiOptions,
    getAllKelompokKeahlian,
} from '../../../../services/adminServices/kelolaKurikulumServices';
import { toast } from 'react-toastify';

/**
 * Custom hook `useKelolaKurikulum`
 * @desc
 *   Mengelola semua logika, state, dan interaksi API untuk halaman Kelola Kurikulum.
 *   Manages all logic, state, and API interactions for the Manage Curriculum page.
 * @returns {object}
 *   State dan fungsi yang diperlukan oleh komponen UI.
 *   An object containing state and functions needed by the UI component.
 */
const useKelolaKurikulum = () => {
    // State untuk menampung data
    // State untuk menyimpan data yang diambil dari API.
    // State to store data fetched from the API.
    const [kurikulumList, setKurikulumList] = useState([]);
    const [selectedKurikulum, setSelectedKurikulum] = useState('');
    const [mataKuliahList, setMataKuliahList] = useState([]);
    const [ekuivalensiOptions, setEkuivalensiOptions] = useState([]);
    const [kelompokKeahlianList, setKelompokKeahlianList] = useState([]);

    // State untuk fungsionalitas pencarian dan filter
    // State untuk mengelola input pencarian dan filter dari pengguna.
    // State to manage search and filter inputs from the user.
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [filterJenisMk, setFilterJenisMk] = useState('');

    // State untuk mengelola modal (tambah/edit/hapus)
    // State untuk mengontrol visibilitas dan mode modal.
    // State to control the visibility and mode of modals.
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedMataKuliah, setSelectedMataKuliah] = useState(null);
    const [mataKuliahToDelete, setMataKuliahToDelete] = useState(null);

    // State untuk mengelola status loading pada berbagai aksi
    // State untuk menunjukkan status loading pada berbagai proses asynchronous.
    // State to indicate loading status for various asynchronous processes.
    const [loading, setLoading] = useState({
        kurikulum: false,
        mataKuliah: false,
        submit: false,
        delete: false,
        ekuivalensi: false,
        kelompokKeahlian: false,
    });

    // Effect ini berjalan sekali saat hook pertama kali digunakan.
    // This effect runs once when the hook is first used.
    useEffect(() => {
        fetchKurikulumList();
        fetchKelompokKeahlianList();
    }, []);

    // Effect ini berjalan setiap kali kurikulum yang dipilih berubah.
    // This effect runs whenever the selected curriculum changes.
    useEffect(() => {
        if (selectedKurikulum) {
            fetchMataKuliahList(selectedKurikulum);
            fetchEkuivalensiOptions(selectedKurikulum);
        }
    }, [selectedKurikulum]);

    /**
     * @desc
     *   Mengambil daftar semua tahun kurikulum dari API.
     *   Fetches the list of all curriculum years from the API.
     */
    const fetchKurikulumList = async () => {
        setLoading((prev) => ({ ...prev, kurikulum: true }));
        try {
            const response = await getAllKurikulum();
            if (response.success) {
                setKurikulumList(response.data);
                // Atur kurikulum pertama sebagai default jika ada.
                // Set the first curriculum as the default if it exists.
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

    /**
     * @desc
     *   Mengambil daftar mata kuliah berdasarkan tahun kurikulum yang dipilih.
     *   Fetches the list of courses based on the selected curriculum year.
     */
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

    /**
     * @desc
     *   Mengambil daftar semua kelompok keahlian yang ada.
     *   Fetches the list of all existing expertise groups.
     */
    const fetchKelompokKeahlianList = async () => {
        setLoading((prev) => ({ ...prev, kelompokKeahlian: true }));
        try {
            const response = await getAllKelompokKeahlian();
            if (response.success) {
                setKelompokKeahlianList(response.data);
            }
            // Tidak perlu notifikasi error jika gagal, karena ini data opsional.
            // No error notification is needed on failure, as this is optional data.
        } catch (error) {
            console.error('Gagal mengambil data kelompok keahlian', error);
        } finally {
            setLoading((prev) => ({ ...prev, kelompokKeahlian: false }));
        }
    };

    /**
     * @desc
     *   Mengambil opsi mata kuliah untuk ekuivalensi berdasarkan kurikulum.
     *   Fetches course options for equivalency based on the curriculum.
     */
    const fetchEkuivalensiOptions = async (kurikulum) => {
        setLoading((prev) => ({ ...prev, ekuivalensi: true }));
        try {
            const response = await getEkuivalensiOptions(kurikulum);
            if (response.success) {
                setEkuivalensiOptions(response.data);
            }
        } catch (error) {
            console.error('Error fetching ekuivalensi options:', error);
        } finally {
            setLoading((prev) => ({ ...prev, ekuivalensi: false }));
        }
    };

    /**
     * @desc
     *   Membuka modal dalam mode 'tambah'.
     *   Opens the modal in 'add' mode.
     */
    const handleOpenAddModal = () => {
        setModalMode('add');
        setSelectedMataKuliah(null);
        setIsModalOpen(true);
    };

    /**
     * @desc
     *   Membuka modal dalam mode 'edit' dengan data mata kuliah yang dipilih.
     *   Opens the modal in 'edit' mode with the selected course data.
     */
    const handleOpenEditModal = async (mataKuliah) => {
        setModalMode('edit');
        setSelectedMataKuliah(mataKuliah);
        setIsModalOpen(true);
        // Ambil opsi ekuivalensi yang relevan untuk mata kuliah yang akan diedit.
        // Fetch relevant equivalency options for the course being edited.
        if (mataKuliah.kurikulum) {
            await fetchEkuivalensiOptions(mataKuliah.kurikulum);
        }
    };

    /**
     * @desc
     *   Menutup modal utama (tambah/edit).
     *   Closes the main modal (add/edit).
     */
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMataKuliah(null);
    };

    /**
     * @desc
     *   Menangani perubahan pilihan kurikulum di UI.
     *   Handles the curriculum selection change in the UI.
     */
    const handleKurikulumChange = (newKurikulum) => {
        setSelectedKurikulum(newKurikulum);
        // Reset filter untuk pengalaman pengguna yang lebih baik.
        // Reset filters for a better user experience.
        setSearchTerm('');
        setFilterSemester('');
        setFilterJenisMk('');
    };

    /**
     * @desc
     *   Menangani submit form (baik tambah maupun edit).
     *   Handles form submission (for both add and edit).
     */
    const handleSubmit = async (formData) => {
        // Pastikan kelompok_keahlian dikirim sebagai null jika kosong untuk konsistensi database.
        // Ensure kelompok_keahlian is sent as null if empty for database consistency.
        const payload = {
            ...formData,
            kelompok_keahlian: formData.kelompok_keahlian || null,
        };

        setLoading((prev) => ({ ...prev, submit: true }));
        try {
            let response;
            if (modalMode === 'add') {
                response = await createNewMataKuliah(payload);
            } else {
                response = await updateMataKuliah(
                    selectedMataKuliah.id_mk,
                    payload
                );
            }

            if (response.success) {
                toast.success(
                    response.message || 'Aksi berhasil dilakukan'
                );
                handleCloseModal();
                // Muat ulang data yang relevan untuk menampilkan perubahan.
                // Reload relevant data to reflect the changes.
                fetchMataKuliahList(selectedKurikulum);
                if (
                    modalMode === 'add' &&
                    !kurikulumList.includes(formData.kurikulum)
                ) {
                    fetchKurikulumList();
                }
                if (!kelompokKeahlianList.find(kk => kk.nama_kk === payload.kelompok_keahlian)) {
                    fetchKelompokKeahlianList();
                }
            } else {
                toast.error(
                    response.message || 'Gagal melakukan aksi'
                );
            }
        } catch (error) {
            toast.error('Terjadi kesalahan pada server');
        } finally {
            setLoading((prev) => ({ ...prev, submit: false }));
        }
    };

    /**
     * @desc
     *   Membuka modal konfirmasi untuk penghapusan.
     *   Opens the confirmation modal for deletion.
     */
    const handleOpenDeleteModal = (mataKuliah) => {
        setMataKuliahToDelete(mataKuliah);
        setIsDeleteModalOpen(true);
    };

    /**
     * @desc
     *   Menutup modal konfirmasi penghapusan.
     *   Closes the delete confirmation modal.
     */
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setMataKuliahToDelete(null);
    };

    /**
     * @desc
     *   Mengeksekusi penghapusan mata kuliah.
     *   Executes the course deletion.
     */
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
                fetchMataKuliahList(selectedKurikulum); // Muat ulang data. / Reload data.
            } else {
                toast.error(response.message || 'Gagal menghapus mata kuliah');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat menghapus mata kuliah');
        } finally {
            setLoading((prev) => ({ ...prev, delete: false }));
        }
    };

    // Logika untuk memfilter daftar mata kuliah berdasarkan input pengguna.
    // Logic to filter the course list based on user input.
    const filteredMataKuliah = mataKuliahList.filter((mk) => {
        const searchMatch =
            searchTerm === '' ||
            mk.kode_mk.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mk.nama_mk.toLowerCase().includes(searchTerm.toLowerCase());

        const semesterMatch =
            filterSemester === '' || mk.semester.toString() === filterSemester;

        const jenisMkMatch =
            filterJenisMk === '' || mk.jenis_mk === filterJenisMk;

        return searchMatch && semesterMatch && jenisMkMatch;
    });

    return {
        // Data
        kurikulumList,
        selectedKurikulum,
        setSelectedKurikulum: handleKurikulumChange,
        mataKuliahList,
        filteredMataKuliah,
        ekuivalensiOptions,
        kelompokKeahlianList,

        // Search and Filter
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
        fetchEkuivalensiOptions,
    };
};

export default useKelolaKurikulum;