import React from 'react';
import RekomendasiMataKuliah from '../../components/compMahasiswa/myCourseComponents/RekomendasiMataKuliah';
import RiwayatMataKuliah from '../../components/compMahasiswa/myCourseComponents/RiwayatMataKuliah';

const MyCoursePage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen p-5 gap-7 w-full">
            <RekomendasiMataKuliah />
            <RiwayatMataKuliah />
        </div>
    );
};

export default MyCoursePage;
