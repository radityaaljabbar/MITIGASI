import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TuitionReliefForm = () => {
  const [formData, setFormData] = useState({
    
    // Informasi Ekonomi
    monthlyIncome: '',
    parentIncome: '',
    dependents: '',
    housingStatus: '', 
    housingCost: '',
    transportationCost: '',
    otherExpenses: '',


    // Detail Keringanan
    reliefType: '', 
    reasonCategory: '', 
    requestedAmount: '',
    reliefReason: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const validateForm = () => {
    // Validasi dasar
    if (formData.monthlyIncome === '' || formData.parentIncome === '' || formData.dependents === '') {
      toast.error('Mohon lengkapi semua field informasi ekonomi!');
      return false;
    }

    if (!formData.reasonCategory) {
      toast.error('Mohon pilih kategori alasan pengajuan keringanan!');
      return false;
    }

    if (formData.reliefType !== 'full' && !formData.requestedAmount) {
      toast.error('Mohon masukkan jumlah keringanan yang diajukan!');
      return false;
    }

    if (!formData.reliefReason || formData.reliefReason.trim().length < 20) {
      toast.error('Mohon jelaskan alasan pengajuan dengan lebih detail (minimal 20 karakter)!');
      return false;
    }

    if (!formData.agreement) {
      toast.error('Anda harus menyetujui pernyataan kebenaran data!');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    toast.info('Sedang memproses pengajuan Anda...');
    
    try {
      // Simulasi pengiriman data ke server
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form data submitted:', formData);
      
      toast.success('Pengajuan berhasil dikirim!');
      setIsLoading(false);
      setIsSubmitted(true);
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
      setIsLoading(false);
      console.error('Error submitting form:', error);
    }
  };

  const handleReset = () => {
    toast.info('Formulir direset!');
    window.location.reload();
  };

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
      
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#951A22] py-6 px-8">
          <h1 className="text-white text-3xl font-bold text-center">Formulir Pengajuan Keringanan Biaya Kuliah</h1>
        </div>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="py-6 px-8 space-y-8">
            {/* Section: Informasi Ekonomi */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informasi Ekonomi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700">
                    Penghasilan Bulanan Mahasiswa (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="monthlyIncome"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#951A22] focus:border-[#951A22]"
                    onBlur={() => {
                      if (formData.monthlyIncome === '') {
                        toast.warning('Penghasilan bulanan mahasiswa tidak boleh kosong!');
                      }
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="parentIncome" className="block text-sm font-medium text-gray-700">
                    Penghasilan Bulanan Orang Tua (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="parentIncome"
                    name="parentIncome"
                    value={formData.parentIncome}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#614c4e] focus:border-[#951A22]"
                    onBlur={() => {
                      if (formData.parentIncome === '') {
                        toast.warning('Penghasilan bulanan orang tua tidak boleh kosong!');
                      }
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="dependents" className="block text-sm font-medium text-gray-700">
                    Jumlah Tanggungan Keluarga <span className="text-red-500">*</span>
                  </label>
                  {/* Penjelasan singkat untuk UI jika diperlukan */}
                  <p className="text-xs text-gray-500 -mt-1 mb-1">
                    Total orang yang menjadi tanggungan finansial orang tua/wali (termasuk Anda).
                  </p>
                  <input
                    type="number"
                    id="dependents"
                    name="dependents"
                    value={formData.dependents}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#951A22] focus:border-[#951A22]"
                  />
                </div>
                <div>
                  <label htmlFor="housingStatus" className="block text-sm font-medium text-gray-700">
                    Status Tempat Tinggal <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="housingStatus"
                    name="housingStatus"
                    value={formData.housingStatus}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#951A22] focus:border-[#951A22]"
                  >
                    <option value="Kost/Kontrakan">Kost/Kontrakan</option>
                    <option value="Rumah Sendiri">Rumah Sendiri</option>
                    <option value="Rumah Orang Tua">Rumah Orang Tua</option>
                    <option value="Asrama">Asrama</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="otherExpenses" className="block text-sm font-medium text-gray-700">
                    Pengeluaran Bulanan (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="otherExpenses"
                    name="otherExpenses"
                    value={formData.otherExpenses}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#951A22] focus:border-[#951A22]"
                  />
                </div>
              </div>
            </div>
            
            {/* Section: Detail Keringanan */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Detail Keringanan</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="reliefType" className="block text-sm font-medium text-gray-700">
                    Jenis Keringanan yang Diajukan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="reliefType"
                    name="reliefType"
                    value={formData.reliefType}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (e.target.value === 'full') {
                        toast.info('Untuk pembebasan biaya penuh, Anda tidak perlu memasukkan jumlah keringanan.');
                      }
                    }}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#951A22] focus:border-[#951A22]"
                  >
                    <option value="Potongan Biaya Sebagian">Potongan Biaya Sebagian</option>
                    <option value="Pembebasan Biaya Penuh">Pembebasan Biaya Penuh</option>
                    <option value="Cicilan Pembayaran">Cicilan Pembayaran</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="reasonCategory" className="block text-sm font-medium text-gray-700">
                    Kategori Alasan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="reasonCategory"
                    name="reasonCategory"
                    value={formData.reasonCategory}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#951A22] focus:border-[#951A22]"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="PHK Orang Tua/Wali">PHK Orang Tua/Wali</option>
                    <option value="Sakit Berkepanjangan">Sakit Berkepanjangan</option>
                    <option value="Bencana Alam">Bencana Alam</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
                
                {formData.reliefType !== 'full' && (
                  <div>
                    <label htmlFor="requestedAmount" className="block text-sm font-medium text-gray-700">
                      Jumlah Keringanan yang Diajukan (Rp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="requestedAmount"
                      name="requestedAmount"
                      value={formData.requestedAmount}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                      required={formData.reliefType !== 'full'}
                      min="0"
                      placeholder="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#951A22] focus:border-[#951A22]"
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="reliefReason" className="block text-sm font-medium text-gray-700">
                    Penjelasan Detail Alasan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="reliefReason"
                    name="reliefReason"
                    value={formData.reliefReason}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Jelaskan secara detail alasan Anda mengajukan keringanan biaya kuliah..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#951A22] focus:border-[#951A22]"
                    onBlur={() => {
                      if (formData.reliefReason && formData.reliefReason.trim().length < 20) {
                        toast.warning('Penjelasan alasan terlalu singkat! Mohon jelaskan lebih detail.');
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Agreement and Submit */}
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreement"
                    name="agreement"
                    type="checkbox"
                    checked={formData.agreement}
                    onChange={handleInputChange}
                    required
                    className="h-4 w-4 text-[#951A22] focus:ring-[#951A22] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreement" className="font-medium text-gray-700">
                    Pernyataan Kebenaran Data <span className="text-red-500">*</span>
                  </label>
                  <p className="text-gray-500">
                    Saya menyatakan bahwa semua informasi yang diberikan dalam formulir ini adalah benar dan lengkap.
                    Saya memahami bahwa pemberian informasi yang tidak benar dapat mengakibatkan penolakan permohonan.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2 px-6 border border-[#951A22] rounded-md shadow-sm text-[#951A22] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#951A22]"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-2 px-6 border border-transparent rounded-md shadow-sm text-white bg-[#951A22] hover:bg-[#7a1118] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#951A22] flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    'Kirim Pengajuan'
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="py-12 px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <svg className="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengajuan Berhasil</h2>
            <p className="text-gray-600 mb-6">
              Terima kasih! Permohonan keringanan biaya kuliah Anda telah berhasil dikirim.
              Kami akan memproses pengajuan Anda dan menghubungi Anda melalui email dalam 7-14 hari kerja.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm font-medium text-gray-700">Nomor Referensi:</p>
              <p className="text-lg font-bold text-[#951A22]">{new Date().getTime().toString(36).toUpperCase()}</p>
              <p className="text-xs text-gray-500 mt-1">Harap simpan nomor referensi ini untuk keperluan pelacakan pengajuan</p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#951A22] hover:bg-[#7a1118] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#951A22]"
            >
              Kembali ke Formulir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TuitionReliefForm;