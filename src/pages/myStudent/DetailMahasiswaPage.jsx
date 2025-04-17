import React from 'react';
import { useParams } from 'react-router';

const DetailMahasiswaPage = () => {
    const { nim } = useParams();
    return <div>{nim}</div>;
};

export default DetailMahasiswaPage;
