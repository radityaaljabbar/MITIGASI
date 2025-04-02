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
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import FeedbackList from './pages/Feedback/FeedbackList.jsx';
import FeedbackDetail from './pages/Feedback/FeedbackDetail.jsx';
import NewFeedback from './pages/Feedback/NewFeedback.jsx';
import FinanceMain from "./pages/Finance/Main";
import FinanceApp from "./pages/Finance/Application";
import FinanceHistory from "./pages/Finance/ApplicationHistory.jsx";
import Login from './pages/Login/LoginPage';

//  Lecturer Pages
import LecturerDashboard from './pages/lecturer/LecturerDashboard';



const App = () => {
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
                    }
                >
                    <Route index element={<HomePage />} />
                    <Route path="my-feedback" element={<FeedbackList />} />
                    <Route path="my-feedback/:feedbackId" element={<FeedbackDetail />} />
                    <Route path="my-feedback/new-feedback" element={<NewFeedback />} />
                    <Route path="my-finance" element={<FinanceMain />} />
                    <Route path="my-finance/application" element={<FinanceApp />} />
                    <Route path="my-finance/application-history" element={<FinanceHistory />} />
                    <Route path="*" element={<NotFoundPage />} />
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