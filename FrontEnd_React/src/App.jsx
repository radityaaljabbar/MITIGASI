import React from 'react';
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';

import MainLayout from './layout/MainLayout';
import NotFoundPage from './pages/NotFoundPage';
//Importing the feature pages:
import HomePage from './pages/HomePage';
import MyCoursePage from './pages/MyCoursePage';

const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/my-course" element={<MyCoursePage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

export default App;
