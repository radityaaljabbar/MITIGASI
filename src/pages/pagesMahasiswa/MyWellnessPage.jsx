import React from 'react';
import { useState, useEffect } from 'react';
//Importing komponen2 MyWellness
import MyWellness_Tested from '../../components/compMahasiswa/myWellnessComponents/MyWellness_Tested';
import MyWellness_NotTested from '../../components/compMahasiswa/myWellnessComponents/MyWellness_NotTested';

//Import fungsi service
import { getPsiResult } from '../../services/mahasiswaServices/myWellnessService';

const MyWellnessPage = () => {
    const [dataPsikologi, setDataPsikologi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // get data from service
    useEffect(() => {
        const getDataPsikologi = async () => {
            try {
                setLoading(true);
                const response = await getPsiResult();

                if (response.success && response.data.length > 0) {
                    // Get the first result from the data array
                    setDataPsikologi(response.data[0]);
                } else {
                    // If response is successful but no data, or if response failed
                    setDataPsikologi(null);
                    if (!response.success) {
                        setError(response.message);
                    }
                }
            } catch (error) {
                console.error('Error fetching psychological data:', error);
                setError('Failed to load data. Please try again later.');
                setDataPsikologi(null);
            } finally {
                setLoading(false);
            }
        };

        getDataPsikologi();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen p-5 gap-7 w-full">
            {loading ? (
                <div className="text-center">
                    <p>Loading wellness data...</p>
                </div>
            ) : error ? (
                <div className="text-center text-red-500">
                    <p>{error}</p>
                </div>
            ) : dataPsikologi ? (
                <MyWellness_Tested dataPsikologi={dataPsikologi} />
            ) : (
                <MyWellness_NotTested />
            )}
        </div>
    );
};

export default MyWellnessPage;
