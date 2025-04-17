import React from 'react';
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Navigate,
} from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute.jsx';
//  Student Pages
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
import MyWellness_Test from './pages/pagesMahasiswa/MyWellness_Test.jsx';
import Login from './pages/Login/LoginPage.jsx';

//  Lecturer Pages
import LecturerDashboard from './pages/lecturer/LecturerDashboard.jsx';
import MyCourseAdvisorPage from './pages/lecturer/MyCourseAdvisorPage.jsx';
import MyReportPage from './pages/lecturer/MyReport/MyReportPage.jsx';
import MyStudentList from './pages/myStudent/studentList.jsx'
// Import your not found page
import NotFoundPage from './pages/lecturer/NotFoundPage.jsx'; // Make sure this path is correct

const App = () => {
    const kirimTestPsikologi = (jawabanTestPsikologi) => {
        console.log(jawabanTestPsikologi);
    };
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route path="/" element={<Login />} />

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
                        element={
                            <MyWellness_Test
                                submitTestPsikologi={kirimTestPsikologi}
                            />
                        }
                    />
                </Route>

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
                        path="course-advisor" // Fixed the typo: removed extra 'r'
                        element={<MyCourseAdvisorPage />}
                    />
                    <Route path="my-report" element={<MyReportPage />} />
                    {/* The report route will be added later by your teammate */}

                    {/* Use your NotFoundPage for 404 routes within lecturer section */}
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
