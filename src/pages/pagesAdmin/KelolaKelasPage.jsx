import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import komponen
import KelolaKelasTable from '../../components/compAdmin/kelolaKelas/KelolaKelasTable';
import KelolaKelasPopUp from '../../components/compAdmin/kelolaKelas/KelolaKelasPopUp';
import DeleteConfirmationModal from '../../components/compAdmin/kelolaPengguna/DeleteConfirmationModal';

// Import custom hook
import { useKelolaKelas } from '../../components/compAdmin/kelolaKelas/hooks/useKelolaKelas';

const KelolaKelasPage = () => {
    // State untuk modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'add' atau 'edit'
    const [currentEditData, setCurrentEditData] = useState(null);

    // State untuk konfirmasi delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    // Custom hook untuk logic
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

    // Handle tambah data
    const handleAdd = () => {
        setModalType('add');
        setCurrentEditData(null);
        setShowModal(true);
    };

    // Handle edit data
    const handleEdit = (data) => {
        setModalType('edit');
        setCurrentEditData(data);
        setShowModal(true);
    };

    // Handle submit form modal
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

    // Handle confirm delete
    const handleDeleteClick = (data) => {
        setDeleteData(data);
        setShowDeleteModal(true);
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        const success = await handleDelete(deleteData.id_kelas);

        if (success) {
            setShowDeleteModal(false);
            setDeleteData(null);
        }
    };

    // Handle close modals
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
