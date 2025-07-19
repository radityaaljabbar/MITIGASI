import React from 'react';
import { Link } from 'react-router'; // Menggunakan Link dari react-router versi lama

/**
 * Komponen yang ditampilkan ketika mahasiswa sudah pernah mengisi kuesioner evaluasi psikologi.
 * Menampilkan ringkasan hasil terakhir.
 * Component displayed when a student has already completed a psychological evaluation questionnaire.
 * It shows a summary of the latest results.
 * @param {object} props - Props komponen.
 * @param {object} props.dataPsikologi - Data hasil evaluasi psikologi terakhir.
 */
const MyWellness_Tested = ({ dataPsikologi }) => {
    // Fungsi untuk menangani aksi cetak halaman
    // Function to handle the page print action
    const handlePrint = () => {
        window.print();
    };

    // Menangani kasus jika tidak ada data yang diterima
    // Handling the case where no data is received
    if (!dataPsikologi) {
        return (
            <div className="p-6 w-full flex flex-col gap-6 text-sm">
                <p>No user data available.</p>
            </div>
        );
    }

    // Memformat tanggal dari string menjadi format yang lebih mudah dibaca
    // Formatting the date from a string to a more readable format
    const dateString = dataPsikologi.tanggalTes;
    const formattedDate = new Date(dateString).toLocaleString('en-US', {
        dateStyle: 'medium', // Opsi: 'short', 'medium', 'long'
    });

    return (
        <div className="p-6 w-full flex flex-col gap-6 text-sm">
            {/* Kartu Header */}
            {/* Header Card */}
            <div className="w-full max-w-[900px] mx-auto p-6 bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex flex-col gap-5">
                <h1 className="text-[clamp(1.5rem,4vw,1.8rem)] font-bold text-[#222] leading-[1.2]">
                    Evaluasi Kondisi Psikologis Mahasiswa
                </h1>
                <p className="text-[clamp(0.9rem,2.5vw,1rem)] text-[#444] leading-[1.5] max-w-[700px]">
                    Anda telah mengisi questioner evaluasi psikologi pada:{' '}
                    {formattedDate}
                </p>
            </div>

            {/* Kartu Hasil Evaluasi */}
            {/* Evaluation Results Card */}
            <div className="w-full max-w-[900px] mx-auto bg-white p-6 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex flex-col gap-5">
                <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] text-[#333] mb-[0.3rem]">
                    Hasil Evaluasi Psikologis Anda
                </h2>
                {/* Menampilkan ringkasan kesimpulan dari hasil tes */}
                {/* Displaying the conclusion summary from the test results */}
                <p className="text-[clamp(0.85rem,2vw,0.95rem)] text-[#444] leading-[1.5] w-full p-[0.6rem] bg-[#f9f9f9] rounded-md border-l-[3px] border-l-[#951A22]">
                    <b>Ringkasan: {dataPsikologi.kesimpulan}</b>
                </p>
                {/* Menampilkan saran berdasarkan hasil tes */}
                {/* Displaying suggestions based on the test results */}
                <p className="text-[clamp(0.85rem,2vw,0.95rem)] text-[#444] leading-[1.5] w-full p-[0.6rem] bg-[#f9f9f9] rounded-md border-l-[3px] border-l-[#951A22]">
                    <b>Saran: {dataPsikologi.saran}</b>
                </p>
                {/* Menampilkan tanggal tes */}
                {/* Displaying the test date */}
                <p className="text-[clamp(0.85rem,2vw,0.95rem)] text-[#444] leading-[1.5] w-full p-[0.6rem] bg-[#f9f9f9] rounded-md border-l-[3px] border-l-[#951A22]">
                    <b>Tanggal Tes: {formattedDate}</b>
                </p>
                {/* Tombol aksi untuk memulai evaluasi baru */}
                {/* Action button to start a new evaluation */}
                <div className="flex flex-wrap gap-[0.8rem] mt-[0.8rem]">
                    <Link to="/student/my-wellness/psi-test">
                        <button className="bg-[#951A22] text-white py-3 px-6 rounded-lg cursor-pointer font-medium relative overflow-hidden transition-all duration-300 ease-in-out hover:bg-[#7a1118] hover:translate-y-[-2px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
                            <span className="relative z-[1]">
                                Mulai Evaluasi Baru
                            </span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MyWellness_Tested;