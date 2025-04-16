import React, { useState } from "react";
import { Search, Filter, Download } from "lucide-react";
import feedbackDatas from '../../../assets/data/feedback.json'

const StudentListView = ({ onViewDetail }) => {
  // const students = [
  //   { id: 1, name: "MIFTAH FARID MAULANA", nim: "1103210066", kelas: "TK-45-06", deskripsi: "TERKAIT PENGAJUAN RESET KRS SIRAMA", tanggal: "RABU, 25 DESEMBER 2024 11:47 WIB" },
  //   { id: 2, name: "RADITYA GHIFARI AL JABBAR", nim: "1103213092", kelas: "TK-45-06", deskripsi: "TERKAIT PENGAJUAN RESET KRS SIRAMA", tanggal: "RABU, 25 DESEMBER 2024 12:00 WIB" },
  //   { id: 3, name: "ANDREAS WAHYU PRAYOGO", nim: "1103213114", kelas: "TK-45-06", deskripsi: "TERKAIT PENGAJUAN RESET KRS SIRAMA", tanggal: "RABU, 25 DESEMBER 2024 12:00 WIB" },
  //   { id: 4, name: "HENDRI MAULANA AZHAR", nim: "1103211809", kelas: "TK-45-04", deskripsi: "TERKAIT PERMOHONAN TANDA TANGAN SURAT", tanggal: "SELASA, 03 DESEMBER 2024 10:00 WIB" },
  //   { id: 5, name: "MUHAMMAD MASYAKUL HARISNA", nim: "1103212011", kelas: "TK-45-04", deskripsi: "TERKAIT PERMOHONAN TANDA TANGAN SURAT", tanggal: "SELASA, 03 DESEMBER 2024 12:00 WIB" },
  //   { id: 6, name: "HOMANINDRA PRATAMA", nim: "1103210067", kelas: "TK-45-02", deskripsi: "TERKAIT PERMOHONAN TANDA TANGAN", tanggal: "KAMIS, 19 DESEMBER 2024 08:00 WIB" },
  //   { id: 7, name: "MUHAMMAD TULUS RUSYDI", nim: "1103210792", kelas: "TK-45-01", deskripsi: "TERKAIT PERMOHONAN TANDA TANGAN", tanggal: "KAMIS, 19 DESEMBER 2024 08:00 WIB" },
  //   { id: 8, name: "CHRISTOPHER EDWIN BREAUX", nim: "1103211071", kelas: "TK-46-01", deskripsi: "TERKAIT PENGAJUAN CUTI PERKULIAHAAN", tanggal: "KAMIS, 19 DESEMBER 2024 12:00 WIB" },
  // ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterKelas, setFilterKelas] = useState("");

  const filteredStudents = feedbackDatas.filter(
    (student) => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nim.includes(searchTerm) ||
        student.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = !filterKelas || student.kelas === filterKelas;
      
      return matchesSearch && matchesFilter;
    }
  );

  // Extract unique class values for filter dropdown
  const uniqueClasses = [...new Set(feedbackDatas.map(student => student.kelas))];

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari mahasiswa, NIM, kelas atau deskripsi..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <select
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all"
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
            >
              <option value="">Semua Kelas</option>
              {uniqueClasses.map(kelas => (
                <option key={kelas} value={kelas}>{kelas}</option>
              ))}
            </select>
            <Filter size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">#</th>
              <th className="text-left px-4 py-3 font-semibold">Nama</th>
              <th className="text-left px-4 py-3 font-semibold">NIM</th>
              <th className="text-left px-4 py-3 font-semibold">Kelas</th>
              <th className="text-left px-4 py-3 font-semibold">Deskripsi</th>
              <th className="text-left px-4 py-3 font-semibold">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, idx) => (
                <tr
                  key={student.feedbackId}
                  className="hover:bg-blue-50 cursor-pointer border-t transition-colors"
                  onClick={() => onViewDetail(student)}
                >
                  <td className="px-4 py-3 font-medium">{idx + 1}</td>
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3">{student.nim}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs">
                      {student.kelas}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {student.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{student.feedbackDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  Tidak ada data yang ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Total: {filteredStudents.length} mahasiswa
      </div>
    </div>
  );
};

export default StudentListView;