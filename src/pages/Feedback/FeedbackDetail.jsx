import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import feedbackDatas from '../../assets/data/feedback.json'
import handleBack from '../../components/handleBack';

const MyFeedbackDetails = () => {
  const [feedbackData, setFeedbackData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { feedbackId } = useParams()


  useEffect(() => {
    const id = Number(feedbackId)
    console.log(id)
    const foundFeedback = feedbackDatas.find(item => Number(item.feedbackId) === id);
    // Simulate API fetch for feedback details
    setTimeout(() => {
      setFeedbackData(foundFeedback);
      setIsLoading(false);
    }, 1000);
  }, []);


  if (isLoading) {
    return (
      <div className="bg-[#FAF0E6] min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl w-full flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#951A22]"></div>
          <p className="mt-4 text-gray-600">Memuat data feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF0E6] min-h-screen flex items-start justify-center p-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 max-w-2xl w-full">
        {/* Feedback Details Section */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-5">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
            {feedbackData?.title}
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Tanggal: {feedbackData?.feedbackDate}
            </span>
          </p>
          <div className="prose prose-sm sm:prose max-w-none text-gray-700">
            <p className="leading-relaxed">
              {feedbackData?.details}
            </p>
          </div>
        </div>

        {/* Advisor's Response Section */}
        <div className="bg-gray-100 rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex items-center mb-3">
            <div className="bg-[#951A22] p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Tanggapan Dosen Wali
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Tanggal: {feedbackData?.responseDate}
            </span>
          </p>
          <div className="prose prose-sm sm:prose max-w-none text-gray-700">
            <p className="leading-relaxed">
              {feedbackData?.response}
            </p>
          </div>
        </div>

        {/* Back Button with Animation */}
        <button 
          onClick={handleBack}
          className="flex items-center bg-[#951A22] hover:bg-[#7A1118] text-white px-5 py-2.5 rounded-lg transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali</span>
        </button>
      </div>
    </div>
  );
};

export default MyFeedbackDetails;