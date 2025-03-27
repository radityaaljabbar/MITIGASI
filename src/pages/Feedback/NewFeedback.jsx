import React, { useState } from 'react';
import handleBack from '../../components/handleBack';

const FeedbackForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 bg-[#FAF0E6] h-screen overflow-auto">
      <div className="bg-white shadow-md rounded-xl p-4 md:p-8 w-full max-w-3xl mx-auto transition-all duration-300">
        <form className="flex flex-col">
          <label htmlFor="feedback-title" className="font-semibold mb-2 text-gray-800">
            Judul (Opsional)
          </label>
          <input
            type="text"
            id="feedback-title"
            placeholder="Judul Feedback"
            className="w-full px-4 py-3 mb-6 border border-gray-200 rounded-lg focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/10 font-sans transition-all duration-300"
          />
          
          <label htmlFor="feedback-content" className="font-semibold mb-2 text-gray-800">
            Feedback Anda
          </label>
          <textarea
            id="feedback-content"
            placeholder="Tulis feedback Anda di sini"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-40"
          />
          
          <div className="flex flex-wrap gap-4 mt-2 justify-start sm:flex-row flex-col">
            <button
              type="button"
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