import React from 'react';

const StudentInfoFinansialPage = ({ studentData }) => {
    const mockStatusFinansial = 'Siaga';
    return (
        <div className="bg-orange-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-2">Informasi Mahasiswa</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <p className="text-sm text-gray-600">Nama</p>
                    <p className="font-medium">{studentData.name}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">NIM</p>
                    <p className="font-medium">{studentData.nim}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Semester</p>
                    <p className="font-medium">{studentData.semester}</p>
                </div>
            </div>
            <div>
                <br />
                Status Finansial: <br />
                <h4 className="text-lg font-medium mb-2">
                    {mockStatusFinansial}
                </h4>
            </div>
        </div>
    );
};

export default StudentInfoFinansialPage;
