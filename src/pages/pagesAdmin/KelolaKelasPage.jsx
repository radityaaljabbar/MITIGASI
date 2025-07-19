import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mengimpor komponen-komponen yang dibutuhkan
// Importing necessary components
import KelolaKelasTable from '../../components/compAdmin/kelolaKelas/KelolaKelasTable';
import KelolaKelasPopUp from '../../components/compAdmin/kelolaKelas/KelolaKelasPopUp';
import DeleteConfirmationModal from '../../components/compAdmin/kelolaPengguna/DeleteConfirmationModal';

// Mengimpor custom hook untuk logika pengelolaan kelas
// Importing the custom hook for class management logic
import { useKelolaKelas } from '../../components/compAdmin/kelolaKelas/hooks/useKelolaKelas';

/**
 * Komponen halaman untuk mengelola data kelas dan penugasan dosen wali.
 * Page component for managing class data and course advisor assignments.
 */
const KelolaKelasPage = () => {
    // State untuk mengelola visibilitas dan tipe modal form
    // State for managing the visibility and type of the form modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'add' atau 'edit'
    const [currentEditData, setCurrentEditData] = useState(null);

    // State untuk mengelola modal konfirmasi penghapusan
    // State for managing the delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    // Menggunakan custom hook untuk mendapatkan state dan fungsi-fungsi logika
    // Using the custom hook to get state and logic functions
    const {
        // State
        loading,
        loadingAction,
        searchTerm,
        currentPage,
        itemsPerPage,

        // Data
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
        getDosenNameByCode,
    } = useKelolaKelas();

    /**
     * Menangani aksi klik tombol "Tambah Data".
     * Handles the "Add Data" button click action.
     */
    const handleAdd = () => {
        setModalType('add');
        setCurrentEditData(null);
        setShowModal(true);
    };

    /**
     * Menangani aksi klik tombol "Edit".
     * Handles the "Edit" button click action.
     * @param {object} data - Data kelas yang akan diedit.
     */
    const handleEdit = (data) => {
        setModalType('edit');
        setCurrentEditData(data);
        setShowModal(true);
    };

    /**
     * Menangani submit form dari modal (baik tambah maupun edit).
     * Handles form submission from the modal (both add and edit).
     * @param {object} formData - Data dari form.
     * @param {string|number} id - ID data (untuk mode edit).
     */
    const handleModalSubmit = async (formData, id) => {
        let success = false;

        if (modalType === 'add') {
            success = await handleCreate(formData);
        } else if (modalType === 'edit') {
            success = await handleUpdate(id, formData);
        }

        if (success) {
            setShowModal(false);
            setCurrentEditData(null);
        }
    };

    /**
     * Menangani aksi klik tombol "Hapus", membuka modal konfirmasi.
     * Handles the "Delete" button click action, opening the confirmation modal.
     * @param {object} data - Data yang akan dihapus.
     */
    const handleDeleteClick = (data) => {
        setDeleteData(data);
        setShowDeleteModal(true);
    };

    /**
     * Menangani konfirmasi penghapusan data.
     * Handles the confirmation of data deletion.
     */
    const handleConfirmDelete = async () => {
        const success = await handleDelete(deleteData.id_kelas);

        if (success) {
            setShowDeleteModal(false);
            setDeleteData(null);
        }
    };

    // Fungsi-fungsi untuk menutup modal
    // Functions for closing modals
    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentEditData(null);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteData(null);
    };

    return (
        <div className="p-6 bg-[#FAF0E6] min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Kelola Kelas
                </h1>
                <p className="text-gray-600">
                    Kelola data kelas dan penugasan dosen wali
                </p>
            </div>

            {/* Table */}
            <KelolaKelasTable
                currentData={currentData}
                filteredData={filteredData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                itemsPerPage={itemsPerPage}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onAdd={handleAdd}
                getDosenNameByCode={getDosenNameByCode}
            />

            {/* Modal Form */}
            <KelolaKelasPopUp
                isOpen={showModal}
                onClose={handleCloseModal}
                onSubmit={handleModalSubmit}
                modalType={modalType}
                initialData={currentEditData}
                dosenList={dosenList}
                loading={loadingAction}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                data={deleteData}
                loading={loadingAction}
            />
        </div>
    );
};

export default KelolaKelasPage;
