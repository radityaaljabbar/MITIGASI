import React, { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import handleBack from '../../components/handleBack';

const FeedbackForm = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [formData, setFormData] = useState({
    feedbackId: null,
    nim: '1301190001', // Hardcoded for this example
    title: '',
    feedbackDate: new Date().toISOString(),
    details: '',
    responseDate: '', 
    response: '', 
    status: 'Pending'
  });

  // Fungsi untuk membaca file JSON
  const readFeedbackFile = () => {
    try {
      const filePath = path.join(__dirname, '../../assets/data/feedback.json');
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents);
    } catch (error) {
      console.error('Error reading feedback file:', error);
      return [];
    }
  };

  // Fungsi untuk menulis ke file JSON
  const writeFeedbackFile = (data) => {
    try {
      const filePath = path.join(__dirname, 'feedback.json');
      fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    } catch (error) {
      console.error('Error writing to feedback file:', error);
    }
  };

  // Memuat data feedback saat komponen dimuat
  useEffect(() => {
    const existingFeedback = readFeedbackFile();
    setFeedbackData(existingFeedback);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id === 'feedback-title' ? 'title' : 'details']: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Buat entri feedback baru
    const newFeedback = {
      ...formData,
      feedbackId: feedbackData.length + 1, // Generate ID berdasarkan panjang data
      feedbackDate: new Date().toISOString()
    };

    // Tambahkan feedback baru ke array
    const updatedFeedbackData = [...feedbackData, newFeedback];

    // Tulis ke file
    writeFeedbackFile(updatedFeedbackData);

    // Update state lokal
    setFeedbackData(updatedFeedbackData);

    // Reset form
    setFormData({
      feedbackId: null,
      nim: '1301190001',
      title: '',
      feedbackDate: new Date().toISOString(),
      details: '',
      responseDate: '', 
      response: '', 
      status: 'Pending'
    });

    // Kembali ke halaman sebelumnya atau beri notifikasi
    alert('Feedback berhasil dikirim!');
    handleBack();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 bg-[#FAF0E6] h-screen overflow-auto">
      <div className="bg-white shadow-md rounded-xl p-4 md:p-8 w-full max-w-3xl mx-auto transition-all duration-300">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="feedback-title" className="font-semibold mb-2 text-gray-800">
            Judul (Opsional)
          </label>
          <input
            type="text"
            id="feedback-title"
            placeholder="Judul Feedback"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-3 mb-6 border border-gray-200 rounded-lg focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/10 font-sans transition-all duration-300"
          />
          
          <label htmlFor="feedback-content" className="font-semibold mb-2 text-gray-800">
            Feedback Anda
          </label>
          <textarea
            id="feedback-content"
            placeholder="Tulis feedback Anda di sini"
            value={formData.details}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-40"
            required
          />
          
          <div className="flex flex-wrap gap-4 mt-2 justify-start sm:flex-row flex-col">
            <button
              type="submit"
              className="bg-red-800 text-white font-medium px-6 py-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-red-900 hover:translate-y-0 hover:shadow-md flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              <span>Kirim Feedback</span>
            </button>
            <button
              onClick={handleBack}
              type="button"
              className="bg-red-800 text-white font-medium px-6 py-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-red-900 hover:translate-y-0 hover:shadow-md flex items-center justify-center gap-2 order-2 sm:order-1"
            >
              <i className="fas fa-times mr-2"></i>
              <span>Batal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;