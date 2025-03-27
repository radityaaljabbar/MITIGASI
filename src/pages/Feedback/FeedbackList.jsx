import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import feedbackDatas from '../../assets/data/feedback.json'


const MyFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading feedback data
  useEffect(() => {
    // This would typically be an API call
    
    setTimeout(() => {
      setFeedbackList(feedbackDatas);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateFeedback = () => {
    // Handle create feedback logic
    console.log('Create new feedback');
  };

  const handleViewDetail = (feedbackId) => {
    // Handle view detail logic
    console.log('View detail for feedback id:', feedbackId);
  };

  return (
    <div className="bg-[#FAF0E6] min-h-screen flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4 sm:p-6 mt-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Daftar Feedback</h1>
        
        <Link 
          to="new-feedback" // ini nanti diganti yang isinya "$nim_mahasiswa"
          className="flex items-center gap-2 bg-[#951A22] hover:bg-[#7A1118] text-white font-medium py-2 px-4 rounded transition-all duration-200 mb-6 shadow-sm hover:shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Buat Feedback Baru</span>
        </Link>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#951A22]"></div>
          </div>
        ) : (
          <ul className="space-y-3">
            {feedbackList.length > 0 ? (
              feedbackList.map((feedback) => (
                <li 
                  key={feedback.feedbackId}
                  className="border-l-4 border-[#951A22] bg-white p-4 rounded shadow-sm hover:translate-x-1 transition-transform duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div className="flex flex-col w-full sm:w-auto">
                    <span className="font-medium text-gray-800 mb-1 sm:mb-0">{feedback.title}</span>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm mt-2 sm:mt-0">
                      <span className="text-gray-500">{feedback.feedbackDate}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor(feedback.status)}`}>
                        {feedback.status}
                      </span>
                    </div>
                  </div>
                  <Link
                  to={`${feedback.feedbackId}`}
                    // onClick={() => handleViewDetail(feedback.feedbackId)}
                    className="bg-[#951A22] hover:bg-[#7A1118] text-white text-sm py-2 px-4 rounded transition-colors duration-200 mt-2 sm:mt-0 w-full sm:w-auto"
                  >
                    Lihat Detail
                  </Link>
                </li>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-lg">Belum ada feedback</p>
                <p className="text-gray-400 mt-2">Klik tombol "Buat Feedback Baru" untuk memulai</p>
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyFeedback;