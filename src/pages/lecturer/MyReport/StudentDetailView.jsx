import React, { useState } from "react";
import { ArrowLeft, Paperclip, Send, Printer, ChevronRight, FileText } from "lucide-react";
import getStatusColor from '../../../components/statusColor'

const StudentDetailView = ({ student, onBack }) => {
  const [komentar, setKomentar] = useState("");
  const [komentarList, setKomentarList] = useState([
    {
      id: 1,
      name: "Admin",
      text: "Mohon untuk melengkapi dokumen yang dibutuhkan",
      timestamp: "10:30 WIB, 25 Des 2024"
    }
  ]);

  const handleKirimKomentar = () => {
    if (komentar.trim()) {
      const newComment = {
        id: komentarList.length + 2,
        name: "You",
        text: komentar,
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit"
        }) + " WIB, " + new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric"
        })
      };
      
      setKomentarList([...komentarList, newComment]);
      setKomentar("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Header with breadcrumb */}
      <div className="bg-gray-50 p-4 md:p-6 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <button 
            className="text-sm text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors"
            onClick={onBack}
          >
            <ArrowLeft size={16} /> 
            <span>Kembali ke Daftar</span>
          </button>
          
          <div className="flex items-center text-sm text-gray-500">
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span>My Report</span>
            <ChevronRight size={14} />
            <span className="font-medium text-gray-700">{student.name}</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Student info card */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex flex-col md:flex-row md:justify-between gap-2">
            <div>
              <h2 className="font-bold text-lg text-blue-900">{student.name}</h2>
              <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-blue-800">
                <span className="font-medium">NIM: {student.nim}</span>
                <span>Kelas: {student.kelas}</span>
              </div>
            </div>
            <div className="text-sm text-blue-700">
              {student.feedbackDate}
            </div>
          </div>
        </div>
        
        {/* Report content */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="font-bold text-base mb-1">
              {student.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor(student.status)}`}>
              {student.status}
            </span>
          </div>
          
          <div className="text-sm text-gray-700 leading-relaxed space-y-4">
            {student.details}
          </div>
        </div>
        
        {/* Attachments */}
        <div className="space-y-3">
          <p className="font-semibold text-sm">Lampiran:</p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 p-2 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <FileText size={20} className="text-blue-600" />
              <span className="text-sm">Surat_Permohonan.docx</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              {/* <FilePdf size={20} className="text-red-600" /> */}
              <span className="text-sm">Dokumen_Pendukung.pdf</span>
            </div>
          </div>
        </div>
        
        {/* Comment section */}
        <div>
          <h4 className="font-semibold text-sm mb-3">Komentar:</h4>
          
          {/* Comment list */}
          <div className="space-y-3 mb-4">
            {komentarList.map(comment => (
              <div 
                key={comment.id}
                className={`p-3 rounded-lg text-sm ${
                  comment.name === "You" 
                    ? "bg-blue-50 border-blue-100 ml-4" 
                    : "bg-gray-50 border-gray-100 mr-4"
                } border`}
              >
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{comment.name}</span>
                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                </div>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
          
          {/* Comment input */}
          <div className="mt-4 space-y-2">
            <div className="flex">
              <textarea
                placeholder="Tambahkan komentar..."
                className="w-full p-3 border border-gray-300 rounded-l-xl text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none resize-none"
                rows="3"
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
              ></textarea>
              <div className="flex flex-col border-t border-r border-b border-gray-300 rounded-r-xl">
                <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <Paperclip size={20} />
                </button>
                <button
                  onClick={handleKirimKomentar}
                  disabled={!komentar.trim()}
                  className={`flex-grow p-2 ${
                    komentar.trim() 
                      ? "text-blue-600 hover:text-blue-800" 
                      : "text-gray-400"
                  } transition-colors`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col md:flex-row justify-end gap-3 pt-6 border-t">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200 transition-colors">
            <Printer size={16} />
            <span>Cetak Hasil Kuesioner</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors">
            <Send size={16} />
            <span>Kirim Respon</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailView;