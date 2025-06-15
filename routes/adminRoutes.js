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

module.exports = router;
