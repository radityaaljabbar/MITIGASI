import React, { useEffect, useState } from 'react';
import { ArrowLeft, Paperclip, Send, Printer, FileText } from 'lucide-react';
import getStatusColor from '../../../components/statusColor';
import { getFeedbackResponse } from '../../../services/dosenWali/myReport/listFeedbackMahasiswaService';

const StudentDetailView = ({ student, onBack }) => {
    const [komentar, setKomentar] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [studentDetail, setStudentDetail] = useState(student);
    const [responseData, setResponseData] = useState(null);
    const [komentarList, setKomentarList] = useState([]);
    const [debugInfo, setDebugInfo] = useState('');

    // Fetch detail feedback mahasiswa
    // Inside the useEffect for fetching dosen response
    useEffect(() => {
        const fetchDosenResponse = async () => {
            if (student.feedbackId) {
                setDebugInfo(
                    `Starting to fetch response for ID: ${student.feedbackId}`
                );
                try {
                    const response = await getFeedbackResponse(
                        student.feedbackId
                    );

                    console.log('Dosen response data:', response);
                    setDebugInfo(
                        (prev) =>
                            `${prev}\nAPI response: ${JSON.stringify(
                                response,
                                null,
                                2
                            )}`
                    );

                    if (response.success && response.data) {
                        setResponseData(response.data);

                        // Update student status based on response status
                        setStudentDetail((prev) => ({
                            ...prev,
                            status: response.data.status,
                        }));

                        // Create a new comment from the response
                        const newComment = {
                            id: response.data.responseId,
                            name: 'Dosen Wali',
                            text: response.data.responseText,
                            timestamp: response.data.responseDate,
                            isDosenResponse: true,
                        };

                        // Replace the entire comment list
                        setKomentarList([newComment]);
                        setDebugInfo(
                            (prev) =>
                                `${prev}\nResponse data found and added to comments.`
                        );
                    } else {
                        // If no response found, show waiting message
                        setKomentarList([
                            {
                                id: 1,
                                name: 'System',
                                text: 'Keluhan anda belum di respon, mohon menunggu',
                                timestamp: new Date().toLocaleString('id-ID'),
                                isSystemMessage: true,
                            },
                        ]);
                        setDebugInfo(
                            (prev) =>
                                `${prev}\nNo response data found, showing waiting message.`
                        );
                    }
                } catch (error) {
                    console.error('Error fetching dosen response:', error);
                    setDebugInfo((prev) => `${prev}\nError: ${error.message}`);

                    // Set waiting message if there's an error
                    setKomentarList([
                        {
                            id: 1,
                            name: 'System',
                            text: 'Keluhan anda belum di respon, mohon menunggu',
                            timestamp: new Date().toLocaleString('id-ID'),
                            isSystemMessage: true,
                        },
                    ]);
                }
            }
        };

        fetchDosenResponse();
    }, [student.feedbackId]);

    const handleKirimKomentar = () => {
        if (komentar.trim()) {
            const newComment = {
                id: komentarList.length + 2,
                name: 'You',
                text: komentar,
                timestamp:
                    new Date().toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                    }) +
                    ' WIB, ' +
                    new Date().toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    }),
            };

            setKomentarList([...komentarList, newComment]);
            setKomentar('');
        }
    };

    // State loading
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow p-4 md:p-6 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // State error
    if (error) {
        return (
            <div className="bg-white rounded-xl shadow p-4 md:p-6">
                <button
                    className="text-sm text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors mb-4"
                    onClick={onBack}>
                    <ArrowLeft size={16} />
                    <span>Kembali ke Daftar</span>
                </button>

                <div className="text-center p-4 text-red-600">
                    <p className="font-medium">Error: {error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => window.location.reload()}>
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden transition-all duration-300 hover:shadow-lg">
            {/* Header with breadcrumb */}
            <div className="bg-gray-50 p-4 md:p-6 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <button
                        className="text-sm text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors"
                        onClick={onBack}>
                        <ArrowLeft size={16} />
                        <span>Kembali ke Daftar</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 space-y-6">
                {/* Student info card */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex flex-col md:flex-row md:justify-between gap-2">
                        <div>
                            <h2 className="font-bold text-lg text-blue-900">
                                {studentDetail.name}
                            </h2>
                            <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-blue-800">
                                <span className="font-medium">
                                    NIM: {studentDetail.nim}
                                </span>
                                <span>Kelas: {studentDetail.kelas}</span>
                            </div>
                        </div>
                        <div className="text-sm text-blue-700">
                            {studentDetail.feedbackDate}
                        </div>
                    </div>
                </div>

                {/* Report content */}
                <div className="space-y-4">
                    <div className="border-b pb-2">
                        <h3 className="font-bold text-base mb-1">
                            {studentDetail.title}
                        </h3>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor(
                                studentDetail.status || 'Menunggu Respon'
                            )}`}>
                            {studentDetail.status || 'Menunggu Respon'}
                        </span>
                    </div>

                    <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                        {studentDetail.details}
                    </div>
                </div>

                {/* Attachments - placeholder since API doesn't provide attachments */}
                <div className="space-y-3">
                    <p className="font-semibold text-sm">Lampiran:</p>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 p-2 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <FileText size={20} className="text-blue-600" />
                            <span className="text-sm">
                                Surat_Permohonan.docx
                            </span>
                        </div>
                    </div>
                </div>

                {/* Comment section */}
                <div>
                    <h4 className="font-semibold text-sm mb-3">Komentar:</h4>

                    {/* Comment list */}
                    <div className="space-y-3 mb-4">
                        {komentarList.length > 0 ? (
                            komentarList.map((comment) => (
                                <div
                                    key={comment.id}
                                    className={`p-3 rounded-lg text-sm ${
                                        comment.name === 'You'
                                            ? 'bg-blue-50 border-blue-100 ml-4'
                                            : comment.isDosenResponse
                                            ? 'bg-green-50 border-green-100'
                                            : comment.isSystemMessage
                                            ? 'bg-yellow-50 border-yellow-100 text-center font-medium'
                                            : 'bg-gray-50 border-gray-100 mr-4'
                                    } border`}>
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium">
                                            {comment.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {comment.timestamp}
                                        </span>
                                    </div>
                                    <p>{comment.text}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500 italic">
                                Belum ada komentar
                            </div>
                        )}
                    </div>

                    {/* Comment input */}
                    <div className="mt-4 space-y-2">
                        <div className="flex">
                            <textarea
                                placeholder="Tambahkan komentar..."
                                className="w-full p-3 border border-gray-300 rounded-l-xl text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none resize-none"
                                rows="3"
                                value={komentar}
                                onChange={(e) =>
                                    setKomentar(e.target.value)
                                }></textarea>
                            <div className="flex flex-col border-t border-r border-b border-gray-300 rounded-r-xl">
                                <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                                    <Paperclip size={20} />
                                </button>
                                <button
                                    onClick={handleKirimKomentar}
                                    disabled={!komentar.trim()}
                                    className={`flex-grow p-2 ${
                                        komentar.trim()
                                            ? 'text-blue-600 hover:text-blue-800'
                                            : 'text-gray-400'
                                    } transition-colors`}>
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
                        <span>Cetak Laporan</span>
                    </button>
                    <button
                        className={`flex items-center justify-center gap-2 px-4 py-2 ${
                            responseData ? 'bg-green-600' : 'bg-blue-600'
                        } text-white rounded-xl text-sm hover:${
                            responseData ? 'bg-green-700' : 'bg-blue-700'
                        } transition-colors`}>
                        <Send size={16} />
                        <span>
                            {responseData ? 'Edit Respon' : 'Kirim Respon'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailView;
