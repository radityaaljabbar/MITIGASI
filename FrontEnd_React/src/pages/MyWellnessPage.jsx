import React from 'react';
import { useState, useEffect } from 'react';
//Import Data json:
import psikologiMahasiswa from '../assets/data/mockupjsonMyWellness/psikologiMahasiswa.json';
//Importing komponen2 MyWellness
import MyWellness_Tested from '../components/myWellnessComponents/MyWellness_Tested';
import MyWellness_NotTested from '../components/myWellnessComponents/MyWellness_NotTested';

const MyWellnessPage = () => {
    const NIMTest = 1103210088;
    const [dataPsikologi, setDataPsikologi] = useState(null);

    // Fungsi untuk ngasih data tergantung NIM avail atau tidak:
    useEffect(() => {
        // Fungsi untuk ambil data berdasarkan NIM
        const getDataPsikologi = () => {
            const result = psikologiMahasiswa.find(
                (data) => data.NIM === NIMTest
            );
            setDataPsikologi(result);
        };

        getDataPsikologi();
    }, [NIMTest]);

    return (
        <div className="flex flex-col items-center justify-center h-screen p-5 gap-7 w-full">
            {dataPsikologi ? (
                <MyWellness_Tested dataPsikologi={dataPsikologi} />
            ) : (
                <MyWellness_NotTested />
            )}
        </div>
    );
};

export default MyWellnessPage;
