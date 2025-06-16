import React, { useState, useEffect } from 'react';

const KelolaKelasPopUp = ({
    isOpen,
    onClose,
    onSubmit,
    modalType,
    initialData,
    dosenList,
    loading,
}) => {
    const [formData, setFormData] = useState({
        tahun_angkatan: '',
        kode_kelas: '',
        kode_dosen: '',
    });

    // Reset form ketika modal dibuka/ditutup atau data berubah
    useEffect(() => {
        if (isOpen) {
            if (modalType === 'edit' && initialData) {
                setFormData({
                    tahun_angkatan: initialData.tahun_angkatan || '',
                    kode_kelas: initialData.kode_kelas || '',
                    kode_dosen: initialData.kode_dosen || '',
                });
            } else {
                // Reset untuk add mode
                setFormData({
                    tahun_angkatan: '',
                    kode_kelas: '',
                    kode_dosen: '',
                });
            }
        }
    }, [isOpen, modalType, initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (modalType === 'add') {
            if (!formData.tahun_angkatan || !formData.kode_kelas) {
                return;
            }
        }

        const submitData = {
            tahun_angkatan: formData.tahun_angkatan,
            kode_kelas: formData.kode_kelas,
            kode_dosen: formData.kode_dosen || null,
        };

        // Get ID untuk update
        const id = modalType === 'edit' ? initialData?.id_kelas : null;

        onSubmit(submitData, id);
    };

    const getModalTitle = () => {
        return modalType === 'add'
            ? 'Tambah Kelas Baru'
            : 'Edit Dosen Wali untuk Kelas';
    };

    const isReadonly = modalType === 'edit';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
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
                    {/* Tahun Angkatan */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tahun Angkatan{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="tahun_angkatan"
                            value={formData.tahun_angkatan}
                            onChange={handleInputChange}
                            required={modalType === 'add'}
                            readOnly={isReadonly}
                            placeholder="Contoh: 2024"
                            min="2020"
                            max="2030"
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isReadonly
                                    ? 'bg-gray-100 cursor-not-allowed'
                                    : ''
                            }`}
                        />
                        {isReadonly && (
                            <small className="text-gray-500">
                                Tahun angkatan tidak dapat diubah
                            </small>
                        )}
                    </div>

                    {/* Kode Kelas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kode Kelas <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="kode_kelas"
                            value={formData.kode_kelas}
                            onChange={handleInputChange}
                            required={modalType === 'add'}
                            readOnly={isReadonly}
                            placeholder="Contoh: TK-48-01"
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isReadonly
                                    ? 'bg-gray-100 cursor-not-allowed'
                                    : ''
                            }`}
                        />
                        {isReadonly && (
                            <small className="text-gray-500">
                                Kode kelas tidak dapat diubah
                            </small>
                        )}
                        {modalType === 'add' && (
                            <small className="text-gray-500">
                                Format: TK-[tahun]-[nomor urut]
                            </small>
                        )}
                    </div>

                    {/* Dosen Wali */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dosen Wali
                        </label>
                        <select
                            name="kode_dosen"
                            value={formData.kode_dosen}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">-- Belum Ditentukan --</option>
                            {dosenList
                                .filter((dosen) => dosen.status === 'aktif')
                                .map((dosen) => (
                                    <option key={dosen.nip} value={dosen.kode}>
                                        {dosen.nama} ({dosen.kode})
                                        {dosen.kelas_wali &&
                                            ` - Saat ini: ${dosen.kelas_wali}`}
                                    </option>
                                ))}
                        </select>
                        <small className="text-gray-500">
                            Opsional - bisa diisi nanti atau diubah kapan saja
                        </small>
                    </div>

                    {/* Form Actions */}
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
                            className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50">
                            {loading ? (
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

export default KelolaKelasPopUp;
