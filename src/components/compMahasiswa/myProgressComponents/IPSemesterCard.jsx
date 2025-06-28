import React from "react";

const IPSemesterCard = ({ dataSemester }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-3 min-h-[120px] max-h-[250px] flex flex-col justify-evenly items-center gap-[1px] overflow-y-auto">
      <h2 className="text-xl mb-2 text-center">IP Semester</h2>

      <ul className="p-3 m-0 w-full max-w-full flex flex-row flex-wrap justify-center gap-3 list-none overflow-y-auto">
        {dataSemester.map((dataS) => (
          <li key={dataS.semester} className="bg-white border border-gray-200 shadow rounded-lg px-4 py-3 w-[140px] text-center hover:shadow-md transition">
            <div className="text-xs text-gray-500 mb-1">Semester {dataS.semester}</div>
            <div className="text-lg font-semibold text-gray-800">{dataS.ipSemester.toFixed(2)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IPSemesterCard;
