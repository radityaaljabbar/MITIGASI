import React from "react";

/**
 * Komponen untuk menampilkan daftar kartu IP per semester.
 * Component to display a list of GPA cards per semester.
 * @param {object} props - Props komponen.
 * @param {Array} props.dataSemester - Array data IP per semester.
 */
const IPSemesterCard = ({ dataSemester }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-3 min-h-[120px] max-h-[250px] flex flex-col justify-evenly items-center gap-[1px] overflow-y-auto">
      <h2 className="text-xl mb-2 text-center">IP Semester</h2>

      {/* Daftar IP semester dengan scroll horizontal jika perlu */}
      {/* List of semester GPAs with horizontal scroll if needed */}
      <ul className="p-3 m-0 w-full max-w-full flex flex-row flex-wrap justify-center gap-3 list-none overflow-y-auto">
        {/* Melakukan iterasi pada data semester untuk membuat setiap kartu */}
        {/* Iterating over the semester data to create each card */}
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