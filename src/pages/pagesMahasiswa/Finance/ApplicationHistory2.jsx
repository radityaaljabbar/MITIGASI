
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router';

const TuitionReliefHistory = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Simulasi data dari server
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        // Simulasi API call dengan timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockApplications = [
          {
            id: 'REF20250519A1B2C3',
            date: '2025-05-15',
            semester: 'Genap 2024/2025',
            reliefType: 'partial',
            reliefTypeLabel: 'Potongan Biaya Sebagian',
            requestedAmount: 2500000,
            status: 'approved',
            reasonCategory: 'PHK Orang Tua/Wali',
            reliefReason: 'Ayah saya baru saja di-PHK dari pekerjaannya sebagai karyawan pabrik tekstil. Saat ini keluarga kami hanya mengandalkan penghasilan ibu sebagai guru honorer.',
            approvedAmount: 2000000,
            approvedDate: '2025-05-18',
            notes: 'Pengajuan disetujui dengan penyesuaian jumlah berdasarkan anggaran fakultas.'
          },
          {
            id: 'REF20250510D4E5F6',
            date: '2025-05-10',
            semester: 'Genap 2024/2025',
            reliefType: 'installment',
            reliefTypeLabel: 'Cicilan Pembayaran',
            requestedAmount: 5000000,
            status: 'rejected',
            reasonCategory: 'Sakit Berkepanjangan',
            reliefReason: 'Saya sedang dalam masa pemulihan setelah kecelakaan yang mengharuskan saya istirahat dan tidak bisa bekerja paruh waktu seperti biasa.',
            rejectedReason: 'Data pendukung tidak lengkap. Silakan ajukan kembali dengan melampirkan surat keterangan dokter.',
            rejectedDate: '2025-05-12'
          },
          {
            id: 'REF20250401G7H8I9',
            date: '2025-04-01',
            semester: 'Genap 2024/2025',
            reliefType: 'full',
            reliefTypeLabel: 'Pembebasan Biaya Penuh',
            requestedAmount: 0,
            status: 'pending',
            reasonCategory: 'Bencana Alam',
            reliefReason: 'Rumah keluarga saya terkena dampak banjir bandang yang melanda kota kami pada Maret 2025. Hampir seluruh perabotan dan barang elektronik rusak, termasuk laptop yang saya gunakan untuk kuliah.',
          }
        ];
        
        setApplications(mockApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Gagal memuat data pengajuan. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []);

  const handleViewDetail = (application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Menunggu
          </span>
        );
      case 'approved':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Disetujui
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Ditolak
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const filteredApplications = applications.filter(app => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-[#FAF0E6] py-6 px-4 sm:px-6 lg:px-8">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-[#951A22] rounded-t-lg shadow-md py-6 px-8">
          <h1 className="text-white text-3xl font-bold text-center">Riwayat Pengajuan Keringanan Biaya Kuliah</h1>
        </div>
        
        {/* Content */}
        <div className="bg-white rounded-b-lg shadow-md py-6 px-8">
          {/* Filter dan Tombol */}
          <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Filter Status:
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-[#951A22] focus:ring focus:ring-[#951A22] focus:ring-opacity-50"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="approved">Disetujui</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
            
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#951A22] hover:bg-[#7a1118] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#951A22]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <Link to="/student/my-finance/application">Buat Pengajuan Baru</Link>
            </button>
          </div>
          
          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin h-8 w-8 text-[#951A22]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Belum Ada Pengajuan</h3>
              <p className="mt-1 text-sm text-gray-500">Anda belum pernah melakukan pengajuan keringanan biaya kuliah.</p>
              <div className="mt-6">
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#951A22] hover:bg-[#7a1118] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#951A22]"
                >
                  <Link to="/student/my-finance/application">Buat Pengajuan</Link>
                </button>
              </div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">Tidak Ada Pengajuan {filterStatus !== 'all' && `dengan Status "${filterStatus === 'pending' ? 'Menunggu' : filterStatus === 'approved' ? 'Disetujui' : 'Ditolak'}"`}</h3>
              <p className="mt-1 text-sm text-gray-500">Coba pilih filter status yang berbeda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Pengajuan
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semester
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Keringanan
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(application.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.reliefTypeLabel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.reliefType === 'full' ? 'Pembebasan Penuh' : formatCurrency(application.requestedAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetail(application)}
                          className="text-[#951A22] hover:text-[#7a1118]"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Detail Pengajuan
                    </h3>
                    
                    <div className="border-t border-gray-200 py-3">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1 text-sm text-gray-900">{getStatusBadge(selectedApplication.status)}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Tanggal Pengajuan</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedApplication.date)}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Semester</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedApplication.semester}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Jenis Keringanan</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedApplication.reliefTypeLabel}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Kategori Alasan</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedApplication.reasonCategory}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Jumlah Pengajuan</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {selectedApplication.reliefType === 'full' ? 'Pembebasan Biaya Penuh' : formatCurrency(selectedApplication.requestedAmount)}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Alasan Pengajuan</dt>
                          <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                            {selectedApplication.reliefReason}
                          </dd>
                        </div>
                        
                        {/* Status Specific Information */}
                        {selectedApplication.status === 'approved' && (
                          <>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Tanggal Disetujui</dt>
                              <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedApplication.approvedDate)}</dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Jumlah Disetujui</dt>
                              <dd className="mt-1 text-sm text-gray-900">{formatCurrency(selectedApplication.approvedAmount)}</dd>
                            </div>
                            <div className="sm:col-span-2">
                              <dt className="text-sm font-medium text-gray-500">Catatan</dt>
                              <dd className="mt-1 text-sm text-gray-900 bg-green-50 p-2 rounded">{selectedApplication.notes}</dd>
                            </div>
                          </>
                        )}
                        
                        {selectedApplication.status === 'rejected' && (
                          <>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Tanggal Ditolak</dt>
                              <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedApplication.rejectedDate)}</dd>
                            </div>
                            <div className="sm:col-span-2">
                              <dt className="text-sm font-medium text-gray-500">Alasan Penolakan</dt>
                              <dd className="mt-1 text-sm text-gray-900 bg-red-50 p-2 rounded">{selectedApplication.rejectedReason}</dd>
                            </div>
                          </>
                        )}
                        
                        {selectedApplication.status === 'pending' && (
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Estimasi Waktu Proses</dt>
                            <dd className="mt-1 text-sm text-gray-900 bg-yellow-50 p-2 rounded">
                              Pengajuan Anda sedang dalam proses review. Estimasi waktu proses adalah 7-14 hari kerja.
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedApplication.status === 'rejected' && (
                  <button
                    type="button"
                    onClick={() => {
                      closeDetailModal();
                      window.location.href = '/pengajuan-keringanan';
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#951A22] text-base font-medium text-white hover:bg-[#7a1118] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#951A22] sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Ajukan Ulang
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeDetailModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#951A22] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TuitionReliefHistory;