import React, { useState, useEffect } from 'react';

/**
 * Komponen KelolaKurikulumModal
 * @desc
 *   Komponen modal untuk menambah atau mengedit data mata kuliah.
 *   Modal component for adding or editing course data.
 * @props
 *   Semua props yang diperlukan untuk fungsionalitas modal.
 *   All necessary props for modal functionality.
 */
const KelolaKurikulumModal = ({
    isOpen,
    onClose,
    onSubmit,
    mode,
    selectedMataKuliah,
    selectedKurikulum,
    ekuivalensiOptions,
    kelompokKeahlianList,
    loading,
    onKurikulumChange, // Fungsi callback untuk menangani perubahan kurikulum
}) => {
    // State lokal untuk mengelola data form.
    // Local state to manage form data.
    const [formData, setFormData] = useState({
        kurikulum: '',
        kode_mk: '',
        nama_mk: '',
        sks_mk: '',
        semester: '',
        jenis_mk: 'WAJIB PRODI',
        ekivalensi: '',
        kelompok_keahlian: '',
    });

    // State ini sekarang hanya untuk opsi LAINNYA di dropdown
    const [otherEkuivalensiOptions, setOtherEkuivalensiOptions] = useState([]);

    // Effect untuk menginisialisasi atau mereset form setiap kali modal dibuka atau datanya berubah.
    // Effect to initialize or reset the form whenever the modal is opened or its data changes.
    useEffect(() => {
        if (isOpen) {
            // Logika untuk Mode Edit
            if (mode === 'edit' && selectedMataKuliah) {
                // Mode Edit: Isi form dengan data yang sudah ada.
                // Edit Mode: Populate the form with existing data.
                setFormData({
                    kurikulum: selectedMataKuliah.kurikulum || '',
                    kode_mk: selectedMataKuliah.kode_mk || '',
                    nama_mk: selectedMataKuliah.nama_mk || '',
                    sks_mk: selectedMataKuliah.sks_mk || '',
                    semester: selectedMataKuliah.semester || '',
                    jenis_mk: selectedMataKuliah.jenis_mk || 'WAJIB PRODI',
                    ekivalensi: selectedMataKuliah.ekivalensi || '',
                    kelompok_keahlian: selectedMataKuliah.kelompok_keahlian || '',
                });

                // Siapkan opsi ekuivalensi lainnya untuk dropdown.
                // Prepare other equivalency options for the dropdown.
                const filteredOptions = ekuivalensiOptions.filter(
                    (option) =>
                        // Tampilkan hanya opsi yang BUKAN merupakan ekuivalensi yang sudah terpilih
                        option.kode !== selectedMataKuliah.ekivalensi &&
                        // Dan yang kurikulumnya lebih lama
                        parseInt(option.kurikulum_type) <=
                            parseInt(selectedMataKuliah.kurikulum)
                );
                setOtherEkuivalensiOptions(filteredOptions);
            } else {
                // Mode Tambah: Reset form dan set kurikulum default.
                // Add Mode: Reset the form and set the default curriculum.
                setFormData({
                    kurikulum: selectedKurikulum || '',
                    kode_mk: '',
                    nama_mk: '',
                    sks_mk: '',
                    semester: '',
                    jenis_mk: 'WAJIB PRODI',
                    ekivalensi: '',
                    kelompok_keahlian: '',
                });

                // Tampilkan semua opsi ekuivalensi yang valid.
                // Display all valid equivalency options.
                const filteredOptions = ekuivalensiOptions.filter(
                    (option) =>
                        parseInt(option.kurikulum_type) <=
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

    /**
     * @desc
     *   Menangani perubahan pada input form dan memanggil callback jika kurikulum berubah.
     *   Handles form input changes and calls a callback if the curriculum changes.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Jika kurikulum berubah, panggil `onKurikulumChange` untuk memperbarui opsi ekuivalensi.
        // If the curriculum changes, call `onKurikulumChange` to update equivalency options.
        if (name === 'kurikulum' && onKurikulumChange) {
            onKurikulumChange(value);
            // Reset ekuivalensi karena options akan berubah
            setFormData((prev) => ({ ...prev, ekivalensi: '' }));
        }
    };

    /**
     * @desc
     *   Mempersiapkan dan mengirim data form saat disubmit.
     *   Prepares and sends form data on submission.
     */
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

    // Jangan render apapun jika modal tidak terbuka.
    // Do not render anything if the modal is not open.
    if (!isOpen) return null;

    console.log(kelompokKeahlianList)

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                />
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    {/* Header Modal */}
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
                                    readOnly={mode === 'edit'}
                                    className={`block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a085] focus:border-[#16a085] ${
                                        mode === 'edit' ? 'bg-gray-100' : ''
                                    }`}
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

                            {/* Dropdown Ekuivalensi */}
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
                                    {/* EDIT MODE ONLY: Display the existing equivalency info as the PRIMARY option */}
                                    {mode === 'edit' &&
                                        selectedMataKuliah &&
                                        selectedMataKuliah.ekuivalensi_info && (
                                            <option
                                                key={`current-${selectedMataKuliah.ekuivalensi_info.kode}-${selectedMataKuliah.ekuivalensi_info.kurikulum}`}
                                                value={selectedMataKuliah.ekuivalensi_info.kode}>
                                                {selectedMataKuliah.ekuivalensi_info.nama}{' '}
                                                ({selectedMataKuliah.ekuivalensi_info.kode}) - Kurikulum{' '}
                                                {selectedMataKuliah.ekuivalensi_info.kurikulum}
                                            </option>
                                        )}

                                    {/* Tampilkan sisa opsi lain yang valid */}
                                    {/* Display the rest of the valid options */}
                                    {otherEkuivalensiOptions.map((option, index) => (
                                        <option
                                            key={`ekuivalensi-${index}-${option.kode}-${option.kurikulum_type}`}
                                            value={option.kode}>
                                            {option.nama} ({option.kode}) -
                                            Kurikulum {option.kurikulum_type}
                                        </option>
                                    ))}
                                </select>
                                {loading && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        <i className="fas fa-spinner fa-spin mr-1"></i>
                                        Memuat opsi ekuivalensi...
                                    </p>
                                )}
                            </div>  
                            
                            {/* Input Kelompok Keahlian */}
                            <div className="md:col-span-2 space-y-1">
                                <label
                                    htmlFor="kelompok_keahlian"
                                    className="block text-sm font-medium text-gray-700">
                                    <i className="fas fa-layer-group mr-1 text-gray-400"></i>{' '}
                                    Kelompok Keahlian (Opsional)
                                </label>
                                <input
                                    type="text"
                                    id="kelompok_keahlian"
                                    name="kelompok_keahlian"
                                    value={formData.kelompok_keahlian}
                                    onChange={handleChange}
                                    list="kelompok-keahlian-options"
                                    placeholder="Pilih atau ketik baru..."
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a085] focus:border-[#16a085]"
                                />
                                <datalist id="kelompok-keahlian-options">
                                    {kelompokKeahlianList &&
                                        kelompokKeahlianList.map((kk, index) => (
                                            <option key={index} value={kk} />
                                        ))}
                                </datalist>
                                <p className="text-xs text-gray-500 mt-1">
                                    Anda bisa memilih dari daftar yang ada atau
                                    mengetikkan kelompok keahlian baru.
                                </p>
                            </div>

                        </div>
                        {/* Tombol Simpan dan Batal */}
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
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save mr-2"></i>
                                        Simpan
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