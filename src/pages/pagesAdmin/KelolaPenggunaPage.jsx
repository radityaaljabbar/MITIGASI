import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import komponen
import KelolaPenggunaTabs from '../../components/compAdmin/kelolaPengguna/kelolaPenggunaTabs';
import KelolaPenggunaTable from '../../components/compAdmin/kelolaPengguna/KelolaPenggunaTable';
import KelolaPenggunaModal from '../../components/compAdmin/kelolaPengguna/KelolaPenggunaModal';
import DeleteConfirmationModal from '../../components/compAdmin/kelolaPengguna/DeleteConfirmationModal';
import BulkImportPopup from '../../components/compAdmin/kelolaPengguna/BulkImportPopup';

// Import custom hook
import { useKelolaPengguna } from '../../components/compAdmin/kelolaPengguna/hooks/useKelolaPengguna';

const KelolaPenggunaPage = () => {
    // State untuk modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'add' atau 'edit'
    const [currentEditData, setCurrentEditData] = useState(null);

    // State untuk konfirmasi delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    // State untuk bulk import popup
    const [showBulkImportPopup, setShowBulkImportPopup] = useState(false);

    // Custom hook untuk logic
    const {
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
    } = useKelolaPengguna();

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
        const id = deleteData?.id || deleteData?.nip || deleteData?.nim;
        const success = await handleDelete(id);

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

    // Handle bulk import
    const handleBulkImportClick = () => {
        setShowBulkImportPopup(true);
    };

    const handleCloseBulkImportPopup = () => {
        setShowBulkImportPopup(false);
    };

    // Handle toggle status aktif/nonaktif langsung dari tabel
    const handleStatusChange = async (user, newStatus) => {
        const updatedUser = { ...user, status: newStatus };
        const id = user.id || user.nip || user.nim;

        const success = await handleUpdate(id, updatedUser);

        if (success) {
            toast.success('Status berhasil diperbarui.');
        } else {
            toast.error('Gagal memperbarui status.');
        }
    };

    return (
        <div className="p-6 bg-[#FAF0E6] min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Kelola Pengguna
                </h1>
                <p className="text-gray-600">
                    Kelola data admin, dosen wali, dan mahasiswa
                </p>
            </div>

            {/* Tabs */}
            <KelolaPenggunaTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            {/* Table */}
            <KelolaPenggunaTable
                activeTab={activeTab}
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
                onStatusChange={handleStatusChange}
                onBulkImport={handleBulkImportClick}
            />

            {/* Modal Form */}
            <KelolaPenggunaModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSubmit={handleModalSubmit}
                activeTab={activeTab}
                modalType={modalType}
                initialData={currentEditData}
                kelasList={kelasList}
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

            {/* Bulk Import Popup */}
            <BulkImportPopup
                isOpen={showBulkImportPopup}
                onClose={handleCloseBulkImportPopup}
                onImport={handleBulkImport}
                loading={bulkImporting}
            />
        </div>
    );
};

export default KelolaPenggunaPage;
