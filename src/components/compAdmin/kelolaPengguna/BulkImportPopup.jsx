import React, { useState, useRef } from 'react';

/**
 * Komponen popup untuk import data mahasiswa secara massal dari file CSV.
 * Popup component for bulk importing student data from a CSV file.
 * @param {object} props - Props komponen.
 * @param {boolean} props.isOpen - Status apakah popup terbuka.
 * @param {function} props.onClose - Fungsi untuk menutup popup.
 * @param {function} props.onImport - Fungsi yang dipanggil saat tombol import diklik.
 * @param {boolean} props.loading - Status loading dari parent.
 */
const BulkImportPopup = ({ isOpen, onClose, onImport, loading }) => {
    // State untuk file yang dipilih, status import, dan hasil import
    // State for the selected file, import status, and import results
    const [selectedFile, setSelectedFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [results, setResults] = useState(null);
    const fileInputRef = useRef(null); // Ref untuk mereset input file / Ref to reset the file input

    /**
     * Menangani pemilihan file dan validasi tipe file.
     * Handles file selection and file type validation.
     * @param {React.ChangeEvent<HTMLInputElement>} e - Event dari input file.
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi file harus .csv
            // Validate that the file must be .csv
            if (!file.name.toLowerCase().endsWith('.csv')) {
                alert('Hanya file CSV yang diperbolehkan');
                return;
            }
            setSelectedFile(file);
        }
    };

    /**
     * Memulai proses import dengan memanggil fungsi onImport dari parent.
     * Starts the import process by calling the onImport function from the parent.
     */
    const handleImport = async () => {
        if (!selectedFile) {
            alert('Pilih file CSV terlebih dahulu');
            return;
        }

        setImporting(true);
        const importResults = await onImport(selectedFile); // Panggil fungsi dari parent / Call function from parent

        if (importResults) {
            setResults(importResults); // Tampilkan hasil / Show results
        }
        setImporting(false);
    };

    /**
     * Menutup popup dan mereset semua state ke kondisi awal.
     * Closes the popup and resets all states to their initial condition.
     */
    const handleClose = () => {
        setSelectedFile(null);
        setResults(null);
        setImporting(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset input file
        }
        onClose();
    };

    /**
     * Membuat dan mengunduh file template CSV.
     * Creates and downloads a CSV template file.
     */
    const downloadTemplate = () => {
        const csvContent =
            'nim,nama,kelas,password\n1103210001,John Doe,TK-45-01,\n1103210002,Jane Smith,TK-45-02,custom123';
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template_mahasiswa.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header Popup */}
                {/* Popup Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Import Data Mahasiswa dari CSV
                    </h3>
                    <button
                        onClick={handleClose}
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

                {/* Tampilan sebelum import atau setelah ditutup */}
                {/* View before import or after closing */}
                {!results ? (
                    <>
                        {/* Petunjuk Import */}
                        {/* Import Instructions */}
                        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">
                                Petunjuk Import:
                            </h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• File harus dalam format CSV</li>
                                <li>
                                    • Kolom yang diperlukan: nim, nama, kelas,
                                    password
                                </li>
                                <li>• Password kosong akan default ke NIM</li>
                                <li>
                                    • Kelas harus sesuai dengan yang tersedia di
                                    sistem
                                </li>
                            </ul>
                        </div>

                        {/* Tombol Download Template */}
                        {/* Download Template Button */}
                        <div className="mb-4">
                            <button
                                onClick={downloadTemplate}
                                className="text-blue-600 hover:text-blue-800 underline text-sm">
                                📥 Download Template CSV
                            </button>
                        </div>

                        {/* Input File */}
                        {/* File Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pilih File CSV
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white file:px-4 file:py-2 hover:file:bg-blue-600 transition duration-300"
                            />
                            {selectedFile && (
                                <p className="mt-2 text-sm text-green-600">
                                    ✓ File dipilih: {selectedFile.name}
                                </p>
                            )}
                        </div>

                        {/* Tombol Aksi (Batal & Import) */}
                        {/* Action Buttons (Cancel & Import) */}
                        <div className="flex space-x-3">
                            <button
                                onClick={handleClose}
                                disabled={importing}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50">
                                Batal
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={!selectedFile || importing}
                                className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50">
                                {importing ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                        Mengimpor...
                                    </div>
                                ) : (
                                    'Import Data'
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    /* Tampilan Hasil Import */
                    /* Import Results Display */
                    <div>
                        {/* Ringkasan Hasil */}
                        {/* Results Summary */}
                        <div className="mb-4 p-4 bg-green-50 rounded-lg">
                            <h4 className="font-medium text-green-800 mb-2">
                                Hasil Import:
                            </h4>
                            <div className="text-sm text-green-700 space-y-1">
                                <p>📊 Total data: {results.total}</p>
                                <p>✅ Berhasil: {results.created}</p>
                                <p>❌ Gagal: {results.failed}</p>
                            </div>
                        </div>

                        {/* Detail Error jika ada */}
                        {/* Error Details if any */}
                        {results.errors && results.errors.length > 0 && (
                            <div className="mb-4 p-4 bg-red-50 rounded-lg max-h-60 overflow-y-auto">
                                <h4 className="font-medium text-red-800 mb-2">
                                    Detail Error:
                                </h4>
                                <div className="text-sm text-red-700 space-y-2">
                                    {results.errors.map((error, index) => (
                                        <div
                                            key={index}
                                            className="border-b border-red-200 pb-1">
                                            <strong>Baris {error.row}:</strong>{' '}
                                            {error.nama} ({error.nim}) -{' '}
                                            {error.error}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleClose}
                            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                            Tutup
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkImportPopup;