import React, { useState } from 'react';
import handleBack from '../../../components/handleBack';

const FeedbackForm = () => {
    const handleBackClick = (e) => {
        e.preventDefault(); // Prevent the default form submission
        handleBack();
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 bg-[#FAF0E6] h-screen overflow-auto">
            <div className="bg-white shadow-md rounded-xl p-4 md:p-8 w-full max-w-3xl mx-auto transition-all duration-300">
                <form className="flex flex-col">
                    <label
                        htmlFor="feedback-title"
                        className="font-semibold mb-2 text-gray-800">
                        Judul (Opsional)
                    </label>
                    <input
                        type="text"
                        id="feedback-title"
                        placeholder="Judul Feedback"
                        className="w-full px-4 py-3 mb-6 border border-gray-200 rounded-lg focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/10 font-sans transition-all duration-300"
                    />

                    <label
                        htmlFor="feedback-content"
                        className="font-semibold mb-2 text-gray-800">
                        Feedback Anda
                    </label>
                    <textarea
                        id="feedback-content"
                        placeholder="Tulis feedback Anda di sini"
                        className="w-full px-3 mb-6 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-40"
                    />

                    {/* Document Upload */}
                    <label 
                        htmlFor="supportDocument" 
                        className="font-semibold mb-2 text-gray-800"
                    >
                        Unggah Dokumen Pendukung
                    </label>
                    <input
                        type="file"
                        id="supportDocument"
                        name="supportDocument"
                        className="w-full px-3 py-2 mb-6 border-2 border-dashed border-gray-300 
                                    rounded-md file:mr-4 file:rounded-md file:border-0
                                    file:bg-[#951A22] file:text-white file:px-4 file:py-2
                                    hover:file:bg-[#7a1118] transition duration-300"
                    />

                    

                    <div className="flex flex-wrap gap-4 mt-2 justify-start sm:flex-row flex-col">
                        <button
                            type="button"
                            onClick={handleBackClick}
                            className="flex items-center bg-[#951A22] hover:bg-[#7A1118] text-white px-5 py-2.5 rounded-lg transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            <span>Kembali</span>
                        </button>

                        <button
                            type="submit"
                            className="flex items-center bg-[#951A22] hover:bg-[#7A1118] text-white px-5 py-2.5 rounded-lg transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                            <span>Kirim Feedback</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackForm;
