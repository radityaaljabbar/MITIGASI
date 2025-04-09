import React from 'react';

const IPSemesterCard = ({ dataSemester }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-3 min-h-[120px] max-h-[250px] flex flex-col justify-evenly items-center gap-[1px] overflow-y-auto">
            <h2 className="text-xl mb-2 text-center">
                Semester GPA (IP Semester)
            </h2>

            <ul className="p-3 m-0 w-full max-w-full flex flex-row flex-wrap justify-center gap-3 list-none overflow-y-auto">
                {dataSemester.map((dataS) => (
                    <li
                        key={dataS.id}
                        className="m-[0.2em_0.8em] flex w-[160px] justify-between">
                        <span className="flex-2">
                            {dataS.semester} Semester
                        </span>
                        <span className="flex-[0.2] text-center">:</span>
                        <span>{dataS.gpa.toFixed(2)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IPSemesterCard;
