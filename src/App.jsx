import React from 'react';
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Navigate,
} from 'react-router-dom';

// Mengimpor komponen untuk rute yang dilindungi
// Importing the component for protected routes
import ProtectedRoute from './components/ProtectedRoute.jsx';
// Mengimpor Halaman Mahasiswa
// Importing Student Pages
import MainLayout from './layout/MainLayout.jsx';
import FeedbackList from './pages/pagesMahasiswa/Feedback/FeedbackList.jsx';
import FeedbackDetail from './pages/pagesMahasiswa/Feedback/FeedbackDetail.jsx';
import NewFeedback from './pages/pagesMahasiswa/Feedback/NewFeedback.jsx';
import FinanceMain from './pages/pagesMahasiswa/Finance/Main.jsx';
import FinanceApp from './pages/pagesMahasiswa/Finance/Application.jsx';
import FinanceHistory from './pages/pagesMahasiswa/Finance/ApplicationHistory.jsx';
import MyProgress from './pages/pagesMahasiswa/MyProgress.jsx';
import MyCoursePage from './pages/pagesMahasiswa/MyCoursePage.jsx';
import MyWellnessPage from './pages/pagesMahasiswa/MyWellnessPage.jsx';
import MyWellnessHistory from './components/compMahasiswa/myWellnessComponents/MyWellnessHistory.jsx';
import MyWellness_Test from './pages/pagesMahasiswa/MyWellness_Test.jsx';
import Login from './pages/Login/LoginPage.jsx';

// Mengimpor Halaman Dosen
// Importing Lecturer Pages
import LecturerDashboard from './pages/lecturer/LecturerDashboard.jsx';
import MyCourseAdvisorPage from './pages/lecturer/myCourseAdvisor/MyCourseAdvisorPage.jsx';
import MyReportPage from './pages/lecturer/MyReport/MyReportPage.jsx';
import MyStudentDetail from './pages/lecturer/myStudent/DetailMahasiswaPage.jsx';
import MyStudentList from './pages/lecturer/myStudent/studentList.jsx';

// Mengimpor halaman Not Found
// Importing the Not Found page
import NotFoundPage from './pages/lecturer/NotFoundPage.jsx'; // Make sure this path is correct

// Mengimpor Halaman Admin
// Importing Admin Pages
import KelolaPenggunaPage from './pages/pagesAdmin/KelolaPenggunaPage.jsx';
import KelolaKelasPage from './pages/pagesAdmin/KelolaKelasPage.jsx';
import KelolaAkademikPage from './pages/pagesAdmin/KelolaAkademikPage.jsx';
import DetailAkademikPage from './pages/pagesAdmin/DetailAkademikPage.jsx';
import KelolaKurikulumPage from './pages/pagesAdmin/KelolaKurikulumPage.jsx';
import LogAktivitasPage from './pages/pagesAdmin/LogAktivitasPage.jsx';

/**
 * Komponen root aplikasi yang mendefinisikan semua rute (routing).
 * The root application component that defines all the routes (routing).
 */
const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                {/* Rute publik untuk halaman login */}
                {/* Public route for the login page */}
                <Route path="/" element={<Login />} />

                {/* Rute Mahasiswa yang Dilindungi */}
                {/* Protected Student Routes */}
                <Route
                    path="/student"
                    element={
                        <ProtectedRoute requiredType="students">
                            <MainLayout />
                        </ProtectedRoute>
                    }>
                    <Route index element={<MyProgress />} />
                    <Route path="my-feedback" element={<FeedbackList />} />
                    <Route
                        path="my-feedback/:feedbackId"
                        element={<FeedbackDetail />}
                    />
                    <Route
                        path="my-feedback/new-feedback"
                        element={<NewFeedback />}
                    />
                    <Route path="my-finance" element={<FinanceMain />} />
                    <Route
                        path="my-finance/application"
                        element={<FinanceApp />}
                    />
                    <Route
                        path="my-finance/application-history"
                        element={<FinanceHistory />}
                    />

                    <Route path="my-course" element={<MyCoursePage />} />
                    <Route path="my-wellness" element={<MyWellnessPage />} />
                    <Route
                        path="my-wellness/psi-test"
                        element={<MyWellness_Test />}
                    />
                    <Route
                        path="my-wellness/history"
                        element={<MyWellnessHistory />}
                    />
                </Route>

                {/* Rute Dosen yang Dilindungi */}
                {/* Protected Lecturer Routes */}
                <Route
                    path="/lecturer"
                    element={
                        <ProtectedRoute requiredType="lecturers">
                            <MainLayout />
                        </ProtectedRoute>
                    }>
                    {/* Add an index route that redirects to dashboard */}
                    <Route
                        index
                        element={<Navigate to="/lecturer/dashboard" />}
                    />
                    <Route path="dashboard" element={<MyStudentList />} />
                    <Route
                        path="detailMahasiswa/:nim"
                        element={<MyStudentDetail />}
                    />
                    <Route
                        path="course-advisor" // Fixed the typo: removed extra 'r'
                        element={<MyCourseAdvisorPage />}
                    />
                    <Route path="my-report" element={<MyReportPage />} />
                    {/* The report route will be added later by your teammate */}

                    {/* Use your NotFoundPage for 404 routes within lecturer section */}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Rute Admin yang Dilindungi */}
                {/* Protected Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredType="admin">
                            <MainLayout />
                        </ProtectedRoute>
                    }>
                    {/* Admin routes */}
                    <Route
                        index
                        element={<Navigate to="/admin/kelolaPengguna" />}
                    />
                    <Route
                        path="kelolaPengguna"
                        element={<KelolaPenggunaPage />}
                    />
                    <Route
                        path="kelolaKelasdanAngkatan"
                        element={<KelolaKelasPage />}
                    />
                    <Route
                        path="kelolaAkademik"
                        element={<KelolaAkademikPage />}
                    />
                    <Route
                        path="kelolaAkademik/detail/:nim"
                        element={<DetailAkademikPage />}
                    />
                    <Route
                        path="kelolaKurikulum"
                        element={<KelolaKurikulumPage />}
                    />
                    <Route 
                        path="/admin/logAktivitas" 
                        element={<LogAktivitasPage />} />

                    {/* 404 for admin routes */}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Global 404 page */}
                <Route path="*" element={<Login />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

export default App;
