import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import submitRelief from '../../../services/mahasiswaServices/myFinanceService';

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
  const [referenceNumber, setReferenceNumber] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
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

    return true;
  };

  // Fungsi untuk mengirim data ke backend
  const sendDataToBackend = async () => {
    setIsLoading(true);
    toast.info('Sedang memproses pengajuan Anda...');
    
    try {
      // Gunakan service untuk mengirim data ke backend
      const result = await tuitionReliefService.submitRelief(formData);
      console.log('Response from backend:', result);
      
      // Simpan nomor referensi dari respons
      if (result && result.data && result.data.referenceNumber) {
        setReferenceNumber(result.data.referenceNumber);
      } else {
        // Jika tidak ada nomor referensi, buat secara lokal untuk demo
        setReferenceNumber(new Date().getTime().toString(36).toUpperCase());
      }
      
      toast.success('Pengajuan berhasil dikirim!');
      setIsLoading(false);
      setIsSubmitted(true);
      return true;
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
      setIsLoading(false);
      return false;
    }
  };

  // Fungsi untuk mode development/testing tanpa backend
  const simulateSubmission = async () => {
    setIsLoading(true);
    toast.info('Sedang memproses pengajuan Anda...');
    
    try {
      // Gunakan metode simulasi dari service
      const result = await tuitionReliefService.simulateSubmission(formData);
      console.log('Simulated response:', result);
      
      // Simpan nomor referensi dari respons simulasi
      if (result && result.data && result.data.referenceNumber) {
        setReferenceNumber(result.data.referenceNumber);
      }
      
      toast.success('Pengajuan berhasil dikirim!');
      setIsLoading(false);
      setIsSubmitted(true);
      return true;
    } catch (error) {
      console.error('Error in simulation:', error);
      toast.error('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
      setIsLoading(false);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Pilih salah satu fungsi berdasarkan mode (development/production)
    // Untuk development tanpa backend yang sudah siap:
    return await simulateSubmission();
    
    // Untuk production dengan backend yang sudah siap:
    // return await sendDataToBackend();
  };

  const handleReset = () => {
    toast.info('Formulir direset!');
    setFormData({
      monthlyIncome: '',
      parentIncome: '',
      dependents: '',
      housingStatus: 'kost', 
      housingCost: '',
      transportationCost: '',
      otherExpenses: '',
      reliefType: 'partial', 
      reasonCategory: '', 
      requestedAmount: '',
      reliefReason: '',
    });
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow">
        <div className="bg-red-800 py-4 px-6">
          <h1 className="text-white text-2xl font-bold">Formulir Pengajuan Keringanan Biaya</h1>
        </div>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="py-6 px-8 space-y-6">
            {/* Form content here */}
            <button
              type="submit"
              disabled={isLoading}
              className="py-2 px-4 bg-red-800 text-white rounded"
            >
              {isLoading ? 'Memproses...' : 'Kirim Pengajuan'}
            </button>
          </form>
        ) : (
          <div className="py-6 px-8 text-center">
            <h2 className="text-xl font-bold mb-2">Pengajuan Berhasil</h2>
            <p className="mb-4">
              Nomor Referensi: <span className="font-bold">{referenceNumber}</span>
            </p>
            <button
              onClick={handleReset}
              className="py-2 px-4 bg-red-800 text-white rounded"
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