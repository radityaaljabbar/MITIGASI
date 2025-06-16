import React from 'react';

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    data,
    loading,
}) => {
    if (!isOpen) return null;

    const getName = () => {
        return data?.name || data?.nama || 'item ini';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                </div>

                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Konfirmasi Hapus
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Apakah Anda yakin ingin menghapus data{' '}
                        <span className="font-semibold">{getName()}</span>?
                        Tindakan ini tidak dapat dibatalkan.
                    </p>

                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50">
                            Batal
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50">
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                    Menghapus...
                                </div>
                            ) : (
                                'Hapus'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
