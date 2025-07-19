import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    getGradesMahasiswa,
    getAllCourses,
    createGrade,
    updateGrade,
    deleteGrade,
    bulkCreateGrades,
} from '../../../services/adminServices/kelolaAkademikServices';
import BulkImportGradesPopup from './BulkImportGradesPopup';
import DeleteConfirmationModal from '../kelolaPengguna/DeleteConfirmationModal';

/**
 * Komponen NilaiMataKuliahTab
 * Component NilaiMataKuliahTab
 * @desc    Mengelola (CRUD) nilai per mata kuliah untuk seorang mahasiswa, termasuk fitur import massal (bulk import).
 *          Manages (CRUD) grades per course for a student, including a bulk import feature.
 * @props   {object} mahasiswaData - Data mahasiswa yang sedang dilihat. / Data of the student being viewed.
 */
const NilaiMataKuliahTab = ({ mahasiswaData }) => {
    // State untuk data
    // State for data
    const [grades, setGrades] = useState([]); // Menyimpan daftar nilai mahasiswa. / Stores the student's list of grades.
    const [courses, setCourses] = useState([]); // Menyimpan daftar semua mata kuliah yang ada (untuk dropdown). / Stores the list of all available courses (for the dropdown).
    const [loading, setLoading] = useState(false); // Loading untuk tabel utama. / Loading for the main table.
    const [loadingAction, setLoadingAction] = useState(false); // Loading untuk aksi (simpan, hapus). / Loading for actions (save, delete).

    // State untuk modal tambah/edit
    // State for add/edit modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'add' atau 'edit'
    const [currentEditData, setCurrentEditData] = useState(null);

    // State untuk konfirmasi hapus
    // State for delete confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    // State untuk import massal
    // State for bulk import
    const [showBulkImportPopup, setShowBulkImportPopup] = useState(false); // Kontrol visibilitas popup import. / Controls visibility of the import popup.
    const [bulkImporting, setBulkImporting] = useState(false); // Status loading untuk proses import. / Loading status for the import process.

    // State untuk form
    // State for the form
    const [formData, setFormData] = useState({
        kodeMK: '',
        indeksNilai: '',
        semester: 'GANJIL',
        tahunAjaran: '',
    });

    // State untuk pencarian
    // State for search
    const [searchTerm, setSearchTerm] = useState('');

    // Effect untuk memuat data saat komponen mount atau `mahasiswaData` berubah
    // Effect to load data on component mount or when `mahasiswaData` changes
    useEffect(() => {
        if (mahasiswaData?.nim) {
            loadData();
        }
    }, [mahasiswaData]);

    /**
     * @desc    Memuat semua data yang diperlukan (nilai dan mata kuliah) secara paralel.
     *          Loads all required data (grades and courses) in parallel.
     */
    const loadData = async () => {
        await Promise.all([loadGrades(), loadCourses()]);
    };

    /**
     * @desc    Memuat data nilai mahasiswa dari API.
     *          Loads student grade data from the API.
     */
    const loadGrades = async () => {
        setLoading(true);
        try {
            const response = await getGradesMahasiswa(mahasiswaData.nim);
            if (response.success) {
                setGrades(response.data.grades || []);
            } else {
                toast.error(response.message || 'Gagal memuat data nilai');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat memuat data nilai');
        } finally {
            setLoading(false);
        }
    };

    /**
     * @desc    Memuat daftar semua mata kuliah dari API untuk digunakan di dropdown form.
     *          Loads the list of all courses from the API to be used in the form dropdown.
     */
    const loadCourses = async () => {
        try {
            const response = await getAllCourses();
            if (response.success) {
                setCourses(response.data || []);
            }
        } catch (error) {
            console.error('Error loading courses:', error);
        }
    };

    /**
     * @desc    Menangani perubahan pada input form.
     *          Handles changes in the form inputs.
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * @desc    Membuka modal untuk menambah nilai baru.
     *          Opens the modal to add a new grade.
     */
    const handleAdd = () => {
        setModalType('add');
        setCurrentEditData(null);
        setFormData({ kodeMK: '', indeksNilai: '', semester: 'GANJIL', tahunAjaran: '' });
        setShowModal(true);
    };

    /**
     * @desc    Membuka modal untuk mengedit nilai yang ada.
     *          Opens the modal to edit an existing grade.
     */
    const handleEdit = (grade) => {
        setModalType('edit');
        setCurrentEditData(grade);
        setFormData({
            kodeMK: grade.kode_mk || '',
            indeksNilai: grade.indeks?.trim() || '',
            semester: grade.semester || 'GANJIL',
            tahunAjaran: grade.tahun_ajaran || '',
        });
        setShowModal(true);
    };

    /**
     * @desc    Menangani submit form, baik untuk tambah atau edit nilai.
     *          Handles form submission, for both adding or editing a grade.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingAction(true);
        try {
            let response;
            if (modalType === 'add') {
                const submitData = { nimMahasiswa: mahasiswaData.nim, ...formData };
                response = await createGrade(submitData);
            } else {
                const updateData = { ...formData };
                response = await updateGrade(currentEditData.id_nilai, updateData);
            }
            if (response.success) {
                toast.success(response.message);
                setShowModal(false);
                loadGrades();
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
     * @desc    Menampilkan modal konfirmasi sebelum menghapus nilai.
     *          Shows a confirmation modal before deleting a grade.
     */
    const handleDeleteClick = (grade) => {
        setDeleteData(grade);
setShowDeleteModal(true);
    };

    /**
     * @desc    Mengeksekusi penghapusan nilai setelah dikonfirmasi.
     *          Executes grade deletion after confirmation.
     */
    const confirmDelete = async () => {
        setLoadingAction(true);
        try {
            const response = await deleteGrade(deleteData.id_nilai);
            if (response.success) {
                toast.success(response.message);
                setShowDeleteModal(false);
                loadGrades();
            } else {
                toast.error(response.message || 'Gagal menghapus data');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat menghapus data');
        } finally {
            setLoadingAction(false);
        }
    };

    // Memfilter data nilai berdasarkan kata kunci pencarian
    // Filters grade data based on the search keyword
    const filteredGrades = grades.filter((grade) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            grade.kode_mk?.toLowerCase().includes(searchLower) ||
            grade.nama_mk?.toLowerCase().includes(searchLower) ||
            grade.indeks?.toLowerCase().includes(searchLower) ||
            grade.semester?.toLowerCase().includes(searchLower) ||
            grade.tahun_ajaran?.toLowerCase().includes(searchLower)
        );
    });

    /**
     * @desc    Mencari dan mengembalikan nama mata kuliah berdasarkan kodenya.
     *          Finds and returns the course name based on its code.
     */
    const getCourseNameByCode = (kode_mk) => {
        const course = courses.find((c) => c.kode_mk === kode_mk);
        return course ? course.nama_mk : 'Mata Kuliah Tidak Ditemukan';
    };

    /**
     * @desc    Mengembalikan kelas CSS untuk badge nilai berdasarkan indeksnya.
     *          Returns a CSS class for the grade badge based on its index.
     */
    const getGradeBadge = (indeks) => {
        // ... logika untuk pewarnaan badge ...
    };

    /**
     * @desc    Menangani proses import massal dari file CSV.
     *          Handles the bulk import process from a CSV file.
     * @param   {File} file - File CSV yang diunggah. / The uploaded CSV file.
     * @returns {object|null} Hasil dari proses import untuk ditampilkan di popup. / The result of the import process to be displayed in the popup.
     */
    const handleBulkImport = async (file) => {
        setBulkImporting(true);
        try {
            const response = await bulkCreateGrades(mahasiswaData.nim, file);
            if (response.success) {
                toast.success(response.message);
                loadGrades(); // Muat ulang data setelah import berhasil
                return response.data; // Kembalikan hasil untuk ditampilkan di popup
            } else {
                toast.error(response.message || 'Gagal import data');
                return null;
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat import data');
            return null;
        } finally {
            setBulkImporting(false);
        }
    };

    return (
        <div className="p-6">
            {/* Header dengan pencarian dan tombol aksi */}
            {/* Header with search and action buttons */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Nilai Mata Kuliah
                    </h3>

                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari mata kuliah atau nilai..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        />
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
                </div>

                <div className="flex space-x-3">
                    {/* Import CSV Button */}
                    <button
                        onClick={() => setShowBulkImportPopup(true)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                        <span className="mr-2">📁</span>
                        Import CSV
                    </button>

                    {/* Add Button */}
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
                        <span>Tambah Nilai</span>
                    </button>
                </div>
            </div>

            {/* Tabel Nilai */}
            {/* Grades Table */}
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
                                        Kode MK
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama Mata Kuliah
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nilai
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Semester
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
                                {/* Mapping data nilai yang sudah difilter */}
                                {/* Mapping filtered grade data */}
                                {filteredGrades.map((grade) => (
                                    <tr
                                        key={grade.id_nilai}
                                        className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {grade.kode_mk}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {grade.nama_mk ||
                                                getCourseNameByCode(
                                                    grade.kode_mk
                                                )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getGradeBadge(
                                                    grade.indeks
                                                )}`}>
                                                {grade.indeks?.trim()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    grade.semester === 'GANJIL'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {grade.semester}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {grade.tahun_ajaran}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(grade)
                                                }
                                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteClick(grade)
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

                    {/* Tampilan jika data tidak ditemukan */}
                    {/* Display when data is not found */}
                    {filteredGrades.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500">
                                {searchTerm
                                    ? 'Tidak ada data yang sesuai dengan pencarian'
                                    : 'Belum ada data nilai'}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal Form Tambah/Edit */}
            {/* Add/Edit Form Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {modalType === 'add'
                                    ? 'Tambah Nilai'
                                    : 'Edit Nilai'}
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
                            {/* Mata Kuliah */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mata Kuliah{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="kodeMK"
                                    value={formData.kodeMK}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Pilih Mata Kuliah</option>
                                    {courses.map((course) => (
                                        <option
                                            key={course.kode_mk}
                                            value={course.kode_mk}>
                                            {course.kode_mk} - {course.nama_mk}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Nilai */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nilai{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="indeksNilai"
                                    value={formData.indeksNilai}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Pilih Nilai</option>
                                    <option value="A">A</option>
                                    <option value="A-">A-</option>
                                    <option value="AB">AB</option>
                                    <option value="B+">B+</option>
                                    <option value="B">B</option>
                                    <option value="B-">B-</option>
                                    <option value="BC">BC</option>
                                    <option value="C+">C+</option>
                                    <option value="C">C</option>
                                    <option value="C-">C-</option>
                                    <option value="D+">D+</option>
                                    <option value="D">D</option>
                                    <option value="E">E</option>
                                    <option value="T">T</option>
                                </select>
                            </div>

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
                                    <option value="GANJIL">GANJIL</option>
                                    <option value="GENAP">GENAP</option>
                                    <option value="ANTARA">ANTARA</option>
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
                                    name="tahunAjaran"
                                    value={formData.tahunAjaran}
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

            {/* Popup untuk Import Massal */}
            {/* Popup for Bulk Import */}
            <BulkImportGradesPopup
                isOpen={showBulkImportPopup}
                onClose={() => setShowBulkImportPopup(false)}
                onImport={handleBulkImport}
                loading={bulkImporting}
                mahasiswaData={mahasiswaData}
            />
        </div>
    );
};

export default NilaiMataKuliahTab;
