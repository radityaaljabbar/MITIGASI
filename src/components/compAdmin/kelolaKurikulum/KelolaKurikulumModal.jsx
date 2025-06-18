import React, { useState, useEffect } from 'react';

const KelolaKurikulumModal = ({
    isOpen,
    onClose,
    onSubmit,
    mode,
    selectedMataKuliah,
    selectedKurikulum,
    ekuivalensiOptions,
    loading,
}) => {
    const [formData, setFormData] = useState({
        kurikulum: '',
        kode_mk: '',
        nama_mk: '',
        sks_mk: '',
        semester: '',
        jenis_mk: 'WAJIB PRODI',
        ekivalensi: '',
    });

    // State ini sekarang hanya untuk opsi LAINNYA di dropdown
    const [otherEkuivalensiOptions, setOtherEkuivalensiOptions] = useState([]);

    useEffect(() => {
        if (isOpen) {
            // Logika untuk Mode Edit
            if (mode === 'edit' && selectedMataKuliah) {
                // 1. Langsung isi form dengan data yang ada
                setFormData({
                    kurikulum: selectedMataKuliah.kurikulum || '',
                    kode_mk: selectedMataKuliah.kode_mk || '',
                    nama_mk: selectedMataKuliah.nama_mk || '',
                    sks_mk: selectedMataKuliah.sks_mk || '',
                    semester: selectedMataKuliah.semester || '',
                    jenis_mk: selectedMataKuliah.jenis_mk || 'WAJIB PRODI',
                    ekivalensi: selectedMataKuliah.ekivalensi || '',
                });

                // 2. Siapkan opsi dropdown LAINNYA
                const filteredOptions = ekuivalensiOptions.filter(
                    (option) =>
                        // Tampilkan hanya opsi yang BUKAN merupakan ekuivalensi yang sudah terpilih
                        option.kode !== selectedMataKuliah.ekivalensi &&
                        // Dan yang kurikulumnya lebih lama
                        parseInt(option.kurikulum_type) <
                            parseInt(selectedMataKuliah.kurikulum)
                );
                setOtherEkuivalensiOptions(filteredOptions);

                // Logika untuk Mode Tambah
            } else {
                setFormData({
                    kurikulum: selectedKurikulum || '',
                    kode_mk: '',
                    nama_mk: '',
                    sks_mk: '',
                    semester: '',
                    jenis_mk: 'WAJIB PRODI',
                    ekivalensi: '',
                });

                // Tampilkan semua opsi yang valid
                const filteredOptions = ekuivalensiOptions.filter(
                    (option) =>
                        parseInt(option.kurikulum_type) <
                        parseInt(selectedKurikulum)
                );
                setOtherEkuivalensiOptions(filteredOptions);
            }
        }
    }, [
        isOpen,
        mode,
        selectedMataKuliah,
        selectedKurikulum,
        ekuivalensiOptions,
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Logika handle ganti kurikulum bisa ditambahkan di sini jika perlu
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const semester = parseInt(formData.semester);
        const tingkat = Math.ceil(semester / 2).toString();
        const jenis_semester = semester % 2 === 1 ? 'GANJIL' : 'GENAP';
        onSubmit({
            ...formData,
            tingkat,
            jenis_semester,
            sks_mk: formData.sks_mk.toString(),
            semester: formData.semester.toString(),
            kurikulum: formData.kurikulum.toString(),
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                />
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    {/* ... Header Modal ... */}
                    <div className="bg-white px-6 pt-6 pb-4">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <i
                                    className={`fas ${
                                        mode === 'add'
                                            ? 'fa-plus-circle'
                                            : 'fa-edit'
                                    } mr-2 text-[#16a085]`}></i>
                                {mode === 'add'
                                    ? 'Tambah Mata Kuliah Baru'
                                    : 'Edit Mata Kuliah'}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ... Input form lainnya (Kurikulum, Kode MK, Nama, dll) ... */}
                            {/* Kurikulum */}
                            <div className="space-y-1">
                                <label
                                    htmlFor="kurikulum"
                                    className="block text-sm font-medium text-gray-700">
                                    <i className="fas fa-calendar-alt mr-1 text-gray-400"></i>{' '}
                                    Kurikulum
                                </label>
                                <input
                                    type="number"
                                    id="kurikulum"
                                    name="kurikulum"
                                    value={formData.kurikulum}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a085] focus:border-[#16a085]"
                                />
                            </div>
                            {/* Kode MK */}
                            <div className="space-y-1">
                                <label
                                    htmlFor="kode_mk"
                                    className="block text-sm font-medium text-gray-700">
                                    <i className="fas fa-code mr-1 text-gray-400"></i>{' '}
                                    Kode Mata Kuliah
                                </label>
                                <input
                                    type="text"
                                    id="kode_mk"
                                    name="kode_mk"
                                    value={formData.kode_mk}
                                    onChange={handleChange}
                                    required
                                    readOnly={mode === 'edit'}
                                    className={`block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a085] focus:border-[#16a085] ${
                                        mode === 'edit' ? 'bg-gray-100' : ''
                                    }`}
                                />
                            </div>
                            {/* Nama MK */}
                            <div className="md:col-span-2 space-y-1">
                                <label
                                    htmlFor="nama_mk"
                                    className="block text-sm font-medium text-gray-700">
                                    <i className="fas fa-book mr-1 text-gray-400"></i>{' '}
                                    Nama Mata Kuliah
                                </label>
                                <input
                                    type="text"
                                    id="nama_mk"
                                    name="nama_mk"
                                    value={formData.nama_mk}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a085] focus:border-[#16a085]"
                                />
                            </div>
                            {/* SKS */}
                            <div className="space-y-1">
                                <label
                                    htmlFor="sks_mk"
                                    className="block text-sm font-medium text-gray-700">
                                    <i className="fas fa-credit-card mr-1 text-gray-400"></i>{' '}
                                    SKS
                                </label>
                                <input
                                    type="number"
                                    id="sks_mk"
                                    name="sks_mk"
                                    value={formData.sks_mk}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a085] focus:border-[#16a085]"
                                />
                            </div>
                            {/* Semester */}
                            <div className="space-y-1">
                                <label
                                    htmlFor="semester"
                                    className="block text-sm font-medium text-gray-700">
                                    <i className="fas fa-calendar mr-1 text-gray-400"></i>{' '}
                                    Semester
                                </label>
                                <input
                                    type="number"
                                    id="semester"
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                    min="1"
                                    max="8"
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a085] focus:border-[#16a085]"
                                />
                            </div>
                            {/* Jenis MK */}
                            <div className="md:col-span-2 space-y-1">
                                <label
                                    htmlFor="jenis_mk"
                                    className="block text-sm font-medium text-gray-700">
                                    <i className="fas fa-tag mr-1 text-gray-400"></i>{' '}
                                    Jenis Mata Kuliah
                                </label>
                                <select
                                    id="jenis_mk"
                                    name="jenis_mk"
                                    value={formData.jenis_mk}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a085] focus:border-[#16a085] bg-white">
                                    <option value="WAJIB PRODI">
                                        Wajib Prodi
                                    </option>
                                    <option value="PILIHAN">Pilihan</option>
                                </select>
                            </div>

                            {/* --- BAGIAN DROPDOWN EKUIVALENSI YANG DIPERBAIKI --- */}
                            <div className="md:col-span-2 space-y-1">
                                <label
                                    htmlFor="ekivalensi"
                                    className="block text-sm font-medium text-gray-700">
                                    <i className="fas fa-exchange-alt mr-1 text-gray-400"></i>{' '}
                                    Ekuivalen dengan (Mata Kuliah Lama)
                                </label>
                                <select
                                    id="ekivalensi"
                                    name="ekivalensi"
                                    value={formData.ekivalensi}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a085] focus:border-[#16a085] bg-white">
                                    <option value="">
                                        -- Tidak ada ekuivalensi --
                                    </option>

                                    {/* KHUSUS MODE EDIT: Tampilkan info ekuivalensi yang sudah ada sebagai pilihan UTAMA */}
                                    {mode === 'edit' &&
                                        selectedMataKuliah &&
                                        selectedMataKuliah.ekuivalensi_info && (
                                            <option
                                                value={
                                                    selectedMataKuliah
                                                        .ekuivalensi_info.kode
                                                }>
                                                {
                                                    selectedMataKuliah
                                                        .ekuivalensi_info.nama
                                                }{' '}
                                                (
                                                {
                                                    selectedMataKuliah
                                                        .ekuivalensi_info.kode
                                                }
                                                ) - Kurikulum{' '}
                                                {
                                                    selectedMataKuliah
                                                        .ekuivalensi_info
                                                        .kurikulum
                                                }
                                            </option>
                                        )}

                                    {/* Tampilkan sisa opsi lain yang valid */}
                                    {otherEkuivalensiOptions.map((option) => (
                                        <option
                                            key={option.id}
                                            value={option.kode}>
                                            {option.nama} ({option.kode}) -
                                            Kurikulum {option.kurikulum_type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* ... Tombol Simpan dan Batal ... */}
                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#16a085]">
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 bg-[#16a085] hover:bg-[#16a085]/90 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#16a085] disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? (
                                    <>
                                        {' '}
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>{' '}
                                        Menyimpan...{' '}
                                    </>
                                ) : (
                                    <>
                                        {' '}
                                        <i className="fas fa-save mr-2"></i>{' '}
                                        Simpan{' '}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default KelolaKurikulumModal;
