import React, { useState } from 'react';
import handleBack from '../../components/handleBack';
handleBack

const FinanceEvaluationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    income: '',
    expenses: '',
    financialGoal: '',
    supportDocument: null
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-[#FAF0E6] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-[#951A22] text-white text-center py-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Formulir Pengajuan</h1>
        </div>
        
        <form 
          onSubmit={handleSubmit} 
          className="p-6 sm:p-8 space-y-6"
          encType="multipart/form-data"
        >
          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-gray-700"
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-[#951A22]/50 
                           transition duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-[#951A22]/50 
                           transition duration-300"
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label 
                htmlFor="income" 
                className="block text-sm font-medium text-gray-700"
              >
                Penghasilan Bulanan
              </label>
              <input
                type="number"
                id="income"
                name="income"
                value={formData.income}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-[#951A22]/50 
                           transition duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <label 
                htmlFor="expenses" 
                className="block text-sm font-medium text-gray-700"
              >
                Pengeluaran Bulanan
              </label>
              <input
                type="number"
                id="expenses"
                name="expenses"
                value={formData.expenses}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-[#951A22]/50 
                           transition duration-300"
              />
            </div>
          </div>

          {/* Financial Goal */}
          <div className="space-y-2">
            <label 
              htmlFor="financialGoal" 
              className="block text-sm font-medium text-gray-700"
            >
              Tujuan Finansial
            </label>
            <textarea
              id="financialGoal"
              name="financialGoal"
              value={formData.financialGoal}
              onChange={handleInputChange}
              rows={4}
              required
              placeholder='Tulis alasan dan tujuan pengajuan keringanan'
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-[#951A22]/50 
                         transition duration-300 resize-none"
            />
          </div>

          {/* Document Upload */}
          <div className="space-y-2">
            <label 
              htmlFor="supportDocument" 
              className="block text-sm font-medium text-gray-700"
            >
              Unggah Dokumen Pendukung
            </label>
            <input
              type="file"
              id="supportDocument"
              name="supportDocument"
              onChange={handleInputChange}
              className="w-full px-3 py-2 border-2 border-dashed border-gray-300 
                         rounded-md file:mr-4 file:rounded-md file:border-0
                         file:bg-[#951A22] file:text-white file:px-4 file:py-2
                         hover:file:bg-[#7a1118] transition duration-300"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#951A22] text-white 
                         rounded-lg hover:bg-[#7a1118] 
                         focus:outline-none focus:ring-2 focus:ring-[#951A22] 
                         transition duration-300 transform hover:-translate-y-1"
            >
              Kirim Pengajuan
            </button>
            
            <button
              onClick={handleBack}
              className="w-full sm:w-auto px-6 py-3 border-2 border-[#951A22] 
                         text-[#951A22] rounded-lg 
                         hover:bg-[#951A22] hover:text-white 
                         focus:outline-none focus:ring-2 focus:ring-[#951A22] 
                         transition duration-300 transform hover:-translate-y-1"
            >
              Batalkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinanceEvaluationForm;