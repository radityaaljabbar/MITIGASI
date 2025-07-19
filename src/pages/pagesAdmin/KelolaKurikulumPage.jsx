import React from 'react';

// Mengimpor komponen-komponen yang diperlukan
// Importing necessary components
import KelolaKurikulumTable from '../../components/compAdmin/kelolaKurikulum/KelolaKurikulumTable';
import KelolaKurikulumModal from '../../components/compAdmin/kelolaKurikulum/KelolaKurikulumModal';
import DeleteConfirmationModal from '../../components/compAdmin/kelolaPengguna/DeleteConfirmationModal';

// Mengimpor custom hook untuk logika pengelolaan kurikulum
// Importing the custom hook for curriculum management logic
import useKelolaKurikulum from '../../components/compAdmin/kelolaKurikulum/hooks/useKelolaKurikulum';

/**
 * Komponen halaman untuk mengelola data kurikulum dan mata kuliah.
 * Page component for managing curriculum and course data.
 */
const KelolaKurikulumPage = () => {
    // Mendestrukturisasi state dan fungsi dari custom hook
    // Destructuring state and functions from the custom hook
    const {
        // Data
        kurikulumList,
        selectedKurikulum,
        setSelectedKurikulum,
        mataKuliahList,
        filteredMataKuliah,
        ekuivalensiOptions,
        kelompokKeahlianList,

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
    } = useKelolaKurikulum();

    return (
        <div className="p-6 bg-[#FAF0E6] min-h-screen">
            {/* Header Halaman */}
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Kelola Kurikulum
                </h1>
                <p className="text-gray-600">
                    Kelola data mata kuliah dan kurikulum
                </p>
            </div>

            {/* Toolbar untuk Filter dan Aksi */}
            {/* Toolbar for Filters and Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="space-y-4">
                    {/* Baris pertama: Filter kurikulum dan tombol tambah */}
                    {/* First row: Curriculum filter and add button */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <i className="fas fa-filter text-gray-500"></i>
                                <label
                                    htmlFor="kurikulum-filter"
                                    className="text-sm font-medium text-gray-700">
                                    Pilih Kurikulum:
                                </label>
                            </div>
                            {loading.kurikulum ? (
                                <div className="w-64 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                            ) : (
                                <select
                                    id="kurikulum-filter"
                                    value={selectedKurikulum}
                                    onChange={(e) =>
                                        setSelectedKurikulum(e.target.value)
                                    }
                                    className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a085] focus:border-[#16a085] bg-white">
                                    {kurikulumList.map((kurikulum) => (
                                        <option
                                            key={kurikulum}
                                            value={kurikulum}>
                                            Kurikulum {kurikulum}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <button
                            onClick={handleOpenAddModal}
                            className="inline-flex items-center px-4 py-2 bg-[#16a085] hover:bg-[#16a085]/90 text-white font-medium rounded-lg shadow-sm transition-colors">
                            <i className="fas fa-plus mr-2"></i>
                            Tambah Mata Kuliah
                        </button>
                    </div>

                    {/* Baris kedua: Pencarian dan filter tambahan */}
                    {/* Second row: Search and additional filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari kode atau nama mata kuliah..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a085] focus:border-[#16a085]"
                            />
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        </div>

                        {/* Filter Semester */}
                        <div>
                            <select
                                value={filterSemester}
                                onChange={(e) =>
                                    setFilterSemester(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a085] focus:border-[#16a085] bg-white">
                                <option value="">Semua Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                    <option key={sem} value={sem}>
                                        Semester {sem}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter Jenis MK */}
                        <div>
                            <select
                                value={filterJenisMk}
                                onChange={(e) =>
                                    setFilterJenisMk(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a085] focus:border-[#16a085] bg-white">
                                <option value="">Semua Jenis</option>
                                <option value="WAJIB PRODI">Wajib Prodi</option>
                                <option value="PILIHAN">Pilihan</option>
                            </select>
                        </div>
                    </div>

                    {/* Informasi jumlah data dan tombol reset filter */}
                    {/* Data count info and reset filter button */}
                    {!loading.mataKuliah && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Menampilkan {filteredMataKuliah.length} dari{' '}
                                {mataKuliahList.length} mata kuliah
                            </div>
                            {(searchTerm ||
                                filterSemester ||
                                filterJenisMk) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterSemester('');
                                        setFilterJenisMk('');
                                    }}
                                    className="text-sm text-[#16a085] hover:text-[#16a085]/80 font-medium">
                                    <i className="fas fa-times-circle mr-1"></i>
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Komponen Tabel Mata Kuliah */}
            {/* Course Table Component */}
            <KelolaKurikulumTable
                mataKuliahList={filteredMataKuliah}
                loading={loading.mataKuliah}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
            />

            {/* Komponen Modal Form Mata Kuliah */}
            {/* Course Form Modal Component */}
            <KelolaKurikulumModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                mode={modalMode}
                selectedMataKuliah={selectedMataKuliah}
                selectedKurikulum={selectedKurikulum}
                ekuivalensiOptions={ekuivalensiOptions}
                loading={loading.submit}
                kelompokKeahlianList={kelompokKeahlianList}
            />

            {/* Komponen Modal Konfirmasi Hapus */}
            {/* Delete Confirmation Modal Component */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDelete}
                data={{
                    nama: mataKuliahToDelete
                        ? `${mataKuliahToDelete.nama_mk} (${mataKuliahToDelete.kode_mk})`
                        : '',
                }}
                loading={loading.delete}
            />
        </div>
    );
};

export default KelolaKurikulumPage;
