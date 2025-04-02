import React from 'react';
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';

import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import FeedbackList  from './pages/Feedback/FeedbackList.jsx';
import FeedbackDetail from './pages/Feedback/FeedbackDetail.jsx'
import NewFeedback from './pages/Feedback/NewFeedback.jsx'
import FinanceMain from "./pages/Finance/Main";
import FinanceApp from "./pages/Finance/Application";
import FinanceHistory from "./pages/Finance/ApplicationHistory.jsx"
import Login from './pages/Login/LoginPage'


const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                {/* <Route path="/" element={<MainLayout />} /> */}
                <Route path="/"  element={<Login />}></Route>
                <Route path='/student' element={<MainLayout />}>
                    {/* <Route index element={<HomePage />} /> */}
                    {/* <Route  path="my-feedback" element={<HomePage />} /> */}
                    <Route path="dashboard" element={<MainLayout />} />
                    <Route path="my-feedback" element={<FeedbackList />} />
                    <Route path="my-feedback/:feedbackId" element={<FeedbackDetail />} />
                    <Route path="my-feedback/new-feedback" element={<NewFeedback />} />
                    <Route path="my-finance" element={<FinanceMain />} />
                    <Route path="my-finance/application" element={<FinanceApp />} />
                    <Route path="my-finance/application-history" element={<FinanceHistory />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

export default App;
