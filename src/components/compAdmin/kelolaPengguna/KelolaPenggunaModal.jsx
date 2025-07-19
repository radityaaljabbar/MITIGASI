import React, { useState, useEffect } from 'react';

/**
 * Komponen Modal untuk menambah atau mengedit data pengguna (Admin, Dosen, Mahasiswa).
 * Modal component for adding or editing user data (Admin, Dosen, Mahasiswa).
 * @param {object} props - Props komponen.
 * @param {boolean} props.isOpen - Status apakah modal terbuka.
 * @param {function} props.onClose - Fungsi untuk menutup modal.
 * @param {function} props.onSubmit - Fungsi untuk submit form.
 * @param {string} props.activeTab - Tab yang sedang aktif ('admin', 'dosen', 'mahasiswa').
 * @param {string} props.modalType - Tipe modal ('add' atau 'edit').
 * @param {object} props.initialData - Data awal untuk mode edit.
 * @param {Array} props.kelasList - Daftar kelas untuk dropdown mahasiswa.
 * @param {boolean} props.loading - Status loading untuk tombol submit.
 */
const KelolaPenggunaModal = ({
    isOpen,
    onClose,
    onSubmit,
    activeTab,
    modalType,
    initialData,
    kelasList,
    loading,
}) => {
    // State untuk menampung data dari input form
    // State to hold data from the form inputs
    const [formData, setFormData] = useState({
        // Admin fields
        name: '',
        username: '',
        password: '',
        // Dosen fields
        nip: '',
        nama: '',
        kode: '',
        status: 'aktif',
        // Mahasiswa fields
        nim: '',
        kelas: '',
    });

    // Effect untuk mengisi atau mereset form saat modal dibuka atau props berubah
    // Effect to populate or reset the form when the modal opens or props change
    useEffect(() => {
        if (isOpen) {
            if (modalType === 'edit' && initialData) {
                // Mengisi form dengan initialData untuk mode edit
                // Populate the form with initialData for edit mode
                if (activeTab === 'admin') {
                    setFormData({
                        name: initialData.name || '',
                        username: initialData.username || '',
                        password: '', // Password dikosongkan untuk keamanan / Password is cleared for security
                    });
                } else if (activeTab === 'dosen') {
                    setFormData({
                        nip: initialData.nip || '',
                        nama: initialData.nama || '',
                        kode: initialData.kode || '',
                        status: initialData.status || 'aktif',
                        password: '',
                    });
                } else if (activeTab === 'mahasiswa') {
                    setFormData({
                        nim: initialData.nim || '',
                        nama: initialData.nama || '',
                        kelas: initialData.kelas || '',
                        status: initialData.status || 'aktif',
                        password: '',
                    });
                }
            } else {
                // Mereset form untuk mode tambah
                // Reset the form for add mode
                setFormData({
                    name: '',
                    username: '',
                    password: '',
                    nip: '',
                    nama: '',
                    kode: '',
                    status: 'aktif',
                    nim: '',
                    kelas: '',
                });
            }
        }
    }, [isOpen, modalType, initialData, activeTab]);

    /**
     * Menangani perubahan pada input form.
     * Handles changes in the form inputs.
     * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e - Event dari input.
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * Menangani submit form.
     * Handles form submission.
     * @param {React.FormEvent<HTMLFormElement>} e - Event submit form.
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        // Menyiapkan data yang akan dikirim berdasarkan tab aktif
        // Prepare the data to be sent based on the active tab
        let submitData = {};

        if (activeTab === 'admin') {
            submitData = {
                name: formData.name,
                username: formData.username,
            };
            if (formData.password) {
                submitData.password = formData.password;
            }
        } else if (activeTab === 'dosen') {
            submitData = {
                nip: formData.nip,
                nama: formData.nama,
                kode: formData.kode,
                status: formData.status,
            };
            if (formData.password) {
                submitData.password = formData.password;
            }
        } else if (activeTab === 'mahasiswa') {
            submitData = {
                nim: formData.nim,
                nama: formData.nama,
                kelas: formData.kelas,
                status: formData.status,
            };
            if (formData.password) {
                submitData.password = formData.password;
            }
        }

        // Mendapatkan ID untuk mode update
        // Get the ID for update mode
        const id =
            modalType === 'edit'
                ? initialData?.id || initialData?.nip || initialData?.nim
                : null;

        onSubmit(submitData, id);
    };

    /**
     * Mendapatkan judul modal secara dinamis.
     * Gets the modal title dynamically.
     * @returns {string} - Judul modal.
     */
    const getModalTitle = () => {
        const action = modalType === 'add' ? 'Tambah' : 'Edit';
        const type =
            activeTab === 'admin'
                ? 'Admin'
                : activeTab === 'dosen'
                ? 'Dosen Wali'
                : 'Mahasiswa';
        return `${action} ${type}`;
    };

    /**
     * Mendapatkan warna tombol submit berdasarkan tab aktif.
     * Gets the submit button color based on the active tab.
     * @returns {string} - Kelas Tailwind CSS untuk warna tombol.
     */
    const getButtonColor = () => {
        switch (activeTab) {
            case 'admin':
                return 'bg-green-500 hover:bg-green-600';
            case 'dosen':
                return 'bg-red-500 hover:bg-red-600';
            case 'mahasiswa':
                return 'bg-blue-500 hover:bg-blue-600';
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    if (!isOpen) return null;

    return (
        // Latar belakang modal
        // Modal backdrop
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Konten modal */}
            {/* Modal content */}
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header modal */}
                {/* Modal header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {getModalTitle()}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form Fields untuk Admin */}
                    {/* Admin Form Fields */}
                    {activeTab === 'admin' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password{' '}
                                    {modalType === 'add' && (
                                        <span className="text-red-500">*</span>
                                    )}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={modalType === 'add'}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {modalType === 'edit' && (
                                    <small className="text-gray-500">
                                        Kosongkan jika tidak ingin mengubah
                                        password
                                    </small>
                                )}
                            </div>
                        </>
                    )}

                    {/* Form Fields untuk Dosen */}
                    {/* Dosen Form Fields */}
                    {activeTab === 'dosen' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    NIP <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nip"
                                    value={formData.nip}
                                    onChange={handleInputChange}
                                    required
                                    disabled={modalType === 'edit'}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                                {modalType === 'edit' && (
                                    <small className="text-gray-500">
                                        NIP tidak dapat diubah
                                    </small>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kode Dosen{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="kode"
                                    value={formData.kode}
                                    onChange={handleInputChange}
                                    required
                                    maxLength="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <small className="text-gray-500">
                                    Maksimal 3 karakter
                                </small>
                            </div>
                            
                            {modalType === 'add' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="aktif">Aktif</option>
                                        <option value="non-aktif">Non-Aktif</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <small className="text-gray-500">
                                    {modalType === 'add'
                                        ? 'Kosongkan untuk menggunakan NIP sebagai password default'
                                        : 'Kosongkan jika tidak ingin mengubah password'}
                                </small>
                            </div>
                        </>
                    )}

                    {/* Form Fields untuk Mahasiswa */}
                    {/* Mahasiswa Form Fields */}
                    {activeTab === 'mahasiswa' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    NIM <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nim"
                                    value={formData.nim}
                                    onChange={handleInputChange}
                                    required
                                    disabled={modalType === 'edit'}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                                {modalType === 'edit' && (
                                    <small className="text-gray-500">
                                        NIM tidak dapat diubah
                                    </small>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kelas{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="kelas"
                                    value={formData.kelas}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Pilih Kelas</option>
                                    {kelasList.map((kelas) => (
                                        <option
                                            key={kelas.id_kelas}
                                            value={kelas.kode_kelas}>
                                            {kelas.kode_kelas}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {modalType === 'add' && (            
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="aktif">Aktif</option>
                                        <option value="non-aktif">Non-Aktif</option>
                                    </select>
                                </div>
                            )}        

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <small className="text-gray-500">
                                    {modalType === 'add'
                                        ? 'Kosongkan untuk menggunakan NIM sebagai password default'
                                        : 'Kosongkan jika tidak ingin mengubah password'}
                                </small>
                            </div>
                        </>
                    )}

                    {/* Tombol Aksi Form (Batal & Simpan) */}
                    {/* Form Action Buttons (Cancel & Save) */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50">
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 ${getButtonColor()}`}>
                            {loading ? (
                                // Tampilan loading
                                // Loading state
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                    Menyimpan...
                                </div>
                            ) : (
                                'Simpan'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KelolaPenggunaModal;