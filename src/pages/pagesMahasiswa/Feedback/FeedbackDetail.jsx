import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import feedbackDatas from '../../../assets/data/feedback.json';
import handleBack from '../../../components/handleBack';
import { FileText, X, Download, ExternalLink } from 'lucide-react'; // Import icons

const MyFeedbackDetails = () => {
  const [feedbackData, setFeedbackData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [activePdf, setActivePdf] = useState(null);
  const { feedbackId } = useParams();

  useEffect(() => {
    const id = Number(feedbackId);
    console.log(id);
    const foundFeedback = feedbackDatas.find(item => Number(item.feedbackId) === id);
    
    // Simulate API fetch for feedback details
    setTimeout(() => {
      // Adding attachments field if not present in the data
      const feedback = {
        ...foundFeedback,
        attachments: foundFeedback.attachments || [
          {
            id: 1,
            name: 'Surat_Permohonan.docx',
            type: 'docx',
            url: '/path/to/document.docx' // In a real implementation, this would be a path to the actual file
          },
          {
            id: 2,
            name: 'Dokumen_Pendukung.pdf',
            type: 'pdf',
            url: '/path/to/document.pdf' // In a real implementation, this would be a path to the actual file
          }
        ]
      };
      
      setFeedbackData(feedback);
      setIsLoading(false);
    }, 500);
  }, [feedbackId]);

  const handleOpenPdf = (pdf) => {
    setActivePdf(pdf);
    setShowPdfModal(true);
  };

  const handleClosePdf = () => {
    setShowPdfModal(false);
    setActivePdf(null);
  };

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

          {/* Attachments Section */}
          {feedbackData?.attachments && feedbackData.attachments.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold text-sm mb-2">Lampiran:</p>
              <div className="flex flex-wrap gap-3">
                {feedbackData.attachments.map((attachment) => (
                  <div 
                    key={attachment.id}
                    onClick={() => attachment.type === 'pdf' ? handleOpenPdf(attachment) : null}
                    className={`flex items-center gap-2 p-2 bg-gray-50 border rounded-lg transition-colors ${attachment.type === 'pdf' ? 'hover:bg-gray-100 cursor-pointer' : ''}`}
                  >
                    {attachment.type === 'docx' ? (
                      <FileText size={20} className="text-blue-600" />
                    ) : (
                      <FileText size={20} className="text-gray-600" />
                    )}
                    <span className="text-sm">{attachment.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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

      {/* PDF Viewer Modal */}
      {showPdfModal && activePdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full h-5/6 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg">{activePdf.name}</h3>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full"
                  title="Unduh"
                >
                  <Download size={20} />
                </button>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full"
                  title="Buka di tab baru"
                  onClick={() => window.open(activePdf.url, '_blank')}
                >
                  <ExternalLink size={20} />
                </button>
                <button 
                  onClick={handleClosePdf}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  title="Tutup"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden p-4">
              <div className="w-full h-full">
                {/* Using an iframe to embed the PDF */}
                <iframe
                  src={`${activePdf.url}#toolbar=0&navpanes=0`}
                  title={activePdf.name}
                  className="w-full h-full border-0 rounded"
                >
                  Your browser does not support PDFs. Please download the PDF to view it.
                </iframe>
                
                {/* Fallback for when iframe doesn't work properly */}
                <div className="hidden">
                  <p className="text-center py-4">
                    PDF tidak dapat ditampilkan. Silakan
                    <a href={activePdf.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">
                      unduh disini
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFeedbackDetails;