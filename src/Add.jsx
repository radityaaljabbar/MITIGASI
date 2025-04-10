import React from 'react';
import { 
    Route, 
    createBrowserRouter, 
    createRoutesFromElements, 
    RouterProvider, 
    Navigate 
} from 'react-router-dom';
import { BrowserRouter as Router, Routes } from 'react-router-dom';


import ProtectedRoute from './components/ProtectedRoute';
//  Student Pages
import MainLayout from './layout/MainLayout';
// import NotFoundPage from './pages/NotFoundPage';
import FeedbackList from './pages/pagesMahasiswa/Feedback/FeedbackList.jsx';
import FeedbackDetail from './pages/pagesMahasiswa/Feedback/FeedbackDetail.jsx';
import NewFeedback from './pages/pagesMahasiswa/Feedback/NewFeedback.jsx';
import FinanceMain from "./pages/pagesMahasiswa/Finance/Main";
import FinanceApp from "./pages/pagesMahasiswa/Finance/Application";
import FinanceHistory from "./pages/pagesMahasiswa/Finance/ApplicationHistory.jsx";
import MyProgress from './pages/pagesMahasiswa/MyProgress';
import MyCoursePage from './pages/pagesMahasiswa/MyCoursePage';
import MyWellnessPage from './pages/pagesMahasiswa/MyWellnessPage';
import MyWellness_Test from './pages/pagesMahasiswa/MyWellness_Test';
import Login from './pages/Login/LoginPage';

//  Lecturer Pages
import LecturerDashboard from './pages/lecturer/LecturerDashboard';



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
                            <MainLayout/>
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<MyProgress />} />
                    <Route path="my-feedback" element={<FeedbackList />} />
                    <Route path="my-feedback/:feedbackId" element={<FeedbackDetail />} />
                    <Route path="my-feedback/new-feedback" element={<NewFeedback />} />
                    <Route path="my-finance" element={<FinanceMain />} />
                    <Route path="my-finance/application" element={<FinanceApp />} />
                    <Route path="my-finance/application-history" element={<FinanceHistory />} />
                    <Route path="my-finance/application-history" element={<FinanceHistory />} />
                    
                    <Route path="my-course" element={<MyCoursePage />} />
                    <Route
                        path="my-wellness"
                        element={<MyWellnessPage />}
                    />
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
                    path="/lecturer/*" 
                    element={
                        <ProtectedRoute requiredType="lecturers">
                            <MainLayout />
                        </ProtectedRoute>
                    } 
                >
                    <Route path="dashboard" element={<LecturerDashboard />} />
                    <Route path="*" element={<Navigate to="/lecturer/dashboard" />} />
                </Route>
                
                {/* Redirect any other route to login */}
                <Route path="*" element={<Navigate to="/" />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

export default App;