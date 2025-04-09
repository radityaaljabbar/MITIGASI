import React from 'react';

const IpkSksTakCard = ({ title, value }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-3 w-[13em] min-h-[90px] max-h-[90px] flex flex-col items-center justify-evenly">
            <h3 className="text-lg text-center mb-1">{title}</h3>
            <p className="text-lg font-bold">{value}</p>
        </div>
    );
};

export default IpkSksTakCard;
