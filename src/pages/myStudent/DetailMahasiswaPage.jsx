import React from 'react';
import { useParams } from 'react-router';

const DetailMahasiswaPage = () => {
    const { nim } = useParams();
    return <div>Hello World... {nim}</div>;
};

export default DetailMahasiswaPage;
