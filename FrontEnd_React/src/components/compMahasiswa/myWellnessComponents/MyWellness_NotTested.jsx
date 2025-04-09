import React from 'react';
import { Link } from 'react-router';

const MyWellness_NotTested = () => {
    return (
        <div className="bg-white shadow-md px-8 py-8 w-full max-w-[800px] rounded-2xl flex flex-col items-center text-center gap-5">
            <h1 className="text-[#951A22] text-[1.8rem] w-full text-center border-b-2 border-[#eee] pb-3">
                Evaluasi Kondisi Psikologis Mahasiswa
            </h1>

            <p className="max-w-[600px] leading-[1.6] text-[#555] mb-2">
                Evaluasi kondisi psikologis Anda. Jawab pertanyaan-pertanyaan
                yang disediakan dengan baik dan benar.
            </p>

            <button className="px-4 py-2 bg-[#951a22] text-white font-medium rounded-lg hover:bg-[#7a1118] hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#951a22]/50 text-sm">
                <Link to="/my-wellness/psi-test">Mulai Evaluasi</Link>
            </button>
        </div>
    );
};

export default MyWellness_NotTested;
