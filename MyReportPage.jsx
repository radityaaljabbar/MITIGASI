import React, { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";

function MyReportPage() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleViewDetail = (student) => {
    setSelectedStudent(student);
  };

  const handleBack = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">My Report Page</h1>
      {selectedStudent ? (
        <StudentDetailView student={selectedStudent} onBack={handleBack} />
      ) : (
        <StudentListView onViewDetail={handleViewDetail} />
      )}
    </div>
  );
}

function StudentListView({ onViewDetail }) {
  
  const students = [
    { id: 1, name: "MIFTAH FARID MAULANA", nim: "1103210066", kelas: "TK-45-06", deskripsi: "TERKAIT PENGAJUAN RESET KRS SIRAMA", tanggal: "RABU, 25 DESEMBER 2024 11:47 WIB" },
    { id: 2, name: "RADITYA GHIFARI AL JABBAR", nim: "1103213092", kelas: "TK-45-06", deskripsi: "TERKAIT PENGAJUAN RESET KRS SIRAMA", tanggal: "RABU, 25 DESEMBER 2024 12:00 WIB" },
    { id: 3, name: "ANDREAS WAHYU PRAYOGO", nim: "1103213114", kelas: "TK-45-06", deskripsi: "TERKAIT PENGAJUAN RESET KRS SIRAMA", tanggal: "RABU, 25 DESEMBER 2024 12:00 WIB" },
    { id: 4, name: "HENDRI MAULANA AZHAR", nim: "1103211809", kelas: "TK-45-04", deskripsi: "TERKAIT PERMOHONAN TANDA TANGAN SURAT", tanggal: "SELASA, 03 DESEMBER 2024 10:00 WIB" },
    { id: 5, name: "MUHAMMAD MASYAKUL HARISNA", nim: "1103212011", kelas: "TK-45-04", deskripsi: "TERKAIT PERMOHONAN TANDA TANGAN SURAT", tanggal: "SELASA, 03 DESEMBER 2024 12:00 WIB" },
    { id: 6, name: "HOMANINDRA PRATAMA", nim: "1103210067", kelas: "TK-45-02", deskripsi: "TERKAIT PERMOHONAN TANDA TANGAN", tanggal: "KAMIS, 19 DESEMBER 2024 08:00 WIB" },
    { id: 7, name: "MUHAMMAD TULUS RUSYDI", nim: "1103210792", kelas: "TK-45-01", deskripsi: "TERKAIT PERMOHONAN TANDA TANGAN", tanggal: "KAMIS, 19 DESEMBER 2024 08:00 WIB" },
    { id: 8, name: "CHRISTOPHER EDWIN BREAUX", nim: "1103211071", kelas: "TK-46-01", deskripsi: "TERKAIT PENGAJUAN CUTI PERKULIAHAAN", tanggal: "KAMIS, 19 DESEMBER 2024 12:00 WIB" },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nim.includes(searchTerm) ||
      student.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="mb-4">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari mahasiswa..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100">
            <tr>
              <th className="text-left px-4 py-2"></th>
              <th className="text-left px-4 py-2">Nama</th>
              <th className="text-left px-4 py-2">NIM</th>
              <th className="text-left px-4 py-2">Kelas</th>
              <th className="text-left px-4 py-2">Deskripsi</th>
              <th className="text-left px-4 py-2">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, idx) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50 cursor-pointer border-t"
                onClick={() => onViewDetail(student)}
              >
                <td className="px-4 py-2 font-medium">{idx + 1}</td>
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.nim}</td>
                <td className="px-4 py-2">{student.kelas}</td>
                <td className="px-4 py-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{student.deskripsi}</td>
                <td className="px-4 py-2">{student.tanggal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentDetailView({ student, onBack }) {
  const [komentar, setKomentar] = useState("");

  const handleKirimKomentar = () => {
    if (komentar.trim()) {
      alert(`Komentar terkirim:\n\n${komentar}`);
      setKomentar("");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-6">
      <button className="text-sm text-blue-600 flex items-center gap-1" onClick={onBack}>
        <ArrowLeft size={16} /> Kembali ke Daftar
      </button>

      <div className="border-b pb-2">
        <h2 className="font-semibold">
          {student.name} | {student.nim} | {student.kelas}
        </h2>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-2">
          {student.deskripsi.toUpperCase()}
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce venenatis, nisi eu auctor luctus, ante mi aliquam mauris, eget vestibulum orci dui sed mauris. Fusce dignissim turpis nibh, id mollis nisi lobortis id. Nam ut lectus ipsum. Curabitur condimentum enim eget commodo dictum. Mauris quam justo, feugiat at maximus pretium, tempus at enim. Quisque in ultricies nibh. Praesent dictum lectus vel auctor varius. Donec tempus magna non tellus mollis feugiat in id justo. Ut nec accumsan urna. Curabitur ac iaculis lacus. Fusce id feugiat neque, at condimentum urna. Nam et hendrerit libero, vestibulum imperdiet dolor.
        </p>
      </div>

      <div>
        <p className="font-semibold mb-1">Attachments:</p>
        <div className="flex gap-6 items-center">
          <img src="/icons/google-docs-icon.png" alt="Google Docs" className="h-8 w-auto" />
          <img src="/icons/pdf-icon.png" alt="PDF" className="h-8 w-auto" />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="komentar" className="font-semibold text-sm">Komentar:</label>
        <textarea
          id="komentar"
          placeholder="Tambahkan komentar..."
          className="w-full h-32 p-3 border border-gray-300 rounded-xl text-sm"
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
        ></textarea>
        <div className="text-right">
          <button
            onClick={handleKirimKomentar}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700"
          >
            Kirim Komentar
          </button>
        </div>
      </div>

      <div className="text-right">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700">
          Cetak Hasil Kuesioner
        </button>
      </div>
    </div>
  );
}

export default MyReportPage;


