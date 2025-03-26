import React from 'react';
import RekomendasiMataKuliah from '../components/myCourseComponents/RekomendasiMataKuliah';
import RiwayatMataKuliah from '../components/myCourseComponents/RiwayatMataKuliah';

const MyCoursePage = () => {
    return (
        <div className="flex flex-col items-center justify-center p-5 gap-7 w-full">
            <RekomendasiMataKuliah />
            <RiwayatMataKuliah />
        </div>
    );
};

export default MyCoursePage;
