import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mengimpor komponen-komponen yang diperlukan
// Importing necessary components
import KelolaPenggunaTabs from '../../components/compAdmin/kelolaPengguna/kelolaPenggunaTabs';
import KelolaPenggunaTable from '../../components/compAdmin/kelolaPengguna/KelolaPenggunaTable';
import KelolaPenggunaModal from '../../components/compAdmin/kelolaPengguna/KelolaPenggunaModal';
import DeleteConfirmationModal from '../../components/compAdmin/kelolaPengguna/DeleteConfirmationModal';
import BulkImportPopup from '../../components/compAdmin/kelolaPengguna/BulkImportPopup';

// Mengimpor custom hook untuk logika pengelolaan pengguna
// Importing the custom hook for user management logic
import { useKelolaPengguna } from '../../components/compAdmin/kelolaPengguna/hooks/useKelolaPengguna';

/**
 * Komponen halaman untuk mengelola data pengguna (Admin, Dosen Wali, Mahasiswa).
 * Page component for managing user data (Admin, Course Advisor, Student).
 */
const KelolaPenggunaPage = () => {
    // State untuk mengelola visibilitas dan tipe modal form
    // State for managing the visibility and type of the form modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'add' atau 'edit'
    const [currentEditData, setCurrentEditData] = useState(null);

    // State untuk mengelola modal konfirmasi penghapusan
    // State for managing the delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    // State untuk mengelola popup import massal
    // State for managing the bulk import popup
    const [showBulkImportPopup, setShowBulkImportPopup] = useState(false);

    // Menggunakan custom hook untuk mendapatkan state dan fungsi logika
    // Using the custom hook to get state and logic functions
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

    // Handler untuk membuka modal tambah
    // Handler to open the add modal
    const handleAdd = () => {
        setModalType('add');
        setCurrentEditData(null);
        setShowModal(true);
    };

    // Handler untuk membuka modal edit
    // Handler to open the edit modal
    const handleEdit = (data) => {
        setModalType('edit');
        setCurrentEditData(data);
        setShowModal(true);
    };

    // Handler untuk submit form dari modal
    // Handler for form submission from the modal
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

    // Handler untuk membuka modal konfirmasi hapus
    // Handler to open the delete confirmation modal
    const handleDeleteClick = (data) => {
        setDeleteData(data);
        setShowDeleteModal(true);
    };

     // Handler untuk konfirmasi penghapusan
    // Handler for delete confirmation
    const handleConfirmDelete = async () => {
        const id = deleteData?.id || deleteData?.nip || deleteData?.nim;
        const success = await handleDelete(id);

        if (success) {
            setShowDeleteModal(false);
            setDeleteData(null);
        }
    };

    // Handler untuk menutup semua jenis modal
    // Handlers for closing all types of modals
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

    /**
     * Menangani perubahan status (aktif/non-aktif) langsung dari tabel.
     * Handles status changes (active/inactive) directly from the table.
     * @param {object} user - Data pengguna yang statusnya akan diubah.
     * @param {string} newStatus - Status baru ('aktif' atau 'nonaktif').
     */
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
            {/* Header Halaman */}
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Kelola Pengguna
                </h1>
                <p className="text-gray-600">
                    Kelola data admin, dosen wali, dan mahasiswa
                </p>
            </div>

            {/* Komponen Tabs */}
            {/* Tabs Component */}
            <KelolaPenggunaTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            {/* Komponen Tabel Pengguna */}
            {/* User Table Component */}
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

            {/* Komponen Modal Form Pengguna */}
            {/* User Form Modal Component */}
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

            {/* Komponen Modal Konfirmasi Hapus */}
            {/* Delete Confirmation Modal Component */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                data={deleteData}
                loading={loadingAction}
            />

             {/* Komponen Popup Import Massal */}
            {/* Bulk Import Popup Component */}
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
