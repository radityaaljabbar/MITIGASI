const express = require('express');
const router = express.Router();

// Import controller
const adminController = require('../controllers/adminController');
// Import middleware authentikasi
const { protect, authorize } = require('../middlewares/authMiddleware');

// @desc    Endpoint backend untuk ...
router.get('/contoh', protect, authorize('admin'), () => {});

// Kelola Admin
router.get(
    '/kelolaPengguna/getAdmin',
    protect,
    authorize('admin'),
    adminController.getAllAdmins
)

router.post(
    '/kelolaPengguna/createAdmin',
    protect,
    authorize('admin'),
    adminController.createAdmin
)

router.delete(
    '/kelolaPengguna/deleteAdmin/:id',
    protect,
    authorize('admin'),
    adminController.deleteAdmin
)

router.put(
    '/kelolaPengguna/updateAdmin/:id',
    protect,
    authorize('admin'),
    adminController.updateAdmin
)

// Kelola Dosen Wali
router.get(
    '/kelolaPengguna/getDosenWali',
    protect,
    authorize('admin'),
    adminController.getAllDosen
)

router.post(
    '/kelolaPengguna/createDosenWali',
    protect,
    authorize('admin'),
    adminController.createDosen
)

router.delete(
    '/kelolaPengguna/deleteDosenWali/:nip',
    protect,
    authorize('admin'),
    adminController.deleteDosen
)

router.put(
    '/kelolaPengguna/updateDosenWali/:nip',
    protect,
    authorize('admin'),
    adminController.updateDosen
)

// Kelola Mahasiswa
router.get(
    '/kelolaPengguna/getMahasiswa',
    protect,
    authorize('admin'),
    adminController.getAllMahasiswa
)

router.post(
    '/kelolaPengguna/createMahasiswa',
    protect,
    authorize('admin'),
    adminController.createMahasiswa
)

router.delete(
    '/kelolaPengguna/deleteMahasiswa/:nim',
    protect,
    authorize('admin'),
    adminController.deleteMahasiswa
)

router.put(
    '/kelolaPengguna/updateMahasiswa/:nim',
    protect,
    authorize('admin'),
    adminController.updateMahasiswaByNim
)

router.get(
    '/kelolaPengguna/getAllKelas',
    protect,
    authorize('admin'),
    adminController.getAllKelas
)

// Kelas
router.get(
    '/kelolaKelas/getAllKelas',
    protect,
    authorize('admin'),
    adminController.getAllKelasforKelas
)

router.get(
    '/kelolaKelas/getDosentList',
    protect,
    authorize('admin'),
    adminController.getDosenList
)

router.post(
    '/kelolaKelas/createKelas',
    protect,
    authorize('admin'),
    adminController.createKelas
)

router.put(
    '/kelolaKelas/updateKelas/:id',
    protect,
    authorize('admin'),
    adminController.updateKelas
)

router.delete(
    '/kelolaKelas/deleteKelas/:id',
    protect,
    authorize('admin'),
    adminController.deleteKelas
)


// =============================================
// ==            KELOLA AKADEMIK              ==
// =============================================

// ============= KELOLA DATA NILAI =============
router.get(
    '/kelolaAkademik/getAllMahasiswa',
    protect,
    authorize('admin'),
    adminController.getAllMahasiswaForKelolaAkademik
)

router.get(
    '/kelolaAkademik/getGradesMahasiswa/:nim',
    protect,
    authorize('admin'),
    adminController.getGradesByNIM
)

router.get(
    '/kelolaAkademik/getAllCourses',
    protect,
    authorize('admin'),
    adminController.getAllCourses
)

router.post(
    '/kelolaAkademik/createGrade',
    protect,
    authorize('admin'),
    adminController.createNilai
)

router.put(
    '/kelolaAkademik/updateGrade/:id',
    protect,
    authorize('admin'),
    adminController.updateNilai
)

router.delete(
    '/kelolaAkademik/deleteGrade/:id',
    protect,
    authorize('admin'),
    adminController.deleteNilai
)


// ============= KELOLA DATA PRESTASI =============
router.get(
    '/kelolaAkademik/getPrestasiData/:nim',
    protect,
    authorize('admin'),
    adminController.getPrestasiByNIM
)

router.post(
    '/kelolaAkademik/createPrestasiData',
    protect,
    authorize('admin'),
    adminController.createPrestasi
)

router.put(
    '/kelolaAkademik/updatePrestasiData/:nim',
    protect,
    authorize('admin'),
    adminController.updatePrestasi
)

router.delete(
    '/kelolaAkademik/deletePrestasiData/:nim',
    protect,
    authorize('admin'),
    adminController.deletePrestasi
)


// ============= KELOLA DATA SEMESTER =============
router.get(
    '/kelolaAkademik/getSemesterData/:nim',
    protect,
    authorize('admin'),
    adminController.getSemesterByNIM
)

router.post(
    '/kelolaAkademik/createSemesterData/:nim',
    protect,
    authorize('admin'),
    adminController.createSemester
)

router.put(
    '/kelolaAkademik/updateSemesterData/:id',
    protect,
    authorize('admin'),
    adminController.updateSemester
)

router.delete(
    '/kelolaAkademik/deleteSemesterData/:id',
    protect,
    authorize('admin'),
    adminController.deleteSemester
)

module.exports = router;
