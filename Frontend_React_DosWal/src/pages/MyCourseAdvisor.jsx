import React, { useState, useRef } from "react";

const dummyCourses = [
  { id: 1, name: "Analisis dan Desain Sistem", code: "ACK2EAB3", type: "Wajib Prodi", sks: 3, kelas: "A", mahasiswa: "andi", semester: "1" },
  { id: 2, name: "Tugas Akhir", code: "ACK2EAB3", type: "Wajib Prodi", sks: 3, kelas: "A", mahasiswa: "andi", semester: "2" },
  { id: 3, name: "Machine Learning", code: "ACK2EAB3", type: "Pilihan", sks: 3, kelas: "B", mahasiswa: "budi", semester: "1" },
  { id: 4, name: "Manajemen Proyek", code: "ACK2EAB3", type: "Wajib Prodi", sks: 3, kelas: "B", mahasiswa: "budi", semester: "2" },
];

const dummyHistory = [
  { id: 1, name: "Kalkulus 1", code: "ACK2EAB3", type: "Wajib Prodi", sks: 3, indeks: "E", tingkat: 1 },
  { id: 2, name: "Kalkulus 2", code: "ACK2EAB3", type: "Wajib Prodi", sks: 3, indeks: "E", tingkat: 1 },
  { id: 3, name: "Fisika", code: "ACK2EAB3", type: "Wajib Prodi", sks: 3, indeks: "E", tingkat: 1 },
  { id: 4, name: "Manajemen Proyek", code: "ACK2EAB3", type: "Wajib Prodi", sks: 3, indeks: "E", tingkat: 3 },
];

const MyCourseAdvisor = () => {
  const [filters, setFilters] = useState({ kelas: "", mahasiswa: "", semester: "" });
  const [availableCourses, setAvailableCourses] = useState(dummyCourses);
  const [studentCourses, setStudentCourses] = useState([]);
  const componentRef = useRef();

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredCourses = availableCourses.filter((course) => {
    const { kelas, mahasiswa, semester } = filters;
    return (kelas === "" || course.kelas === kelas) && (mahasiswa === "" || course.mahasiswa === mahasiswa) && (semester === "" || course.semester === semester);
  });

  const addCourse = (course) => {
    setAvailableCourses(availableCourses.filter((c) => c.id !== course.id));
    setStudentCourses([...studentCourses, course]);
  };

  const removeCourse = (course) => {
    setStudentCourses(studentCourses.filter((c) => c.id !== course.id));
    setAvailableCourses([...availableCourses, course]);
  };

  const renderCourseRow = (course, isAvailable) => (
    <tr key={course.id} className={`text-white ${isAvailable ? "bg-green-600" : "bg-red-600"} hover:opacity-80`}>
      <td className="p-2 border">{course.name}</td>
      <td className="p-2 border">{course.code}</td>
      <td className="p-2 border">{course.type}</td>
      <td className="p-2 border text-center">{course.sks}</td>
      <td className="p-2 border text-center">
        <button className="bg-white text-black px-2 py-1 rounded" onClick={() => (isAvailable ? addCourse(course) : removeCourse(course))}>
          {isAvailable ? "+" : "-"}
        </button>
      </td>
    </tr>
  );

  return (
    <div className="p-6 bg-neutral-100 min-h-screen">
      {/* Filter dan Export */}
      <div className="flex gap-4 mb-4 print:hidden">
        <select name="kelas" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Pilih Kelas</option>
          <option value="A">Kelas A</option>
          <option value="B">Kelas B</option>
        </select>
        <select name="mahasiswa" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Pilih Mahasiswa</option>
          <option value="andi">Andi</option>
          <option value="budi">Budi</option>
        </select>
        <select name="semester" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Pilih Semester</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
        </select>

        <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => window.print()}>
          Cetak PDF
        </button>
      </div>

      <div ref={componentRef}>
        {/* Tabel Atas */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Mata Kuliah Tersedia</h2>
            <table className="w-full border text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 border">Nama</th>
                  <th className="p-2 border">Kode</th>
                  <th className="p-2 border">Jenis</th>
                  <th className="p-2 border">SKS</th>
                  <th className="p-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>{filteredCourses.map((course) => renderCourseRow(course, true))}</tbody>
            </table>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Mata Kuliah Mahasiswa</h2>
            <table className="w-full border text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 border">Nama</th>
                  <th className="p-2 border">Kode</th>
                  <th className="p-2 border">Jenis</th>
                  <th className="p-2 border">SKS</th>
                  <th className="p-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>{studentCourses.map((course) => renderCourseRow(course, false))}</tbody>
            </table>
          </div>
        </div>

        {/* Riwayat Mata Kuliah */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Riwayat Mata Kuliah</h2>
          <table className="w-full border text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Kode</th>
                <th className="p-2 border">Jenis</th>
                <th className="p-2 border">SKS</th>
                <th className="p-2 border">Indeks</th>
                <th className="p-2 border">Tingkat</th>
              </tr>
            </thead>
            <tbody>
              {dummyHistory.map((row) => (
                <tr key={row.id} className="bg-red-600 text-white">
                  <td className="p-2 border">{row.name}</td>
                  <td className="p-2 border">{row.code}</td>
                  <td className="p-2 border">{row.type}</td>
                  <td className="p-2 border text-center">{row.sks}</td>
                  <td className="p-2 border text-center">{row.indeks}</td>
                  <td className="p-2 border text-center">{row.tingkat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyCourseAdvisor;
