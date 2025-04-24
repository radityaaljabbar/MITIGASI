-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 24, 2025 at 02:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mitigasi`
--

-- --------------------------------------------------------

--
-- Table structure for table `dosen_wali`
--

CREATE TABLE `dosen_wali` (
  `nip` varchar(15) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `kode` varchar(3) NOT NULL,
  `password` varchar(100) NOT NULL,
  `kelas_ampu` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dosen_wali`
--

INSERT INTO `dosen_wali` (`nip`, `nama`, `kode`, `password`, `kelas_ampu`) VALUES
('02770066-1', 'YUDHA PURWANTO', 'YDP', '02770066-1', 'TK-45-06'),
('10800047-1', 'PURBA DARU KUSUMA', 'PBD', '10800047-1', 'TK-47-06');

-- --------------------------------------------------------

--
-- Table structure for table `keluhan_mahasiswa`
--

CREATE TABLE `keluhan_mahasiswa` (
  `id_keluhan` int(11) NOT NULL,
  `nim_keluhan` varchar(15) NOT NULL,
  `tanggal_keluhan` date NOT NULL,
  `title_keluhan` text NOT NULL,
  `detail_keluhan` text NOT NULL,
  `status_keluhaN` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `keluhan_mahasiswa`
--

INSERT INTO `keluhan_mahasiswa` (`id_keluhan`, `nim_keluhan`, `tanggal_keluhan`, `title_keluhan`, `detail_keluhan`, `status_keluhaN`) VALUES
(1, '1103213092', '2025-02-12', 'Kesulitan dalam Mata Kuliah Algoritma', 'Saya mengalami kesulitan dalam memahami materi terkait algoritma sorting pada mata kuliah Algoritma dan Pemrograman. Apakah ada rekomendasi sumber belajar tambahan?', 1),
(2, '1103213114', '2024-12-11', 'Masalah Akses Perpustakaan Digital', 'Saya tidak dapat mengakses jurnal-jurnal internasional pada perpustakaan digital kampus. Sistem selalu menampilkan pesan error saat saya mencoba login menggunakan akun saya.', 0),
(3, '1103213114', '2025-01-08', 'Kesulitan Mendapatkan Referensi Tugas Akhir', 'Saya kesulitan menemukan referensi untuk tugas akhir saya tentang Implementasi Blockchain pada Supply Chain Management. Apakah dosen pembimbing memiliki rekomendasi sumber atau kontak peneliti di bidang ini?', 1),
(4, '1301190001', '2025-02-09', 'Usulan Penambahan Mata Kuliah', 'Saya ingin mengusulkan penambahan mata kuliah \'Keamanan Siber dan Etika Digital\' sebagai mata kuliah wajib untuk program studi Sistem Informasi. Banyak mahasiswa yang merasakan pentingnya topik ini untuk karir mereka.', 0);

-- --------------------------------------------------------

--
-- Table structure for table `mahasiswa`
--

CREATE TABLE `mahasiswa` (
  `nim` varchar(15) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `kelas` varchar(15) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mahasiswa`
--

INSERT INTO `mahasiswa` (`nim`, `nama`, `kelas`, `password`) VALUES
('1103213092', 'Raditya Ghifari Aljabbar', 'TK-45-06', '1103213092'),
('1103213114', 'ANDREAS WAHYU PRAYOGO', 'TK-45-06', '1103213114'),
('1301190001', 'MIFTAH FARID MAULANA', 'TK-45-06', '1301190001');

-- --------------------------------------------------------

--
-- Table structure for table `mata_kuliah`
--

CREATE TABLE `mata_kuliah` (
  `id_mk` int(11) NOT NULL,
  `kode_mk` varchar(15) NOT NULL,
  `nama_mk` varchar(100) NOT NULL,
  `sks_mk` int(1) NOT NULL,
  `jenis_mk` varchar(50) NOT NULL,
  `tingkat` int(1) NOT NULL,
  `semester` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `response_dosen_wali`
--

CREATE TABLE `response_dosen_wali` (
  `id_feedback` int(11) NOT NULL,
  `nip_dosen_wali` varchar(15) NOT NULL,
  `id_keluhan` int(11) NOT NULL,
  `response_keluhan` text NOT NULL,
  `tanggal_response` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `response_dosen_wali`
--

INSERT INTO `response_dosen_wali` (`id_feedback`, `nip_dosen_wali`, `id_keluhan`, `response_keluhan`, `tanggal_response`) VALUES
(1, '02770066-1', 1, 'Terima kasih atas feedback-nya. Saya merekomendasikan untuk mengunjungi lab praktikum di lantai 3 gedung utara, mereka memiliki sesi tutorial setiap Rabu. Selain itu, ada beberapa video pembelajaran di LMS yang bisa Anda tonton ulang.', '2025-03-13'),
(2, '02770066-1', 3, 'Saya merekomendasikan Anda untuk mengakses jurnal IEEE, ACM Digital Library, dan repository kampus yang memiliki koleksi lengkap tentang topik ini. Selain itu, saya akan mengenalkan Anda dengan Pak Dr. Hendra dari Fakultas Teknik yang sedang meneliti topik serupa.', '2025-03-01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dosen_wali`
--
ALTER TABLE `dosen_wali`
  ADD PRIMARY KEY (`nip`),
  ADD UNIQUE KEY `kode` (`kode`);

--
-- Indexes for table `keluhan_mahasiswa`
--
ALTER TABLE `keluhan_mahasiswa`
  ADD PRIMARY KEY (`id_keluhan`),
  ADD KEY `nim_keluhan` (`nim_keluhan`);

--
-- Indexes for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD PRIMARY KEY (`nim`);

--
-- Indexes for table `mata_kuliah`
--
ALTER TABLE `mata_kuliah`
  ADD PRIMARY KEY (`id_mk`),
  ADD UNIQUE KEY `kode_mk` (`kode_mk`);

--
-- Indexes for table `response_dosen_wali`
--
ALTER TABLE `response_dosen_wali`
  ADD PRIMARY KEY (`id_feedback`),
  ADD KEY `id_keluhan` (`id_keluhan`),
  ADD KEY `nip_dosen_wali` (`nip_dosen_wali`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `keluhan_mahasiswa`
--
ALTER TABLE `keluhan_mahasiswa`
  MODIFY `id_keluhan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `mata_kuliah`
--
ALTER TABLE `mata_kuliah`
  MODIFY `id_mk` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `response_dosen_wali`
--
ALTER TABLE `response_dosen_wali`
  MODIFY `id_feedback` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `keluhan_mahasiswa`
--
ALTER TABLE `keluhan_mahasiswa`
  ADD CONSTRAINT `keluhan_mahasiswa_ibfk_1` FOREIGN KEY (`nim_keluhan`) REFERENCES `mahasiswa` (`nim`);

--
-- Constraints for table `response_dosen_wali`
--
ALTER TABLE `response_dosen_wali`
  ADD CONSTRAINT `response_dosen_wali_ibfk_1` FOREIGN KEY (`id_keluhan`) REFERENCES `keluhan_mahasiswa` (`id_keluhan`),
  ADD CONSTRAINT `response_dosen_wali_ibfk_2` FOREIGN KEY (`nip_dosen_wali`) REFERENCES `dosen_wali` (`nip`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
