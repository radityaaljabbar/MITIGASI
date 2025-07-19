import React from 'react';

/**
 * Komponen sederhana untuk menampilkan indikator loading.
 * A simple component to display a loading indicator.
 */
const LoadingAnalisisFinansial = () => {
    return (
        // Flex container untuk memusatkan spinner
        // Flex container to center the spinner
        <div className="flex justify-center items-center h-64">
            {/* Elemen spinner dengan animasi putar */}
            {/* Spinner element with a rotation animation */}
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#951A22]"></div>
        </div>
    );
};

export default LoadingAnalisisFinansial;