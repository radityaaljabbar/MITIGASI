import React from 'react';
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';

import MainLayout from './layout/MainLayout';
import MyStudentsPage from './pages/MyStudentsPage';
import MyCourseAdvisor from './pages/MyCourseAdvisor';
import MyReportPage from './pages/MyReportPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<MainLayout />}>
                <Route index element={<MyStudentsPage />} />
                <Route
                    path="/my-course-advisor"
                    element={<MyCourseAdvisor />}
                />
                <Route path="/my-report" element={<MyReportPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

export default App;
