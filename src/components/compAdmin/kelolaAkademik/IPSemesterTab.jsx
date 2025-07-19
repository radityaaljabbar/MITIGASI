import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    getSemesterData,
    createSemesterData,
    updateSemesterData,
    deleteSemesterData,
} from '../../../services/adminServices/kelolaAkademikServices';
import DeleteConfirmationModal from '../kelolaPengguna/DeleteConfirmationModal';

/**
 * Komponen IPSemesterTab
 * Component IPSemesterTab
 * @desc    Menampilkan dan mengelola data riwayat IP dan SKS per semester mahasiswa.
 *          Displays and manages the history of GPA and SKS per semester for a student.
 * @props   {object} mahasiswaData - Data mahasiswa yang sedang dilihat. / Data of the student being viewed.
 */
const IPSemesterTab = ({ mahasiswaData }) => {
    // State untuk data dan UI
    // State for data and UI
    const [semesterData, setSemesterData] = useState([]); // Menyimpan array data riwayat semester. / Stores an array of semester history data.
    const [loading, setLoading] = useState(false); // Status loading untuk tabel. / Loading status for the table.
    const [loadingAction, setLoadingAction] = useState(false); // Status loading untuk aksi di modal/delete. / Loading status for actions in modal/delete.

    // State untuk modal tambah/edit
    // State for add/edit modal
    const [showModal, setShowModal] = useState(false); // Kontrol visibilitas modal. / Controls modal visibility.
    const [modalType, setModalType] = useState(''); // Tipe modal: 'add' atau 'edit'. / Modal type: 'add' or 'edit'.
    const [currentEditData, setCurrentEditData] = useState(null); // Data yang sedang diedit. / Data currently being edited.

    // State untuk konfirmasi hapus
    // State for delete confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Kontrol visibilitas modal hapus. / Controls delete modal visibility.
    const [deleteData, setDeleteData] = useState(null); // Data yang akan dihapus. / Data to be deleted.

    // State untuk form di dalam modal
    // State for the form inside the modal
    const [formData, setFormData] = useState({
        ip_semester: '',
        semester: '',
        sks_semester: '',
        tahun_ajaran: '',
        jenis_semester: 'GANJIL',
    });

    // Effect untuk memuat data saat komponen mount atau `mahasiswaData` berubah
    // Effect to load data on component mount or when `mahasiswaData` changes
    useEffect(() => {
        if (mahasiswaData?.nim) {
            loadSemesterData();
        }
    }, [mahasiswaData]);

    /**
     * @desc    Memuat data riwayat semester mahasiswa dari API.
     *          Loads student semester history data from the API.
     */
    const loadSemesterData = async () => {
        setLoading(true);
        try {
            const response = await getSemesterData(mahasiswaData.nim);
            if (response.success) {
                setSemesterData(response.data.riwayat_semester || []);
            } else {
                toast.error(response.message || 'Gagal memuat data semester');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat memuat data semester');
        } finally {
            setLoading(false);
        }
    };

    /**
     * @desc    Menangani perubahan pada input form di modal.
     *          Handles changes in the modal form inputs.
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * @desc    Mempersiapkan dan menampilkan modal untuk menambah data baru.
     *          Prepares and displays the modal for adding new data.
     */
    const handleAdd = () => {
        setModalType('add');
        setCurrentEditData(null);
        // Reset form ke nilai default
        // Reset form to default values
        setFormData({
            ip_semester: '',
            semester: '',
            sks_semester: '',
            tahun_ajaran: '',
            jenis_semester: 'GANJIL',
        });
        setShowModal(true);
    };

    /**
     * @desc    Mempersiapkan dan menampilkan modal untuk mengedit data yang ada.
     *          Prepares and displays the modal for editing existing data.
     */
    const handleEdit = (semester) => {
        setModalType('edit');
        setCurrentEditData(semester);
        // Isi form dengan data yang akan diedit
        // Fill the form with the data to be edited
        setFormData({
            ip_semester: semester.ip_semester?.toString() || '',
            semester: semester.semester?.toString() || '',
            sks_semester: semester.sks_semester?.toString() || '',
            tahun_ajaran: semester.tahun_ajaran || '',
            jenis_semester: semester.jenis_semester || 'GANJIL',
        });
        setShowModal(true);
    };

    /**
     * @desc    Menangani submit form dari modal, baik untuk tambah atau edit.
     *          Handles form submission from the modal, for both add or edit.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingAction(true);

        try {
            let response;
            const submitData = {
                ip_semester: formData.ip_semester,
                semester: formData.semester,
                sks_semester: formData.sks_semester,
                tahun_ajaran: formData.tahun_ajaran,
                jenis_semester: formData.jenis_semester,
            };

            if (modalType === 'add') {
                response = await createSemesterData(
                    mahasiswaData.nim,
                    submitData
                );
            } else {
                response = await updateSemesterData(
                    currentEditData.id,
                    submitData
                );
            }

            if (response.success) {
                toast.success(response.message);
                setShowModal(false); // Tutup modal setelah berhasil
                loadSemesterData(); // Muat ulang data tabel
            } else {
                toast.error(response.message || 'Terjadi kesalahan');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat menyimpan data');
        } finally {
            setLoadingAction(false);
        }
    };

    /**
     * @desc    Menangani klik pada tombol hapus di baris tabel.
     *          Handles the click on the delete button in a table row.
     */
    const handleDeleteClick = (semester) => {
        setDeleteData(semester);
        setShowDeleteModal(true);
    };

    /**
     * @desc    Mengeksekusi penghapusan data setelah dikonfirmasi.
     *          Executes data deletion after confirmation.
     */
    const confirmDelete = async () => {
        setLoadingAction(true);
        try {
            const response = await deleteSemesterData(deleteData.id);
            if (response.success) {
                toast.success(response.message);
                setShowDeleteModal(false); // Tutup modal konfirmasi
                loadSemesterData(); // Muat ulang data tabel
            } else {
                toast.error(response.message || 'Gagal menghapus data');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat menghapus data');
        } finally {
            setLoadingAction(false);
        }
    };

    /**
     * @desc    Mengembalikan kelas CSS untuk badge IP berdasarkan nilainya.
     *          Returns a CSS class for the IP badge based on its value.
     */
    const getIPBadge = (ip) => {
        if (ip >= 3.5) return 'bg-green-100 text-green-800';
        if (ip >= 3.0) return 'bg-blue-100 text-blue-800';
        if (ip >= 2.5) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    // Mengurutkan data semester berdasarkan nomor semester untuk tampilan yang konsisten
    // Sorts semester data by semester number for consistent display
    const sortedSemesterData = [...semesterData].sort(
        (a, b) => a.semester - b.semester
    );

    return (
        <div className="p-6">
             {/* Header dengan tombol "Tambah Data" */}
            {/* Header with "Add Data" button */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    Data IP Semester
                </h3>

                <button
                    onClick={handleAdd}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                    <span>Tambah Data Semester</span>
                </button>
            </div>

            {/* Kartu Ringkasan: Ditampilkan jika ada data */}
            {/* Summary Cards: Displayed if data exists */}
            {sortedSemesterData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg
                                    className="w-8 h-8 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-blue-900">
                                    Total Semester
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {sortedSemesterData.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg
                                    className="w-8 h-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-green-900">
                                    IP Tertinggi
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {Math.max(
                                        ...sortedSemesterData.map(
                                            (s) => s.ip_semester
                                        )
                                    ).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg
                                    className="w-8 h-8 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-purple-900">
                                    Total SKS
                                </p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {sortedSemesterData.reduce(
                                        (sum, s) => sum + s.sks_semester,
                                        0
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabel Data Semester */}
            {/* Semester Data Table */}
            {loading ? (
                // Tampilan loading
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="bg-white rounded-lg border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Semester
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        IP Semester
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        SKS Semester
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jenis Semester
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tahun Ajaran
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Mapping data semester yang sudah diurutkan ke baris tabel */}
                                {/* Mapping sorted semester data to table rows */}
                                {sortedSemesterData.map((semester) => (
                                    <tr
                                        key={semester.id}
                                        className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Semester {semester.semester}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getIPBadge(
                                                    semester.ip_semester
                                                )}`}>
                                                {semester.ip_semester?.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {semester.sks_semester} SKS
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    semester.jenis_semester ===
                                                    'GANJIL'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {semester.jenis_semester}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {semester.tahun_ajaran}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(semester)
                                                }
                                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteClick(semester)
                                                }
                                                className="text-red-600 hover:text-red-800 font-medium hover:underline">
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Tampilan Kosong: Ditampilkan jika tidak ada data */}
                    {/* Empty State: Displayed if no data exists */}
                    {sortedSemesterData.length === 0 && (
                        <div className="text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                Belum ada data IP semester
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Mulai dengan menambahkan data IP semester
                                mahasiswa.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal Form untuk Tambah/Edit Data */}
            {/* Modal Form for Add/Edit Data */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {modalType === 'add'
                                    ? 'Tambah Data Semester'
                                    : 'Edit Data Semester'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
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
                            {/* Semester */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Semester{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Pilih Semester</option>
                                    {[
                                        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                                    ].map((sem) => (
                                        <option key={sem} value={sem}>
                                            Semester {sem}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* IP Semester */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    IP Semester{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="ip_semester"
                                    value={formData.ip_semester}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    max="4"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <small className="text-gray-500">
                                    IP dalam skala 0.00 - 4.00
                                </small>
                            </div>

                            {/* SKS Semester */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SKS Semester{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="sks_semester"
                                    value={formData.sks_semester}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    max="30"
                                    placeholder="20"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <small className="text-gray-500">
                                    Jumlah SKS yang diambil di semester ini
                                </small>
                            </div>

                            {/* Jenis Semester */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenis Semester{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="jenis_semester"
                                    value={formData.jenis_semester}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="GANJIL">GANJIL</option>
                                    <option value="GENAP">GENAP</option>
                                </select>
                            </div>

                            {/* Tahun Ajaran */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tahun Ajaran{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="tahun_ajaran"
                                    value={formData.tahun_ajaran}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="2023/2024"
                                    pattern="[0-9]{4}/[0-9]{4}"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <small className="text-gray-500">
                                    Format: YYYY/YYYY
                                </small>
                            </div>

                            {/* Buttons */}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    disabled={loadingAction}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200">
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={loadingAction}
                                    className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50">
                                    {loadingAction ? (
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
            )}

            {/* Modal Konfirmasi Hapus */}
            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                data={deleteData}
                loading={loadingAction}
            />
        </div>
    );
};

export default IPSemesterTab;
