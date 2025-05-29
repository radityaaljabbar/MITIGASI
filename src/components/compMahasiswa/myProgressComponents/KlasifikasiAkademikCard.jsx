import React from 'react';

const KlasifikasiAkademikCard = ({ status }) => {
    return (
        <div className="bg-white shadow-md p-3 rounded-lg text-center text-base">
            <h3 className="text-lg">Klasifikasi Akademik</h3>
            <p>
                <span className="text-green-600 font-bold capitalize-text">{status}</span>
            </p>
        </div>
    );
};

export default KlasifikasiAkademikCard;
