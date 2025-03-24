import React from 'react';
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';

import MainLayout from './layout/MainLayout';
import MyStudentsPage from './pages/MyStudentsPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<MainLayout />}>
                <Route index element={<MyStudentsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

export default App;
